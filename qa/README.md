# QA scripts

Small Playwright (Node) scripts used during development. They test the Mecha Legion game served as static files.

## Setup
```bash
npm i -D playwright-core            # once (do not commit if you prefer; it is dev tooling)
npx playwright install chromium     # or set CHROMIUM_PATH to an existing Chrome/Chromium
python3 -m http.server 4399 &    # serve this repo folder (index.html at the root)
```
Environment variables: `BASE_URL` (default `http://localhost:4399`), `GAME_PATH` (default `/`), `OUT_DIR` (default `.`), `CHROMIUM_PATH` (optional).

## Scripts
| Script | What it checks | Exit code |
|---|---|---|
| `playthrough.cjs` | Intro, Select, Gameplay, menus, a spin, Big Win, Scatter + Free Game, Jackpot. Reports any 4xx response and console error; writes `assets-used.txt` (assets really loaded) | 1 on any 4xx or error |
| `chain-bigwin.cjs` | The Big Win demo button gives BIG, MEGA, EPIC in order | 1 on mismatch |
| `negative-numbers.cjs` | Money counters never show a negative number (frame timestamps are skewed on purpose) | 1 if any negative |
| `sim.js` | `node qa/sim.js`: frequency of chain wins and payout of the base game (pure Node) | n/a |

Notes: in headless Chromium the H.264 battle video does not play and sound is silent; scripts therefore check behaviour, not audio. Selectors in the game start with ids such as `#spin`, `#demoSC`, `#demoBW`, `#demoJP`, `#bw`, `#popup`, `#jpov`.
