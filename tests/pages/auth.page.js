class AuthPage {
  constructor(page) {
    this.page = page;
    this.emailInput = page.getByPlaceholder('seu@email.com');
    this.passwordInput = page.getByPlaceholder('••••••••');
    this.loginButton = page.getByRole('button', { name: 'Entrar', exact: true });
    this.logoutButton = page.getByRole('button', { name: 'Sair' });
  }

  async goto() {
    await this.page.goto('/auth');
  }

  async login(email, password) {
    if (email) await this.emailInput.fill(email);
    if (password) await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}

module.exports = { AuthPage };
