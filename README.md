# Niji Days

にじさんじ / NIJISANJI EN ライバーのデビュー日からの経過日数と、近日中の記念日を確認できる非公式ファンツールです。

## 概要

「推しの今日」と「もうすぐ祝える日」を毎日すぐ確認できる、軽量な記念日ダッシュボードです。

公式プロフィールのデビュー日をもとに、今日で何日目か、次の節目まであと何日かを表示します。

## 主な機能

- 今日の記念日
- 近日記念日
- 推し登録
- ライバー名検索
- 五十音順 / デビュー日順 / 経過日数 / 記念日が近い順の並び替え
- ライバー詳細ページ
- X共有文生成
- 公式カラーを使ったカード表示

## データについて

ライバーデータは、にじさんじ公式サイトのタレント一覧と各タレント詳細ページから取得しています。

- 対象: にじさんじ、NIJISANJI EN
- 除外: VirtuaReal
- デビュー日: 公式プロフィールの `debutAt` を `Asia/Tokyo` の日付に変換
- 画像: 公式画像・ロゴ・ライバー画像は掲載しません

データの再取得:

```bash
npm run fetch:livers
```

詳細は [データ収集メモ](./docs/08-data-collection.md) を参照してください。

## 非公式表記

本サービスは非公式ファンツールです。ANYCOLOR株式会社およびにじさんじ公式とは関係ありません。

## 開発

```bash
npm install
npm run dev
```

品質確認:

```bash
npm run test
npm run build
npm audit --audit-level=moderate
```

## 関連ドキュメント

- [運用・権利・データ方針](./docs/05-operations-and-compliance.md)
- [ロードマップ](./docs/06-roadmap.md)
- [データ収集メモ](./docs/08-data-collection.md)
