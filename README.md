# English QA - Duolingo automation project

Projeto de automação Playwright para validar o fluxo real do English QA, iniciando em `/auth`, seguindo com login válido, acesso a "Ir para Exercícios", seleção da "Trilha do Inglês" e verificação das unidades, lições, XP e acessibilidade.

## Objetivo

Cobrir os requisitos principais da trilha:

- 4 unidades progressivas com lições
- desbloqueio sequencial de lições
- XP ao finalizar cada lição
- validação de campos e mensagens de erro
- acessibilidade, foco visual e layout responsivo

## Pré-requisitos

- Node.js 18+
- Chromium do Playwright
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
TEST_USER_EMAIL=seu_email_validado@dominio.com
TEST_USER_PASSWORD=sua_senha_valida
```

## Execução

```bash
npx playwright test
```

Relatório HTML:

```bash
npx playwright show-report playwright-report
```

## Fluxo coberto

1. acessa `/auth`
2. faz login com usuário validado
3. clica em "Ir para Exercícios"
4. seleciona "Trilha do Inglês"
5. valida unidade, lições, XP e comportamento visual

## Evidências geradas

A configuração gera automaticamente:

- `playwright-report/`
- `test-results/results.json`
- screenshots e vídeos em `test-results/`
