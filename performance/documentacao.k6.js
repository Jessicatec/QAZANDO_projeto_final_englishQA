import http from 'k6/http';
import { check, group, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

const BASE_URL = __ENV.BASE_URL || 'https://english.qazando.com.br';
const TEST_USER_EMAIL = __ENV.TEST_USER_EMAIL || 'admin@teste.com';
const TEST_USER_PASSWORD = __ENV.TEST_USER_PASSWORD || 'Teste@123';

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
  scenarios: {
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
  },
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
      'docs content is present': (r) => !!r && /Documentação|Funcionalidades e Regras de Negócio|Usuários de Teste/i.test(r.body || ''),
    });
  });

  sleep(1);
}

export function loadDocumentation() {
  smokeDocumentation();
}
