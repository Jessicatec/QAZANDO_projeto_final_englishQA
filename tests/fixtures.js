const { test: base } = require('playwright-bdd');
const { AuthPage } = require('./pages/auth.page');

const test = base.extend({
  authPage: async ({ page }, use) => {
    await use(new AuthPage(page));
  },
});

module.exports = { test };
