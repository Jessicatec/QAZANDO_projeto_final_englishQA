class RankingPage {
  constructor(page) {
    this.page = page;
    this.mainMenuLink = page.getByRole('link', { name: /ir para exercícios/i });
    this.rankingLink = page.getByRole('link', { name: /ranking/i }).first();
    this.rankingButton = page.getByRole('button', { name: /ranking/i }).first();
    this.premiumHeading = page.getByRole('heading', { name: /conteúdo premium/i });
    this.premiumDescription = page.getByText(/este conteúdo está disponível apenas para usuários premium/i);
    this.activatePremiumButton = page.getByRole('button', { name: /ativar código premium/i });
    this.emptyState = page.getByText(/nenhum participante|sem dados|mínimo de 5 exercícios/i);
    this.rankingTitle = page.getByRole('heading', { name: /ranking/i });
  }

  async openFromMainMenu() {
    const exerciseLink = this.mainMenuLink;
    if (await exerciseLink.count()) {
      await exerciseLink.click({ timeout: 15_000 });
    }
    await this.page.goto('/ranking');
  }
}

module.exports = { RankingPage };
