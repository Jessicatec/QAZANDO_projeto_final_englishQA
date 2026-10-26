# Relatório de performance - Documentação

## Objetivo
Validar o comportamento da tela de documentação da plataforma English QA sob carga progressiva e em pico de uso, cobrindo autenticação, carregamento da página e verificação do conteúdo principal.

## Cenários implementados

| Cenário | Tipo | Usuários | Duração | Objetivo |
|---|---|---:|---|---|
| `performance_documentacao` | Smoke | 1 VU constante | 20s | Validar login e carregamento rápido da tela |
| `performance_documentacao_load` | Load | 10 → 50 → 100 VUs | 35s total | Verificar estabilidade em carga incremental |
| `performance_documentacao_escala` | Stress/Load | 10 → 50 → 100 → 500 → 1000 VUs | 1m25s total | Validar limite da tela em pico de uso |
| `performance_documentacao_spike` | Spike | 20 → 1000 VUs | 35s total | Avaliar resposta em pico abrupto |

## Arquivo de teste
- `performance/documentacao.k6.js`

## Comando de execução

As credenciais são lidas do `.env`. Cada perfil executa apenas os seus cenários (veja [performance/README.md](../performance/README.md)).

```bash
npm run test:perf:documentacao              # smoke (padrão)
npm run test:perf:documentacao -- load
npm run test:perf:documentacao -- stress
npm run test:perf:documentacao -- spike
```

## Evidência executada

### Smoke - 26/10/2026

Perfil `smoke` (1 VU por 20 s): **thresholds aprovados**.

| Métrica | Resultado |
| --- | --- |
| Checks | 100% (45/45) |
| `http_req_failed` | 0,00% (0/45) |
| `http_req_duration` p95 | 299,40 ms |

### Correção do check de conteúdo

A aplicação é uma SPA: a resposta HTTP de `/docs` contém apenas o shell HTML (`<div id="root">`), e o texto "Documentação" é renderizado no navegador. Como o k6 não executa JavaScript, o check antigo `docs content is present` falhava em **100% das iterações, mesmo com 1 usuário**. Ele foi substituído por `docs SPA shell is delivered`. O conteúdo da página continua validado pelo Playwright em `tests/documentacao.spec.ts`.

### Execução com todos os cenários simultâneos (registro anterior)

Execução realizada antes da separação por perfis e da correção acima, com os 4 cenários rodando ao mesmo tempo.

- Cenários executados: 4
- VUs máximos observados: 1162
- HTTP failures: 0.65%
- Checks totais: 19494
- Checks bem-sucedidos: 13041 (66.89%)
- Checks falharam: 6453 (33.10%)
- p95 de resposta HTTP: 9.19s
- p95 de resposta customizada: 8.17s

### Observação importante

Os limiares de aceitação foram excedidos na fase de pico, indicando que a tela começa a sofrer degradação quando a carga cresce para 500–1000 usuários simultâneos (p95 de 9,19 s e 0,65% de falhas HTTP).

A taxa de 66,89% de checks **não** reflete degradação: 1 dos 3 checks (`docs content is present`) falhava sempre, pelo motivo descrito em "Correção do check de conteúdo". A análise de degradação deve se basear no p95 e na taxa de falhas HTTP.

Isso é um resultado útil de desempenho: o cenário é capaz de identificar gargalos reais, e a página precisa de otimização de desempenho em alta concorrência.
