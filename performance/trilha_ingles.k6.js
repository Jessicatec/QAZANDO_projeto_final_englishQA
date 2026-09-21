import http from 'k6/http';
import { check, group, sleep } from 'k6';

const BASE_URL = __ENV.BASE_URL || 'https://english.qazando.com.br';
const TEST_USER_EMAIL = __ENV.TEST_USER_EMAIL || 'admin@teste.com';
const TEST_USER_PASSWORD = __ENV.TEST_USER_PASSWORD || 'Teste@123';
const FORM_BODY = `email=${encodeURIComponent(TEST_USER_EMAIL)}&password=${encodeURIComponent(TEST_USER_PASSWORD)}`;

function authAttempts() {
  return [
    {
      name: 'auth-form',
      url: `${BASE_URL}/auth`,
      data: FORM_BODY,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    },
    {
      name: 'auth-json',
      url: `${BASE_URL}/auth/login`,
      data: JSON.stringify({
        email: TEST_USER_EMAIL,
        password: TEST_USER_PASSWORD,
      }),
      headers: { 'Content-Type': 'application/json' },
    },
    {
      name: 'api-login',
      url: `${BASE_URL}/api/login`,
      data: JSON.stringify({
        email: TEST_USER_EMAIL,
        password: TEST_USER_PASSWORD,
      }),
      headers: { 'Content-Type': 'application/json' },
    },
  ];
}

function authenticate() {
  const landing = http.get(`${BASE_URL}/auth`, { redirects: 10 });

  for (const attempt of authAttempts()) {
    const res = http.post(attempt.url, attempt.data, {
      headers: attempt.headers,
      redirects: 10,
    });

    if (res.status >= 200 && res.status < 400) {
      return { landing, login: res };
    }
  }

  return { landing, login: null };
}

function accessLearningTrail() {
  const exercises = http.get(`${BASE_URL}/exercises`, { redirects: 10 });
  const trail = http.get(`${BASE_URL}/duolingo`, { redirects: 10 });
  return { exercises, trail };
}

export const options = {
  scenarios: {
    performance_trilhaingles: {
      executor: 'constant-vus',
      vus: 1,
      duration: '20s',
      exec: 'smokeJourney',
    },
    performance_trilhaingles_load: {
      executor: 'ramping-vus',
      startVUs: 2,
      stages: [
        { duration: '10s', target: 5 },
        { duration: '25s', target: 5 },
        { duration: '10s', target: 0 },
      ],
      exec: 'loadJourney',
    },
    performance_trilhaingles_escala: {
      executor: 'ramping-vus',
      startVUs: 10,
      stages: [
        { duration: '10s', target: 10 },
        { duration: '15s', target: 30 },
        { duration: '15s', target: 60 },
        { duration: '15s', target: 100 },
        { duration: '20s', target: 200 },
        { duration: '20s', target: 500 },
        { duration: '20s', target: 1000 },
        { duration: '10s', target: 0 },
      ],
      exec: 'loadJourney',
    },
  },
  thresholds: {
    http_req_failed: ['rate<0.05'],
    http_req_duration: ['p(95)<2000'],
    checks: ['rate>0.95'],
  },
};

export default function () {
  smokeJourney();
}

export function smokeJourney() {
  group('autenticação e trilha do inglês', () => {
    const auth = authenticate();

    check(auth.login, {
      'login completed successfully': (r) => !!r && r.status >= 200 && r.status < 400,
    });

    if (!auth.login) {
      return;
    }

    const pages = accessLearningTrail();

    check(pages.exercises, {
      'view exercises screen': (r) => !!r && (r.status === 200 || r.url.includes('/exercises') || r.url.includes('/duolingo')),
    });

    check(pages.trail, {
      'view English trail screen': (r) => !!r && (r.status === 200 || /trilha|english|lesson|unit|exercise/i.test(r.body || '')),
    });
  });

  sleep(1);
}

export function loadJourney() {
  group('carga na trilha do inglês', () => {
    const auth = authenticate();

    check(auth.login, {
      'login succeeded under load': (r) => !!r && r.status >= 200 && r.status < 400,
    });

    if (!auth.login) {
      return;
    }

    const pages = accessLearningTrail();

    check(pages.exercises, {
      'exercises endpoint is reachable': (r) => !!r && (r.status === 200 || r.url.includes('/exercises')),
    });

    check(pages.trail, {
      'English trail page responds under load': (r) => !!r && (r.status === 200 || /trilha|english|lesson|unit/i.test(r.body || '')),
    });
  });

  sleep(1);
}
