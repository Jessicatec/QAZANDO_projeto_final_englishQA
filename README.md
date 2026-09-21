# English QA - Duolingo automation project

Projeto de automação de testes para validar o fluxo real do English QA, iniciando em `/auth`, seguindo com login válido, acesso a "Ir para Exercícios", seleção da "Trilha do Inglês" e verificação das unidades, lições, XP, acessibilidade e comportamento sob carga.

## Objetivo

Cobrir os requisitos principais da trilha:

- 4 unidades progressivas com lições
- desbloqueio sequencial de lições
- XP ao finalizar cada lição
- validação de campos e mensagens de erro
- acessibilidade, foco visual e layout responsivo
- cenário de performance com escalonamento de usuários em K6

## Pré-requisitos

- Node.js 18+
- Chromium do Playwright
- K6 instalado para execução de testes de performance
- arquivo `.env` com credenciais válidas

## Instalação

```bash
npm install
npx playwright install chromium
cp .env.example .env
```

Preencha o `.env`:

```bash
BASE_URL=https://english.qazando.com.br
TEST_USER_EMAIL=admin@teste.com
TEST_USER_PASSWORD=Teste@123
```

## Execução dos testes funcionais

```bash
npx playwright test
```

Relatório HTML:

```bash
npx playwright show-report playwright-report
```

## Execução dos testes de performance

```powershell
$env:BASE_URL="https://english.qazando.com.br"
$env:TEST_USER_EMAIL="admin@teste.com"
$env:TEST_USER_PASSWORD="Teste@123"
& "C:\Program Files\k6\k6.exe" run .\performance\duolingo-trilha.k6.js
```

## Fluxo coberto

1. acessa `/auth`
2. faz login com usuário validado
3. clica em "Ir para Exercícios"
4. seleciona "Trilha do Inglês"
5. valida unidade, lições, XP e comportamento visual
6. valida comportamento sob carga em cenários K6

## Cenários de performance

A suíte em K6 inclui os seguintes cenários:

- `performance_trilhaingles` — smoke com 1 VU
- `performance_trilhaingles_load` — carga leve com 2 → 5 VUs
- `performance_trilhaingles_escala` — escala com 10 → 30 → 60 → 100 → 200 → 500 → 1000 VUs

## Evidências geradas

A configuração gera automaticamente:

- `playwright-report/`
- `test-results/results.json`
- screenshots e vídeos em `test-results/`
- relatório de performance em `docs/performance-report.md`

## Evidência validada

Execução final do Playwright:

- 8 testes executados
- 8 aprovados
- tempo total: 51.7s

Execução final do K6 com cenário escalonado:

- 22.319 checks
- 100% de checks bem-sucedidos
- 0.27% de falhas HTTP
- p95: 2.78s
- limiar de desempenho excedido no pico de carga com 1000 VUs

Esse resultado indica que o fluxo principal permanece funcional, mas a aplicação começa a apresentar saturação e lentidão na fase mais intensa de concorrência.
