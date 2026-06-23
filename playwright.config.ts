import { defineConfig, devices } from '@playwright/test';
import path from 'path';
import { config as dotenvConfig } from 'dotenv';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
dotenvConfig({ path: path.resolve(__dirname, '.env') });


  const baseURL = process.env.BASE_URL || 'https://valentinos-magic-beans.click/';
  const slowMo = process.env.SLOW_MO ? Number(process.env.SLOW_MO) : 0
  // Start local dev server only when baseURL points to localhost
  const startLocalServer = baseURL.includes('localhost') || baseURL.includes('127.0.0.1')

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['list'],
    ['github'],
    ['html', { outputFolder: 'reports-e2e/html', open: 'never' }],
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Run tests in headed mode by default. */
     headless: process.env.CI ? true : false,
    

    /* Base URL to use in actions like `await page.goto('')`. */
    baseURL: 'https://valentinos-magic-beans.click/',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    // trace: 'on-first-retry',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    launchOptions: slowMo ? { slowMo } : undefined, // para ralentizar la ejecución de las pruebas y poder ver mejor lo que está sucediendo en el navegador
    /* All available options: https://playwright.dev/docs/api/class-testoptions */
  },

  /* Configure projects for major browsers */
  projects: [
      // API TESTING
      {
        name: 'api-test',
        testDir: 'tests/api-tests',
        testMatch: ['**/*.spec.ts'],
        use: {
          baseURL: 'https://api.valentinos-magic-beans.click/',
          extraHTTPHeaders: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        }
      },
      {
        name: 'chromium',
        testDir: 'tests/basic',
        testMatch: ['**/*.spec.ts'],
        use: {
          ...devices['Desktop Chrome'],
          // para cargar el estado de autenticación generado por el proyecto de auth-setup, que es el encargado de generar el archivo de sesión necesario para el proyecto de chromium
          storageState: './playwright/.auth/user-session.json'
        },
        // para asegurarnos de que el proyecto de chromium se ejecute después del proyecto de auth-setup, que es el encargado de generar el archivo de sesión necesario para el proyecto de chromium
        dependencies: ['auth-setup']
      },
      // se ejecuta antes que el proyecto de chromium, para generar el archivo de sesión necesario para el proyecto de chromium
      {
        name: 'auth-setup',
        testDir: 'tests/setup',
        testMatch: ['auth.spec.ts'],
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
    webServer: startLocalServer ? {
      command: 'npm run start',
      url: baseURL,
      // If a server is already running at this URL, reuse it instead of failing
      reuseExistingServer: true,
      stdout: 'ignore',
      stderr: 'ignore',
    } : undefined,
  });
