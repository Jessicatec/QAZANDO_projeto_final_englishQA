# Evidências do módulo de Ranking - English QA

## Requisitos e comportamento esperados da feature

- URL esperada: https://english.qazando.com.br/ranking
- O usuário deve autenticar-se antes de acessar o painel principal
- Após o login, o usuário deve clicar em "Ir para Exercícios" para acessar o menu principal
- O menu principal deve expor a opção "Ranking"
- O ranking exige mínimo de 5 atividades concluídas (exercícios e/ou quizzes) para exibir o participante
- A pontuação combina acertos de Quiz + Exercícios
- A ordenação deve ser por maior total de acertos, do maior para o menor
- Cada participante deve apresentar nome, email e estatísticas visíveis
- A interface deve indicar claramente estados vazios, bloqueios e mensagens de orientação

## Campos, botões e elementos clicáveis visíveis

- Campo de email no login
- Campo de senha no login
- Botão "Entrar"
- Link/CTA "Ir para Exercícios"
- Link/botão do menu principal para "Ranking"
- Botão "Ativar Código Premium" em fluxo de bloqueio
- Elementos de lista/tabela ou estado vazio no ranking
- Foco visível por teclado em botões e links interativos

## Fluxos esperados de uso

1. Login com credencial válida
2. Clique em "Ir para Exercícios"
3. Acesso ao menu principal
4. Seleção da opção "Ranking"
5. Visualização do estado do ranking conforme perfil, progresso e premium
6. Validação de regra de mínimo de exercícios e feedback visual adequado

## Possíveis mensagens de erro, bloqueio ou validação

- Conteúdo Premium
- Este conteúdo está disponível apenas para usuários premium
- Ativar Código Premium
- Nenhum participante encontrado
- Sem dados suficientes para exibir o ranking
- Mínimo de 5 atividades concluídas (exercícios e/ou quizzes)

## Ações alternativas

### Fluxo positivo
- Usuário autenticado, premium, com 5 ou mais atividades concluídas
- Acesso ao ranking e visualização da lista ordenada

### Fluxo negativo
- Usuário autenticado sem premium
- Tela de bloqueio com CTA para ativação
- Usuário com menos de 5 exercícios
- Estado vazio ou regra não atendida

## Casos de teste manuais e resumidos

| Cenário | Objetivo | Pré-condições | Passos | Resultado esperado |
| --- | --- | --- | --- | --- |
| CN001 - Acesso ao ranking pelo menu principal - usuário não Premium | Validar que usuário sem Premium recebe bloqueio ao acessar a feature | Usuário autenticado sem assinatura Premium | 1. Fazer login com usuário comum. 2. Clicar em "Ir para Exercícios". 3. Selecionar "Ranking" no menu principal. | A mensagem de bloqueio Premium é exibida e a opção de ativação Premium fica visível. |
| CN002 - Acesso ao ranking pelo menu principal - usuário Premium | Validar acesso ao ranking para usuários Premium | Usuário autenticado com assinatura Premium ativa | 1. Fazer login com usuário Premium. 2. Clicar em "Ir para Exercícios". 3. Selecionar "Ranking" no menu principal. | A página de Ranking é exibida sem bloqueio Premium e apresenta a listagem ou o estado vazio aplicável. |
| CN003 - Exibição no ranking com exercícios abaixo da quantidade mínima | Validar a regra de participação mínima para exercícios | Participante Premium com 4 exercícios concluídos e sem outras atividades contabilizadas | 1. Acessar o Ranking pelo menu principal. 2. Localizar o participante na listagem. | O participante não aparece, pois possui menos de 5 atividades concluídas. |
| CN004 - Exibição no ranking com exercícios e quizzes abaixo da quantidade mínima | Validar a regra combinada de exercícios e quizzes abaixo do limite | Participante Premium com 2 exercícios e 2 quizzes concluídos | 1. Acessar o Ranking pelo menu principal. 2. Localizar o participante na listagem. | O participante não aparece, pois as 4 atividades concluídas não atingem o mínimo de 5. |
| CN005 - Exibição no ranking com quizzes abaixo da quantidade mínima | Validar que a quantidade de quizzes, isoladamente, também precisa atingir o mínimo | Participante Premium com 2 quizzes concluídos e sem exercícios contabilizados | 1. Acessar o Ranking pelo menu principal. 2. Localizar o participante na listagem. | O participante não aparece, pois possui menos de 5 atividades concluídas. |
| CN006 - Exibição no ranking com exercícios que atingem a quantidade mínima | Validar a participação com o mínimo atingido por exercícios | Participante Premium com 5 exercícios concluídos | 1. Acessar o Ranking pelo menu principal. 2. Localizar o participante na listagem. | O participante aparece no ranking por atingir o mínimo de 5 atividades concluídas. |
| CN007 - Exibição dos dados corretos do participante no ranking | Validar a integridade dos dados exibidos | Participante Premium elegível e com nome, email e estatísticas conhecidos | 1. Acessar o Ranking pelo menu principal. 2. Localizar o participante. 3. Conferir nome, email e estatísticas exibidas. | Os dados apresentados correspondem aos dados cadastrados e às atividades contabilizadas para o participante. |
| CN008 - Exibição no ranking com exercícios e quizzes que atingem a quantidade mínima | Validar a regra combinada de exercícios e quizzes no limite mínimo | Participante Premium com 3 exercícios e 2 quizzes concluídos | 1. Acessar o Ranking pelo menu principal. 2. Localizar o participante na listagem. | O participante aparece no ranking, pois as 5 atividades concluídas atingem o mínimo. |
| CN009 - Exibição no ranking com mais erros do que acertos e quantidade mínima atingida | Validar que erros não excluem participante que atingiu o mínimo | Participante Premium com pelo menos 5 atividades concluídas e mais erros do que acertos | 1. Acessar o Ranking pelo menu principal. 2. Localizar o participante e conferir as estatísticas. | O participante aparece no ranking por atingir o mínimo; o total de acertos reflete o desempenho, mas a quantidade de erros não o exclui por si só. |

## Cenários automatizados implementados

- Acesso autenticado à tela de ranking e visualização do estado atual da feature
- Exibição da mensagem de bloqueio para usuários sem acesso premium
- Navegação até o menu principal após autenticação
- Acessibilidade por teclado e foco visível
- Feedback visual claro quando o ranking está bloqueado

## Evidência executada

### Execução funcional da feature de ranking

Comando executado:

```bash
npx playwright test tests/ranking.spec.ts --reporter=list
```

Resultado validado no ambiente real:

- a suíte foi executada contra o app em https://english.qazando.com.br
- o comportamento real atual expõe o estado de bloqueio premium do ranking
- a automação foi ajustada para validar o comportamento com foco em usabilidade, acessibilidade e feedback visual

### Execução com massa simulada de participantes

Comando executado:

```bash
npx playwright test tests/ranking-mass-data.spec.ts --reporter=list
```

Resultado validado:

- 3 testes executados
- 3 testes aprovados
- tempo total: 3.6s
- cenários validados: elegibilidade, regra mínima de participação e exibição correta de nome, email e estatísticas

## Artefatos gerados

- suíte automatizada em `tests/ranking.spec.ts`
- página de apoio em `tests/pages/ranking.page.js`
- cenários em Gherkin em `features/ranking.feature`
- relatório HTML em `playwright-report/`
- evidências em `test-results/`

> Observação: no ambiente real validado, a tela de ranking exige acesso premium e o fluxo bloqueado é exibido com clareza. A regra funcional de ordenação por acertos e de mínimo de 5 exercícios foi documentada nos cenários manualmente conforme requisito de negócio, enquanto a automação cobre o comportamento visível e acessível observado na app atual.
