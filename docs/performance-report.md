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
| `duolingo_login_smoke` | Smoke | 1 VU constante | 20s | Validar que o login e o acesso à trilha funcionam em fluxo simples |
| `duolingo_trail_load` | Load | 2 → 5 VUs | 45s total | Validar a trilha com aumento gradual de concorrência |

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

Execução validada com o K6 instalado e disponível no ambiente.

Comando executado:

```powershell
$env:BASE_URL="https://english.qazando.com.br"
$env:TEST_USER_EMAIL="admin@teste.com"
$env:TEST_USER_PASSWORD="Teste@123"
& "C:\Program Files\k6\k6.exe" run .\performance\duolingo-trilha.k6.js
```

Resultado real obtido:

```text
checks_total.......: 483     10.672634/s
checks_succeeded...: 100.00% 483 out of 483
checks_failed......: 0.00%   0 out of 483

http_req_duration..............: avg=72.75ms min=49.2ms med=63.97ms max=1.07s p(90)=76.04ms p(95)=82.34ms
http_req_failed................: 0.00%  0 out of 644
http_reqs......................: 644    14.230179/s

running (0m45.3s), 0/6 VUs, 161 complete and 0 interrupted iterations
```

## Resultado final da execução

- Cenários executados: 2
- Checks considerados: 483
- Checks bem-sucedidos: 483 (100%)
- Falhas HTTP: 0%
- p95 da resposta: 82.34ms
- Status geral: aprovado

## Observação final

O fluxo principal da trilha do inglês se mostrou estável sob a carga leve aplicada e atende aos critérios de aceitação definidos para autenticação e acesso à trilha.
