# language: pt
Funcionalidade: Trilha do Inglês
  Como usuário autenticado do English QA
  Quero acessar a trilha de inglês e completar as lições em sequência
  Para evoluir no curso e ganhar XP

  Contexto:
    Dado que o usuário está autenticado no sistema
    E acessa a página da trilha do inglês

  @funcional
  Cenário: Login com credenciais válidas
    Dado que estou na página de autenticação
    E possuo um usuário válido do English QA
    Quando informo meu e-mail válido e minha senha válida
    E clico em "Entrar"
    Então devo ser redirecionado para o painel principal
    E devo ver o botão "Ir para Exercícios"

  @funcional
  Cenário: Acesso ao menu principal e seleção da trilha do inglês
    Quando clico no botão "Ir para Exercícios"
    E seleciono a opção "Trilha do Inglês"
    Então devo ver a página da trilha de inglês
    E a interface deve exibir os módulos e as lições disponíveis

  @funcional
  Cenário: Visualização de 4 unidades progressivas com lições
    Quando a página da trilha carrega
    Então devo visualizar 4 unidades progressivas
    E cada unidade deve conter lições ou ações associadas
    E o layout deve ser legível e organizado visualmente

  @funcional
  Cenário: Lições desbloqueiam sequencialmente
    Dado que a lição anterior permanece incompleta
    Quando tento abrir a lição seguinte
    Então a lição seguinte deve permanecer bloqueada ou desabilitada
    E o sistema deve indicar claramente o estado bloqueado

  @funcional
  Cenário: Quando a lição é errada, a próxima não pode ser desbloqueada
    Dado que estou em uma lição disponível
    E falho a lição inteira ou a etapa principal da atividade
    Quando o sistema avalia o resultado
    Então a lição deve continuar bloqueada ou sem avanço liberado
    E a próxima lição não deve ficar disponível para acesso imediato
    E o usuário deve ter a opção de tentar novamente sem pular etapas

  @funcional
  Cenário: Conclusão de lição concede XP ao jogador
    Dado que estou em uma lição disponível
    Quando concluo a lição com sucesso
    Então a lição deve ser marcada como concluída
    E o jogador deve receber XP
    E o progresso da unidade deve ser atualizado

  @funcional
  Cenário: Acessibilidade por teclado e foco visível
    Quando navego com o teclado usando Tab
    Então cada elemento interativo deve receber foco visível
    E a ordem de navegação deve ser lógica e previsível

  @funcional
  Cenário: Validação de erros e mensagens obrigatórias
    Dado que estou dentro de um fluxo que exige conclusão ou resposta
    Quando a ação obrigatória não for executada
    Então uma mensagem de validação ou erro deve ser exibida
    E o usuário deve conseguir tentar novamente sem perder o progresso já realizado
