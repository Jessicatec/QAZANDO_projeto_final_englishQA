# language: pt
Funcionalidade: Exercícios de inglês
  Como usuário autenticado do English QA
  Quero responder exercícios de completar frase e acompanhar o progresso
  Para validar a mecânica da rodada, o histórico e o reinício do fluxo

  Contexto:
    Dado que o usuário acessa a página de exercícios
    E está autenticado no sistema

  @funcional
  Cenário: CN001 - Responder corretamente uma questão
    Dado que a questão exibida é "Are _______ going to the park tomorrow?"
    Quando digitar "you" no campo de resposta
    E clicar em "Verificar Resposta"
    Então a próxima questão é exibida
    E o contador avança para um valor maior que zero
    E a barra de progresso é atualizada com um percentual positivo
    E o histórico mostra a resposta e o resultado da tentativa
    E o resumo do histórico mostra um total de acertos e respostas

  @funcional
  Cenário: CN002 - Recomeçar após completar algumas frases
    Dado que o usuário completou as 5 questões
    Quando clicar em "Recomeçar"
    Então uma nova rodada inicia em "1 de 30" com histórico vazio

  @funcional
  Cenário: CN004 - Histórico com as 30 respostas
    Dado que o usuário respondeu as 30 questões
    Então o histórico é apresentado de forma legível
    E o carregamento da página permanece aceitável

  @funcional
  Cenário: CN005 - Recomeçar após concluir as 30 questões
    Dado que o usuário concluiu a rodada de 30 questões
    Quando clicar em "Recomeçar"
    Então uma nova rodada inicia em "1 de 30" com histórico vazio

  @funcional
  Cenário: CN006 - Resposta incorreta mantém o status e bloqueia avanço
    Dado que a questão exibida é "Are _______ going to the park tomorrow?"
    Quando digitar "they" no campo de resposta
    E clicar em "Verificar Resposta"
    Então o sistema marca a resposta como incorreta
    E a questão permanece disponível para correção sem pular para a próxima

  @funcional
  Cenário: CN007 - Campo de resposta vazio exige validação
    Dado que a questão exibida é "Are _______ going to the park tomorrow?"
    Quando clicar em "Verificar Resposta" sem preencher o campo
    Então uma mensagem de validação ou erro deve ser exibida
    E a questão não pode ser considerada resolvida
