class ExercisesPage {
  constructor(page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto('/exercises');
  }

  locatorForAnswerInput() {
    return this.page.locator([
      'input[type="text"]',
      'input[type="search"]',
      'textarea',
      '[data-testid*="answer"]',
      '[data-testid*="response"]',
      'input[placeholder*="resposta" i]',
      'input[placeholder*="answer" i]',
      '[aria-label*="resposta" i]',
      '[aria-label*="answer" i]',
      '[name*="answer" i]',
      '[name*="response" i]',
    ].join(', ')).first();
  }

  async fillAnswer(answer) {
    const input = this.locatorForAnswerInput();
    if (await input.count()) {
      await input.fill(answer, { timeout: 10_000 });
      return input;
    }

    await this.page.keyboard.type(answer, { delay: 50 });
    return this.page.locator('body');
  }

  async submitAnswer() {
    const submit = this.page.getByRole('button', { name: /verificar resposta|check answer|enviar|submit|confirmar|responder/i }).first();
    if (await submit.count()) {
      await submit.click({ timeout: 20_000 });
      return;
    }

    const fallback = this.page.locator('button, [role="button"]').filter({
      hasText: /verificar|check|submit|confirmar|responder/i,
    }).first();

    if (await fallback.count()) {
      await fallback.click({ timeout: 20_000 });
      return;
    }

    await this.page.keyboard.press('Enter');
  }

  async answerQuestion(answer) {
    await this.fillAnswer(answer);
    await this.submitAnswer();
  }
}

module.exports = { ExercisesPage };
