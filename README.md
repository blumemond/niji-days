# Niji Days 仕様書

にじさんじライバーのデビュー日からの経過日数と、近日中の記念日を見やすく確認できる非公式ファン向けWebサービスの企画・仕様書です。

## コンセプト

「推しの今日」と「もうすぐ祝える日」を毎日すぐ確認できる、軽量な記念日ダッシュボード。

単なる日数カウンターではなく、ファンが次の投稿・配信コメント・SNS投稿のきっかけを見つけられるサービスを目指します。

## 想定サービス名

正式名称は未確定です。仕様書内では仮称として `Niji Days` を使用します。

候補:

- Niji Days
- Debut Days
- 推しデビュー日カウンター
- Liver Anniversary Board

## ドキュメント一覧

- [プロダクト仕様](./docs/01-product-spec.md)
- [機能要件](./docs/02-functional-requirements.md)
- [画面仕様・画面遷移](./docs/03-screen-spec.md)
- [データ設計](./docs/04-data-model.md)
- [運用・権利・データ方針](./docs/05-operations-and-compliance.md)
- [MVPロードマップ](./docs/06-roadmap.md)
- [開発スケジュール・レビュー・WBS](./docs/07-development-plan-and-wbs.md)

## MVPの最小構成

- 全ライバー一覧
- ライバー名検索
- デビュー日からの経過日数表示
- 今日の記念日
- 近日記念日
- 推し登録
- 個別ページ
- X共有文生成

## 重要な前提

- 本サービスは非公式ファンツールとして設計します。
- デビュー日の基準はサービス内で明示します。初期案では「初配信日」を基準にします。
- 公式画像・ロゴ・ライバー画像の利用は慎重に扱い、MVPでは原則として名前・色・公式リンク中心のUIにします。
- 公開前にANYCOLOR公式の最新ガイドラインを再確認します。

## 開発

```bash
npm install
npm run dev
```

品質確認:

```bash
npm run test
npm run build
```
