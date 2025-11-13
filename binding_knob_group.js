autowatch = 1;

/**
 * KnobGroup 全体を管理するクラス。
 *
 * - Max 側からのメッセージ:
 *   ["knob_group", groupId, "knob_dial_number", knobIndex, "value", value]
 *
 * - BindingParameterMenu からのバインド情報:
 *   dispatcher.emit("parameterBound", {
 *     groupId,        // knob_group の番号
 *     knobIndex,      // 1..n
 *     parameter,      // BindingParameter#getInfo() の結果
 *   });
 *
 * - BindingParameter からの値変更通知:
 *   dispatcher.emit("parameterValueChanged", parameterInfo);
 */
class BindingKnobGroup {
  constructor(dispatcher, outletIndex) {
    this.logger = new Logger(`BindingKnobGroup`);
    this.dispatcher = dispatcher;
    this.outletIndex = outletIndex;

    // bindings[groupId][knobIndex] = parameterInfo
    this.bindings = {};

    // 逆引き: paramPath → [{ groupId, knobIndex }]
    this.paramToKnob = {};

    // --- イベント購読 ---

    // Max → JS: ノブが動いた
    dispatcher.on("knobGroupValueSet", (msg) => this._onKnobMessage(msg));

    // ParameterMenu → JS: ノブとパラメータのバインド
    dispatcher.on("parameterBound", (payload) =>
      this._onParameterBound(payload)
    );

    // BindingParameter → JS: パラメータ値が変化した
    dispatcher.on("parameterValueChanged", (info) =>
      this._onParameterValueChanged(info)
    );
  }

  // ------------------------------------------------
  // Max → JS: knob_group メッセージを解析
  // ------------------------------------------------
  _onKnobMessage(msg) {
    if (!Array.isArray(msg)) {
      this.logger.warn("Knob message is not array", { msg });
      return;
    }

    // 期待形式:
    // ["knob_group", groupId, "knob_dial_number", knobIndex, "value", value]
    const [tag, groupIdRaw, dialTag, knobIndexRaw, valueTag, valueRaw] = msg;

    if (tag !== "knob_group") return;
    if (dialTag !== "knob_dial_number") return;
    if (valueTag !== "value") return;

    const groupId = parseInt(groupIdRaw, 10);
    const knobIndex = parseInt(knobIndexRaw, 10);
    const knobValue = Number(valueRaw);

    if (
      Number.isNaN(groupId) ||
      Number.isNaN(knobIndex) ||
      Number.isNaN(knobValue)
    ) {
      this.logger.warn("Invalid knob message values", {
        groupIdRaw,
        knobIndexRaw,
        valueRaw,
      });
      return;
    }

    this.logger.info("Knob moved", {
      groupId,
      knobIndex,
      knobValue,
    });

    // バインドされたパラメータがあれば Live に反映
    const param = this._getBinding(groupId, knobIndex);
    if (!param) {
      this.logger.info("No parameter bound to knob", {
        groupId,
        knobIndex,
      });
      return;
    }

    this._applyKnobToParameter(knobValue, param);
  }

  // ------------------------------------------------
  // ParameterMenu → JS: バインド情報を登録
  // ------------------------------------------------
  _onParameterBound({ groupId, knobIndex, parameter }) {
    // parameter は BindingParameter#getInfo() の結果
    if (!parameter || !parameter.path) {
      this.logger.warn("Invalid parameter bound", {
        groupId,
        knobIndex,
        parameter,
      });
      return;
    }

    const gId = parseInt(groupId, 10);
    const kIdx = parseInt(knobIndex, 10);

    if (!this.bindings[gId]) this.bindings[gId] = {};
    this.bindings[gId][kIdx] = parameter;

    // 逆引き index を更新
    if (!this.paramToKnob[parameter.path]) {
      this.paramToKnob[parameter.path] = [];
    }
    // すでに同じ組み合わせがある場合は重複させない
    const exists = this.paramToKnob[parameter.path].some(
      (b) => b.groupId === gId && b.knobIndex === kIdx
    );
    if (!exists) {
      this.paramToKnob[parameter.path].push({ groupId: gId, knobIndex: kIdx });
    }

    this.logger.info("Parameter bound to knob", {
      groupId: gId,
      knobIndex: kIdx,
      paramName: parameter.name,
      path: parameter.path,
    });

    // 初期値をノブへ反映（必要なら）
    this._updateKnobFromParameter(gId, kIdx, parameter);
  }

  // ------------------------------------------------
  // BindingParameter → JS: パラメータが Live 側から変化
  // ------------------------------------------------
  _onParameterValueChanged(info) {
    const bindings = this.paramToKnob[info.path];
    if (!bindings || bindings.length === 0) {
      // このパラメータにバインドされたノブはない
      return;
    }

    this.logger.info("Parameter value changed, updating knobs", {
      name: info.name,
      path: info.path,
      value: info.value,
    });

    bindings.forEach(({ groupId, knobIndex }) => {
      this._updateKnobFromParameter(groupId, knobIndex, info);
    });
  }

  // ------------------------------------------------
  // 内部ヘルパ
  // ------------------------------------------------

  _getBinding(groupId, knobIndex) {
    const g = this.bindings[groupId];
    if (!g) return null;
    return g[knobIndex] || null;
  }

  /**
   * ノブの 0–127 の値を、パラメータの min–max にスケールして LiveAPI に反映する
   */
  _applyKnobToParameter(knobValue, paramInfo) {
    const min = Number(paramInfo.min);
    const max = Number(paramInfo.max);
    if (Number.isNaN(min) || Number.isNaN(max)) {
      this.logger.warn("Invalid parameter range", { paramInfo });
      return;
    }

    // knobValue: 0–127 → parameter: min–max
    const t = Math.max(0, Math.min(127, knobValue)) / 127;
    const scaled = min + (max - min) * t;

    this.logger.info("Apply knob to parameter", {
      knobValue,
      scaled,
      min,
      max,
      path: paramInfo.path,
      name: paramInfo.name,
    });

    try {
      const api = new LiveAPI(null, paramInfo.path);
      api.set("value", scaled);
    } catch (e) {
      this.logger.error("Failed to set parameter value", {
        error: e,
        path: paramInfo.path,
      });
    }
  }

  /**
   * Parameter の値からノブ値(0–127)を計算し、UI に反映する
   * （Max 側で "set_knob_value groupId knobIndex value" を受け取るパッチが必要）
   */
  _updateKnobFromParameter(groupId, knobIndex, paramInfo) {
    const min = Number(paramInfo.min);
    const max = Number(paramInfo.max);
    const v = Number(paramInfo.value);

    if (Number.isNaN(min) || Number.isNaN(max) || Number.isNaN(v)) {
      this.logger.warn("Invalid parameter info for knob update", {
        groupId,
        knobIndex,
        paramInfo,
      });
      return;
    }

    const normalized = (v - min) / (max - min || 1);
    const knobValue = Math.round(Math.max(0, Math.min(1, normalized)) * 127);

    this.logger.info("Update knob from parameter", {
      groupId,
      knobIndex,
      value: knobValue,
    });

    // ここでは "set_knob_value" という独自メッセージで UI に送る。
    // Max 側で:
    //   route set_knob_value
    //   → groupId/knobIndex で対象ノブを選択
    //   → live.dial の set メッセージに変換
    outlet(this.outletIndex, ["set_knob_value", groupId, knobIndex, knobValue]);
  }
}
