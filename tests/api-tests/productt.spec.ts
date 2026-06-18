import { test, expect } from '@playwright/test';

test.describe('Product API tests', () => {

    test('Get all products', async ({ request }) => {
        const response = await request.get('products');
        // check status code and log response
        console.log('Status:', response.status());
        expect(response.ok()).toBeTruthy();
        expect(response.status()).toBe(200);

        // check headers
         expect(response.headers()['content-type']).toBe('application/json');

        const responseBody = await response.json();
        console.log('Response Body:', responseBody);
        
        // Response strcture validation
        expect(responseBody).toHaveProperty('success', true);
        expect(responseBody).toHaveProperty('data');
        expect(Array.isArray(responseBody.data)).toBe(true); 
        expect(responseBody.data.length).toBeGreaterThan(0);

        // Log the name of the first product
        console.log('Data product 1', responseBody.data[0])
        console.log('Name from product 1', responseBody.data[0].name)
    })
})