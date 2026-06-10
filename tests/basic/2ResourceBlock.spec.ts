import { test  } from '@playwright/test';
test('print all resources', async ({ page }) => {
    await page.route('**/*', (route) => {
        if (route.request().resourceType() === 'image') {
            route.abort()
        }
        return route.continue()
    })

    await page.goto('/products');
})