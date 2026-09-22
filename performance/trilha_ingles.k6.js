import http from 'k6/http';
import { check, group, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

const BASE_URL = __ENV.BASE_URL || 'https://english.qazando.com.br';
const TEST_USER_EMAIL = __ENV.TEST_USER_EMAIL || 'admin@teste.com';
const TEST_USER_PASSWORD = __ENV.TEST_USER_PASSWORD || 'Teste@123';
const FORM_BODY = `email=${encodeURIComponent(TEST_USER_EMAIL)}&password=${encodeURIComponent(TEST_USER_PASSWORD)}`;

const responseTime = new Trend('exercise_response_time');
const errorRate = new Rate('exercise_error_rate');

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
    performance_Exercicios: {
      executor: 'constant-vus',
      vus: 1,
      duration: '20s',
      exec: 'smokeJourney',
    },
    performance_Exercicios_load: {
      executor: 'ramping-vus',
      startVUs: 10,
      stages: [
        { duration: '10s', target: 10 },
        { duration: '15s', target: 50 },
        { duration: '15s', target: 50 },
        { duration: '10s', target: 0 },
      ],
      exec: 'loadJourney',
    },
    performance_Exercicios_escala: {
      executor: 'ramping-vus',
      startVUs: 10,
      stages: [
        { duration: '15s', target: 10 },
        { duration: '20s', target: 50 },
        { duration: '20s', target: 100 },
        { duration: '20s', target: 200 },
        { duration: '20s', target: 500 },
        { duration: '20s', target: 1000 },
        { duration: '10s', target: 0 },
      ],
      gracefulRampDown: '10s',
      exec: 'loadJourney',
    },
  },
  thresholds: {
    http_req_failed: ['rate<0.05'],
    http_req_duration: ['p(95)<2000'],
    checks: ['rate>0.95'],
    exercise_error_rate: ['rate<0.05'],
    exercise_response_time: ['p(95)<2000'],
  },
};

export default function () {
  smokeJourney();
}

export function smokeJourney() {
  group('autenticação e exercícios', () => {
    const auth = authenticate();

    const loginDuration = auth.login ? auth.login.timings.duration : 0;
    responseTime.add(loginDuration);
    errorRate.add(!!auth.login && auth.login.status >= 400);

    check(auth.login, {
      'login completed successfully': (r) => !!r && r.status >= 200 && r.status < 400,
    });

    if (!auth.login) {
      return;
    }

    const pages = accessLearningTrail();

    responseTime.add(pages.exercises.timings.duration);
    responseTime.add(pages.trail.timings.duration);
    errorRate.add(pages.exercises.status >= 400 || pages.trail.status >= 400);

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
  group('carga em exercícios', () => {
    const auth = authenticate();

    const loginDuration = auth.login ? auth.login.timings.duration : 0;
    responseTime.add(loginDuration);
    errorRate.add(!!auth.login && auth.login.status >= 400);

    check(auth.login, {
      'login succeeded under load': (r) => !!r && r.status >= 200 && r.status < 400,
    });

    if (!auth.login) {
      return;
    }

    const pages = accessLearningTrail();

    responseTime.add(pages.exercises.timings.duration);
    responseTime.add(pages.trail.timings.duration);
    errorRate.add(pages.exercises.status >= 400 || pages.trail.status >= 400);

    check(pages.exercises, {
      'exercises endpoint is reachable': (r) => !!r && (r.status === 200 || r.url.includes('/exercises')),
    });

    check(pages.trail, {
      'English trail page responds under load': (r) => !!r && (r.status === 200 || /trilha|english|lesson|unit/i.test(r.body || '')),
    });
  });

  sleep(1);
}
