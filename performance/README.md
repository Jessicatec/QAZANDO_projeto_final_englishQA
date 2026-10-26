# Performance com k6

Scripts de carga das três áreas automatizadas. Cada script tem vários cenários, agrupados em **perfis**; só o perfil escolhido é executado. O perfil padrão é `smoke` (1 VU por 20 s), para que nenhuma execução dispare carga alta por engano.

> Execute perfis de carga (`load`, `stress`, `spike`, `blocked`) apenas com autorização do responsável pelo ambiente.

## Pré-requisitos

- [k6](https://grafana.com/docs/k6/latest/set-up/install-k6/) instalado e no `PATH` (`k6 version`).
- Arquivo `.env` preenchido na raiz do projeto (veja `.env.example`). O runner `scripts/run-k6.js` lê o `.env` e repassa as variáveis ao k6.

## Executar

```bash
npm run test:perf:smoke                    # smoke das 3 áreas, em sequência
npm run test:perf:trilha_ingles            # smoke da Trilha do Inglês
npm run test:perf:documentacao -- load     # outro perfil: informe depois de --
npm run test:perf:ranking -- stress
```

## Perfis disponíveis

| Script | Perfil | Cenário | Carga |
| --- | --- | --- | --- |
| `trilha_ingles.k6.js` | `smoke` | `performance_Exercicios` | 1 VU constante por 20 s |
| | `load` | `performance_Exercicios_load` | 10 → 50 VUs |
| | `stress` | `performance_Exercicios_escala` | 10 → 1000 VUs |
| `documentacao.k6.js` | `smoke` | `performance_documentacao` | 1 VU constante por 20 s |
| | `load` | `performance_documentacao_load` | 10 → 100 VUs |
| | `stress` | `performance_documentacao_escala` | 10 → 1000 VUs |
| | `spike` | `performance_documentacao_spike` | 20 → 1000 VUs em 15 s |
| `performance_ranking.k6.js` | `smoke` | `smoke_ranking` | 1 VU constante por 20 s |
| | `stress` | `performance_ranking_ramp` | 10 → 1000 VUs |
| | `blocked` | `performance_ranking_blocked_access` | 25 VUs constantes (usuário sem Premium) |
| | `premium` | `performance_ranking_premium` | 1 VU (exige `PREMIUM_USER_EMAIL`/`PREMIUM_USER_PASSWORD`) |

## Thresholds

| Script | `http_req_duration` p95 | `http_req_failed` | `checks` |
| --- | --- | --- | --- |
| Trilha do Inglês | < 2000 ms | < 5% | > 95% |
| Documentação | < 2500 ms | < 5% | > 95% |
| Ranking | < 2500 ms | < 5% | > 95% |

Se algum threshold for reprovado, o k6 encerra com código diferente de zero e o relatório marca **Thresholds reprovados**.

## Relatórios

Ao final de cada execução, `performance/lib/k6-utils.js` gera:

- `reports/k6/<area>-<perfil>.html`: relatório visual com thresholds, checks e métricas;
- `reports/k6/<area>-<perfil>.json`: dados completos da execução;
- resumo no terminal.

A pasta `reports/` não vai para o Git. As análises das execuções registradas ficam em [`docs/`](../docs/README.md).
