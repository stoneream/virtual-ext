---
title: inletとMaxのメッセージの思想
---

## inletからメッセージを受け取ったとき（inletにメッセージを送ったとき）の挙動について

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

`hoge fuga piyo`というメッセージを送った場合は以下のようになる。

- `messagename` が `hoge`
- `args` が `[fuga, piyo]`

## Maxのメッセージの思想について

おそらくだが、Maxのメッセージの思想は基本的にスペース区切りで送る形になっているように思う。
そのルールに則るのであれば、`hoge`の部分がコマンド名になっていると処理の分岐が容易になる。
outletから送るメッセージも同様に、最初の要素をコマンド名として扱うと良いだろう。

## 今後の実装戦略

こういうハンドラマッピングとかは定型で作るからクラス化して抽象化する。
もしくはディスパッチャーのような形を取ったほうが良いかもしれないなあ、とかは考えている。
