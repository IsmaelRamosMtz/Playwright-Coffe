import { Page } from "playwright";
import { expect } from '@playwright/test';

export const userData = {
  firstName: "John",
  lastName: "Smith",
  password: "Password123###!"
};

export async function fillUserRegister(page: Page, email: string) {
  await page
    .locator('[data-test-id="signup-firstname-input"]')
    .fill(userData.firstName);
  await page
    .locator('[data-test-id="signup-lastname-input"]')
    .fill(userData.lastName);
  await page.locator('[data-test-id="signup-email-input"]').fill(email);
  await page
    .locator('[data-test-id="signup-password-input"]')
    .fill(userData.password); 
}

export async function submitSignUp(page: Page) {
    const submitButon = page.locator('[data-test-id="signup-submit-button"]');
    await expect(submitButon).toBeVisible();
    await submitButon.click();

}

export async function confirmationCode(page: Page, code: string) {
    await page.locator('input[inputmode="numeric"]').fill(code);
    await page.locator('[data-test-id="confirm-signup-submit-button"]').click();
}