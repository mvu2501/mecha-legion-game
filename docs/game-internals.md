# Game internals (Mecha Legion)

One self-contained HTML file (about 120 KB, inline CSS and JS, Vietnamese UI) plus `assets/`. 9:16 stage scaled to fit; works standalone at `/mecha-legion/game/index.html`. Audio starts only after the first tap (browser autoplay rule).

## Screens and flow
Intro (tap) -> Select warrior (door closes, lock centred) -> Gameplay (5x3 grid, ALL WAYS). The shortcut rail inside the game (`.rail [data-go=...]`, `#demoSC`, `#demoBW`, `#demoJP`) is hidden on small stages but still clickable by script; the portfolio buttons use it.

## State and constants
- `S`: balance `bal` (starts 50,000), bet 1,000, `win`, `jp` (jackpot pool, starts 1,059,229 and grows 8-47 per spin; resets to 1,000,000 after a jackpot), `collect` {long, lan, quy, phung} (0..12), `freeLeft`, `freeMult`, `spinning`, `auto`, `turbo`, `mute`.
- `SYM` table: weights and pay per symbol (3/4/5 of a kind); payout = `pay[n-3] * ways * bet * 0.4`. WILD substitutes except SCATTER.
- Tunables: `FREE_SPINS = 5`, `FREE_MULT = 3`, collect chance `0.5` per gem symbol per spin (in `spin`), chain multiplier = link number, Big Win tiers by chain length.

## Rules as implemented
1. **Spin** (`spin(forced, script, free)`): bet is deducted on spin; there is no point deduction anywhere else, only additions on wins. `forced` = fixed grid, `script` = scripted refill queue (demo), `free` = free spin (no bet, no collect, no retrigger).
2. **Chain wins** (`runCascade`): winning cells pop, symbols above fall, new ones fill (from `script.queue` or random), then evaluate again. Link N pays `ev.total * N` (times `FREE_MULT` in free game). Each link plays coin payout (`payout`), rising-pitch sound, glow (`#grid.cglow`), flash, shake from link 3, and a "LIÊN HOÀN xN" badge.
3. **Big Win** after the chain ends (`bigWin(total, links, title)`): 3 links = BIG WIN, 5 = MEGA WIN, 7+ = EPIC WIN. Not used inside free spins.
4. **Scatter** (3+ scatters): banner, `scatterStrike(idx)` draws a thin double lightning bolt through the scatter cells with charge, flash, shake and sounds `sfx_chain` + `sfx_explode`, then the "FREE GAME" popup, then `runFreeGame()`.
5. **Free Game** (`runFreeGame`): `FREE_SPINS` automatic spins at turbo, the bet tile becomes "QUAY MIỄN PHÍ" with a countdown (`freeHud`), all wins x `FREE_MULT`, final summary through `bigWin(total, 0, 'FREE GAME')`.
6. **Collect meter / Jackpot**: the four portraits at the top count gems (`bumpColl` animation, glow from 10/12). **Jackpot triggers only when all four warriors are 12/12** (`qualifyJackpot` shows the qualified effect, then `jackpotSeq(true)` runs the ultra attack and `jackpotPopup`). All four meters reset to 0 afterwards.
7. **Sound toggle**: round speaker button `#snd` (bottom-left of the stage, all screens), shares state with the menu's "Âm thanh" via `toggleMute()`. Audio helper object `AUD` (`sfx(name, volume, rate)`, `loopStart/Stop`, `music`, `duck`).
8. **Counters** (`tween`, `bigWin`, `jackpotPopup`) clamp progress to 0..1 and values to >= 0; never display negatives.

## Demo buttons (functions)
- `demoSC`: forces 3 scatters (cells 0, 7, 14) with no line wins.
- `demoBW`: each click runs a scripted chain of 3, then 5, then 7 (BIG, MEGA, EPIC), cycling (`bwStep`).
- `demoJackpot`: fills all four meters to 12/12, qualified effect, ultra attack, popup.
Keyboard shortcuts in the game: `4` = scatter demo, `5` or `B` = Big Win demo, `6` = jackpot demo, `Enter` on the intro, arrow keys on the select screen.

## Frequencies (simulation `qa/sim.js`, 300k spins, base game)
Chain of at least 1 win: 39% of spins; >= 2: 10.9%; >= 3 (Big Win): 2.9% (1 in 35); >= 5 (Mega): 0.18% (1 in 566); >= 7 (Epic): 0.008% (1 in 12,000). Collect: roughly 40-60 spins (an estimate, not measured) until all four warriors reach 12/12; the rarest gem, Long Hạch, is the bottleneck. This is a demo, not a certified RTP model.

## Assets
`assets/` has about 70 files loaded at runtime in a full play-through: symbols (`sym_*`), enemies (`enemy_*`), warrior sprites (`spr_*`, `battle_*`), projectile strips (`fx_proj_*`), effects (`fx_hit`, `fx_die`, `fx_debris`...), backgrounds (`splash_bg`, `bg_*`), `bg_battle.mp4`, and `audio/` (3 bgm + 28 sfx). A few images in `assets/` are duplicates of `public/images/work/mecha-legion/` (see backlog). A runtime asset log was used to delete 21 unreferenced images; verify with `qa/playthrough.cjs` after removing anything.

## Safe-change checklist
After editing the game: run `qa/playthrough.cjs` (no 404, no console errors), `qa/negative-numbers.cjs`, `qa/chain-bigwin.cjs`; check 420x746 and 390x844 screenshots; make sure no `S.win`/balance can go negative.
