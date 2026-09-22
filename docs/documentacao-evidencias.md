# Relatório de evidências - Documentação

## Objetivo
Validar a interface e a funcionalidade da tela de documentação do English QA em https://english.qazando.com.br/docs, cobrindo contexto de login, renderização da página, expansão de cards e tabela de usuários de teste.

## Comandos executados

- `npx playwright test tests/documentacao.spec.ts --reporter=list`

## Evidências coletadas

- Captura de tela da página: [documentacao-evidencia.png](documentacao-evidencia.png)
- HTML report gerado pelo Playwright em `playwright-report/index.html`

## Resultado verificado

- 4 testes executados
- 4 testes aprovados
- Tempo total: 12.1s

## Cenários validados

1. Carregamento da página de documentação com os principais blocos da interface
2. Expansão de uma funcionalidade e exibição das regras de negócio
3. Listagem correta dos usuários de teste com perfil e senha
4. Navegação por teclado acessível nos cards de documentação

## Observações

A página confirmou a estrutura esperada: título principal "Documentação", introdução do contexto de negócios, lista de funcionalidades em accordion e tabela de usuários de teste com perfis Admin, Premium Ativo, Usuário Comum e Sem Email Confirmado.
