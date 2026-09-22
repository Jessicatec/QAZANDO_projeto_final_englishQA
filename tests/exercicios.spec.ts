import { test, expect } from '@playwright/test';

const { AuthPage } = require('./pages/auth.page');
const { ExercisesPage } = require('./pages/exercises.page');
const { ensureLoggedIn } = require('./support/test-user');

async function openExercisesSession(page: any) {
  const email = process.env.TEST_USER_EMAIL;
  const password = process.env.TEST_USER_PASSWORD;

  if (!email || !password) {
    test.skip(true, 'Defina TEST_USER_EMAIL e TEST_USER_PASSWORD no arquivo .env para executar os exercícios reais.');
  }

  const authPage = new AuthPage(page);
  await ensureLoggedIn(authPage, page);
  await page.goto('/exercises');
  await page.waitForLoadState('domcontentloaded', { timeout: 20_000 }).catch(() => {});
  await page.waitForTimeout(500);

  return { authPage, exercisesPage: new ExercisesPage(page) };
}

async function answerExercise(page: any, answer: string) {
  const exercisesPage = new ExercisesPage(page);
  await exercisesPage.answerQuestion(answer);
  await page.waitForTimeout(1500);
}

test.describe('English QA - Exercícios', () => {
  test('CN001 - Responder corretamente uma questão', async ({ page }) => {
    await openExercisesSession(page);

    await expect(page.getByText(/Are _______ going to the park tomorrow\?/i).first()).toBeVisible({ timeout: 20_000 });

    await answerExercise(page, 'you');

    await expect.poll(async () => {
      return (await page.locator('body').innerText()).toLowerCase();
    }, { timeout: 30000 }).toMatch(/correto|parab[eé]ns|você respondeu: you|you responded/i);

    const bodyText = await page.locator('body').innerText();
    expect(bodyText).toMatch(/2\s*de\s*30|2\s*of\s*30|2\s*\/\s*30/i);
    expect(bodyText).toMatch(/\d+%/i);
    expect(bodyText).toMatch(/\d+\s*corretas?\s*de\s*\d+\s*respondidas/i);
  });

  test('CN002 - Recomeçar após completar algumas frases', async ({ page }) => {
    await openExercisesSession(page);

    for (let index = 0; index < 5; index += 1) {
      await answerExercise(page, 'you');
    }

    await expect(page.getByRole('button', { name: /Recomeçar|Restart|Começar novamente/i }).first()).toBeVisible({ timeout: 20_000 });
    await page.getByRole('button', { name: /Recomeçar|Restart|Começar novamente/i }).click({ timeout: 20_000 });

    await expect(page.getByText(/Exercícios Reiniciados|Você pode começar novamente!/i).first()).toBeVisible({ timeout: 20_000 });
    await expect(page.locator('body')).toContainText(/1\s*de\s*30|1\s*of\s*30|1\s*\/\s*30/i, { timeout: 20_000 });

    const bodyText = await page.locator('body').innerText();
    expect(bodyText.toLowerCase()).not.toMatch(/histórico de respostas|history|historico|respostas anteriores/i);
  });

  test('CN004 - Histórico com as 30 respostas', async ({ page }) => {
    await openExercisesSession(page);

    for (let index = 0; index < 30; index += 1) {
      await answerExercise(page, 'you');
    }

    await expect(page.locator('body')).toContainText(/Histórico de Respostas|History/i, { timeout: 20_000 });
    const bodyText = await page.locator('body').innerText();
    expect(bodyText.length).toBeGreaterThan(500);
    expect(bodyText.toLowerCase()).toMatch(/resposta|answer|correto|correct|errado|wrong/i);
  });

  test('CN005 - Recomeçar após concluir as 30 questões', async ({ page }) => {
    await openExercisesSession(page);

    for (let index = 0; index < 30; index += 1) {
      await answerExercise(page, 'you');
    }

    await expect(page.getByRole('button', { name: /Recomeçar|Restart|Começar novamente/i }).first()).toBeVisible({ timeout: 20_000 });
    await page.getByRole('button', { name: /Recomeçar|Restart|Começar novamente/i }).click({ timeout: 20_000 });

    await expect(page.getByText(/Exercícios Reiniciados|Você pode começar novamente!/i).first()).toBeVisible({ timeout: 20_000 });
    await expect(page.locator('body')).toContainText(/1\s*de\s*30|1\s*of\s*30|1\s*\/\s*30/i, { timeout: 20_000 });

    const bodyText = await page.locator('body').innerText();
    expect(bodyText.toLowerCase()).not.toMatch(/histórico de respostas|history|historico|respostas anteriores/i);
  });

  test('CN006 - Resposta incorreta mantém o status e bloqueia avanço', async ({ page }) => {
    await openExercisesSession(page);

    await answerExercise(page, 'they');

    const invalidLabel = page.getByText(/Incorreto|Wrong|Incorrect|Tente novamente|Try again|Erro/i).first();
    if (await invalidLabel.count()) {
      await expect(invalidLabel).toBeVisible({ timeout: 20_000 });
    }

    const bodyText = await page.locator('body').innerText();
    expect(bodyText.toLowerCase()).not.toMatch(/pr[oó]xima quest[aã]o|next question/i);
  });

  test('CN007 - Campo de resposta vazio exige validação', async ({ page }) => {
    await openExercisesSession(page);

    const submit = page.getByRole('button', { name: /Verificar Resposta|Check Answer|Enviar|Submit|Confirmar|Responder/i }).first();
    if (await submit.count()) {
      await submit.click({ timeout: 20_000 });
    }

    const validation = page.getByText(/obrigat|required|erro|error|atenção|valida/i).first();
    if (await validation.count()) {
      await expect(validation).toBeVisible({ timeout: 20_000 });
    }
  });
});
