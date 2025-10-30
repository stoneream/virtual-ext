/*
  LiveAPIのコールバックはクラスのインスタンスが生成されたタイミングと設定したプロパティが変化したタイミングで呼ばれる。
  この「インスタンスが生成されたタイミング」でコールバックが呼ばれることを回避したい。
  プロパティの状態を保持し、コールバックが呼ばれた際に比較を行う。
  比較の結果、状態に変化があった場合のみハンドラを呼び出す仕組みを実現している。

  LiveAPIのインスタンスの存在チェックを行い、初期化フラグを用意する方法も考えられる。
  JavaScriptのAPI自体はあくまでMaxへのブリッジのため、初期化の完了自体が保証されていない可能性がある。
  （詳しい記述を見つけられなかったため断言することはできない。）
  */
class LiveObjectObserver {
  #handler = null;
  #api = null;
  #previousState = null;
  #logger = new Logger("LiveObjectObserver");

  constructor(path, property, handler) {
    /*
      LiveAPIのインスタンスが生成されたタイミングで、引数に与えたコールバックが呼ばれる。
      そのためハンドラを先に代入しないと、コールバックが呼ばれた際に参照エラーが発生してしまう点に注意。
      */
    this.#handler = handler;

    this.#api = new LiveAPI(() => this.#callback(), path);
    this.#api.property = property;

    // 初期状態を保存
    this.#previousState = this.#api.get(property);
  }

  #callback() {
    /*
      コールバックはLiveAPIのインスタンスが生成された瞬間に呼ばれる。
      初期状態の代入よりも先に呼ばれる場合に処理をスキップする。
      */
    if (!this.#previousState) {
      return;
    }

    const currentState = this.#api.get(this.#api.property);

    const previousStateJSON = JSON.stringify(this.#previousState);
    const currentStateJSON = JSON.stringify(currentState);

    // 状態に変化がない場合はスキップする
    if (previousStateJSON === currentStateJSON) {
      return;
    }

    const logProperty = {
      path: this.#api.path,
      property: this.#api.property,
      previousState: previousStateJSON,
      currentState: currentStateJSON,
    };
    this.#logger.info("detected state change", logProperty);

    this.#handler(this.#api);
  }
}
