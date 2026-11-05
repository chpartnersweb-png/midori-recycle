# SEO設定・公開後の手順

対象URL：`https://midori-recycle.pages.dev/`  
ソース設定日：2026年11月5日。

## 設定の目的

西東京市を拠点とする「みどり♻リサイクル」の不用品回収・買取相談について、検索エンジンに名称・所在地・連絡先・サービス内容・正規URLを一貫して伝える設定です。店舗情報はユーザーの依頼文と現在の掲載データに基づきます。

## 管理するファイル

| 対象 | ファイル |
| --- | --- |
| 本番URL・言語・画像パス | `src/config/seo.mjs` |
| Astroの本番URL・末尾スラッシュ | `astro.config.mjs` |
| タイトル・説明・会社情報 | `src/data/site.ts` |
| メタ情報・JSON-LD | `src/components/Seo.astro` |
| 構造化データの元になるサービス | `src/data/services.ts` |
| robots.txt | `src/pages/robots.txt.ts` |
| sitemap.xml | `src/pages/sitemap.xml.ts` |

## タイトル・説明

タイトル：

> みどり♻リサイクル｜西東京市の不用品回収・買取相談

説明：

> 西東京市を拠点に関東エリアの不用品回収・買取相談に対応。家電・金属・自転車やバイク、退去後の残置物整理、遺品整理のご相談も承ります。西東京市は無料出張対応。回収・作業費用は品物や条件により異なります。電話対応9:00〜20:00。

ブランド名を先頭にする現在の構成を維持しています。無料出張と回収・作業費用は区別して記載します。

## URL・検索向け設定

- トップページのcanonical：`https://midori-recycle.pages.dev/`。
- URLのクエリ文字列・ページ内アンカーはcanonicalに含めません。
- Astroの`site`にも同じ本番URLを設定し、HTMLページの末尾スラッシュを統一します。
- `robots`メタは`index,follow,max-image-preview:large`。
- `lang="ja"`を維持します。
- 主要な本文・会社情報・FAQはHTMLに含まれ、検索用の本文を画像だけに持たせません。

## OGP・SNS共有

- `og:url`はcanonicalと一致させます。
- OGP画像：`https://midori-recycle.pages.dev/ogp.jpg`。
- JPEG、1200×630の設定を出力します。
- タイトル・説明はページのメタ情報と共通化し、日本語ロケールを設定します。
- X用の`summary_large_image`、タイトル、説明、画像、画像の代替説明を設定します。
- OGP画像はブランド用の生成画像です。実際の回収品や現場の写真としては扱いません。

## 構造化データ

JSON-LDの`@graph`で、以下を関連付けています。

| 種類 | 内容 |
| --- | --- |
| LocalBusiness | サービス名、記号を省いた別名、運営会社、URL、電話、所在地、関東エリア、問い合わせ先 |
| ImageObject | 生成したブランドロゴ。`public/icon-512.png`を使用 |
| WebSite | サイト名、URL、日本語、運営主体 |
| WebPage | 正規URL、ページ名、説明、WebSite・事業者・サービスとの関係 |
| Service ×5 | 小型家電、金属、自転車・バイク、残置物整理、遺品整理のご相談 |

電話番号・所在地・対応エリアは画面と同じ`site.ts`から出力します。サービス説明も画面と同じ`services.ts`を参照し、各サービスのURLは実際の本文内アンカーに対応させています。

営業時間9:00〜20:00は本文・説明・ContactPointの説明に掲載します。営業曜日・定休日は未確認のため、毎日営業を意味する曜日指定を作っていません。未確認の許可番号、価格、評価、資格、緯度経度、代表者の創業者扱い等も追加していません。

会社の実写画像は未提供のため、生成した品目画像やヒーローをLocalBusinessの実店舗写真として指定していません。

## robots.txt・サイトマップ

再ビルド・再デプロイ後、次のパスに出力する構成です。

- `https://midori-recycle.pages.dev/robots.txt`
- `https://midori-recycle.pages.dev/sitemap.xml`

robots.txtはクロールを許可し、サイトマップの絶対URLを案内します。サイトマップに含めるのは、現時点で唯一の独立したHTMLページであるトップページです。ページ内アンカーを個別ページとして登録しません。

ページを増やす場合は`src/config/seo.mjs`の`sitemapPaths`を更新します。正確な更新履歴を管理していないため、ビルド時刻を更新日として出力する処理は入れていません。

## 公開反映と確認

今回行ったのはローカルのソース変更です。ユーザーの指示により、実装後のビルド・テスト・ブラウザー確認・構造化データの検証は行っていません。再デプロイ、Search Consoleへの登録、サイトマップ送信、インデックス登録は未実施です。

作業開始時に公開URLの取得を試みましたが、利用したWeb取得ツールでは読み取れませんでした。この結果だけで、サイトが停止しているとは判断していません。現在の配信内容やHTTPヘッダーは未確認です。

ユーザー側で公開反映する際の手順：

1. 変更を含めてビルド・再デプロイする。
2. 公開ページのcanonical・OGP、robots.txt・sitemap.xmlが取得できることを確認する。
3. Googleのリッチリザルトテスト等で構造化データを確認する。
4. Search Consoleで対象サイトを確認し、`sitemap.xml`を送信する。
5. トップページのURL検査から、必要に応じてインデックス登録をリクエストする。

## 参照した公式資料

- [Google：LocalBusiness構造化データ](https://developers.google.com/search/docs/appearance/structured-data/local-business)
- [Google：サイトマップの作成と送信](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)
- [Astro：ルーティング](https://docs.astro.build/en/guides/routing/)
- [Astro：静的エンドポイント](https://docs.astro.build/en/guides/endpoints/)
