![ヘッダー画像](https://github.com/raito2180/pythagora_maker/assets/138564916/9b841690-2231-4f3d-b62f-ecf356e71f63)

<br />

## アプリのURL

https://pythagora-maker.vercel.app/

<br />

## アプリ概要

ボールをゴールであるスイッチまで運ぶパズルゲームです。<br />各ステージごとに用意されているオブジェクトを使用し、ゴールまでの道のりをオブジェクトで作り、ボールをゴールまで導いてください。<br />また、ユーザーがステージを作成することが可能です。<br />作成したステージを公開することで、自身が作成したステージを他のユーザーに遊んでもらうことができます。

<br />

## アプリを作ったきっかけ

「スクールのカリキュラム外の技術を使って、新しい技術を学びながらチーム開発を体験しよう！」というコンセプトからチーム開発が始まりました。<br />そこでフロント技術を中心としたアプリを作成することになり、ReactとMatter.jsをかけ合わせたゲーム「Pythagora Maker」を作ることになりました。

<br />

## アプリケーションのイメージ
![アプリケーションのイメージ](https://github.com/raito2180/pythagora_maker/assets/138564916/68691df7-a571-4c79-a2e0-032e497ae14a)

※開発中の画面になります。

<br />

## 機能一覧
| トップ画面 |新規ユーザー登録画面 |
| ---- | ---- |
| <img src= "https://github.com/raito2180/pythagora_maker/assets/138564916/3ffb64df-6673-4d58-9faa-710d15257b85" width= "3400px"> | ![新規ユーザー登録画像](https://github.com/raito2180/pythagora_maker/assets/138564916/3bf7d879-4685-4d0c-b10b-8150290a1925) |
| ユーザー未登録の方が「Game Start」を押すとユーザー登録画面に遷移するように設定しています。 | すぐに遊んでいただけるようにシンプルな登録項目にしました。 |

| ログイン画面 |　デフォルトステージ画面 |
| ---- | ---- |
| <img src= "https://github.com/raito2180/pythagora_maker/assets/138564916/d148bb6c-e0f0-4115-8bbf-684327ccd0c3" width= "3270px"> | ![デフォルトステージセレクト画像](https://github.com/raito2180/pythagora_maker/assets/138564916/b831e9fb-463b-476d-aa36-388443449ae8) |
| supabaseを使用することで認証機能を実装しました。 | 初期設定のステージセレクト画面です。<br />難易度が異なる8つのステージを楽しむことができます。 |

| ユーザーステージ画面 |　ステージ編集画面 |
| ---- | ---- |
| <img src= "https://github.com/raito2180/pythagora_maker/assets/138564916/fa596e1d-1a07-4ac5-a535-c0ac3d2d1fe9" width= "3690px"> | ![ステージ編集画像](https://github.com/raito2180/pythagora_maker/assets/138564916/aa619e5d-7d6c-4903-bbb4-324603690c5d) |
| ユーザーが作成したステージのみを表示する画面です。<br />※画像は開発中のものになります。 | ユーザーが作成したステージを確認、編集する画面です。<br />最大3つまで作成することができ、その中から1つだけを公開することができます。 |

| ステージ作成画面 |　テストプレイ画面 |
| ---- | ---- |
|<img src= "https://github.com/raito2180/pythagora_maker/assets/138564916/391f7127-d299-46eb-89fb-bed04d540066" width= "3690px"> | ![テストプレイ画面](https://github.com/raito2180/pythagora_maker/assets/138564916/8bf29529-de95-4360-8c81-ed8245332b62) |
| ユーザーがステージを作成することができる画面です。 | ユーザーが作成したステージをテストプレイする画面です。 |

| ヘルプ画面 |　About us画面 |
| ---- | ---- |
| <img src= "https://github.com/raito2180/pythagora_maker/assets/138564916/952a079a-24da-4b92-9e91-17ade2bb70f1" width= "3840px"> | ![About us画面画像](https://github.com/raito2180/pythagora_maker/assets/138564916/96b4ef77-c6f1-4142-adc6-9f830366a9b0) |
| ゲーム画面、ステージ編集画面、ステージ作成画面、テストプレイ画面の画面説明を確認できます。| チーム開発メンバーのコメントを掲載しています。 |

<br />

## 使用技術

#### フロントエンド
<img src="https://img.shields.io/badge/-React-555.svg?logo=react&style=popout">

<img src="https://img.shields.io/badge/-JavaScript-276DC3.svg?logo=javascript&style=popout">

<img src="https://img.shields.io/badge/-tailwindcss-555.svg?logo=tailwindcss&style=popout">

<img src="https://img.shields.io/badge/-matterdotjs-4B5562.svg?logo=matterdotjs&style=popout">

#### データベース
<img src="https://img.shields.io/badge/-supabase-bfcfcf.svg?logo=supabase&style=popout">

#### ストレージサービス
<img src="https://img.shields.io/badge/-supabase-bfcfcf.svg?logo=supabase&style=popout">

#### インフラ
<img src="https://img.shields.io/badge/-docker-555.svg?logo=docker&style=popout">

<img src="https://img.shields.io/badge/-vercel-000.svg?logo=vercel&style=popout">

#### その他

<img src="https://img.shields.io/badge/-github-181717.svg?logo=github&style=popout">

<br />

## ER図

![ER図画像](https://github.com/raito2180/pythagora_maker/assets/138564916/81c5dcae-967a-4d43-a7e6-ca84f1a36449)

<br />

## 画面遷移図

![画面遷移図画像](https://github.com/raito2180/pythagora_maker/assets/138564916/39166b29-43b9-4bef-a8c8-be8ebb9c7d26)


https://www.figma.com/file/TJrwdvgpydCBUVdtDF0Ox0/%E3%83%94%E3%82%BF%E3%82%B4%E3%83%A9%E3%82%81%E3%81%84%E3%81%8B%EF%BD%9E?type=design&node-id=0-1&mode=design&t=FaRmC42fXabSyCa6-0

<br />

## 今後の展望

- バージョンアップ以降でランキング機能を追加予定

<br />

## 各ディレクトリの説明
public/assets: 画像ファイルやロゴなどの静的ファイルを格納
src/components: 共通コンポーネントを格納(ヘッダー、フッターなど)
src/contexts: コンテキストを格納(ログイン情報など)
src/hooks: カスタムフックを格納
src/pages: 各ページの作業用ディレクトリ(実装者はこのディレクトリ配下にページごとにディレクトリを作成してください)
src/services: 外部APIとの接続サービスを格納(Supabaseクライアントなど)
src/utils: 定数などを格納

<br />

## Supabaseコンテナの導入方法

開発環境の動作にはSupabaseコンテナの実行が必須です。
以下の手順に従ってコンテナを立ち上げておいてください。

1. リポジトリをクローンする
git clone --depth 1 https://github.com/supabase/supabase

2. docker-compose.ymlが存在するディレクトリに移動
cd supabase/docker

3. 環境変数をコピー
cp .env.example .env

4. 最新のイメージを取得する
docker compose pull

5. コンテナをバックグラウンドで立ち上げる
docker compose up -d


以上でローカルにsupabaseコンテナを構築することができます。
supabaseのダッシュボードにアクセスする場合はhttp://localhost:8000/にアクセスしてください。
以下にセルフホスト版のSupabaseのドキュメントのリンクを置いておきます。
https://supabase.com/docs/guides/self-hosting/docker

## React-iconsの使い方 例:ai/AiFillAccountBook

1.使いたいアイコンを選びimport(https://react-icons.github.io/react-icons/を参照)
例:import { AiFillAccountBook } from "react-icons/ai";

2.アイコンを挿入したいところに下記のように記述(アイコン自体にtailwind.css使えません)
例:<AiFillAccountBook />