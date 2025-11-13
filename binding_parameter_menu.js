class BindingParameterMenu {
  constructor(dispatcher, outletIndex, knobGroupId, knobIndex) {
    this.logger = new Logger(`BindingParameterMenu[${knobGroupId}]`);
    this.dispatcher = dispatcher;
    this.outletIndex = outletIndex;
    this.knobGroupId = knobGroupId;
    this.knobIndex = knobIndex;

    this.parameters = [];
    this.currentDeviceIndex = null;

    // ---- Live → UI ----
    dispatcher.on("parametersUpdated", ({ deviceIndex, parameters }) =>
      this._onParametersUpdated(deviceIndex, parameters)
    );

    dispatcher.on("parameterSelected", ({ knobGroupId, index }) => {
      if (knobGroupId === this.knobGroupId)
        this._onParameterSelectedFromLive(index);
    });

    // ---- UI → JS ----
    dispatcher.on("parameterSelectedFromUI", ({ knobGroupId, index }) => {
      if (knobGroupId === this.knobGroupId)
        this._onParameterSelectedFromUI(index);
    });
  }

  // ---- Live → UI ----
  _onParametersUpdated(deviceIndex, parameters) {
    this.logger.info("Parameters updated", {
      deviceIndex,
      count: parameters.length,
    });

    this.currentDeviceIndex = deviceIndex;
    this.parameters = parameters;

    // UI を再構成
    outlet(this.outletIndex, ["clear"]);
    parameters.forEach((p) => {
      outlet(this.outletIndex, ["append", p.name]);
    });

    // default: index 0
    outlet(this.outletIndex, ["set", 0]);
  }

  // ---- UI → JS ----
  _onParameterSelectedFromUI(index) {
    const parameter = this.parameters[index];

    // KnobGroup にパラメータをバインドする
    this.dispatcher.emit("parameterBound", {
      groupId: this.knobGroupId,
      knobIndex: this.knobIndex,
      parameter,
    });

    // Live 側の選択も（必要なら）setParameterRequested で main に渡す
    this.dispatcher.emit("setParameterRequested", {
      knobGroupId: this.knobGroupId,
      deviceIndex: this.currentDeviceIndex,
      parameterIndex: index,
    });
  }

  // ---- Live → UI ----
  _onParameterSelectedFromLive(index) {
    this.logger.info("Parameter selected from Live", { index });
    outlet(this.outletIndex, ["set", index]);
  }
}
