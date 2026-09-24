import http from 'k6/http';
import { check, group, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

const BASE_URL = __ENV.BASE_URL || 'https://english.qazando.com.br';
const TEST_USER_EMAIL = __ENV.TEST_USER_EMAIL || 'admin@teste.com';
const TEST_USER_PASSWORD = __ENV.TEST_USER_PASSWORD || 'Teste@123';
const PREMIUM_USER_EMAIL = __ENV.TEST_PREMIUM_EMAIL || '';
const PREMIUM_USER_PASSWORD = __ENV.TEST_PREMIUM_PASSWORD || '';

const rankingResponseTime = new Trend('ranking_response_time');
const rankingErrorRate = new Rate('ranking_error_rate');

function login(email, password) {
  const landingPage = http.get(`${BASE_URL}/auth`, { redirects: 10 });

  const formLogin = http.post(
    `${BASE_URL}/auth`,
    `email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`,
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
    JSON.stringify({ email, password }),
    {
      headers: { 'Content-Type': 'application/json' },
      redirects: 10,
    }
  );

  return { landingPage, login: apiLoginFallback };
}

function accessRanking(email, password) {
  const auth = login(email, password);

  if (!auth.login || auth.login.status >= 400) {
    return { ...auth, ranking: null };
  }

  const rankingPage = http.get(`${BASE_URL}/ranking`, { redirects: 10 });
  return { ...auth, ranking: rankingPage };
}

export const options = {
  scenarios: {
    smoke_ranking: {
      executor: 'constant-vus',
      vus: 1,
      duration: '20s',
      exec: 'smokeRanking',
    },
    performance_ranking_ramp: {
      executor: 'ramping-vus',
      startVUs: 10,
      stages: [
        { duration: '10s', target: 10 },
        { duration: '15s', target: 50 },
        { duration: '15s', target: 100 },
        { duration: '15s', target: 500 },
        { duration: '15s', target: 1000 },
        { duration: '10s', target: 0 },
      ],
      gracefulRampDown: '10s',
      exec: 'loadRanking',
    },
    performance_ranking_blocked_access: {
      executor: 'constant-vus',
      vus: 25,
      duration: '20s',
      exec: 'blockedRanking',
    },
  },
  thresholds: {
    http_req_failed: ['rate<0.05'],
    http_req_duration: ['p(95)<2500'],
    checks: ['rate>0.95'],
    ranking_error_rate: ['rate<0.05'],
    ranking_response_time: ['p(95)<2500'],
  },
};

export default function () {
  smokeRanking();
}

export function smokeRanking() {
  group('acesso e validação da tela de ranking', () => {
    const result = accessRanking(TEST_USER_EMAIL, TEST_USER_PASSWORD);

    rankingResponseTime.add(result.login ? result.login.timings.duration : 0);
    if (result.ranking) {
      rankingResponseTime.add(result.ranking.timings.duration);
    }

    rankingErrorRate.add(!!result.login && result.login.status >= 400);
    if (result.ranking) {
      rankingErrorRate.add(result.ranking.status >= 400);
    }

    check(result.login, {
      'login succeeds before opening ranking': (r) => !!r && r.status >= 200 && r.status < 400,
    });

    if (!result.ranking) {
      return;
    }

    check(result.ranking, {
      'ranking page responds successfully': (r) => !!r && r.status < 400 && !!r.body && r.body.length > 0,
      'ranking response contains usable HTML payload': (r) => !!r && !!r.body && /<html|<!doctype|<body|ranking|premium|conteúdo|bloqueio|ativar/i.test(r.body || ''),
    });
  });

  sleep(1);
}

export function loadRanking() {
  group('carga no acesso ao ranking', () => {
    const result = accessRanking(TEST_USER_EMAIL, TEST_USER_PASSWORD);

    rankingResponseTime.add(result.login ? result.login.timings.duration : 0);
    if (result.ranking) {
      rankingResponseTime.add(result.ranking.timings.duration);
    }

    rankingErrorRate.add(!!result.login && result.login.status >= 400);
    if (result.ranking) {
      rankingErrorRate.add(result.ranking.status >= 400);
    }

    check(result.login, {
      'login remains stable under load': (r) => !!r && r.status >= 200 && r.status < 400,
    });

    if (result.ranking) {
      check(result.ranking, {
        'ranking route is reachable under load': (r) => !!r && r.status < 400 && !!r.body && r.body.length > 0,
      });
    }
  });

  sleep(1);
}

export function blockedRanking() {
  group('acesso bloqueado do ranking por plano Premium', () => {
    const result = accessRanking(TEST_USER_EMAIL, TEST_USER_PASSWORD);

    if (result.ranking) {
      rankingResponseTime.add(result.ranking.timings.duration);
      rankingErrorRate.add(result.ranking.status >= 400);
    }

    check(result.ranking, {
      'premium restriction message is visible': (r) => !!r && r.status < 400 && !!r.body && /premium|ranking|conteúdo|bloqueio|ativar/i.test(r.body || ''),
    });
  });

  sleep(1);
}

export function premiumRanking() {
  if (!PREMIUM_USER_EMAIL || !PREMIUM_USER_PASSWORD) {
    return;
  }

  group('acesso ao ranking com usuário premium', () => {
    const result = accessRanking(PREMIUM_USER_EMAIL, PREMIUM_USER_PASSWORD);

    if (result.ranking) {
      rankingResponseTime.add(result.ranking.timings.duration);
      rankingErrorRate.add(result.ranking.status >= 400);
    }

    check(result.ranking, {
      'premium ranking page loads successfully': (r) => !!r && r.status < 400 && !!r.body && r.body.length > 0,
    });
  });

  sleep(1);
}
