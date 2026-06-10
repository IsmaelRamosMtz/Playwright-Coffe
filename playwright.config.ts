import { defineConfig, devices } from '@playwright/test';
import path from 'path';
import { config as dotenvConfig } from 'dotenv';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
dotenvConfig({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [['html'] , ['list']],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Run tests in headed mode by default. */
    headless: false,

    /* Base URL to use in actions like `await page.goto('')`. */
    baseURL: 'https://valentinos-magic-beans.click/',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'],
        // para cargar el estado de autenticación generado por el proyecto de auth-setup, que es el encargado de generar el archivo de sesión necesario para el proyecto de chromium
        storageState: './playwright/.auth/user-session.json'
      },
      // para asegurarnos de que el proyecto de chromium se ejecute después del proyecto de auth-setup, que es el encargado de generar el archivo de sesión necesario para el proyecto de chromium
      dependencies: ['auth-setup']
    },
    // se ejecuta antes que el proyecto de chromium, para generar el archivo de sesión necesario para el proyecto de chromium
    {
      name: 'auth-setup',
      testMatch: 'tests/setup/auth.spec.ts',
    }

/*     {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    }, */

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
