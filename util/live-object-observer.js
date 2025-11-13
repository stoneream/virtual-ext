/*
  このクラスは監視対象のオブジェクトの状態変化とその差分を検出することを目的としている。
  （状態の差分を取得し保持することで差分を検出している。）

  ただし、LivAPIのコールバックは以下のタイミングでコールバックが実行される。

  - クラスがインスタンス化されたタイミング
  - 監視対象（プロパティ）を設定したタイミング
  - プロパティを設定したあとにもう一度発火する（この挙動は不明）
  
  上述のタイミングで実行されるコールバックを回避している。
  */
class LiveObjectObserver {
  constructor(path, property, handler) {
    this.logger = new Logger("LiveObjectObserver");

    // インスタンス生成直後のコールバック
    this.initialized = false;
    // プロパティ（監視対象）をセットした直後のコールバック
    this.detectedPropertySet = false;
    // 直前の状態保存
    this.previousState = null;

    this.api = new LiveAPI(this._callback.bind(this), path);
    this.api.property = property;
    this.handler = handler;
  }

  _callback() {
    // ハンドラーがセットされていない場合は処理をスキップ
    if (!this.handler) {
      return;
    }

    // インスタンス生成直後のコールバックをスキップ
    if (!this.initialized) {
      this.logger.info("LiveAPI initialized");
      this.initialized = true;
      return;
    }

    // プロパティセット直後のコールバックをスキップ
    if (!this.detectedPropertySet) {
      this.logger.info("Detected property set");
      this.detectedPropertySet = true;
      return;
    }

    // 初回状態保存
    if (!this.previousState) {
      this.logger.info("Storing initial state");
      const currentState = this.api.getstring(this.api.property);
      this.previousState = currentState;
      return;
    }

    // 現在の状態を取得
    const currentState = this.api.getstring(this.api.property);

    // 状態に変化がない場合はスキップする
    if (this.previousState === currentState) {
      this.logger.info("No state change detected");
      return;
    }

    this.logger.info("State change detected");
    const diff = this._computeDiff(this.previousState, currentState);

    const logProperty = {
      path: this.api.path,
      property: this.api.property,
      addedIds: diff.addedIds,
      removedIds: diff.removedIds,
    };
    this.logger.info("Diff computed", logProperty);

    // 現在の状態を保存
    this.previousState = currentState;

    this.handler(diff);
  }

  _computeDiff(previousState, currentState) {
    const parse = (s) =>
      s.split(" ").filter((p) => p !== "id" && p.trim() !== "");

    const prevIds = parse(previousState);
    const currIds = parse(currentState);

    const addedIds = currIds.filter((x) => !prevIds.includes(x));
    const removedIds = prevIds.filter((x) => !currIds.includes(x));

    const diff = new Diff(addedIds, removedIds);

    return diff;
  }

  dispose() {
    this.api = null;
    this.handler = null;
  }
}
