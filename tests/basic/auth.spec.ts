import { test } from "@playwright/test";
import { EmailUtil } from "../../utils/EmailUtil";
import * as SignUp from "../pages/signUp";
import * as login from "../pages/login";
import { join, resolve } from "path";
import { writeFileSync, existsSync, mkdirSync } from "fs";
import { Sign } from "crypto";

const testSignUp = process.env.SIGN_UP_FLOW

test("track order with email", async ({}) => {
  const emailUtils = new EmailUtil();
  const inbox = await emailUtils.createInbox();
  console.log("Inbox created with email address:", inbox.emailAddress);
});

test("Sign up flow", async ({ page }) => {
  test.skip(testSignUp !== 'true', 'Skipping sign up test')
  const emailUtils = new EmailUtil();
  const inbox = await emailUtils.createInbox();
  // console.log("Inbox created with email address:", inbox);
  await page.goto("/signup");

  const signUp = await SignUp.fillUserRegister(page, inbox.emailAddress);
  const submitButton = await SignUp.submitSignUp(page);

  const email = await emailUtils.waitForLatestEmail(inbox.id);
  console.log("Email received:", email);

  const code = /([0-9]{6})/.exec(email.body!)![1];

  const confirmationCode = await SignUp.confirmationCode(page, code);

  await login.fillLoginForm(page, inbox.emailAddress, SignUp.userData.password);
  await login.submitLogin(page);

  await login.verifyLoginSuccess(page);

 // persist login data:
    const loginData = {
        email: inbox.emailAddress,
        pass: SignUp.userData.password
    }
    const authDir = resolve(__dirname, '../playwright/.auth');
    if (!existsSync(authDir)) {
        mkdirSync(authDir, { recursive: true });
    }
    writeFileSync(
        join(authDir, 'loginData.json'),
        JSON.stringify(loginData, null, 2)
    );
});
