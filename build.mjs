// Builds index.html from src/. Run: node build.mjs
import { readFileSync, writeFileSync } from 'node:fs';
const r = f => readFileSync(new URL('./src/' + f, import.meta.url), 'utf8');
const reset = `:root{color-scheme:light;padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}body{margin:0;font:14px system-ui,sans-serif}img{max-width:100%}[hidden]{display:none!important}`;
const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="theme-color" content="#2D5D4C">
<meta name="description" content="Every chore and maintenance job your home needs, on the right schedule, split fairly across the family.">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="default">
<meta name="apple-mobile-web-app-title" content="Upkeep">
<link rel="manifest" href="/manifest.webmanifest">
<link rel="icon" href="/icon-192.png">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<style>${reset}</style>
${r('head.html').replace('<meta name="claude:viewport-fit-sides" content="cover">\n', '')}
</style>
</head>
<body>
<div class="wrap" id="app">
  <header class="top"><div><h1>Upkeep</h1></div></header>
  <p class="summary" role="status">Opening your house…</p>
  <div class="skel"></div><div class="skel"></div><div class="skel"></div>
</div>
<nav class="tabs" id="tabs" hidden><div class="in"></div></nav>
<div id="layer"></div>
<script>
${r('lib.js')}
${r('lib2.js')}
${r('app.js')}
${r('design.js')}
${r('web.js')}
${r('features.js')}
</script>
</body>
</html>
`;
writeFileSync(new URL('./index.html', import.meta.url), html);
console.log('index.html', html.length, 'bytes');
