import { test, expect } from '@playwright/test';


test('Example test', async ({ page }) => {
  await page.goto('/'); 

  //check if user is auth 
  await page.locator('div').filter({ hasText: /^Toggle navigation menu$/ }).locator('div').getByRole('button').click();

  const welcomeMessage = page.getByText('Welcome!')
  await expect(welcomeMessage).toBeVisible();


})