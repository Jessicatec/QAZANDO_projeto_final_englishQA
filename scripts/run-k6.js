// Executa scripts k6 com as variáveis do .env e gera os relatórios em reports/k6/.
// Uso: node scripts/run-k6.js <script.k6.js | all> [perfil] [flags extras do k6]
// Exemplo: npm run test:perf:ranking -- stress
const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ quiet: true });

const ALL_SCRIPTS = [
  'performance/trilha_ingles.k6.js',
  'performance/documentacao.k6.js',
  'performance/performance_ranking.k6.js',
];

const [target, profileArg, ...extraArgs] = process.argv.slice(2);

if (!target) {
  console.error('Uso: node scripts/run-k6.js <script.k6.js | all> [perfil]');
  process.exit(1);
}

const profile = profileArg && !profileArg.startsWith('-') ? profileArg : 'smoke';
if (profileArg && profileArg.startsWith('-')) extraArgs.unshift(profileArg);

const reportDir = path.join('reports', 'k6');
fs.mkdirSync(reportDir, { recursive: true });

function runScript(script) {
  console.log(`\nk6 > ${script} | perfil: ${profile} | relatório: ${reportDir}`);

  const result = spawnSync('k6', ['run', '-e', `PROFILE=${profile}`, '-e', `REPORT_DIR=${reportDir.replace(/\\/g, '/')}`, ...extraArgs, script], {
    stdio: 'inherit',
    env: process.env,
    shell: process.platform === 'win32',
  });

  if (result.error) {
    console.error(`Não foi possível executar o k6: ${result.error.message}. Verifique se ele está instalado e no PATH.`);
    return 1;
  }
  return result.status ?? 1;
}

const scripts = target === 'all' ? ALL_SCRIPTS : [target];
const failures = scripts.filter((script) => runScript(script) !== 0);

if (failures.length) {
  console.error(`\nExecuções com falha ou thresholds reprovados: ${failures.join(', ')}`);
  process.exit(1);
}
