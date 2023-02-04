- [スクリーンショット、キャプチャの取り方](#スクリーンショットキャプチャの取り方)  - [OS標準のスクリーンショットの取り方](#OS標準のスクリーンショットの取り方)
  - [動画として保存するとき](#動画として保存するとき)

    
- [画像加工](#画像加工)  - [背景透過・レイヤー分け](#背景透過レイヤー分け)
  - [SVG作成](#SVG作成)

    
- [動画加工](#動画加工)  - [動画フォーマット変更](#動画フォーマット変更)
  - [キーフレームアニメーションの考え方](#キーフレームアニメーションの考え方)
  - [動画の切り抜き](#動画の切り抜き)

    
- [その他](#その他)  - [素材の探し方](#素材の探し方)
  - [3Dオブジェクトを使用したもの](#3Dオブジェクトを使用したもの)
  - [機械学習で自動生成するもの](#機械学習で自動生成するもの)

    
この記事は、Lancers（ランサーズ） Advent Calendar 2022の記事になります。  
[![Calendar for Lancers（ランサーズ） | Advent Calendar 2022 - Qiita](iframe-afd3f0cbb5625eb4d61e069ffa0a4452e5b921b9c3391df14411b1539a213c72.png)](https://qiita.com/advent-calendar/2022/lancers)
[qiita.com](https://qiita.com/advent-calendar/2022/lancers)
  
いろいろ面白そうなものが今後も記載されると思いますので見ていただけると幸いです。  
明日の担当の方引き続きよろしくお願いします。  

---------------------------------------

<img src="0-img-tag.gif" width="444" height="210" loading="lazy" title="" class="hatena-fotolife" itemprop="image">

  
この記事では画像や動画編集、編集元となる素材をどう作るのかというのをまとめたいと思います。
有料のソフトウェアだったらもっと楽にできるのにとかあると思いますが無料でできる範囲で頑張ってみた内容になります。  
#### スクリーンショット、キャプチャの取り方

##### OS標準のスクリーンショットの取り方

WindowsならSnipping Tool を使用します。  
[![Snipping Tool を使ってスクリーン ショットをキャプチャする - Microsoft サポート](iframe-386dad07dfb5f7d6853d26c1e9182e37e9d5b07df0eb9a875797716a2b065d17.png)](https://support.microsoft.com/ja-jp/windows/snipping-tool-%E3%82%92%E4%BD%BF%E3%81%A3%E3%81%A6%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%B3-%E3%82%B7%E3%83%A7%E3%83%83%E3%83%88%E3%82%92%E3%82%AD%E3%83%A3%E3%83%97%E3%83%81%E3%83%A3%E3%81%99%E3%82%8B-00246869-1843-655f-f220-97299b865f6b)
[support.microsoft.com](https://support.microsoft.com/ja-jp/windows/snipping-tool-%E3%82%92%E4%BD%BF%E3%81%A3%E3%81%A6%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%B3-%E3%82%B7%E3%83%A7%E3%83%83%E3%83%88%E3%82%92%E3%82%AD%E3%83%A3%E3%83%97%E3%83%81%E3%83%A3%E3%81%99%E3%82%8B-00246869-1843-655f-f220-97299b865f6b)
  
macOSなら「shift」「command」「4」の 3 つのキーを同時で取得してます  
[![Mac でスクリーンショットを撮る](iframe-8de03dda243cee2e6a6d428df2b18fdb160d1c51bf4668360e48fd717331e188.png)](https://support.apple.com/ja-jp/HT201361)
[support.apple.com](https://support.apple.com/ja-jp/HT201361)
  
##### 動画として保存するとき

macOSならQuickTime Playerで動画として保存するときが多いです。  
[![Mac用QuickTime Playerユーザガイド](iframe-0059b00c6f474068052166a6275ad9ccd1407390e427fb94e703b634c4dc3954.png)](https://support.apple.com/ja-jp/guide/quicktime-player/welcome/mac)
[support.apple.com](https://support.apple.com/ja-jp/guide/quicktime-player/welcome/mac)
  
WindowsならCapturaで保存するときが多いです。
FFMpegも入れる必要がありますがFFMpeg自身がコマンドラインでいろいろ使えるのもあるので別で記載したいと思います。  
[![GitHub - MathewSachin／Captura: Capture Screen, Audio, Cursor, Mouse Clicks and Keystrokes](iframe-189b5070b2ff621d61adf22b5e51b8c169d5d5482ec7d99b93d14974d93705c5.png)](https://github.com/MathewSachin/Captura)
[github.com](https://github.com/MathewSachin/Captura)
  
上記の保存の場合は音声がないときのやりかたで音声ありにしたいときはOBSの録画機能で保存します。  
[![Open Broadcaster Software | OBS](iframe-174580ff6ed409aaae09fff04a42ebc235918b3f316ef279c9c473977f21dd40.png)](https://obsproject.com/ja/)
[obsproject.com](https://obsproject.com/ja/)
  
PC上の音だけでなくマイクの音も動画にすることが可能なので
事前にマシンのメモリの余裕を作ってから録画してます。
M1 MacBookにしてからOBSの使用も少し余裕ができたりしました。  
#### 画像加工

##### 背景透過・レイヤー分け

ソフトウェアの軽量さでMedibang Paintで塗りつぶしツールから矩形選択でざっくり透明色に塗りつぶしてあとで消しゴムツールで消しきれていないところを地道に消すことが多いです。  
  
<img src="1-img-tag.jpg" width="399" height="259" loading="lazy" title="" class="hatena-fotolife" itemprop="image">
ぬりつぶしツール

  
  
<img src="2-img-tag.jpg" width="237" height="454" loading="lazy" title="" class="hatena-fotolife" itemprop="image">
消しゴムツール

  
[![MediBang Paint – 無料のイラスト・マンガ制作ツール](iframe-063d4391a6559efb62a68c3d6c315d9e07de6ccffb2ab95d44181d1e3cabc59d.png)](https://medibangpaint.com/)
[medibangpaint.com](https://medibangpaint.com/)
  
Gimpでのやり方は自由選択で切り取りたい箇所を選択してレイヤー化することで対応させます。  
  
<img src="3-img-tag.jpg" width="237" height="454" loading="lazy" title="" class="hatena-fotolife" itemprop="image">
自由選択

  
  
<img src="4-img-tag.jpg" width="887" height="722" loading="lazy" title="" class="hatena-fotolife" itemprop="image">
自由選択後、レイヤーにある選択範囲から右クリックで新しいレイヤーの生成する

  
  
<img src="5-img-tag.jpg" width="874" height="614" loading="lazy" title="" class="hatena-fotolife" itemprop="image">
レイヤー分け完了

  
[![GIMP](iframe-bd300cc057883a1904e074cadad932d9033216176d811a53542d38085f99346e.png)](https://www.gimp.org/)
[www.gimp.org](https://www.gimp.org/)
  
レイヤーを更に複製してパーツ化することで更に加工がしやすくなったりするので時間が許されるときは細かくレイヤー分けしたいですね。  
<img src="6-img-tag.jpg" width="581" height="822" loading="lazy" title="" class="hatena-fotolife" itemprop="image">

  
##### SVG作成

SVGのようなアイコンやパスの情報を扱いたい画像を作成するときはFigmaで作成することが多いです。  
[![Figma: コラボレーションインターフェイスデザインツール。](iframe-ec586de22a510d6cdd045425ccc13cc1f1eead25a092b7900587cb55827fde7a.png)](https://www.figma.com/ja/)
[www.figma.com](https://www.figma.com/ja/)
  
過去に作ったものだと  
[![GitHub - igara／party-deno: this is pary parrot and denoland parody.](iframe-ac2d7e00e08a37004bcd7e0b28736201345d09473ad3377156c8360d35edd59b.png)](https://github.com/igara/party-deno)
[github.com](https://github.com/igara/party-deno)
  
とか個人サイトのアイコンも作成していたこともありました。  
[![syonet_eight_design_system／src／components／icons at master · igara／syonet_eight_design_system](iframe-6197cf1351f11cc501f6941e279381baa9a1fe6804d3d25952753184ab5d638a.png)](https://github.com/igara/syonet_eight_design_system/tree/master/src/components/icons)
[github.com](https://github.com/igara/syonet_eight_design_system/tree/master/src/components/icons)
  
SVGはCSSでアニメーションを追加しやすいものだったりするので極めたいものだったりします。  
#### 動画加工

##### 動画フォーマット変更

対応しているフォーマットも多いのでFFMpegで変更することが多いです。
サービスによって対応しているフォーマットが決まってたりするので覚えておくと便利です。  

```
ffmpeg -i xxxxx.webm yyyyy.gif
```

とかでGIFに変更できたりしますが動画のフォーマットによっては実はグレーというのありますよね。  
[![H.265／HEVC特許暗黒時代 - Qiita](iframe-59e0e2bf828dcb2557d5766d37207b8a607fc5d3a91324ac8f64b9155d60f473.png)](https://qiita.com/yohhoy/items/c2579097a507b1fbdddb)
[qiita.com](https://qiita.com/yohhoy/items/c2579097a507b1fbdddb)
  
##### キーフレームアニメーションの考え方

画像や座標などなんらかの差分をコマ送りで連続に表示させることでアニメーションが作成されます。  
SVG + CSSによるアニメーションも動画ソフトウェアを使用した際も考え方自体は同じだと思います。  
SVG + CSSの場合はparty-deno.svgのようなCSSの記載でできます。  
[![party-deno／party-deno.svg at master · igara／party-deno](iframe-8edb3998e569726b2ddecdb0486c6ae9344ded593047799b43b8a304afb74a6a.png)](https://github.com/igara/party-deno/blame/master/party-deno.svg#L105-L148)
[github.com](https://github.com/igara/party-deno/blame/master/party-deno.svg#L105-L148)
  
動画ソフトウェアはいろいろありますが無料のソフトウェアから例をあげてみても  
  
<img src="7-img-tag.jpg" width="807" height="496" loading="lazy" title="" class="hatena-fotolife" itemprop="image">
Olilveのキーフレーム設定

  
[![GitHub - olive-editor／olive: Free open-source non-linear video editor](iframe-50792241006cd988a2062926458b89e7dfa3141cb72098a7ea49238b263763b0.png)](https://github.com/olive-editor/olive)
[github.com](https://github.com/olive-editor/olive)
  
  
<img src="8-img-tag.png" width="1200" height="635" loading="lazy" title="" class="hatena-fotolife" itemprop="image">
AnimeEffectsのキーフレーム設定

  
[![AnimeEffects | 2D Animation Tool](iframe-707ac6eab05176ffebcf09fd137f7ccc40532a97630efb6268f74a0e858ae0df.png)](http://animeeffects.org/ja/)
[animeeffects.org](http://animeeffects.org/ja/)
  
キーフレームの設定があります。
この設定を細かくできるほど室の高いアニメーションを作ることができると言っても過言ではないと思います。  
唐突にOlilveとAnimeEffectsを例としてあげたのですが2つのソフトウェアの違いとしてOliveは音声込みの動画編集に使用し、AnimeEffectsは音声のないようなGIFとかSlackのスタンプ作成で使い分けてます。  
##### 動画の切り抜き

動画のキャプチャをしてファイル出力したもののなかにも余分な箇所があったりするのでOlilveのRazer Toolは重宝します。
Olilveというソフトウェアは複数の動画や音声を合成することが可能なソフトウェアなのでRazer Toolで余分なとこを消してBGMが流れている時間内に表示したいものを表示する時間を合わせる調整ができます。  
  
<img src="9-img-tag.jpg" width="1200" height="202" loading="lazy" title="" class="hatena-fotolife" itemprop="image">
Raze Toolで動画をわけた

  
#### その他

##### 素材の探し方

ネットスラング的なものをきっかけで知ることが多いです。  
あとはライセンスフリーなものか商用利用可能かとかは気をつけてみてたりします。  
いらすとやとか商用利用可能だけど利用できる上限があったりするものとかは見逃しがちですよね。  
[![ご利用について](iframe-c268e0287625754ae92d42365f3736e0f8ef356bc6e45740d8147ccd5fd96ec1.png)](https://www.irasutoya.com/p/terms.html)
[www.irasutoya.com](https://www.irasutoya.com/p/terms.html)
  
##### 3Dオブジェクトを使用したもの

VRoidで結構簡単にガワを作れることを知りUnityでも読み込み可能だったりするのでゲーム以外にもいろいろコンテンツ作れそうと感じたまにこの辺の界隈を調べてたりします。  
[![VRoid](iframe-9a04027dc28a4b8023113dcd0d0621568a65aa2cbbcda2b185ce70f61123cfd4.png)](https://vroid.com/)
[vroid.com](https://vroid.com/)
  
実際に作ってみて雑コラした作品です。  
[![燃えたくない、いがちゃんはとちゃん 身内ネタ](iframe-a22cf7cde56e90683f33fdcf3ee4e3f2e6e95e53164122c3119d298f91b70d03.png)](https://www.youtube.com/embed/00_-GjkFZks?feature=oembed)
[www.youtube.com](https://www.youtube.com/watch?v=00_-GjkFZks)
  
アバター的なモデル以外にも建物のモデルも公開されてたりするのでこれもまた可能性あるものだなとみてたりします。  
[![PLATEAU [プラトー] | 国土交通省が主導する、日本全国の3D都市モデルの整備・オープンデータ化プロジェクト](iframe-f90426928301a7538ac8894bfcef30b8be3a9dafde8f68cc4e0480c1765356d5.png)](https://www.mlit.go.jp/plateau/)
[www.mlit.go.jp](https://www.mlit.go.jp/plateau/)
  
  
  
これもやりかけで放置してるのでまた別で使いこなしたいデータだなと思っているんですよね。  
##### 機械学習で自動生成するもの

最近だとひろゆきメーカーとかMidjourneyみたいな生成するもの系の興味が高いです。  
機械学習系は画像識別で止まってるのでそろそろ新しい知識をインプットしたいなぁというお気持ち表明です。  
[![](iframe-e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855.png)](//speakerdeck.com/player/0ee5cca4cb334b9696ca8f6ca8bb6f97)
 [speakerdeck.com](https://speakerdeck.com/igara/2018dong-kai-fa-he-su)
  
