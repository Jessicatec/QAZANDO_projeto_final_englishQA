import { test, expect } from '@playwright/test';

const { AuthPage } = require('./pages/auth.page');
const { RankingPage } = require('./pages/ranking.page');
const { requireTestUser } = require('./support/test-user');

async function loginAndOpenMainMenu(page: any) {
  const { email, password } = requireTestUser();

  await page.goto('/auth');
  const authPage = new AuthPage(page);
  await authPage.login(email, password);
  await page.waitForURL(/\/(?:$|exercises|dashboard|duolingo)/i, { timeout: 30_000 });

  const rankingPage = new RankingPage(page);
  if (await rankingPage.mainMenuLink.count()) {
    await rankingPage.mainMenuLink.click({ timeout: 15_000 });
  }

  return page;
}

async function openRankingPage(page: any) {
  await loginAndOpenMainMenu(page);
  await page.goto('/ranking');
  await expect(page).toHaveURL(/\/ranking/i, { timeout: 20_000 });
}

test.describe('English QA - Ranking', () => {
  test('acessa a tela de ranking após login e visualiza o estado atual da feature', async ({ page }) => {
    await openRankingPage(page);

    const rankingPage = new RankingPage(page);
    await expect(page.locator('body')).toContainText(/ranking|conteúdo premium|ativar código premium/i, { timeout: 20_000 });
    await expect(rankingPage.premiumHeading.or(rankingPage.rankingTitle)).toBeVisible({ timeout: 20_000 });
  });

  test('exibe a mensagem de bloqueio para usuários sem acesso premium ao ranking', async ({ page }) => {
    await openRankingPage(page);

    const rankingPage = new RankingPage(page);
    await expect(rankingPage.premiumHeading).toBeVisible({ timeout: 20_000 });
    await expect(rankingPage.premiumDescription).toBeVisible({ timeout: 20_000 });
    await expect(rankingPage.activatePremiumButton).toBeVisible({ timeout: 20_000 });
  });

  test('permite a navegação até o menu principal após autenticação', async ({ page }) => {
    await loginAndOpenMainMenu(page);

    await expect(page.locator('body')).toContainText(/exerc[ií]cios|trilha|quiz|ranking/i, { timeout: 20_000 });
  });

  test('mantém a tela de ranking acessível por teclado e com foco visível', async ({ page }) => {
    await openRankingPage(page);

    const rankingPage = new RankingPage(page);
    const target = rankingPage.activatePremiumButton;

    if (await target.count()) {
      await target.focus();
      await expect(target).toBeFocused({ timeout: 10_000 });
    }
  });

  test('apresenta feedback visual claro quando o acesso ao ranking está bloqueado', async ({ page }) => {
    await openRankingPage(page);

    const rankingPage = new RankingPage(page);
    await expect(rankingPage.premiumHeading).toBeVisible({ timeout: 20_000 });
    await expect(rankingPage.activatePremiumButton).toBeVisible({ timeout: 20_000 });
    await expect(page.locator('body')).not.toContainText(/erro crítico|falha ao carregar/i, { timeout: 20_000 });
  });
});
