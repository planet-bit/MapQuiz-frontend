# MapQuiz-frontend

このアプリは、言語と地名の学習を目的としたクイズアプリです。

## 概要
MapQuiz-frontendはVue.jsを使用しており、MapQuiz-backendと連携してクイズ機能を提供します。

フロントエンドと連携するバックエンドアプリケーションのセットアップについては、

MapQuiz-env README https://github.com/planet-bit/MapQuiz-env を参照してください。

## 推奨されるIDE（統合開発環境）設定

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) （Veturは無効にしてください）

### 必要なツール
- Node.js (推奨バージョン: v22.13.1)
- npm
- Docker
- Docker Compose

### 主な依存ライブラリ
- Vue (^3.5.13) - フロントエンドフレームワーク
- Axios (^1.8.1) - HTTPクライアント
- Leaflet (^1.9.4) - 地図ライブラリ

## セットアップ手順

### インストール手順

1. 必要なリポジトリをクローン

   ```sh
   git clone https://github.com/planet-bit/MapQuiz-frontend.git
   git clone https://github.com/planet-bit/MapQuiz-backend.git
   git clone https://github.com/planet-bit/MapQuiz-env.git
   ```

2. 環境変数ファイルの設定

   /MapQuiz-env/env.sampleにはサンプルのバックエンドの接続設定があります。
   
　 /MapQuiz-env/.env.sample を /MapQuiz-backend/.env にコピーします。

   ```sh
   cd MapQuiz-env
   cp .env.sample ../MapQuiz-backend/.env
   ```

3. Dockerコンテナの起動

   Docker Composeを使用して、すべてのコンテナ（バックエンド、フロントエンド、データベース）を立ち上げます。

   ```sh
   docker-compose up
   ```

   これにより、以下のコンテナが起動します：

   - mapquiz-app-container（フロントエンド、バックエンド）
   - mapquiz-mysql-container（データベース）

4. バックエンドアプリの確認

   コンテナが起動した後、Node.jsのバックエンドアプリケーションが実行されます。
   
   
   バックエンドへは、http://localhost:3000 を開いて、APIが動作していることを確認してください。

   フロントエンドへは http://localhost:5173 でアプリにアクセスできます。
