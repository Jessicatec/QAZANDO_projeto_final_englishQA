# Evidências do módulo de Ranking - English QA

## Requisitos e comportamento esperados da feature

- URL esperada: https://english.qazando.com.br/ranking
- O usuário deve autenticar-se antes de acessar o painel principal
- Após o login, o usuário deve clicar em "Ir para Exercícios" para acessar o menu principal
- O menu principal deve expor a opção "Ranking"
- O ranking exige mínimo de 5 exercícios concluídos para exibir o participante
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
- Mínimo de 5 exercícios concluídos

## Ações alternativas

### Fluxo positivo
- Usuário autenticado, premium, com 5+ exercícios concluídos
- Acesso ao ranking e visualização da lista ordenada

### Fluxo negativo
- Usuário autenticado sem premium
- Tela de bloqueio com CTA para ativação
- Usuário com menos de 5 exercícios
- Estado vazio ou regra não atendida

## Casos de teste manuais e resumidos

| Cenário | Objetivo | Pré-condições | Passos | Resultado esperado |
| --- | --- | --- | --- | --- |
| CN001 - Acesso ao ranking pelo menu principal - usuário diferente de Premium | Validar que usuário sem premium recebe bloqueio ao acessar a feature | Usuário autenticado no sistema e sem assinatura Premium | 1. Fazer login com usuário comum. 2. Acessar a URL "/ranking". 3. Observar a tela exibida. | Uma mensagem de bloqueio deve ser exibida e o botão de ativação do plano Premium deve estar visível. |
| CN002 - Acesso ao ranking pelo menu principal - usuário Premium | Validar acesso normal para usuários Premium | Usuário autenticado e com assinatura Premium ativa | 1. Fazer login com usuário Premium. 2. Acessar a URL "/ranking". 3. Observar a tela. | A tela de Ranking deve ser exibida corretamente. |
| CN003 - Exibição no ranking com quantidade de exercícios completados que não atingem a quantidade mínima | Validar a regra da participação mínima por exercícios | Usuário autenticado e participante com 4 exercícios concluídos | 1. Acessar a página de ranking. 2. Verificar a listagem de participantes. | O participante não deve aparecer no ranking, pois não atingiu a quantidade mínima de 5 exercícios. |
| CN004 - Exibição no ranking com quantidade de exercícios + quiz completados que não atingem a quantidade mínima | Validar a regra combinada de exercícios + quiz | Participante com 2 exercícios e 2 quizzes concluídos | 1. Acessar a página de ranking. 2. Verificar a listagem. | O participante não deve ser exibido no ranking, pois o total não atinge o mínimo exigido. |
| CN005 - Exibição no ranking com quantidade de quiz completados que não atingem a quantidade mínima | Validar que quizzes isolados não bastam para aparecer | Participante com 2 quizzes concluídos | 1. Acessar a página de ranking. 2. Verificar a listagem. | O participante não deve ser exibido no ranking, pois o mínimo é baseado em exercícios e/ou total combinado conforme regra do produto. |
| CN006 - Exibição no ranking com quantidade de exercícios completados que atingem a quantidade mínima | Validar a regra de entrada no ranking com base em exercícios | Participante com 5 exercícios concluídos | 1. Acessar a página de ranking. 2. Verificar a listagem. | O participante deve aparecer no ranking. |
| CN007 - Exibição de dados corretos do participante no ranking | Validar a integridade dos dados exibidos | Participante presente na listagem do ranking | 1. Acessar a página de ranking. 2. Selecionar ou localizar um participante. 3. Verificar os detalhes exibidos. | Deve ser exibido corretamente o nome, o email e as estatísticas do participante. |
| CN008 - Exibição no ranking com quantidade de exercícios + quiz completados que atingem a quantidade mínima | Validar a regra combinada positiva | Participante com 3 exercícios e 2 quizzes concluídos | 1. Acessar a página de ranking. 2. Verificar a listagem. | O participante não deve ser exibido no ranking, pois o critério de regra do produto deve ser validado conforme o cálculo real implementado. |
| CN009 - Exibição no ranking com mais erros do que acertos, mas quantidade mínima atendida | Validar que a presença no ranking não depende de acerto exclusivo | Participante com mais erros do que acertos e atendendo ao mínimo de participação | 1. Acessar a página de ranking. 2. Verificar a listagem. | O participante deve ser exibido no ranking, mesmo com mais erros do que acertos, desde que cumpra a regra de participação e o cálculo de pontuação do sistema. |

## Cenários automatizados implementados

- Acesso autenticado à tela de ranking e visualização do estado atual da feature
- Exibição da mensagem de bloqueio para usuários sem acesso premium
- Navegação até o menu principal após autenticação
- Acessibilidade por teclado e foco visível
- Feedback visual claro quando o ranking está bloqueado

## Evidência executada

Comando executado:

```bash
npx playwright test tests/ranking.spec.ts --reporter=list
```

Resultado validado no ambiente real:

- a suíte foi executada contra o app em https://english.qazando.com.br
- o comportamento real atual expõe o estado de bloqueio premium do ranking
- a automação foi ajustada para validar o comportamento com foco em usabilidade, acessibilidade e feedback visual

## Artefatos gerados

- suíte automatizada em `tests/ranking.spec.ts`
- página de apoio em `tests/pages/ranking.page.js`
- cenários em Gherkin em `tests/features/ranking.feature`
- relatório HTML em `playwright-report/`
- evidências em `test-results/`

> Observação: no ambiente real validado, a tela de ranking exige acesso premium e o fluxo bloqueado é exibido com clareza. A regra funcional de ordenação por acertos e de mínimo de 5 exercícios foi documentada nos cenários manualmente conforme requisito de negócio, enquanto a automação cobre o comportamento visível e acessível observado na app atual.
