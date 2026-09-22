# K6 performance - Trilha do Inglês

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
k6 run .\performance\trilha_ingles.k6.js
```

### Bash / zsh

```bash
BASE_URL=https://english.qazando.com.br \
TEST_USER_EMAIL=admin@teste.com \
TEST_USER_PASSWORD=Teste@123 \
k6 run ./performance/trilha_ingles.k6.js
```

## Cenários configurados

- `performance_Exercicios`: 1 usuário constante por 20s
- `performance_Exercicios_load`: ramp-up de 10 para 50 usuários para validar a carga incremental
- `performance_Exercicios_escala`: escalonamento de 10, 50, 100, 200, 500 e 1000 usuários para validar carga e stress

## Objetivo

Validar as rotas mais críticas do fluxo autenticado:

1. autenticação
2. acesso ao menu de exercícios
3. navegação para a trilha do inglês
4. resiliência sob carga leve

## Observação

O script foi desenhado para seguir a regra de negócio da feature e validar o comportamento do fluxo principal sob carga, sem bloquear a navegação de usuários reais.
