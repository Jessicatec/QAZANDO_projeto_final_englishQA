# Central de documentação

Índice dos artefatos de QA do projeto, organizados por área.

## Por área

| Área | Especificação (Gherkin) | Casos e evidências funcionais | Performance |
| --- | --- | --- | --- |
| Trilha do Inglês | [trilha_ingles.feature](../features/trilha_ingles.feature) | [Casos de teste](test-cases.md) | [Relatório](performance-report.md) |
| Exercícios | [exercicios.feature](../features/exercicios.feature) | [Evidências e cenários manuais](exercicios-evidencias.md) | — |
| Documentação | [documentacao.feature](../features/documentacao.feature) | [Evidências](documentacao-evidencias.md) · [Screenshot](documentacao-evidencia.png) | [Relatório](documentacao-performance-report.md) |
| Ranking | [ranking.feature](../features/ranking.feature) | [Evidências](ranking-evidencias.md) | [Relatório](performance_ranking.md) |

## Como os artefatos se relacionam

- **`features/`**: especificação de comportamento em Gherkin. É a documentação viva dos requisitos; não é executada diretamente.
- **`tests/*.spec.ts`**: automação Playwright que implementa esses cenários na aplicação real.
- **`performance/*.k6.js`**: scripts de carga por área (veja [performance/README.md](../performance/README.md)).
- **`docs/`**: casos manuais, evidências e análise dos resultados registrados.

## Relatórios gerados a cada execução

Estes arquivos não são versionados; são recriados a cada rodada.

| Origem | Arquivo | Como abrir |
| --- | --- | --- |
| Playwright | `playwright-report/index.html` | `npm run test:report` |
| Playwright | `test-results/results.json` · `test-results/junit.xml` | Integração com CI/ferramentas |
| Playwright | `test-results/artifacts/` | Screenshots, vídeos e traces das falhas |
| k6 | `reports/k6/<area>-<perfil>.html` | Abrir no navegador |
| k6 | `reports/k6/<area>-<perfil>.json` | Dados completos da execução |
