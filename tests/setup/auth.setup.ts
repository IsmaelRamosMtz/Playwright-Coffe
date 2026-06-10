import path from 'path';
import fs from 'fs'
import { test } from '@playwright/test';
import * as loginPage from '../pages/login';    

const authSessionFile = path.resolve(__dirname, '../../playwright/.auth/user-session.json')

// Read and parse the JSON file
const loginDataFile = path.resolve(__dirname, '../../playwright/.auth/loginData.json'); 
const loginData = JSON.parse(fs.readFileSync(loginDataFile, 'utf8')) as {
    email: string;
    password: string;
};

test("Load auth session", async ({ page }) => {
    // Check if the auth session file exists
    await page.goto("/login");

    await loginPage.fillLoginForm(page, loginData.email, loginData.password);
    await loginPage.submitLogin(page);
    await loginPage.verifyLoginSuccess(page);

    await page.context().storageState({ path: authSessionFile });
});
