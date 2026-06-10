import { Page, expect } from "@playwright/test";

export async function fillLoginForm(page: Page, email: string, password: string) {  
    await page.locator('[data-test-id="login-email-input"]').fill(email);
    await page.locator('[data-test-id="login-password-input"]').fill(password);
}

export async function submitLogin(page: Page) {
    const btnLogin =  page.locator('[data-test-id="login-submit-button"]')
    await expect(btnLogin).toBeVisible();
    await btnLogin.click();
}

export async function verifyLoginSuccess(page: Page) {
    await expect(page).toHaveURL('/');
}