# English QA | Portfólio de QA e Automação

Projeto de portfólio de qualidade de software para a plataforma English QA. Reúne planejamento de testes, cenários manuais, automação funcional com Playwright, especificações em Gherkin e testes de performance com k6.

> A aplicação testada é externa a este repositório; os testes exigem uma conta autorizada e dados de teste válidos.

## Visão geral

| Área | Cobertura principal | Evidência |
| --- | --- | --- |
| Trilha do Inglês | Unidades, lições, desbloqueio, XP, progresso, acessibilidade e carga | [Casos de teste](docs/test-cases.md) · [Evidências](docs/performance-report.md) |
| Exercícios | Respostas corretas/incorretas, validação, progresso, histórico e rodada de 30 questões | [Evidências e cenários manuais](docs/exercicios-evidencias.md) |
| Documentação | Carregamento, accordions, regras de negócio, usuários de teste e teclado | [Evidências](docs/documentacao-evidencias.md) · [Performance](docs/documentacao-performance-report.md) |
| Ranking | Acesso Premium, elegibilidade, estatísticas e massa simulada | [Evidências](docs/ranking-evidencias.md) · [Performance](docs/performance_ranking.md) |

## Abordagem de QA

- Casos manuais documentados com objetivo, pré-condições, passos e resultado esperado.
- Testes de interface e fluxo com Playwright, utilizando page objects e suporte de autenticação.
- Cenários de comportamento escritos em Gherkin, em `features/`.
- Testes de carga e escalonamento com k6.
- Relatórios HTML/JSON, screenshots, vídeos e traces para apoiar a análise de falhas.
- Registro explícito de comportamento observado versus requisito esperado, especialmente no Ranking e nos testes de pico.

## Evidências registradas

### Execução completa - 26/10/2026

**Playwright: 26 de 26 testes aprovados** (Chromium, 1 worker, 3,6 min, sem falhas, skips ou retries).

| Suíte | Testes | Resultado |
| --- | ---: | --- |
| Trilha do Inglês | 8 | 8 aprovados |
| Exercícios | 6 | 6 aprovados |
| Documentação | 4 | 4 aprovados |
| Ranking | 5 | 5 aprovados |
| Ranking com massa simulada | 3 | 3 aprovados |

**k6 smoke (1 VU por 20 s): thresholds aprovados nas 3 áreas.**

| Área | Checks | Falhas HTTP | p95 |
| --- | --- | --- | --- |
| Trilha do Inglês | 100% (45/45) | 0,00% | 187,79 ms |
| Documentação | 100% (45/45) | 0,00% | 299,40 ms |
| Ranking | 100% (45/45) | 0,00% | 302,35 ms |

### Execuções de carga registradas anteriormente

| Área | Resultado documentado |
| --- | --- |
| Trilha do Inglês | Até 1.000 VUs: 22.319 checks aprovados; 0,27% de falhas HTTP; p95 de 2,78 s, acima do limite de 2 s |
| Documentação | Pico até 1.000 VUs: p95 de 9,19 s e 0,65% de falhas HTTP ([nota sobre a taxa de checks](docs/documentacao-performance-report.md#correção-do-check-de-conteúdo)) |
| Ranking | Os perfis até 1.000 VUs estão configurados, mas não são apresentados como execução concluída |

Os detalhes, condições e limitações de cada execução estão nos relatórios vinculados na [central de documentação](docs/README.md). Os relatórios de performance mostram degradação nos cenários de pico; eles não devem ser interpretados como aprovação dos limites de carga.

## Começar

### Pré-requisitos

- Node.js 18 ou superior e npm.
- Chromium instalado pelo Playwright.
- k6 no `PATH` para executar performance.
- Conta de teste autorizada com acesso ao ambiente alvo.

### Instalação

No PowerShell:

```powershell
npm install
npx playwright install chromium
Copy-Item .env.example .env
```

Edite `.env` com os dados da conta de teste. O arquivo `.env` está no `.gitignore` e não deve ser commitado.

```dotenv
BASE_URL=https://english.qazando.com.br
TEST_USER_EMAIL=seu_email_de_teste
TEST_USER_PASSWORD=sua_senha_de_teste
```

### Executar Playwright

```bash
npm test
npm run test:trilha-ingles
npm run test:exercicios
npm run test:documentacao
npm run test:ranking
npm run test:ranking:mass-data
```

Abrir o relatório HTML da execução mais recente:

```bash
npm run test:report
```

### Executar k6

Os scripts k6 usam as credenciais do `.env` (lidas pelo runner `scripts/run-k6.js`). Por padrão, executam o perfil `smoke`, com 1 usuário virtual por 20 s.

```bash
npm run test:perf:smoke                    # smoke das 3 áreas
npm run test:perf:trilha_ingles
npm run test:perf:documentacao
npm run test:perf:ranking
npm run test:perf:ranking -- stress        # outro perfil: informe depois de --
```

Perfis, cenários e thresholds estão descritos em [performance/README.md](performance/README.md).

> Execute perfis de carga (`load`, `stress`, `spike`) apenas com autorização do responsável pelo ambiente. Comece pelo smoke e aumente a concorrência de forma controlada.

## Relatórios

| Ferramenta | Relatório | Como abrir |
| --- | --- | --- |
| Playwright | HTML com passos, screenshots, vídeos e traces | `npm run test:report` (abre `playwright-report/index.html`) |
| Playwright | JSON e JUnit | `test-results/results.json` · `test-results/junit.xml` |
| k6 | HTML com thresholds, checks e métricas | Abrir `reports/k6/<area>-<perfil>.html` no navegador |
| k6 | JSON completo | `reports/k6/<area>-<perfil>.json` |

Essas pastas são recriadas a cada execução e não são versionadas.

## Integração contínua

O workflow [`.github/workflows/tests.yml`](.github/workflows/tests.yml) executa a suíte Playwright a cada push e pull request e publica os relatórios como artefatos (`playwright-report` e `test-results`). Pela aba **Actions → Testes → Run workflow**, também é possível executar o smoke do k6, que publica o artefato `k6-reports`.

Para o CI autenticar na aplicação, cadastre em **Settings → Secrets and variables → Actions** os secrets `TEST_USER_EMAIL` e `TEST_USER_PASSWORD`.

## Estrutura do projeto

```text
.github/workflows/  Pipeline de CI (Playwright e smoke k6)
docs/               Casos de teste, evidências e relatórios de performance
features/           Especificações Gherkin (exercícios, trilha, ranking e documentação)
performance/        Scripts k6 por área e utilitários de perfil/relatório (lib/)
scripts/            Runner do k6 e scripts auxiliares de inspeção
tests/              Specs Playwright, page objects (pages/) e suporte (support/)
playwright.config.ts
```

## Configuração

O Playwright está configurado para Chromium headless, com execução serial (todas as suítes compartilham a mesma conta de teste), retry (1 local, 2 no CI), trace na primeira repetição, screenshot e vídeo em falhas e relatórios de lista, HTML, JSON e JUnit.

Os arquivos `.feature` são a especificação de comportamento de cada área. A suíte executada são os specs Playwright em `tests/`, que implementam esses cenários.

Veja o índice de documentos e relatórios em [docs/README.md](docs/README.md).
