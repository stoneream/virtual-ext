---
title: knob_groupの仕様
---

## これは何

ノブとメニューがセットが縦に3つ並んだコンポーネントをbpatchとして再利用できるようにしたもの。

## 引数

1. ノブグループ番号

## メッセージのやり取り

命令の受信および送信はsend/receiveオブジェクトを介して行う。

メッセージを送信する場合は以下の宛先に送る。

`knob_master_bus`

メッセージを受信したい場合は以下の宛先から受け取る。

`knob_master_bus_notification`

## todo

メッセージのやり取りについてMaxの思想と反するものがあるため実装を見直す

### ノブ

値の設定

`knob_group <knob_group_number> knob1_dial_value <value>`

値の更新通知

`knob_master_bus_notification knob_group <knob_group_number> knob_dial_number <nob_dial_number> _value <value>`

### umenu

値の設定
基本的にumenuのコマンドを送りつける形になっている

`knob_group <knob_group_number> knob1_umenu_msg <umenu_message>`

値の更新通知

`knob_master_bus_notification knob_group <knob_group_number> knob_umenu_number <knob_umenu_number> index <umenu_selected_index>`
