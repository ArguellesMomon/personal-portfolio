import { defineConfig } from '@playwright/test';
import config from './playwright.config.js';

export default defineConfig({
  ...config,
  testMatch: 'mobile-hero.spec.js',
  use: { ...config.use, browserName: 'webkit', channel: undefined },
});
