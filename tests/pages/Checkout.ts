import { Page } from "playwright";

export const checkoutData = {
  contactInfo: {
    name: "John",
    lastName: "Smith",
    email: "test@gmail.com",
  },
  shippingInfo: {
    address: "123 Main St",
    city: "Anytown",
    zipCode: "12345",
    country: "United States",
  },
  paymentInfo: {
    nameOnCard: "John Smith",
    cardNumber: "4111 1111 1111 1111",
    expirationDate: "12/25",
    cvv: "123",
  },
};

export async function fillContactInfo(page: Page) {
    await page.locator('[data-test-id="checkout-firstname-input"]').fill(checkoutData.contactInfo.name);
    await page.locator('[data-test-id="checkout-lastname-input"]').fill(checkoutData.contactInfo.lastName);
    await page.locator('[data-test-id="checkout-email-input"]').fill(checkoutData.contactInfo.email);
}

export async function fillShippingInfo(page: Page) {
    await page.locator('[data-test-id="checkout-address-input"]').fill(checkoutData.shippingInfo.address);
    await page.locator('[data-test-id="checkout-city-input"]').fill(checkoutData.shippingInfo.city);
    await page.locator('[data-test-id="checkout-zipcode-input"]').fill(checkoutData.shippingInfo.zipCode);
    await page.locator('[data-test-id="checkout-country-input"]').fill(checkoutData.shippingInfo.country);
}

export async function fillPaymentInfo(page: Page) {
    await page.locator('[data-test-id="checkout-cardname-input"]').fill(checkoutData.paymentInfo.nameOnCard);
    await page.locator('[data-test-id="checkout-cardnumber-input"]').fill(checkoutData.paymentInfo.cardNumber);
    await page.locator('[data-test-id="checkout-cardexpiry-input"]').fill(checkoutData.paymentInfo.expirationDate);
    await page.locator('[data-test-id="checkout-cardcvc-input"]').fill(checkoutData.paymentInfo.cvv);
}

export async function submitCheckout(page: Page) {
    await page.locator('[data-test-id="place-order-button"]').click();
}