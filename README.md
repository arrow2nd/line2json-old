# line2json

LINE のトーク履歴ファイルを JSON に変換するやつ

## 使い方

```sh
deno run --allow-read --allow-write [トーク履歴のファイル]
```

## 結果

`元ファイル名.json`が生成されます。

```json
[
  {
    "date": "YYYY/M/D h:m",
    "username": "名前",
    "message": "メッセージ"
  }
]
```
