# 生成素材の記録

生成日：2026年11月5日。  
使用方法：組み込みの`image_gen`ツール。CLI・外部APIキーは使用していません。

## アートディレクション

深緑・若葉色・生成りを中心とした、紙の質感と穏やかな立体感のある説明用イラスト。人物、商標、実際の依頼先・作業現場などを描いた画像は使用していません。

## 素材一覧

| 使用ファイル | 内容・用途 |
| --- | --- |
| `src/assets/generated/logo-mark.png` | 葉と循環、芽をモチーフにした透明背景のマーク。日本語の店名はサイト上で文字として組版 |
| `src/assets/generated/hero-desktop.webp` | PC用。まち・自転車・電化製品・資源を描いた横構図 |
| `src/assets/generated/hero-mobile.webp` | スマホ用。上部の文字領域と下部のまちを縦構図で配置 |
| `src/assets/generated/items-appliances.webp` | 小型家電の例 |
| `src/assets/generated/items-computers.webp` | パソコン・周辺機器の例 |
| `src/assets/generated/items-tools.webp` | 電動工具・ミシンの例 |
| `src/assets/generated/items-metals.webp` | 金属資源・電線の例 |
| `src/assets/generated/items-bicycles.webp` | 自転車・バイクの例 |
| `src/assets/generated/items-furniture.webp` | 家具・オフィス用品の例 |
| `public/ogp.jpg` | ヒーローとロゴを参照して生成したSNS共有画像。1200×630へ形式調整 |
| `public/favicon.png`ほか | 生成したロゴマークから各端末用サイズを作成 |

元の生成画像は`src/assets/generated/originals/`に保存しています。サイトが参照する素材はすべてプロジェクト内にあり、生成ツールの保存先には依存しません。

## プロンプト

実際に使用した英語の指示全文を`scripts/generated-assets.json`の各`prompt`に記録しています。基本方針は以下です。

- ロゴ：二枚の葉がつくる開いた循環と中央の芽。深緑・葉の緑。文字なし・透明背景・明瞭な形。
- PCヒーロー：紙の質感のまちと資源。上部を見出し用の余白、下部を建物・自転車・電化製品等の情景に。
- スマホヒーロー：同じ色と素材感で縦構図。上部55%程度の無地部分と下部の小さなまち。
- 品目6種：同じ素材感・配色・視点。対象を2〜3点ずつ配置。商標・文字なし。
- OGP：生成済みPCヒーローとロゴを参照画像として使用し、店名・指定キャッチ・サービス・関東対応を入れた横構図を生成。

OGPは独立した合成生成を1回行いました。主要な素材生成9点とOGP1点です。

## 配信用の加工

`scripts/prepare-assets.mjs`で生成原本をプロジェクトへ複製し、Sharpを使ってサイズ・圧縮形式を配信用に変換しました。ヒーローと品目はWebP、ロゴは透明PNG、OGPはJPEGです。品目は4:3の1000×750へ、OGPは1200×630へ調整し、ロゴからファビコンと端末用アイコンを作成しています。

生成画像を実際の商品在庫・作業現場・実績写真として利用していません。ヒーローの家電類なども説明用のイメージであり、個々の品物の回収や買取を保証するものではありません。
