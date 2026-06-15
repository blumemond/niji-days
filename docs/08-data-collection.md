# データ収集メモ

## 収集日

2026-06-15

## 収集元

- [にじさんじ公式サイト タレント一覧](https://www.nijisanji.jp/talents)
- 各タレント詳細ページ: `https://www.nijisanji.jp/talents/l/{slug}`

## 収集方法

`npm run fetch:livers` で、公式サイトのNext.js埋め込みデータ `__NEXT_DATA__` を取得し、`src/data/livers.ts` を生成します。

取得対象:

- `profile.affiliation` が `にじさんじ`
- `profile.affiliation` が `NIJISANJI EN`

除外対象:

- `VirtuaReal`

## 取得件数

- にじさんじ: 168件
- NIJISANJI EN: 28件
- 合計: 196件

## 取得項目

- ID: 公式slug
- 表示名
- 読み仮名
- 公式の五十音順ソート値
- 英字名ソート値
- デビュー日
- 所属区分
- 公式カラー
- 公式プロフィールURL
- X
- YouTube
- ファンクラブ
- 公式ショップ
- MAGAZINE

## デビュー日の扱い

公式プロフィールの `debutAt` をAsia/Tokyoの日付に変換して保存しています。

例:

```text
2018-07-29T15:00:00.000Z -> 2018-07-30
```

## 注意点

公式データだけでは、活動中・卒業済み・休止中を完全には判定できません。そのため、現時点では `status` を `listed` とし、画面上は「公式掲載」と表示します。

卒業済み判定を正確に入れる場合は、公式告知や別途確認済みデータを追加ソースとして管理します。

