import { textSummary } from 'https://jslib.k6.io/k6-summary/0.1.0/index.js';

export const PROFILE = (__ENV.PROFILE || 'smoke').toLowerCase();
const REPORT_DIR = __ENV.REPORT_DIR || 'reports/k6';

/**
 * Mantém apenas os cenários do perfil escolhido (PROFILE=smoke|load|stress|...).
 * O padrão é smoke, para que nenhuma execução dispare carga alta por engano.
 */
export function selectScenarios(allScenarios, profiles) {
  const names = profiles[PROFILE];

  if (!names) {
    throw new Error(`PROFILE "${PROFILE}" inválido. Use um destes: ${Object.keys(profiles).join(', ')}.`);
  }

  const selected = {};
  for (const name of names) {
    selected[name] = allScenarios[name];
  }
  return selected;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function formatValue(metric, key) {
  const value = metric.values[key];
  if (value === undefined) return '-';
  if (key === 'rate') return `${(value * 100).toFixed(2)}%`;
  if (metric.contains === 'time') return `${value.toFixed(2)} ms`;
  if (metric.contains === 'data') return `${(value / 1024).toFixed(1)} KB`;
  return Number.isInteger(value) ? String(value) : value.toFixed(2);
}

function collectChecks(group, list = []) {
  for (const check of group.checks || []) {
    list.push({ group: group.path || '(raiz)', ...check });
  }
  for (const child of group.groups || []) {
    collectChecks(child, list);
  }
  return list;
}

function buildHtml(title, data) {
  const thresholdRows = [];
  for (const [name, metric] of Object.entries(data.metrics)) {
    for (const [expression, result] of Object.entries(metric.thresholds || {})) {
      thresholdRows.push({ name, expression, ok: result.ok, value: metric });
    }
  }
  const passed = thresholdRows.every((row) => row.ok);

  const thresholdsHtml = thresholdRows.map((row) => `
      <tr class="${row.ok ? 'ok' : 'fail'}">
        <td>${escapeHtml(row.name)}</td>
        <td><code>${escapeHtml(row.expression)}</code></td>
        <td>${row.ok ? 'Aprovado' : 'Reprovado'}</td>
      </tr>`).join('');

  const metricsHtml = Object.entries(data.metrics)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([name, metric]) => `
      <tr>
        <td>${escapeHtml(name)}</td>
        <td>${escapeHtml(metric.type)}</td>
        <td>${formatValue(metric, 'avg')}</td>
        <td>${formatValue(metric, 'p(90)')}</td>
        <td>${formatValue(metric, 'p(95)')}</td>
        <td>${formatValue(metric, 'max')}</td>
        <td>${formatValue(metric, 'rate')}</td>
        <td>${formatValue(metric, 'count')}</td>
      </tr>`).join('');

  const checksHtml = collectChecks(data.root_group).map((check) => {
    const total = check.passes + check.fails;
    const rate = total ? ((check.passes / total) * 100).toFixed(2) : '0.00';
    return `
      <tr class="${check.fails === 0 ? 'ok' : 'fail'}">
        <td>${escapeHtml(check.group)}</td>
        <td>${escapeHtml(check.name)}</td>
        <td>${check.passes}</td>
        <td>${check.fails}</td>
        <td>${rate}%</td>
      </tr>`;
  }).join('');

  const durationSeconds = ((data.state && data.state.testRunDurationMs) || 0) / 1000;

  return `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<title>${escapeHtml(title)}</title>
<style>
  body { font-family: Segoe UI, Arial, sans-serif; margin: 32px; color: #1f2933; }
  h1 { margin-bottom: 4px; }
  .meta { color: #52606d; margin-bottom: 24px; }
  .badge { display: inline-block; padding: 6px 14px; border-radius: 4px; color: #fff; font-weight: bold; }
  .badge.ok { background: #2f855a; }
  .badge.fail { background: #c53030; }
  table { border-collapse: collapse; width: 100%; margin-bottom: 32px; }
  th, td { border: 1px solid #d9e2ec; padding: 8px 10px; text-align: left; font-size: 14px; }
  th { background: #f0f4f8; }
  tr.ok td:last-child { color: #2f855a; font-weight: bold; }
  tr.fail td:last-child { color: #c53030; font-weight: bold; }
</style>
</head>
<body>
  <h1>${escapeHtml(title)}</h1>
  <div class="meta">
    Perfil: <strong>${escapeHtml(PROFILE)}</strong> ·
    Alvo: ${escapeHtml(__ENV.BASE_URL || 'https://english.qazando.com.br')} ·
    Duração: ${durationSeconds.toFixed(1)} s ·
    Gerado em: ${new Date().toISOString()}
  </div>
  <p><span class="badge ${passed ? 'ok' : 'fail'}">${passed ? 'Thresholds aprovados' : 'Thresholds reprovados'}</span></p>

  <h2>Thresholds</h2>
  <table>
    <thead><tr><th>Métrica</th><th>Critério</th><th>Resultado</th></tr></thead>
    <tbody>${thresholdsHtml}</tbody>
  </table>

  <h2>Checks</h2>
  <table>
    <thead><tr><th>Grupo</th><th>Check</th><th>Aprovados</th><th>Falhas</th><th>Taxa</th></tr></thead>
    <tbody>${checksHtml}</tbody>
  </table>

  <h2>Métricas</h2>
  <table>
    <thead><tr><th>Métrica</th><th>Tipo</th><th>Média</th><th>p(90)</th><th>p(95)</th><th>Máx.</th><th>Taxa</th><th>Contagem</th></tr></thead>
    <tbody>${metricsHtml}</tbody>
  </table>
</body>
</html>`;
}

/**
 * Gera, ao final da execução, o resumo no terminal e os arquivos
 * reports/k6/<nome>-<perfil>.html e reports/k6/<nome>-<perfil>.json.
 */
export function buildSummary(reportName, title) {
  return (data) => {
    const basePath = `${REPORT_DIR}/${reportName}-${PROFILE}`;
    return {
      stdout: textSummary(data, { indent: ' ', enableColors: true }),
      [`${basePath}.html`]: buildHtml(`${title} (${PROFILE})`, data),
      [`${basePath}.json`]: JSON.stringify(data, null, 2),
    };
  };
}
