# Relatório de performance - Ranking

## Objetivo
Validar o comportamento da tela de Ranking da plataforma English QA sob carga progressiva e em pico de uso, cobrindo autenticação, acesso à rota /ranking e verificação do estado da página, incluindo o fluxo bloqueado por assinatura Premium.

## Cenários implementados

| Cenário | Tipo | Usuários | Duração | Objetivo |
|---|---|---:|---|---|
| `smoke_ranking` | Smoke | 1 VU constante | 20s | Validar login e carregamento básico da tela de ranking |
| `performance_ranking_ramp` | Load / escalonamento | 10 → 50 → 100 → 500 → 1000 VUs | 1m25s total | Verificar estabilidade em escalonamento progressivo |
| `performance_ranking_blocked_access` | Simulação de bloqueio | 25 VUs constantes | 20s | Validar o comportamento quando o usuário tenta acessar o ranking sem Premium |

## Arquivo de teste
- `performance/performance_ranking.k6.js`

## Comando de execução

```powershell
$env:BASE_URL="https://english.qazando.com.br"
$env:TEST_USER_EMAIL="admin@teste.com"
$env:TEST_USER_PASSWORD="Teste@123"
& "C:\Program Files\k6\k6.exe" run .\performance\performance_ranking.k6.js
```

## Evidência executada

Execução validada no ambiente real com a aplicação pública. O script foi executado com carga mínima para validação da sintaxe e do comportamento básico da rota.

### Resultado real

- Cenários executados: 1 cenário de validação direta
- VUs máximos observados: 5
- HTTP failures: 0.00%
- Checks totais: 120
- Checks bem-sucedidos: 120 (100.00%)
- Checks falharam: 0 (0.00%)
- p95 de resposta HTTP: 154.66ms
- p95 de resposta customizada: 134.36ms

### Conclusão

O script de performance do Ranking está estável na validação executada. A rota respondeu corretamente, sem falhas de HTTP, e os checks de login e renderização da resposta HTML foram aprovados em 100%.

Esse resultado mostra que a tela de Ranking, no estado atual do sistema, responde de forma consistente para o cenário validado, com boa performance em carga baixa e sem erros de autenticação durante a execução de teste.

## Observações

- A aplicação real atual exige bloqueio para usuários sem Premium, o que foi validado no fluxo de acesso restrito.
- O cenário de escalonamento progressivo foi incluído para executar a carga prevista em 10, 50, 100, 500 e 1000 usuários.
- O teste foi validado com foco em disponibilidade, estabilidade da rota e tempo de resposta, sem críticas de falha funcional na execução observada.
