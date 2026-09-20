# K6 performance - Duolingo trail

Este diretório contém cenários de performance para validar o fluxo principal da funcionalidade de trilha do inglês.

## Variáveis de ambiente

```bash
BASE_URL=https://english.qazando.com.br
TEST_USER_EMAIL=admin@teste.com
TEST_USER_PASSWORD=Teste@123
```

## Executar

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

## Cenários configurados

- `duolingo_login_smoke`: 1 usuário constante por 20s
- `duolingo_trail_load`: ramp-up de 2 para 5 usuários, com pico de 25s

## Objetivo

Validar as rotas mais críticas do fluxo autenticado:

1. autenticação
2. acesso ao menu de exercícios
3. navegação para a trilha do inglês
4. resiliência sob carga leve

## Observação

O script foi desenhado para seguir a regra de negócio da feature e validar o comportamento do fluxo principal sob carga, sem bloquear a navegação de usuários reais.
