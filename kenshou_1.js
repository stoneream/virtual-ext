include("header.js");

function f_kenshou_1() {
  /*  
  LiveAPIに設定したコールバックはクラスのコンストラクト時とパスにぶら下がっている監視対象のオブジェクトが変更された場合に呼ばれる
  しかし、コンストラクト時に呼ばれることを回避したい場合は、初期化済みフラグを用意して回避したいところである
  で、一瞬で初期化オブザーバーに登録されるように見えるが、Live 内部（C++側）の進行中になる？
  よって、JavaScirpt上ではオブジェクトの存在は保証されるが、初期化の完了が保証されていない

 大体の場合はディレイを挟むことで解決することが多いみたいだが、初期化が完全に行われたこと自体は保証されないはず
 フラグを持つ、のではなく、コンストラクタに設定したハンドラが何度も実行されても問題ないような作りにするのが好ましいといえる
 
 なぜこんなことが起きるのかというと、JavaScirptのAPI自体はC++のFFIのようなものであり、C++側での初期化処理自体は非同期で行われている可能性がある
 ドキュメントを読めば明記されている気もするが見つけるのが面倒臭かった
 
 ハンドラーが呼ばれた場合に監視対象のオブジェクトの状態を保持し続けて、状態の変化を監視する仕組みさえ作れば
 本当の意味での更新時ハンドラの実現と、更新内容を比較できる...はず
 （ちなみに更新自体を検知することはできるが、何が更新されたか？までは追いかけることができない。）
 
 TODO: ただし、その差分検知の処理自体が重たい可能性はよくわからないのでこれから検証する必要がある。
 */

  const logger = new Logger("f_kenshou_1");

  // LiveAPIの初期化済みフラグ
  let initialized = false;

  function handler() {
    logger.info("handler callback invoked");

    if (initialized) {
      logger.info("initialization complete, executing handler logic");
    } else {
      logger.info("initialization not yet complete, skipping handler");
    }
  }

  const path = "live_set";
  const api = new LiveAPI(handler, path);

  if (!api) {
    logger.error("failed to init LiveAPI", { path: path });
    return;
  }

  const task = new Task(() => {
    initialized = true;
  }, this);
  task.schedule(0);

  // live_set -> tracks の変更を監視する
  api.property = "tracks";
}
