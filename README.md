# みどり♻リサイクル

株式会社盈和商事の不用品回収・買取相談ホームページです。Astroで構築した日本語の1ページ構成です。

## ドキュメント

- [制作プラン](docs/HP-制作プラン.md)
- [編集・運用ガイド](docs/EDITING.md)
- [掲載内容の根拠](docs/CONTENT-SOURCES.md)
- [生成素材の記録](docs/GENERATED-ASSETS.md)
- [SEO設定・公開後の手順](docs/SEO.md)

## 開発

AGENTS.mdに従い、開発サーバーはバックグラウンドで起動します。

```powershell
npm run astro -- dev --background
npm run astro -- dev status
npm run astro -- dev logs
npm run astro -- dev stop
```

## 変更先

基本情報・電話・エリアは`src/data/site.ts`、品目・サービス・実績・FAQは`src/data/`の各ファイルで管理します。スタイルは`src/styles/global.css`、ページ構成は`src/pages/index.astro`です。

素材は`src/assets/generated/`、生成原本は同フォルダの`originals/`、OGPとアイコンは`public/`にあります。生成プロンプト全文は`scripts/generated-assets.json`に保存しています。

## 公開前の設定

本番URLは`https://midori-recycle.pages.dev/`です。`src/config/seo.mjs`で管理し、Astroの`site`、canonical、OGP、構造化データ、robots.txt、サイトマップへ反映しています。正式な許可情報・LINEの追加URLは確認後に`src/data/site.ts`へ設定できます。SEO設定の公開反映には再ビルド・再デプロイが必要です。詳しくは編集ガイドと`docs/SEO.md`を参照してください。

2026年11月5日にローカル実装を作成しました。ユーザーの指定により、実装後のビルド・テスト・型チェック・ブラウザー確認・サーバー起動は実施していません。公開も行っていません。
