# Relatório de desempenho - Feature Duolingo Trilha

## Objetivo

Validar o comportamento da funcionalidade de trilha do inglês sob carga leve, com foco no fluxo autenticado e na navegação até a trilha principal.

## Escopo

Os cenários cobrem:

1. Autenticação do usuário
2. Acesso ao menu de exercícios
3. Navegação para a trilha do inglês
4. Verificação do comportamento sob carga leve

## Cenários de teste

| Cenário | Tipo | Usuários | Duração | Objetivo |
|---|---|---:|---|---|
| `performance_trilhaingles` | Smoke | 1 VU constante | 20s | Validar que o login e o acesso à trilha funcionam em fluxo simples |
| `performance_trilhaingles_load` | Load | 2 → 5 VUs | 45s total | Validar a trilha com aumento gradual de concorrência |
| `performance_trilhaingles_escala` | Stress/Load | 10 → 30 → 60 → 100 → 200 → 500 → 1000 VUs | 2m5s total | Validar a estabilidade da trilha em crescimento escalonado de uso e identificar o ponto de saturação |

## Script de performance

Arquivo principal:
- `performance/duolingo-trilha.k6.js`

## Comando de execução

### Windows PowerShell

```powershell
$env:BASE_URL="https://english.qazando.com.br"
$env:TEST_USER_EMAIL="admin@teste.com"
$env:TEST_USER_PASSWORD="Teste@123"
k6 run .\performance\duolingo-trilha.k6.js
```

### Bash / zsh

```bash
BASE_URL=https://english.qazando.com.br \
TEST_USER_EMAIL=admin@teste.com \
TEST_USER_PASSWORD=Teste@123 \
k6 run ./performance/duolingo-trilha.k6.js
```

## Critérios de aceitação

- `http_req_failed` abaixo de 5%
- `p(95)` de resposta inferior a 2000 ms
- checagens principais com taxa superior a 95%
- autenticação e acesso à trilha funcionando sob carga leve

## Evidência executada

Execução validada com o K6 instalado e disponível no ambiente, incluindo o novo cenário escalonado de usuários.

Comando executado:

```powershell
$env:BASE_URL="https://english.qazando.com.br"
$env:TEST_USER_EMAIL="admin@teste.com"
$env:TEST_USER_PASSWORD="Teste@123"
& "C:\Program Files\k6\k6.exe" run .\performance\duolingo-trilha.k6.js
```

Resultado real obtido:

```text
scenarios: (100.00%) 3 scenarios, 1000 max VUs, 2m35s max duration
* performance_trilhaingles: 1 looping VUs for 20s
* performance_trilhaingles_escala: Up to 1000 looping VUs for 2m5s over 8 stages
* performance_trilhaingles_load: Up to 5 looping VUs for 45s over 3 stages

checks_total.......: 22319   145.168537/s
checks_succeeded...: 100.00% 22319 out of 22319
checks_failed......: 0.00%   0 out of 22319

http_req_duration..............: avg=913.57ms min=0s med=220.95ms max=53.08s p(90)=1.43s p(95)=2.78s
http_req_failed................: 0.27% 81 out of 29806
http_reqs......................: 29806 193.865918/s

running (2m33.7s), 0000/1000 VUs, 7437 complete and 7 interrupted iterations
```

## Resultado final da execução

- Cenários executados: 3
- Checks considerados: 22319
- Checks bem-sucedidos: 22319 (100%)
- Falhas HTTP: 0.27% (81/29806)
- p95 da resposta: 2.78s
- Status geral: limiar de desempenho excedido no pico de carga (p95 acima do critério de 2s)

## Observação final

O cenário escalonado com 10, 30, 60, 100, 200, 500 e 1000 usuários foi adicionado e executado com sucesso até o pico de carga. O ambiente começou a demonstrar lentidão e algumas falhas de conexão na fase mais intensa, indicando que o sistema atinge seu limite de estabilidade em alta concorrência mesmo com o fluxo principal funcionando.
