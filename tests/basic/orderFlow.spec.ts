import { test, expect } from "@playwright/test";
import * as Products from "../pages/Products";
import * as Carts from "../pages/Carts";
import * as Checkout from "../pages/Checkout";
import * as Contact from "../pages/Contact";

test("e2e shop on coffee", async ({ page }) => {
  await page.goto("/products");

  const addProductToCart = await Products.addProductToCart(page, 0);

  await page.locator('[data-test-id="header-cart-button"]').click();

  const assertProductInCart = await Carts.assertProductInCart(
    page,
    addProductToCart.name,
  );

  const subTotal = await Carts.getSubTotal(page);
  expect(subTotal).toBe(addProductToCart.price);

  await page.getByRole("button", { name: "Proceed to checkout" }).click();

  /*    const fillContactInfo = await Checkout.fillContactInfo(page);
    const fillShippingInfo = await Checkout.fillShippingInfo(page);
    const fillPaymentInfo = await Checkout.fillPaymentInfo(page);
    const submitCheckout = await Checkout.submitCheckout(page); */
  await Checkout.fillContactInfo(page);
  await Checkout.fillShippingInfo(page);
  await Checkout.fillPaymentInfo(page);
  await Checkout.submitCheckout(page);

  const orderConfirmation = page.getByRole("heading", {
    name: "Order Confirmed!",
  });
  await expect(orderConfirmation).toBeVisible();

  const orderNumber = page.locator(".text-2xl");
  const orderNumberText = await orderNumber.textContent();
  await expect(orderNumber).toBeVisible();

  await page.getByRole("button", { name: "Track Your Order" }).click();

  if (!orderNumberText) {
    throw new Error("No se encontró el número de orden");
  }
  await Contact.trackOrder(
    page,
    orderNumberText,
    Checkout.checkoutData.contactInfo.email,
  );

  await Contact.submitTrackOrder(page);

  await Promise.all([page.waitForURL("**/order/**")]);

  const url = page.url();
  expect(url).toContain(`order/${orderNumberText}`);

  const firstOrder = page.getByText(addProductToCart.name);
  await expect(firstOrder).toBeVisible();
});

test("e2e shop on coffee - with steps", async ({ page }) => {
  await test.step("Open products page", async () => {
    await page.goto("/products");
  });

  let addProductToCart = { name: "", price: 0 };
  // la variable addProductToCart funciona como un contenedor para almacenar el resultado de la función Products.addProductToCart, que se ejecutará dentro del bloque de código del paso "Add first coffee product to cart". Esto permite que el resultado de esa función esté disponible para su uso en pasos posteriores, como "Open shopping cart and verify selected item", donde se necesita acceder a las propiedades name y price del producto agregado al carrito. Al declarar addProductToCart fuera del bloque de código del paso, se asegura que su valor persista a lo largo de toda la ejecución del test, permitiendo así una mejor organización y reutilización de los datos obtenidos durante el flujo de compra.
  // let addProductToCart: Awaited<ReturnType<typeof Products.addProductToCart>> = { } as any;
  await test.step("Add first coffee product to cart", async () => {
    addProductToCart = await Products.addProductToCart(page, 0);
  });

  await test.step("Open shopping cart and verify selected item", async () => {
    await page.locator('[data-test-id="header-cart-button"]').click();

    await Carts.assertProductInCart(page, addProductToCart.name);

    const subTotal = await Carts.getSubTotal(page);
    expect(subTotal).toBe(addProductToCart.price);
  });

  await test.step("Proceed to checkout", async () => {
    await page.getByRole("button", { name: "Proceed to checkout" }).click();
  });

  await test.step("Complete checkout forms", async () => {
    await Checkout.fillContactInfo(page);
    await Checkout.fillShippingInfo(page);
    await Checkout.fillPaymentInfo(page);
    await Checkout.submitCheckout(page);
  });

  let orderNumberText: string | null = null;
  await test.step("Verify order confirmation and capture order number", async () => {
    const orderConfirmation = page.getByRole("heading", {
      name: "Order Confirmed!",
    });
    await expect(orderConfirmation).toBeVisible();

    const orderNumber = page.locator(".text-2xl");
    orderNumberText = await orderNumber.textContent();
    await expect(orderNumber).toBeVisible();
  });

  await test.step("Track order and validate order detail page", async () => {
    await page.getByRole("button", { name: "Track Your Order" }).click();

    if (!orderNumberText) {
      throw new Error("No se encontró el número de orden");
    }

    await Contact.trackOrder(
      page,
      orderNumberText,
      Checkout.checkoutData.contactInfo.email,
    );

    await Contact.submitTrackOrder(page);

    await Promise.all([page.waitForURL("**/order/**")]);

    const url = page.url();
    expect(url).toContain(`order/${orderNumberText}`);

    const firstOrder = page.getByText(addProductToCart.name);
    await expect(firstOrder).toBeVisible();
  });
});
