autowatch = 1;

class Dispatcher {
  constructor() {
    this._listeners = {};
    this.logger = new Logger("Dispatcher");
  }

  init() {}

  // イベントの購読
  on(event, handler) {
    if (!this._listeners[event]) this._listeners[event] = [];
    this._listeners[event].push(handler);
  }

  // 一度きりの購読
  once(event, handler) {
    const wrap = (payload) => {
      handler(payload);
      this.off(event, wrap);
    };
    this.on(event, wrap);
  }

  // イベントの購読解除
  off(event, handler) {
    if (!this._listeners[event]) return;
    this._listeners[event] = this._listeners[event].filter(
      (h) => h !== handler
    );
  }

  // 特定イベントの全リスナーを削除
  remove(event) {
    delete this._listeners[event];
  }

  // すべてのイベントを削除
  clear() {
    this._listeners = {};
  }

  // イベントの発火
  emit(event, payload) {
    const handlers = this._listeners[event];
    if (!handlers || handlers.length === 0) {
      this.logger.error("no listener for event", event);
      return;
    }

    this.logger.info(`emit event`, event, payload);
    for (let i = 0; i < handlers.length; i++) {
      try {
        handlers[i](payload);
      } catch (e) {
        this.logger.error(`emit error`, e, event);
      }
    }
  }

  // デバッグ用に登録されているイベント一覧を取得
  list() {
    return Object.keys(this._listeners);
  }
}
