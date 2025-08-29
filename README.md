# 音声・動画自動再生テストプロジェクト

このプロジェクトは、さまざまな環境での音声・動画の自動再生挙動をテストするためのものです。MP3（標準と WebAudio API）、MP4、HLS、YouTube の各種メディアタイプについて、異なる再生パターンをテストできます。

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## テスト内容

### MP3（音声）テスト

MP3（音声）では、以下の 5 つの再生パターンをテストできます：

1. **音声あり自動再生試行**：ページ読み込み時に音声ありで自動再生を試みますが、多くのブラウザでブロックされます。
2. **初回クリック → 再生開始**：ユーザーの最初のクリックで再生を開始します。
3. **遅延後に音声あり自動再生試行**：カウントダウン後に音声ありで自動再生を試みます。
4. **二段階カウントダウン**：最初のカウントダウン終了後、再度カウントダウンを行い、その後音声ありで自動再生を試みます。
5. **ボタンクリック後再生**：専用のボタンをクリックするとオーディオプレーヤーが表示され、再生を開始します。

MP3 テストは、ローカル音源とネットワーク音源の 2 種類のページで別々にテストできます：

- **ローカル音源**：サーバー上に配置された MP3 ファイルを使用
- **ネットワーク音源**：外部 URL から取得する MP3 ファイルを使用

### WebAudio API テスト

WebAudio API を使用した MP3 再生では、標準の HTML5 audio 要素とは異なる低レベルな音声処理が可能です。以下の 5 つの再生パターンをテストできます：

1. **音声あり自動再生試行**：ページ読み込み時に音声ありで自動再生を試みます。波形の視覚化機能付きです。
2. **初回クリック → 再生開始**：ユーザーの最初のクリックで再生を開始します。
3. **遅延後に音声あり自動再生試行**：カウントダウン後に音声ありで自動再生を試みます。
4. **二段階カウントダウン**：最初のカウントダウン終了後、再度カウントダウンを行い、その後音声ありで自動再生を試みます。
5. **ボタンクリック後再生**：専用のボタンをクリックするとオーディオプレーヤーが表示され、再生を開始します。

### MP4、HLS、YouTube（動画）テスト

動画メディアタイプでは、以下の 6 つの再生パターンをテストできます：

1. **静音オート**：ページ読み込み時に自動的に再生を開始しますが、音声はミュートされています。
2. **有声オート試行**：ページ読み込み時に音声ありで自動再生を試みますが、多くのブラウザでブロックされます。
3. **初回クリック →0 秒有声**：ユーザーの最初のクリックで 0 秒から音声ありで再生を開始します。
4. **遅延有声オート**：カウントダウン後に音声ありで自動再生を試みます。
5. **二段階カウントダウン**：最初のカウントダウン終了後、再度カウントダウンを行い、その後音声ありで自動再生を試みます。
6. **ボタンクリック後再生**：専用のボタンをクリックすると、ビデオが表示され、音声ありで自動再生を開始します。

各メディアタイプ（MP3 ローカル、MP3 ネットワーク、MP4、HLS、YouTube）で上記のパターンをテストできます。

## 使い方

1. プロジェクトを起動します
2. ホームページから各メディアタイプのテストページに移動します
3. 各テストパターンの挙動を確認します
4. 異なる環境（ブラウザ、デバイス）での挙動の違いを比較します

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
