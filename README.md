# Mecha Legion: playable slot game prototype

A 9:16 sci-fi mecha slot game prototype (art direction + prototype by Vu Nguyen). Static HTML/CSS/JS, no build step, no dependencies.

**Play:** https://mvu2501.github.io/mecha-legion-game/ (best on a phone; on desktop a side rail lists shortcuts to jump to each screen).

Case study: https://www.vudesign.fun/work/mecha-legion

## Run locally
```bash
git clone https://github.com/mvu2501/mecha-legion-game.git
cd mecha-legion-game
python3 -m http.server 4400      # then open http://localhost:4400
```
Any static server works (opening `index.html` directly also works, but audio and video are more reliable over http).

## Files
- `index.html`: the whole game (inline CSS and JS, Vietnamese UI).
- `assets/`: images (`.webp`), `bg_battle.mp4`, `audio/` (3 music tracks, 28 sound effects).
- `docs/game-internals.md`: rules, functions, tunables, frequencies.
- `qa/`: Playwright scripts (`npm i -D playwright-core`), see `qa/README.md`.
- `.nojekyll`: lets GitHub Pages serve files as they are.

## How to update and deploy
1. Edit `index.html` or `assets/`, check locally.
2. `git add -A && git commit -m "..." && git push` to `main`.
3. GitHub Pages republishes within about a minute. Hard refresh the page (Cmd+Shift+R) to see changes.
The portfolio embeds this same URL, so one push updates both the shareable link and the portfolio.

## Tunables (top of the game script)
`FREE_SPINS` (5), `FREE_MULT` (3), collect chance (0.5 per gem symbol in `spin`), symbol weights and pays in `SYM`. Jackpot needs all four warriors at 12/12.

## Portfolio bridge
The portfolio page controls this game through `postMessage` (`{type: 'mecha-demo', target: '<selector>'}`) from `https://www.vudesign.fun`, `https://vudesign.fun` or `localhost`; only six shortcut selectors are accepted (see the end of `index.html`). Keep that list if you change the ids `#demoSC`, `#demoBW`, `#demoJP` or the `.rail [data-go=...]` buttons.

## Tóm tắt (tiếng Việt)
- Đây là repo riêng của game Mecha Legion, chỉ chứa game (không có portfolio). Link chơi: https://mvu2501.github.io/mecha-legion-game/.
- Cập nhật: sửa file, `git push` lên `main`, đợi khoảng 1 phút, bấm Cmd+Shift+R để thấy bản mới.
- Portfolio nhúng đúng link này, nên một lần push cập nhật cả link gửi khách lẫn portfolio.
- Chạy thử trên máy: `python3 -m http.server 4400` rồi mở http://localhost:4400.

## Notes
- Prototype only: not a certified RTP model; Free Game and Jackpot are demo flows.
- No secrets, keys or private material in this repo.
