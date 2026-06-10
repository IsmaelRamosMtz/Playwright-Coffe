import { test, expect } from '@playwright/test';

test('print api call to products', async ({ page }) => {
    // print request:
    page.on('request', request => console.log('>>', request.method(), request.url()));

    await page.goto('/products');

    // wait for all network calls to finish
    await page.waitForLoadState('networkidle');
});

test('intercept api call to products and mock response', async ({ page }) => {
    // add mockdata for products api call
    // the mockdata is information that we want to return instead of the real response from the server
    const someProducts = {
        success: true,
        source: 'dynamodb',
        data: [{
            name: 'Product 1',
            price: 10,
            id: 0
        },
        {
            name: 'Product 2',
            price: 20,
            id: 1
        }]
    }

    await page.route('https://api.valentinos-magic-beans.click/products', (route) => {
        route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(someProducts)
        })
    });

    await page.goto('/products');

    // this will allow intercepting fetch request 
    await page.waitForLoadState('networkidle');

    await page.locator('[data-test-id="product-card-add-to-cart-button-0"]').click();

    await page.locator('[data-test-id="header-cart-button"]').click();

    // assert that the product is added to the cart
    const firstPorductHeading = page.getByRole('heading', { name: someProducts.data[0].name });

    await expect(firstPorductHeading).toBeVisible();
})


test.skip('example of intercept similar to cypress cy.intercept', async ({ page }) => {
    // cypress:
    // cy.intercept('GET', '/api/data').as('getData')
    // cy.wait(@getData)

    // Ejemplo 1: interceptas y dejas pasar la petición
    await page.route('**/api/data**', route => route.continue());

    // esperas la respuesta que coincida
    const response = await page.waitForResponse(
        resp => resp.url().includes('/api/data') && resp.request().method() === 'GET'
    );

    // luego usas el cuerpo si quieres
    const data = await response.json();


    // Ejemplo 2: Si la llamada se dispara por una acción en la página, hazlo así:

    const [response2] = await Promise.all([
        page.waitForResponse(
            resp => resp.url().includes('/api/data') && resp.request().method() === 'GET'
        ),
        page.click('button#load-data')
    ]);

    const datas = await response2.json();
})