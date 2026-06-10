import { test, expect } from '@playwright/test';
import * as Products from '../pages/Products';
import * as Carts from '../pages/Carts';

test('add to cart', async ({ page }) => {
    await page.goto('/products');

    const addProductToCart = await Products.addProductToCart(page, 0);

    await page.locator('[data-test-id="header-cart-button"]').click();

    const assertProductInCart = await Carts.assertProductInCart(page, addProductToCart.name);

    const subTotal = await Carts.getSubTotal(page);
    expect(subTotal).toBe(addProductToCart.price);
})