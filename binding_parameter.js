autowatch = 1;

class BindingParameter {
  constructor(dispatcher, path, index) {
    this.dispatcher = dispatcher;
    this.logger = new Logger(`BindingParameter[${index}]`);

    this.path = path; // live_set tracks <track_index> devices <device_index> parameters <parameter_index>
    this.index = index;

    this.api = new LiveAPI(this._callback.bind(this), path);
    this.id = this.api.id;
    this.name = this.api.get("name");
    this.min = this.api.get("min");
    this.max = this.api.get("max");
    this.value = this.api.get("value");
  }

  _callback(args) {
    if (args[0] === "value") {
      const newValue = this.api.get("value");
      if (newValue !== this.value) {
        this.logger.info("Parameter value changed", {
          name: this.name,
          from: this.value,
          to: newValue,
          path: this.path,
        });
        this.value = newValue;
        this.dispatcher.emit("parameterValueChanged", this.getInfo());
      }
    }
  }

  setValue(newValue) {
    if (typeof newValue !== "number") return;
    const clamped = Math.min(this.max, Math.max(this.min, newValue));
    this.api.set("value", clamped);
    this.value = clamped;

    this.logger.info("Set parameter value", {
      name: this.name,
      value: clamped,
      min: this.min,
      max: this.max,
    });
  }

  getInfo() {
    return {
      id: this.id,
      index: this.index,
      name: this.name,
      value: this.value,
      min: this.min,
      max: this.max,
      path: this.path,
    };
  }

  dispose() {
    this.logger.info("Disposed parameter", {
      name: this.name,
      path: this.path,
    });
    this.api = null;
  }
}
