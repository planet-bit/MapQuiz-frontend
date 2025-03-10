# MapQuiz-frontend

このアプリは、言語と地名の学習を目的としたクイズアプリです。

## 概要
MapQuiz-frontendはVue.jsを使用しており、MapQuiz-backendと連携してクイズ機能を提供します。


## 推奨されるIDE（統合開発環境）設定

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) （Veturは無効にしてください）

### 必要なツール
- Node.js (推奨バージョン: xx.xx.x)
- npm

### 主な依存ライブラリ
- Vue (^3.5.13) - フロントエンドフレームワーク
- Axios (^1.8.1) - HTTPクライアント
- Leaflet (^1.9.4) - 地図ライブラリ

## セットアップ手順

### 1.リポジトリをクローンします。

```sh
git clone https://github.com/planet-bit/MapQuiz-frontend
cd MapQuiz-frontend
```

### 2.必要なパッケージをインストールします。

```sh
npm install
```

### 3.開発環境を起動します。

```sh
npm run dev
```
ローカル環境では、通常 http://localhost:5173 でアプリにアクセスできます。

### 4.本番環境用にビルド（コンパイルおよび圧縮）

```sh
npm run build
```

## バックエンドの起動

フロントエンドと連携するバックエンドアプリケーションのセットアップについては、MapQuiz-frontend READMEを参照してください。