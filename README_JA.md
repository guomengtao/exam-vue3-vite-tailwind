# Vue3 Vite Tailwind CSS サンプルプロジェクト

Vue 3 と Vite で Tailwind CSS を設定・使用する方法を示すシンプルなサンプルプロジェクトです。

## 主な機能

- Vue 3 コンポジション API
- Vite ビルドツール
- Tailwind CSS スタイリング
- ES Module 設定
- PostCSS 統合

## プロジェクト設定

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev

# プロダクションビルド
npm run build

# プロダクションビルドのプレビュー
npm run preview
```

## 主要な設定ファイル

- `postcss.config.js` - PostCSS 設定
- `tailwind.config.js` - Tailwind CSS 設定
- `vite.config.js` - Vite 設定
- `src/assets/main.css` - Tailwind CSS エントリーポイント

## よくある問題

1. スタイルが適用されない場合
   - `main.css` のインポートを確認
   - `tailwind.config.js` の `content` 設定を確認
   - `postcss.config.js` の構文を確認

2. ビルドが失敗する場合
   - 依存関係のバージョンの互換性を確認
   - 設定ファイルの構文を確認
   - Node.js のバージョンの互換性を確認

## 英語ドキュメント

For English documentation, please refer to [README.md](README.md)

## 中国語ドキュメント

For Chinese documentation, please refer to [README_CN.md](README_CN.md) 