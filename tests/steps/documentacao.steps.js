const { expect } = require('@playwright/test');
const { createBdd } = require('playwright-bdd');
const { test } = require('../fixtures');
const { requireTestUser } = require('../support/test-user');

const { Given, When, Then } = createBdd(test);

async function loginAndOpenDocs(page) {
  const { email, password } = requireTestUser();

  await page.goto('/auth');
  await page.getByPlaceholder('seu@email.com').fill(email);
  await page.getByPlaceholder('••••••••').fill(password);
  await page.getByRole('button', { name: 'Entrar', exact: true }).click();
  await page.waitForURL(/\/(?:$|docs|exercises|dashboard)/i, { timeout: 30_000 });
  await page.goto('/docs');
  await page.waitForLoadState('domcontentloaded');
}

Given('the user is authenticated and on the documentation page', async ({ page }) => {
  await loginAndOpenDocs(page);
});

Given('the user is on the documentation page', async ({ page }) => {
  await loginAndOpenDocs(page);
});

Then('the heading {string} should be visible', async ({ page }, headingText) => {
  await expect(page.getByRole('heading', { name: new RegExp(headingText, 'i') })).toBeVisible({ timeout: 20_000 });
});

Then('the overview paragraph should describe the purpose of the platform', async ({ page }) => {
  await expect(page.getByText(/Imagine que você é um|English QA|QA/i)).toBeVisible({ timeout: 20_000 });
});

Then('the feature list and test user table should be displayed', async ({ page }) => {
  await expect(page.getByRole('heading', { name: /Funcionalidades e Regras de Negócio/i })).toBeVisible({ timeout: 20_000 });
  await expect(page.getByRole('heading', { name: /Usuários de Teste/i })).toBeVisible({ timeout: 20_000 });
  await expect(page.getByRole('table')).toBeVisible({ timeout: 20_000 });
});

When('the user expands the {string} section', async ({ page }, sectionName) => {
  const button = page.getByRole('button', { name: new RegExp(sectionName, 'i') });
  await button.click({ timeout: 20_000 });
});

Then('the business rules list should be displayed', async ({ page }) => {
  await expect(page.getByText('Regras de Negócio', { exact: true })).toBeVisible({ timeout: 20_000 });
  await expect(page.getByText('Cadastro exige email válido e confirmação por email obrigatória', { exact: false })).toBeVisible({ timeout: 20_000 });
});

Then('the rules should include email validation and login restrictions', async ({ page }) => {
  await expect(page.getByText('Cadastro exige email válido e confirmação por email obrigatória', { exact: false })).toBeVisible({ timeout: 20_000 });
  await expect(page.getByText('Login só funciona após a confirmação do email', { exact: false })).toBeVisible({ timeout: 20_000 });
  await expect(page.getByText('Senha deve ter no mínimo 6 caracteres', { exact: false })).toBeVisible({ timeout: 20_000 });
});

Then('the test user table should show the profiles admin, premium active, common user and email unconfirmed', async ({ page }) => {
  await expect(page.getByRole('cell', { name: 'admin@teste.com', exact: true })).toBeVisible({ timeout: 20_000 });
  await expect(page.getByRole('cell', { name: 'ativo@teste.com', exact: true })).toBeVisible({ timeout: 20_000 });
  await expect(page.getByRole('cell', { name: 'inativo@teste.com', exact: true })).toBeVisible({ timeout: 20_000 });
  await expect(page.getByRole('cell', { name: 'semconfirmar@teste.com', exact: true })).toBeVisible({ timeout: 20_000 });
});

When('the user tabs through the interactive feature cards', async ({ page }) => {
  const firstCard = page.getByRole('button', { name: /cadastro e acesso gratuito/i }).first();
  await firstCard.focus();
  await page.keyboard.press('Tab');
});

Then('the focused card should change visually and remain accessible', async ({ page }) => {
  const nextCard = page.getByRole('button', { name: /ativação premium gratuito/i }).first();
  await expect(nextCard).toBeVisible({ timeout: 20_000 });
  await expect(nextCard).toBeFocused({ timeout: 20_000 });
});
