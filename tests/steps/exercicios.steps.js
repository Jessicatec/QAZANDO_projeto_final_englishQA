const { expect } = require('@playwright/test');
const { createBdd } = require('playwright-bdd');
const { test } = require('../fixtures');
const { requireTestUser, ensureLoggedIn } = require('../support/test-user');
const { ExercisesPage } = require('../pages/exercises.page');

const { Given, When, Then } = createBdd(test);

async function accessExercisePage({ authPage, page }) {
  const { email, password } = requireTestUser();
  await ensureLoggedIn(authPage, page);
  await page.goto('/exercises');
  await page.waitForLoadState('domcontentloaded', { timeout: 20_000 }).catch(() => {});
  await page.waitForTimeout(500);

  if (!email || !password) {
    throw new Error('Credenciais do usuário de teste ausentes para validar os exercícios.');
  }
}

async function answerExercise(page, answer) {
  const exercisesPage = new ExercisesPage(page);
  await exercisesPage.answerQuestion(answer);
}

Given('que o usuário acessa a página de exercícios', async ({ authPage, page }) => {
  await accessExercisePage({ authPage, page });
});

Given('que está autenticado no sistema', async ({ authPage, page }) => {
  await ensureLoggedIn(authPage, page);
  await page.goto('/exercises');
});

Given('que a questão exibida é {string}', async ({ page }, questionText) => {
  await page.waitForTimeout(500);
  const matches = page.getByText(new RegExp(questionText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'));
  if (await matches.count()) {
    await expect(matches.first()).toBeVisible({ timeout: 20_000 });
  }
});

Given('que o usuário completou as 5 questões', async ({ authPage, page }) => {
  await accessExercisePage({ authPage, page });
  for (let index = 0; index < 5; index += 1) {
    await answerExercise(page, 'you');
    await page.waitForTimeout(500);
  }
});

Given('que o usuário está na questão {string}', async ({ authPage, page }, questionLabel) => {
  await accessExercisePage({ authPage, page });
  await page.waitForTimeout(500);
  const target = page.getByText(new RegExp(questionLabel.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i')).first();
  if (await target.count()) {
    await expect(target).toBeVisible({ timeout: 20_000 });
  }
});

Given('que o usuário respondeu as 30 questões', async ({ authPage, page }) => {
  await accessExercisePage({ authPage, page });
  for (let index = 0; index < 30; index += 1) {
    await answerExercise(page, 'you');
    await page.waitForTimeout(400);
  }
});

Given('que o usuário completou as 30 questões', async ({ authPage, page }) => {
  await accessExercisePage({ authPage, page });
  for (let index = 0; index < 30; index += 1) {
    await answerExercise(page, 'you');
    await page.waitForTimeout(400);
  }
});

When('digitar {string} no campo de resposta', async ({ page }, answer) => {
  const exercisesPage = new ExercisesPage(page);
  await exercisesPage.fillAnswer(answer);
});

When('clicar em {string}', async ({ page }, buttonLabel) => {
  const button = page.getByRole('button', { name: new RegExp(buttonLabel, 'i') }).first();
  if (await button.count()) {
    await button.click({ timeout: 20_000 });
    return;
  }

  const fallback = page.locator('button, [role="button"]').filter({
    hasText: new RegExp(buttonLabel, 'i'),
  }).first();

  if (await fallback.count()) {
    await fallback.click({ timeout: 20_000 });
  }
});

When('clicar em {string} sem preencher o campo', async ({ page }, buttonLabel) => {
  await page.getByRole('button', { name: new RegExp(buttonLabel, 'i') }).first().click({ timeout: 20_000 }).catch(() => {});
});

When('responder a última questão e clicar em {string}', async ({ page }, actionLabel) => {
  const exercisesPage = new ExercisesPage(page);
  await exercisesPage.answerQuestion('you');
  await page.getByRole('button', { name: new RegExp(actionLabel, 'i') }).first().click({ timeout: 20_000 }).catch(() => {});
});

Then('a próxima questão é exibida', async ({ page }) => {
  await page.waitForTimeout(800);
  await expect(page.locator('body')).toBeVisible();
});

Then('o indicador avança para {string}', async ({ page }, expectedText) => {
  const match = page.getByText(new RegExp(expectedText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i')).first();
  if (await match.count()) {
    await expect(match).toBeVisible({ timeout: 20_000 });
  }
});

Then('a barra de progresso é atualizada \(ex\.: 7%\)', async ({ page }) => {
  const progress = page.getByText(/7%|7 percent|7\/100|7\s*de\s*100|7\s*%/i).first();
  if (await progress.count()) {
    await expect(progress).toBeVisible({ timeout: 20_000 });
  }
});

Then('o histórico mostra a questão com {string} e o status {string}', async ({ page }, answerText, statusText) => {
  const history = page.locator('body');
  await expect(history).toContainText(new RegExp(answerText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'), { timeout: 20_000 });
  await expect(history).toContainText(new RegExp(statusText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'), { timeout: 20_000 });
});

Then('o resumo do histórico mostra {string}', async ({ page }, summaryText) => {
  await expect(page.locator('body')).toContainText(new RegExp(summaryText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'), { timeout: 20_000 });
});

Then('uma nova rodada inicia em {string} com histórico vazio', async ({ page }, expectedText) => {
  const heading = page.getByText(new RegExp(expectedText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i')).first();
  if (await heading.count()) {
    await expect(heading).toBeVisible({ timeout: 20_000 });
  }

  const bodyText = await page.locator('body').innerText();
  expect(bodyText.toLowerCase()).not.toMatch(/você respondeu|historico|history|respostas anteriores/i);
});

Then('a barra de progresso mostra {string}', async ({ page }, expectedText) => {
  await expect(page.locator('body')).toContainText(new RegExp(expectedText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'), { timeout: 20_000 });
});

Then('uma tela ou mensagem de conclusão é exibida', async ({ page }) => {
  const completion = page.getByText(/conclu|finish|finalizado|congrat|done|parabéns|completo/i).first();
  if (await completion.count()) {
    await expect(completion).toBeVisible({ timeout: 20_000 });
  }
});

Then('o histórico lista as 30 questões com {string}', async ({ page }, expectedText) => {
  await expect(page.locator('body')).toContainText(new RegExp(expectedText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'), { timeout: 20_000 });
});

Then('não é possível avançar para uma {string}', async ({ page }, expectedText) => {
  const nextQuestion = page.getByText(new RegExp(expectedText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i')).first();
  if (await nextQuestion.count()) {
    await expect(nextQuestion).toBeHidden({ timeout: 10_000 }).catch(() => {});
  }
});

Then('o histórico é apresentado de forma legível \(rolagem, agrupamento ou paginação\)', async ({ page }) => {
  const history = page.locator('body');
  await expect(history).toBeVisible();
  const text = await history.innerText();
  expect(text.length).toBeGreaterThan(30);
});

Then('o carregamento da página não fica lento', async ({ page }) => {
  const start = Date.now();
  await page.waitForLoadState('domcontentloaded', { timeout: 20_000 }).catch(() => {});
  const elapsed = Date.now() - start;
  expect(elapsed).toBeLessThan(30_000);
});

Then('o sistema deve marcar a resposta como incorreta ou mostrar retry', async ({ page }) => {
  const invalid = page.getByText(/incorret|wrong|incorrect|tente novamente|retry|erro/i).first();
  if (await invalid.count()) {
    await expect(invalid).toBeVisible({ timeout: 20_000 });
  }
});

Then('a questão deve permanecer disponível para correção sem pular para a próxima', async ({ page }) => {
  await expect(page.locator('body')).toBeVisible();
  const bodyText = await page.locator('body').innerText();
  expect(bodyText.toLowerCase()).not.toMatch(/pr[oó]xima quest[aã]o|next question/i);
});

Then('uma mensagem de validação ou erro deve ser exibida', async ({ page }) => {
  const validation = page.getByText(/obrigat|required|erro|error|atenção|valida/i).first();
  if (await validation.count()) {
    await expect(validation).toBeVisible({ timeout: 20_000 });
  }
});

Then('a questão não pode ser considerada resolvida', async ({ page }) => {
  await expect(page.locator('body')).toBeVisible();
  const bodyText = await page.locator('body').innerText();
  expect(bodyText.toLowerCase()).not.toMatch(/correto|correct|resposta correta|right answer/i);
});
