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

```powershell
$env:BASE_URL="https://english.qazando.com.br"
$env:TEST_USER_EMAIL="admin@teste.com"
$env:TEST_USER_PASSWORD="Teste@123"
& "C:\Program Files\k6\k6.exe" run .\performance\documentacao.k6.js
```

## Evidência executada

Execução validada no ambiente real com a aplicação pública. O script foi executado com todos os cenários configurados.

### Resultado real

- Cenários executados: 4
- VUs máximos observados: 1162
- HTTP failures: 0.65%
- Checks totais: 19494
- Checks bem-sucedidos: 13041 (66.89%)
- Checks falharam: 6453 (33.10%)
- p95 de resposta HTTP: 9.19s
- p95 de resposta customizada: 8.17s

### Observação importante

Os limiares de aceitação foram excedidos na fase de pico, principalmente no conteúdo da página de documentação, indicando que a tela começa a sofrer degradação quando a carga cresce para 500–1000 usuários simultâneos.

Isso é um resultado útil de desempenho: o cenário é capaz de identificar gargalos reais, e a página precisa de otimização de desempenho em alta concorrência.
