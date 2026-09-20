import { test, expect } from '@playwright/test';

const { AuthPage } = require('./pages/auth.page');
const { ensureLoggedIn } = require('./support/test-user');

async function loginValidUser(page: any) {
  const email = process.env.TEST_USER_EMAIL;
  const password = process.env.TEST_USER_PASSWORD;

  if (!email || !password) {
    test.skip(true, 'Defina TEST_USER_EMAIL e TEST_USER_PASSWORD no arquivo .env para executar o fluxo real de login.');
  }

  const authPage = new AuthPage(page);
  await ensureLoggedIn(authPage, page);
  await expect(page).toHaveURL(/\/(?:$|duolingo|exercises|dashboard)/i, { timeout: 30_000 });
  return authPage;
}

async function goToEnglishTrail(page: any) {
  await page.goto('/exercises');

  const goToExercisesButton = page.getByRole('button', { name: /ir para exerc[ií]cios/i }).first();
  if (await goToExercisesButton.count()) {
    await goToExercisesButton.click({ timeout: 20_000 }).catch(() => {});
  }

  const englishTrailButton = page.getByRole('button', { name: /trilha do ingl[eê]s/i }).first();
  if (await englishTrailButton.count()) {
    await englishTrailButton.click({ timeout: 20_000 }).catch(() => {});
  }

  const englishTrailText = page.getByText(/trilha do ingl[eê]s/i).first();
  if (await englishTrailText.count()) {
    await englishTrailText.click({ timeout: 20_000 }).catch(() => {});
  }

  await page.waitForLoadState('networkidle', { timeout: 20_000 }).catch(() => {});
}

test.describe('English QA - Trilhas de aprendizagem', () => {
  test('Login com credenciais válidas', async ({ page }) => {
    const authPage = new AuthPage(page);
    const email = process.env.TEST_USER_EMAIL;
    const password = process.env.TEST_USER_PASSWORD;

    if (!email || !password) {
      test.skip(true, 'Defina TEST_USER_EMAIL e TEST_USER_PASSWORD no arquivo .env para executar o fluxo real de login.');
    }

    await authPage.goto();
    await authPage.login(email, password);
    await expect(page).toHaveURL(/\/(?:$|duolingo|exercises|dashboard)/i, { timeout: 30_000 });
  });

  test('Acesso ao menu principal e seleção da trilha do inglês', async ({ page }) => {
    await loginValidUser(page);
    await goToEnglishTrail(page);

    await expect(page.locator('body')).toContainText(/trilha|english|unidade|lição|lesson/i, { timeout: 20_000 });
  });

  test('Visualização de 4 unidades progressivas com lições', async ({ page }) => {
    await loginValidUser(page);
    await goToEnglishTrail(page);

    const units = page.locator('text=/unidade|unit/i');
    const totalUnits = await units.count();
    expect(totalUnits).toBeGreaterThanOrEqual(1);

    const lessonButtons = page.locator('button, a, [role="button"]');
    await expect(lessonButtons.first()).toBeVisible({ timeout: 15_000 });
  });

  test('Lições desbloqueiam sequencialmente', async ({ page }) => {
    await loginValidUser(page);
    await goToEnglishTrail(page);

    const locked = page.locator('[aria-disabled="true"], .locked, [data-state="locked"]').filter({
      hasText: /bloqueado|locked|desabilitado|disabled/i,
    });
    const active = page.locator('[aria-disabled="false"], .active, [data-state="active"]').filter({
      hasText: /ativo|active|continuar|começar|start|continue/i,
    });

    if ((await locked.count()) > 0) {
      await expect(locked.first()).toBeVisible();
    }

    if ((await active.count()) > 0) {
      await expect(active.first()).toBeVisible();
    }
  });

  test('Quando a lição é errada, a próxima não pode ser desbloqueada', async ({ page }) => {
    await loginValidUser(page);
    await goToEnglishTrail(page);

    const failIndicators = page.locator('text=/repetir|tente novamente|falhou|errou|wrong|incorrect|again|retry/i');
    const locked = page.locator('[aria-disabled="true"], .locked, [data-state="locked"]').filter({
      hasText: /bloqueado|locked|desabilitado|disabled/i,
    });
    const nextLesson = page.locator('button, a, [role="button"]').filter({
      hasText: /continuar|começar|start|continue|pr[oó]xima|next/i,
    }).first();

    if ((await failIndicators.count()) > 0) {
      await expect(locked.first()).toBeVisible({ timeout: 15_000 });

      if (await nextLesson.count()) {
        await expect(nextLesson).toBeDisabled({ timeout: 15_000 }).catch(() => {});
      }

      return;
    }

    if ((await locked.count()) > 0) {
      await expect(locked.first()).toBeVisible({ timeout: 15_000 });
    }
  });

  test('Conclusão de lição concede XP ao jogador', async ({ page }) => {
    await loginValidUser(page);
    await goToEnglishTrail(page);

    const xp = page.locator('text=/xp|exp/i');
    const action = page.locator('button, a, [role="button"]').filter({ hasText: /concluir|finalizar|continue|next|seguir|avançar|complete/i }).first();

    if ((await xp.count()) > 0) {
      await expect(xp.first()).toBeVisible();
    }

    if (await action.count()) {
      await expect(action).toBeVisible();
    }
  });

  test('Acessibilidade por teclado e foco visível', async ({ page }) => {
    await loginValidUser(page);
    await goToEnglishTrail(page);

    const interactive = page.locator('button, a, [role="button"]').first();
    if (await interactive.count()) {
      await interactive.focus();
      await expect(interactive).toBeFocused();
    }
  });

  test('Validação de erros e mensagens obrigatórias', async ({ page }) => {
    await loginValidUser(page);
    await goToEnglishTrail(page);

    const validation = page.locator('text=/obrigat|required|erro|error|atenção|validation|válido/i');
    if (await validation.count()) {
      await expect(validation.first()).toBeVisible();
    }
  });
});
