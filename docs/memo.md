## umenuについて

`delete <index>` メッセージで項目を削除することができる。  
その場合、削除したあとのインデックスは自動的に詰められる。  

例えば、1番目に"apple"、2番目に"banana"、3番目に"cherry"がある場合に、`delete 0` を実行すると、"apple"が削除され、"banana"が0番目、"cherry"が1番目に移動する。  

インデックスで状態を管理している場合は、番号を詰める考慮が必要である点に注意が必要である。

## ineltについて

```js
// Inletのハンドラマッピング
const InletHandlers = {
  0: handler1,
};

function anything() {
  emitEvent({
    type: "symbol",
    name: messagename,
    args: arrayfromargs(arguments),
    inlet: inlet,
  });
}

function emitEvent(payload) {
  const handler = InletHandlers[payload.inlet];
  if (handler) {
    handler(payload);
  } else {
    logger.warn(`No handler for inlet ${payload.inlet}`);
  }
}

function handler1(payload) {
  const message = {
    eventType: "umenu",
    index: payload.args[0],
    label: payload.args[1],
  };
  outlet(0, JSON.stringify(message));
}
```

上述のような実装があった場合に、`hoge fuga piyo`というメッセージを送った場合、`hoge`が`messagename`に、`fuga`と`piyo`が`args`に格納される。

Maxのコマンドの思想は基本的にスペース区切りで送る形になっているように思う。
そのルールに則るのであれば、`hoge`の部分がコマンド名にするのが処理の分岐が容易になる。

ハンドラマッピング定型で書いてるからClass化したりしてもいいかもしれないなあとか考えている。

## ASCIIコード

ASCIIコード
up 30
down 31
1 49
2 50
3 51
4 52
5 53
6 54
7 55
8 56

## 監視する必要があるもの

基本的にセッション中はidをキーとして管理(?)

### 親子関係（LOM）　

https://docs.cycling74.com/apiref/lom/

### ライブセット

トラックの追加と削除

### トラック

どの親のトラックであるか？は持っておきたい

名前と色の変更
同定情報となるため

デバイスの追加と削除

### デバイス

名前
同定情報となるため

パラメーターの追加と削除

### パラメーター

名前
値

## 戦略（？）

起動した瞬間にすべての親子を探索してidのマッピングを作成する

~~誰がどの親かは気にする必要がないか...?~~

トラックが消えると下にぶら下がってる子も消えるので親子関係も保持する必要がある。

順当に親子関係をクラスに表現すれば良さそう(そもそもLOMがそういう作りにしておいてほしいという話はあるが...)
