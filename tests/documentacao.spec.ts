import { test, expect } from '@playwright/test';

const { DocsPage } = require('./pages/docs.page');
const { requireTestUser } = require('./support/test-user');

async function loginAndOpenDocs(page: any) {
  const { email, password } = requireTestUser();

  await page.goto('/auth');
  await page.getByPlaceholder('seu@email.com').fill(email);
  await page.getByPlaceholder('••••••••').fill(password);
  await page.getByRole('button', { name: 'Entrar', exact: true }).click();
  await page.waitForURL(/\/(?:$|docs|exercises|dashboard)/i, { timeout: 30_000 });
  await page.goto('/docs');
  await expect(page.getByRole('heading', { name: 'Documentação', exact: true })).toBeVisible({ timeout: 20_000 });
}

test.describe('English QA - Documentação', () => {
  test('carrega a página de documentação com os principais blocos da interface', async ({ page }) => {
    await loginAndOpenDocs(page);

    const docsPage = new DocsPage(page);
    await expect(docsPage.heading).toBeVisible({ timeout: 20_000 });
    await expect(page.getByText(/Imagine que você é um/i)).toBeVisible({ timeout: 20_000 });
    await expect(page.getByRole('heading', { name: /Funcionalidades e Regras de Negócio/i })).toBeVisible({ timeout: 20_000 });
    await expect(page.getByRole('heading', { name: /Usuários de Teste/i })).toBeVisible({ timeout: 20_000 });
    await expect(docsPage.testUsersTable).toBeVisible({ timeout: 20_000 });
  });

  test('expande uma funcionalidade e exibe as regras de negócio associadas', async ({ page }) => {
    await loginAndOpenDocs(page);

    await page.getByRole('button', { name: /Cadastro e Acesso Gratuito/i }).click();

    await expect(page.getByText('Regras de Negócio', { exact: true })).toBeVisible({ timeout: 20_000 });
    await expect(page.getByText('Cadastro exige email válido e confirmação por email obrigatória', { exact: false })).toBeVisible({ timeout: 20_000 });
    await expect(page.getByText('Login só funciona após a confirmação do email', { exact: false })).toBeVisible({ timeout: 20_000 });
    await expect(page.getByText('Senha deve ter no mínimo 6 caracteres', { exact: false })).toBeVisible({ timeout: 20_000 });
  });

  test('lista corretamente os usuários de teste com perfil e senha', async ({ page }) => {
    await loginAndOpenDocs(page);

    await expect(page.getByRole('cell', { name: 'admin@teste.com', exact: true })).toBeVisible({ timeout: 20_000 });
    await expect(page.getByRole('cell', { name: 'ativo@teste.com', exact: true })).toBeVisible({ timeout: 20_000 });
    await expect(page.getByRole('cell', { name: 'inativo@teste.com', exact: true })).toBeVisible({ timeout: 20_000 });
    await expect(page.getByRole('cell', { name: 'semconfirmar@teste.com', exact: true })).toBeVisible({ timeout: 20_000 });
    await expect(page.getByRole('columnheader', { name: 'Perfil', exact: true })).toBeVisible({ timeout: 20_000 });
    await expect(page.getByRole('columnheader', { name: 'Descrição', exact: true })).toBeVisible({ timeout: 20_000 });
  });

  test('mantém a navegação por teclado acessível nos cards de documentação', async ({ page }) => {
    await loginAndOpenDocs(page);

    const firstCard = page.getByRole('button', { name: /Cadastro e Acesso Gratuito/i });
    await firstCard.focus();
    await expect(firstCard).toBeFocused({ timeout: 20_000 });

    await page.keyboard.press('Tab');
    const nextCard = page.getByRole('button', { name: /Ativação Premium Gratuito/i });
    await expect(nextCard).toBeVisible({ timeout: 20_000 });
    await expect(nextCard).toBeFocused({ timeout: 20_000 });

    await page.screenshot({ path: 'docs/documentacao-evidencia.png', fullPage: true });
  });
});
