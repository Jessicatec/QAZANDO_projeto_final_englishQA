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

  for (let i = 0; i < 5; i++) {
    await page.locator("input[placeholder='Sua resposta aqui...']").fill('you');
    await page.getByRole('button', { name: /Verificar Resposta/i }).click();
    await page.waitForTimeout(1500);
  }

  console.log('--- AFTER 5 ANSWERS ---');
  console.log((await page.locator('body').innerText()).slice(0, 5000));

  await page.getByRole('button', { name: /Recomeçar/i }).click();
  await page.waitForTimeout(2500);

  console.log('--- AFTER RESTART ---');
  console.log((await page.locator('body').innerText()).slice(0, 5000));

  await browser.close();
})();
