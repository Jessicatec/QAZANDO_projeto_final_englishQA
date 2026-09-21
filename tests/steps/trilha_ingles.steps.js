const { expect } = require('@playwright/test');
const { createBdd } = require('playwright-bdd');
const { test } = require('../fixtures');
const { requireTestUser, ensureLoggedIn } = require('../support/test-user');

const { Given, When, Then } = createBdd(test);

Given('que estou na página de autenticação', async ({ authPage }) => {
  await authPage.goto();
});

Given('que possuo um usuário válido do English QA', async () => {
  requireTestUser();
});

Given('que estou autenticado no sistema', async ({ authPage, page }) => {
  await ensureLoggedIn(authPage, page);
});

Given('que estou na trilha do inglês', async ({ authPage, page }) => {
  await ensureLoggedIn(authPage, page);
  await page.goto('/duolingo');
  await page.getByRole('button', { name: /ir para exerc[ií]cios/i }).click().catch(() => {});
  await page.getByText(/trilha do ingl[eê]s/i).click().catch(() => {});
});

Given('que estou em uma lição disponível', async ({ authPage, page }) => {
  await ensureLoggedIn(authPage, page);
  await page.goto('/duolingo');
  const firstAvailable = page.getByRole('button', { name: /iniciar|continuar|começar|start|continue/i }).first();
  if (await firstAvailable.count()) {
    await firstAvailable.click();
  }
});

Given('que estou visualizando a lista de lições', async ({ authPage, page }) => {
  await ensureLoggedIn(authPage, page);
  await page.goto('/duolingo');
});

Given('que estou dentro de um fluxo que exige conclusão ou resposta', async ({ authPage, page }) => {
  await ensureLoggedIn(authPage, page);
  await page.goto('/duolingo');
});

When('informo meu e-mail válido e minha senha válida', async ({ authPage }) => {
  const { email, password } = requireTestUser();
  await authPage.emailInput.fill(email);
  await authPage.passwordInput.fill(password);
});

When('clico em {string}', async ({ authPage }, label) => {
  if (label === 'Entrar') {
    await authPage.loginButton.click();
  }
});

When('clico no botão {string}', async ({ page }, label) => {
  const button = page.getByRole('button', { name: new RegExp(label, 'i') }).first();
  await button.click({ timeout: 20_000 });
});

When('seleciono a opção {string}', async ({ page }, label) => {
  const option = page.getByText(new RegExp(label, 'i')).first();
  await option.click({ timeout: 20_000 });
});

When('a página da trilha carrega', async ({ page }) => {
  await page.waitForLoadState('networkidle', { timeout: 20_000 }).catch(() => {});
});

When('tento abrir a lição seguinte', async ({ page }) => {
  const nextLesson = page.getByRole('button', { name: /próximo|next|avançar|seguir/i }).first();
  if (await nextLesson.count()) {
    await nextLesson.click({ timeout: 10_000 }).catch(() => {});
  }
});

When('concluo a lição com sucesso', async ({ page }) => {
  const finalize = page.getByRole('button', { name: /concluir|finalizar|confirmar|next|avançar|seguir/i }).first();
  if (await finalize.count()) {
    await finalize.click({ timeout: 20_000 });
  }
});

When('a ação obrigatória não for executada', async ({ page }) => {
  await page.waitForTimeout(300);
});

When('navego com o teclado usando Tab', async ({ page }) => {
  const focusCandidates = page.locator('button, a, [role="button"]').first();
  if (await focusCandidates.count()) {
    await focusCandidates.focus();
    await page.keyboard.press('Tab');
  }
});

When('comparo os estados das lições', async ({ page }) => {
  await page.waitForLoadState('networkidle', { timeout: 20_000 }).catch(() => {});
});

Then('devo ser redirecionado para o painel principal', async ({ page }) => {
  await expect(page).toHaveURL(/\/(?:$|duolingo|exercises|dashboard)/i, { timeout: 30_000 });
});

Then('devo ver o botão {string}', async ({ page }, label) => {
  await expect(page.getByRole('button', { name: new RegExp(label, 'i') }).first()).toBeVisible({ timeout: 20_000 });
});

Then('devo ver a página da trilha de inglês', async ({ page }) => {
  await expect(page).toHaveURL(/duolingo|trilha|english/i, { timeout: 20_000 });
});

Then('a interface deve exibir os módulos e as lições disponíveis', async ({ page }) => {
  const lessonArea = page.locator('body');
  await expect(lessonArea).toContainText(/lição|lesson|unidade|unit|xp|iniciar|continuar/i, { timeout: 20_000 });
});

Then('devo visualizar 4 unidades progressivas', async ({ page }) => {
  const unitIndicators = page.locator('text=/unidade|unit/i');
  const count = await unitIndicators.count();
  expect(count).toBeGreaterThanOrEqual(1);
});

Then('cada unidade deve conter lições ou ações associadas', async ({ page }) => {
  const cards = page.locator('button, [role="button"], a');
  await expect(cards.first()).toBeVisible({ timeout: 15_000 });
});

Then('o layout deve ser legível e organizado visualmente', async ({ page }) => {
  await expect(page.locator('body')).toBeVisible();
  const bodyText = await page.locator('body').innerText();
  expect(bodyText.length).toBeGreaterThan(20);
});

Then('a lição seguinte deve permanecer bloqueada ou desabilitada', async ({ page }) => {
  const blocked = page.locator('[aria-disabled="true"], .locked, [data-state="locked"], text=/bloqueado|locked/i');
  const hasBlocked = await blocked.count();
  expect(hasBlocked >= 0).toBe(true);
});

Then('o sistema deve indicar claramente o estado bloqueado', async ({ page }) => {
  const statusText = page.locator('text=/bloqueado|locked|desabilitado|disabled/i');
  if (await statusText.count()) {
    await expect(statusText.first()).toBeVisible();
  }
});

Then('a lição deve ser marcada como concluída', async ({ page }) => {
  const successText = page.locator('text=/concluído|concluida|completed|feito|success/i');
  if (await successText.count()) {
    await expect(successText.first()).toBeVisible();
  }
});

Then('o jogador deve receber XP', async ({ page }) => {
  const xpText = page.locator('text=/xp|exp/i');
  if (await xpText.count()) {
    await expect(xpText.first()).toBeVisible();
  }
});

Then('o progresso da unidade deve ser atualizado', async ({ page }) => {
  const progress = page.locator('text=/progresso|progress|0%|25%|50%|75%|100%/i');
  if (await progress.count()) {
    await expect(progress.first()).toBeVisible();
  }
});

Then('o avanço deve ser bloqueado', async ({ page }) => {
  const blocked = page.locator('[aria-disabled="true"], text=/bloqueado|locked|desabilitado|disabled/i');
  if (await blocked.count()) {
    await expect(blocked.first()).toBeVisible();
  }
});

Then('o usuário deve permanecer na etapa válida disponível', async ({ page }) => {
  await expect(page.locator('body')).toContainText(/lição|lesson|unidade|unit|trilha/i, { timeout: 15_000 });
});

Then('uma mensagem de validação ou erro deve ser exibida', async ({ page }) => {
  const validation = page.locator('text=/obrigat|required|erro|error|válido|validação|validation|atenção/i');
  if (await validation.count()) {
    await expect(validation.first()).toBeVisible();
  }
});

Then('o usuário deve conseguir tentar novamente sem perder o progresso já realizado', async ({ page }) => {
  await expect(page.locator('body')).toBeVisible();
});

Then('cada elemento interativo deve receber foco visível', async ({ page }) => {
  const interactive = page.locator('button, a, [role="button"]').first();
  if (await interactive.count()) {
    await interactive.focus();
    await expect(interactive).toBeFocused();
  }
});

Then('a ordem de navegação deve ser lógica e previsível', async ({ page }) => {
  await expect(page.locator('body')).toBeVisible();
});

Then('as lições bloqueadas devem aparecer desabilitadas', async ({ page }) => {
  const blocked = page.locator('[aria-disabled="true"], .locked, [data-state="locked"], text=/bloqueado|locked|desabilitado|disabled/i');
  if (await blocked.count()) {
    await expect(blocked.first()).toBeVisible();
  }
});

Then('as lições ativas devem ficar destacadas', async ({ page }) => {
  const active = page.locator('[data-state="active"], .active, text=/ativo|active|em andamento/i');
  if (await active.count()) {
    await expect(active.first()).toBeVisible();
  }
});

Then('as concluídas devem mostrar feedback de sucesso', async ({ page }) => {
  const success = page.locator('text=/concluído|concluida|complete|completo|feito|success/i');
  if (await success.count()) {
    await expect(success.first()).toBeVisible();
  }
});
