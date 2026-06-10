import { Page, expect } from "@playwright/test";

export async function assertProductInCart(page: Page, heading: string) {
  const firstProductHeading = page.getByRole("heading", {
    name: heading,
  });
  await expect(firstProductHeading).toBeVisible();
}


export async function getSubTotal(page: Page) {
  const subTotalWrapper = page.getByText("SubTotal")
    .locator("..")
    .locator(".font-semibold");
  const subTotal = await subTotalWrapper.textContent();
  return Number(subTotal?.substring(1)); // omite el 1 valor en estecaso '$'
}