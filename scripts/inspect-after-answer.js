const { chromium } = require('playwright');
require('dotenv').config();

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const email = process.env.TEST_USER_EMAIL;
  const password = process.env.TEST_USER_PASSWORD;

  await page.goto('https://english.qazando.com.br/auth');
  await page.getByPlaceholder('seu@email.com').fill(email);
  await page.getByPlaceholder('••••••••').fill(password);
  await page.getByRole('button', { name: 'Entrar', exact: true }).click();
  await page.waitForURL(/\/(?:$|duolingo|exercises|dashboard)/i, { timeout: 40_000 });

  await page.goto('https://english.qazando.com.br/exercises');
  await page.waitForTimeout(2000);

  const input = page.locator("input[placeholder='Sua resposta aqui...']");
  const button = page.getByRole('button', { name: /Verificar Resposta/i });

  await input.fill('you');
  await button.click();
  await page.waitForTimeout(2500);

  const bodyText = await page.locator('body').innerText();
  console.log('--- AFTER CORRECT ---');
  console.log(bodyText.slice(0, 5000));

  await browser.close();
})();
