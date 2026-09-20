function requireTestUser() {
  const email = process.env.TEST_USER_EMAIL;
  const password = process.env.TEST_USER_PASSWORD;

  if (!email || !password) {
    throw new Error(
      'TEST_USER_EMAIL/TEST_USER_PASSWORD não configurados. ' +
      'Crie um arquivo .env a partir do .env.example com uma conta validada no sistema.'
    );
  }

  return { email, password };
}

async function ensureLoggedIn(authPage, page) {
  const { email, password } = requireTestUser();
  const authPattern = /\/auth(?:\/|$)/i;
  const appPattern = /\/(?:$|duolingo|exercises|dashboard)/i;

  await page.goto('/auth');
  await page.waitForLoadState('domcontentloaded', { timeout: 15_000 }).catch(() => {});

  if (!authPattern.test(page.url())) {
    await page.goto('/exercises');
    await page.waitForURL(appPattern, { timeout: 20_000 }).catch(() => {});
    return;
  }

  await authPage.emailInput.waitFor({ state: 'visible', timeout: 15_000 }).catch(() => {});
  await authPage.login(email, password);
  await page.waitForURL(appPattern, { timeout: 30_000 });
  await page.goto('/exercises');
}

module.exports = { requireTestUser, ensureLoggedIn };
