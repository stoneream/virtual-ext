autowatch = 1;

class BindingTrack {
  constructor(dispatcher, path, index) {
    this.dispatcher = dispatcher;
    this.logger = new Logger(`BindingTrack[${index}]`);

    this.path = path; // live_set tracks <index>
    this.index = index;
    this.api = new LiveAPI(null, path);

    this.id = this.api.id;
    this.name = this.api.get("name");

    this.devices = [];
    this.devicesObserver = null;
  }

  // 初期化処理
  init() {
    this.logger.info("Initializing BindingTrack");
    this._buildDeviceBindings();

    // デバイスの追加・削除を監視
    this.devicesObserver = new LiveObjectObserver(
      this.path,
      "devices",
      this._onDevicesChanged.bind(this)
    );
  }

  // デバイスを走査してBinding
  _buildDeviceBindings() {
    const count = this.api.getcount("devices");
    this.devices = [];

    for (let i = 0; i < count; i++) {
      const devicePath = `${this.path} devices ${i}`;
      const device = new BindingDevice(this.dispatcher, devicePath, i);
      device.init();
      this.devices.push(device);
    }

    this.dispatcher.emit("deviceUpdated", {
      trackId: this.id,
      devices: this.devices.map((d) => d.getInfo()),
    });
  }

  // デバイス構造が変化
  _onDevicesChanged(diff) {
    this.logger.info(`Devices changed in track[${this.index}]`, diff);

    // 新規デバイスを追加
    diff.addedIds.forEach((id) => {
      const deviceIndex = this._findDeviceIndexById(id);
      if (deviceIndex !== null) {
        const path = `${this.path} devices ${deviceIndex}`;
        const newDevice = new BindingDevice(this.dispatcher, path, deviceIndex);
        newDevice.init();
        this.devices.push(newDevice);
        this.logger.info(`Device added`, path);
      }
    });

    // 削除デバイスを破棄
    diff.removedIds.forEach((id) => {
      const device = this._findDeviceById(id);
      if (device) {
        device.dispose();
        this.devices = this.devices.filter((d) => d !== device);

        this.logger.info(`Device removed`, id);
      }
    });

    this.dispatcher.emit("devicesUpdated", {
      trackId: this.id,
      devices: this.devices.map((d) => d.getInfo()),
    });
  }

  _findDeviceIndexById(id) {
    const count = this.api.getcount("devices");
    for (let i = 0; i < count; i++) {
      const path = `${this.path} devices ${i}`;
      const api = new LiveAPI(null, path);
      if (api.id === parseInt(id)) return i;
    }
    return null;
  }

  _findDeviceById(id) {
    return this.devices.find((d) => d.id === parseInt(id));
  }

  getInfo() {
    return {
      id: this.id,
      index: this.index,
      name: this.name,
      deviceCount: this.devices.length,
    };
  }

  dispose() {
    if (this.devicesObserver) this.devicesObserver.dispose();
    this.devices.forEach((d) => d.dispose && d.dispose());
    this.devices = [];
    this.logger.info(`Disposed track: ${this.name}`);
  }
}
