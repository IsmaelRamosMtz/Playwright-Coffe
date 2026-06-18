import { test, expect } from '@playwright/test';

test('Create order', async ({ request }) => {
    const dataPayload = {
        customerDetails: {
            firstName: 'Jhon',
            lastName: 'Doe',
            email: 'jhontest.doe@example.com',
            address: 'Test adress',
            city: 'Test city',
            zipCode: '66064',
            country: 'United States',
        },
        items: [
            {
                productId: '504',
                quantity: 1,
            },
        ],
    };

    const orderResponse = await request.post('/orders', {
        data: dataPayload,
    });
    // validar response
    expect(orderResponse.ok()).toBeTruthy();
    expect([200, 201]).toContain(orderResponse.status());
    const orderBody = await orderResponse.json();
    console.log('Response Body:', orderBody);



    // validar estructura de response
    expect(orderBody).toHaveProperty('success', true);
    expect(orderBody).toHaveProperty('data');
    expect(orderBody.data).toHaveProperty('orderId');
    expect(orderBody.data.orderId).not.toBeNull();


})
