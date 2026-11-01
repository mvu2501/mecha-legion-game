// Shared helper: launches Chromium with autoplay allowed.
// Env: BASE_URL (default http://localhost:4399, the game's server), GAME_PATH (default /), OUT_DIR, CHROMIUM_PATH (optional).
const { chromium } = require('playwright-core');
module.exports = {
  BASE: process.env.BASE_URL || 'http://localhost:4399',
  GAME_PATH: process.env.GAME_PATH || '/',
  OUT: process.env.OUT_DIR || '.',
  launch: () => chromium.launch({
    executablePath: process.env.CHROMIUM_PATH || undefined,
    args: ['--no-sandbox', '--autoplay-policy=no-user-gesture-required'],
  }),
};
