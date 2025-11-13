autowatch = 1;

class BindingDevice {
  constructor(dispatcher, path, index) {
    this.dispatcher = dispatcher;
    this.logger = new Logger(`BindingDevice[${index}]`);

    this.path = path; // live_set tracks <track_index> devices <device_index>
    this.index = index;

    this.api = new LiveAPI(null, path);
    this.id = this.api.id;
    this.name = this.api.get("name");

    this.parameters = [];
    this.paramObserver = null;
  }

  init() {
    this.logger.info("Initializing device", this.name);

    // 現在の parameters をスキャン
    this._buildParameterBindings();

    this.paramObserver = new LiveObjectObserver(
      this.path,
      "parameters",
      (diff) => this._onParametersChanged(diff)
    );
  }

  // パラメーターを走査
  _buildParameterBindings() {
    const count = this.api.getcount("parameters");
    this.parameters = [];

    for (let i = 0; i < count; i++) {
      const path = `${this.path} parameters ${i}`;
      const param = new BindingParameter(this.dispatcher, path, i);
      this.parameters.push(param);
    }

    this.dispatcher.emit("parametersUpdated", {
      deviceId: this.id,
      parameters: this.parameters.map((p) => p.getInfo()),
    });
  }

  _onParametersChanged(diff) {
    this.logger.info(`Parameters changed in device[${this.index}]`, diff);
    // 差分を反映（追加・削除）
    // TODO: ParameterBindingを動的に追加／削除する処理
    this.dispatcher.emit("parametersUpdated", {
      deviceId: this.id,
      parameters: this.parameters.map((p) => p.getInfo()),
    });
  }

  getInfo() {
    return {
      id: this.id,
      index: this.index,
      name: this.name,
      paramCount: this.parameters.length,
    };
  }

  dispose() {
    if (this.paramObserver) this.paramObserver.dispose();
    this.parameters.forEach((p) => p.dispose && p.dispose());
    this.parameters = [];
    this.logger.info(`Disposed device: ${this.name}`);
  }
}
