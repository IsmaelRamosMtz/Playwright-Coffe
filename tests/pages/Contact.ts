import { Page } from "playwright";

export async function trackOrder(page: Page, orderId: string, email: string) {
    await page.locator('[data-test-id="contact-order-id-input"]').fill(orderId);
    await page.locator('[data-test-id="contact-email-input"]').fill(email);
}

export async function submitTrackOrder(page: Page) {
    await page.locator('[data-test-id="contact-track-order-button"]').click();
}