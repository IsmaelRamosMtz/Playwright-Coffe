import { test, expect } from '@playwright/test';

test('Guest customer workflow', async ({ request }) => {
    // Step: obtener respuesta de productos
    const productsResponse = await request.get('products');
    expect(productsResponse.status()).toBe(200);
    //console.log('Products response => ', await productsResponse.json());

    // Step 2: imprimir el cuerpo de la respuesta de productos
    const productsBody = await productsResponse.json();
    //console.log('Products Response Body:', productsBody);
    expect(productsBody).toHaveProperty('success', true);
    expect(Array.isArray(productsBody.data)).toBe(true);
    expect(productsBody.data.length).toBeGreaterThan(0);

    // Step 3: Validar stock del producto
    const products = productsBody.data;
    // console.log('Products:', products);
    const availableProduct = products.find((product: any) => product.stock > 0);
    expect(availableProduct).toBeDefined();
    expect(availableProduct.stock).toBeGreaterThan(0);

    // console.log('Available product:', availableProduct);

    // Step 4: Crear orden con producto disponible
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
                productId: availableProduct.id,
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

    // validar estructura de response
    const orderBody = await orderResponse.json();
    //    console.log('Response Body:', orderBody);
    expect(orderBody).toHaveProperty('success', true);
    expect(orderBody).toHaveProperty('data');
    expect(orderBody.data).toHaveProperty('orderId');
    expect(orderBody.data.orderId).not.toBeNull();
})