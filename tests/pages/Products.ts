import { type Page } from "playwright";

export async function addProductToCart(page: Page, index: number){
    const productWrapper = page.locator('.p-6').nth(index);
    const product_name = await productWrapper.getByRole('heading').textContent();
    const product_price = await productWrapper.locator('.font-bold').textContent();

    const addButton = productWrapper.getByRole('button', { name: 'Add to cart' });
    await addButton.click();

    return { 
        name: product_name!,
        price: Number(product_price?.substring(1)) // omite el 1 valor en estecaso '$'
    }
}
    