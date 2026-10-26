import dotenv from 'dotenv';
import { defineConfig, devices } from '@playwright/test';

dotenv.config({ quiet: true });

const isCI = !!process.env.CI;

export default defineConfig({
  testDir: './tests',
  // Todas as suítes usam a mesma conta de teste; execução serial evita interferência de estado.
  fullyParallel: false,
  workers: 1,
  forbidOnly: isCI,
  retries: isCI ? 2 : 1,
  timeout: 60_000,
  expect: {
    timeout: 15_000,
  },
  outputDir: 'test-results/artifacts',
  reporter: [
    ['list'],
    ['html', { open: 'never', outputFolder: 'playwright-report' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/junit.xml' }],
  ],
  use: {
    baseURL: process.env.BASE_URL || 'https://english.qazando.com.br',
    headless: true,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 20_000,
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
});
