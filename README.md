![ヘッダー画像](https://github.com/raito2180/pythagora_maker/assets/138564916/9b841690-2231-4f3d-b62f-ecf356e71f63)

<br />

## アプリのURL

URLを記述

<br />

## アプリ概要

ボールをゴールであるスイッチまで運ぶパズルゲームです。<br />各ステージごとに用意されているオブジェクトを使用し、ゴールまでの道のりを自分で作りゴールまで導いてください。

<br />

## アプリを作ったきっかけ

「スクールのカリキュラム外の技術を使って、新しい技術を学びながらチーム開発を体験しよう！」というコンセプトから始まりました。<br />そこでフロント技術を中心としたアプリを作成することになり、ReactとMatter.jsをかけ合わせたゲーム「Pythagora Maker」を作ることになりました。

<br />

## アプリケーションのイメージ
![アプリケーションのイメージ](https://github.com/raito2180/pythagora_maker/assets/138564916/68691df7-a571-4c79-a2e0-032e497ae14a)

※開発中の画面になります。

<br />

## 機能一覧
| トップ画面 |新規ユーザー登録画面 |
| ---- | ---- |
| ![トップ画像](https://github.com/raito2180/pythagora_maker/assets/138564916/336349e6-b74d-472c-a90c-40eac13ea9a1) | ![新規ユーザー登録画像](https://github.com/raito2180/pythagora_maker/assets/138564916/59d0fe72-4e44-4744-a12e-785e11bc56ae) |
| ユーザー未登録の方が「Game Start」を押すとユーザー登録画面に遷移するように設定しています。 | すぐに遊んでいただけるようにシンプルな登録項目にしました。 |

| ログイン画面 |　デフォルトステージ画面 |
| ---- | ---- |
| ![ログイン画像](https://github.com/raito2180/pythagora_maker/assets/138564916/40fc375a-71f1-4bc8-a14f-71f67af33d44) | ![デフォルトステージセレクト画像](https://github.com/raito2180/pythagora_maker/assets/138564916/1f9d4f26-0584-45e3-af2d-f94f173fb543) |
| supabaseを使用することで認証機能を実装しました。 | 初期設定のステージセレクト画面です。<br />難易度が異なる8つのステージを楽しむことができます。 |

| ユーザーステージ画面 |　ステージ編集画面 |
| ---- | ---- |
| ![ユーザーステージ画像](https://github.com/raito2180/pythagora_maker/assets/138564916/6ce646fe-6a47-4392-b5b8-07e9325c010c) | ![ステージ編集画像](https://github.com/raito2180/pythagora_maker/assets/138564916/0ef4dba2-e0a3-4abc-af71-7ba6a655c99f) |
| ユーザーが作成したステージのみを表示する画面です。<br />※画像は開発中のものになります。 | ユーザーが作成したステージを確認、編集する画面です。<br />最大3つまで作成することができ、その中から1つだけを公開することができます。 |

| ステージ作成画面 |　テストプレイ画面 |
| ---- | ---- |
| ![ステージ作成画面画像](画像ディレクトリを記述) | ![テストプレイ画面](画像ディレクトリを記述) |
| 実際にユーザー自身がステージを作成することができる画面です。 | ユーザー自身が作成したステージをテストできる画面です。 |

| プロフィール画面 |　About us画面 |
| ---- | ---- |
| ![プロフィール画面画像](画像ディレクトリを記述) | ![About us画面画像](https://github.com/raito2180/pythagora_maker/assets/138564916/4ad33fde-3a8f-4553-a478-c3703b7a44fe) |
| ユーザーのプロフィールを確認、編集できる画面です。<br />クリアしたステージやいいねを確認できます。 | チーム開発メンバーのコメントを掲載しています。 |

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

<img width="918" alt="er" src="https://github.com/raito2180/pythagora_maker/assets/138564916/81c5dcae-967a-4d43-a7e6-ca84f1a36449">

<br />

## 画面遷移図

<img width="1069" alt="ScreenTransition Diagram" src="https://github.com/raito2180/pythagora_maker/assets/138564916/39166b29-43b9-4bef-a8c8-be8ebb9c7d26">


https://www.figma.com/file/TJrwdvgpydCBUVdtDF0Ox0/%E3%83%94%E3%82%BF%E3%82%B4%E3%83%A9%E3%82%81%E3%81%84%E3%81%8B%EF%BD%9E?type=design&node-id=0-1&mode=design&t=FaRmC42fXabSyCa6-0

<br />

## 今後の展望

- 〇〇を追加
- 〇〇を導入
- etc...



## 各ディレクトリの説明
public/assets: 画像ファイルやロゴなどの静的ファイルを格納  
src/components: 共通コンポーネントを格納(ヘッダー、フッターなど)  
src/contexts: コンテキストを格納(ログイン情報など)  
src/hooks: カスタムフックを格納  
src/pages: 各ページの作業用ディレクトリ(実装者はこのディレクトリ配下にページごとにディレクトリを作成してください)  
src/services: 外部APIとの接続サービスを格納(Supabaseクライアントなど)
src/utils: 定数などを格納

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