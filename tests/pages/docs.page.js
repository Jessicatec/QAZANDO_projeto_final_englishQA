class DocsPage {
  constructor(page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: 'Documentação', exact: true });
    this.featureCards = page.getByRole('button', { name: /cadastro|ativação|trilha|exercícios|quiz|progresso|ranking|historinhas|entrevistas|falar com max|gerador|treinar fala|flashcards|painel admin/i });
    this.testUsersTable = page.getByRole('table');
    this.featureSummary = page.getByText(/funcionalidades e regras de negócio|usuários de teste/i);
  }

  async goto() {
    await this.page.goto('/docs');
  }

  async openFeature(featureName) {
    const button = this.page.getByRole('button', { name: new RegExp(featureName, 'i') });
    await button.click({ timeout: 20_000 });
    return button;
  }
}

module.exports = { DocsPage };
