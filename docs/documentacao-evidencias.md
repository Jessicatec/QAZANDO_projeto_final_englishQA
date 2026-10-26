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

## Cenários manuais

### CN001 - Acessar a página de documentação
- Objetivo: validar o acesso e o carregamento inicial da página de documentação.
- Pré-condições: usuário com credenciais válidas e confirmado no sistema.
- Passos:
	1. Fazer login no English QA.
	2. Acessar a página de documentação pelo menu ou diretamente pela rota `/docs`.
	3. Conferir o título, a introdução, a lista de funcionalidades e a tabela de usuários de teste.
- Resultado esperado: a página de documentação é carregada para o usuário autenticado, com os principais blocos visíveis e sem erros de interface.

### CN002 - Expandir uma funcionalidade para ver os detalhes das regras de negócio
- Objetivo: verificar se os detalhes e as regras de negócio de uma funcionalidade podem ser consultados.
- Pré-condições: usuário autenticado na página de documentação.
- Passos:
	1. Localizar um card de funcionalidade, por exemplo, "Cadastro e Acesso Gratuito".
	2. Acionar o card usando mouse ou teclado.
	3. Conferir a área expandida e o conteúdo das regras de negócio.
- Resultado esperado: o card expande e apresenta os detalhes e as regras de negócio correspondentes à funcionalidade selecionada.
