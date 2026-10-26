import http from 'k6/http';
import { check, group, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';
import { buildSummary, selectScenarios } from './lib/k6-utils.js';

const BASE_URL = __ENV.BASE_URL || 'https://english.qazando.com.br';
const TEST_USER_EMAIL = __ENV.TEST_USER_EMAIL;
const TEST_USER_PASSWORD = __ENV.TEST_USER_PASSWORD;

if (!TEST_USER_EMAIL || !TEST_USER_PASSWORD) {
  throw new Error('Set TEST_USER_EMAIL and TEST_USER_PASSWORD before running this test.');
}

const documentacaoResponseTime = new Trend('documentacao_response_time');
const documentacaoErrorRate = new Rate('documentacao_error_rate');

function loginToDocs() {
  const landingPage = http.get(`${BASE_URL}/auth`, { redirects: 10 });

  const formLogin = http.post(
    `${BASE_URL}/auth`,
    `email=${encodeURIComponent(TEST_USER_EMAIL)}&password=${encodeURIComponent(TEST_USER_PASSWORD)}`,
    {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      redirects: 10,
    }
  );

  if (formLogin.status >= 200 && formLogin.status < 400) {
    return { landingPage, login: formLogin };
  }

  const apiLoginFallback = http.post(
    `${BASE_URL}/auth/login`,
    JSON.stringify({
      email: TEST_USER_EMAIL,
      password: TEST_USER_PASSWORD,
    }),
    {
      headers: { 'Content-Type': 'application/json' },
      redirects: 10,
    }
  );

  return { landingPage, login: apiLoginFallback };
}

function openDocumentationPage() {
  return http.get(`${BASE_URL}/docs`, { redirects: 10 });
}

export const options = {
  scenarios: selectScenarios({
    performance_documentacao: {
      executor: 'constant-vus',
      vus: 1,
      duration: '20s',
      exec: 'smokeDocumentation',
    },
    performance_documentacao_load: {
      executor: 'ramping-vus',
      startVUs: 10,
      stages: [
        { duration: '10s', target: 10 },
        { duration: '15s', target: 50 },
        { duration: '15s', target: 100 },
        { duration: '10s', target: 0 },
      ],
      gracefulRampDown: '10s',
      exec: 'loadDocumentation',
    },
    performance_documentacao_escala: {
      executor: 'ramping-vus',
      startVUs: 10,
      stages: [
        { duration: '15s', target: 10 },
        { duration: '20s', target: 50 },
        { duration: '20s', target: 100 },
        { duration: '20s', target: 500 },
        { duration: '20s', target: 1000 },
        { duration: '10s', target: 0 },
      ],
      gracefulRampDown: '10s',
      exec: 'loadDocumentation',
    },
    performance_documentacao_spike: {
      executor: 'ramping-vus',
      startVUs: 20,
      stages: [
        { duration: '10s', target: 20 },
        { duration: '15s', target: 1000 },
        { duration: '15s', target: 1000 },
        { duration: '10s', target: 0 },
      ],
      gracefulRampDown: '10s',
      exec: 'loadDocumentation',
    },
  }, {
    smoke: ['performance_documentacao'],
    load: ['performance_documentacao_load'],
    stress: ['performance_documentacao_escala'],
    spike: ['performance_documentacao_spike'],
  }),
  thresholds: {
    http_req_failed: ['rate<0.05'],
    http_req_duration: ['p(95)<2500'],
    checks: ['rate>0.95'],
    documentacao_error_rate: ['rate<0.05'],
    documentacao_response_time: ['p(95)<2500'],
  },
};

export default function () {
  smokeDocumentation();
}

export const handleSummary = buildSummary('documentacao', 'Performance - Documentação');

export function smokeDocumentation() {
  group('autenticação e documentação', () => {
    const auth = loginToDocs();

    documentacaoResponseTime.add(auth.landingPage.timings.duration);
    if (auth.login) {
      documentacaoResponseTime.add(auth.login.timings.duration);
    }

    documentacaoErrorRate.add((auth.landingPage.status >= 400) || (!!auth.login && auth.login.status >= 400));

    check(auth.login, {
      'login succeeded before opening docs': (r) => !!r && r.status >= 200 && r.status < 400,
    });

    if (!auth.login) {
      return;
    }

    const docsPage = openDocumentationPage();
    documentacaoResponseTime.add(docsPage.timings.duration);
    documentacaoErrorRate.add(docsPage.status >= 400);

    check(docsPage, {
      'docs page responds successfully': (r) => !!r && r.status === 200,
      // A aplicação é uma SPA: o servidor entrega o shell HTML e o conteúdo é renderizado no navegador
      // (validado pelo Playwright). Aqui verificamos que o shell da aplicação foi entregue.
      'docs SPA shell is delivered': (r) => !!r && /id="root"/i.test(r.body || '') && /English QA/i.test(r.body || ''),
    });
  });

  sleep(1);
}

export function loadDocumentation() {
  smokeDocumentation();
}
