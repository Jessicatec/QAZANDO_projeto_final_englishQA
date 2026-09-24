Feature: Ranking
  As a user authenticated in English QA
  I want to access and validate the ranking feature
  So that I can verify access rules, participation criteria and data display

  Scenario: RANK-01 - Usuário sem plano Premium recebe bloqueio ao acessar o ranking
    Given the user is authenticated in the system
    And the user does not have a Premium plan subscription
    When the user accesses the URL "/ranking"
    Then a blocking message must be displayed
    And the Premium plan activation button must be visible

  Scenario: RANK-02 - Usuário com plano Premium acessa a tela de ranking corretamente
    Given the user is authenticated in the system
    And the user has a Premium plan subscription
    When the user accesses the URL "/ranking"
    Then the Ranking screen must be displayed

  Scenario: RANK-03 - Participante com 4 exercícios não aparece no ranking
    Given I am on the ranking page
    And a participant has completed 4 exercises
    When the participant accesses the ranking
    Then the participant must not be displayed in the ranking

  Scenario: RANK-04 - Participante com 2 exercícios e 2 quizzes não aparece no ranking
    Given I am on the ranking page
    And a participant has completed 2 exercises and 2 quizzes
    When the participant accesses the ranking
    Then the participant must not be displayed in the ranking

  Scenario: RANK-05 - Participante com 2 quizzes não aparece no ranking
    Given I am on the ranking page
    And a participant has completed 2 quizzes
    When the participant accesses the ranking
    Then the participant must not be displayed in the ranking

  Scenario: RANK-06 - Participante com 5 exercícios aparece no ranking
    Given I am on the ranking page
    And a participant has completed 5 exercises
    When the participant accesses the ranking
    Then the participant must be displayed in the ranking

  Scenario: RANK-07 - Dados do participante são exibidos corretamente no ranking
    Given a participant is in the ranking
    When I view the participant details
    Then I must see the name, email and statistics correctly displayed

  Scenario: RANK-08 - Participante com 3 exercícios e 2 quizzes não aparece no ranking
    Given I am on the ranking page
    And a participant has completed 3 exercises and 2 quizzes
    When the participant accesses the ranking
    Then the participant must not be displayed in the ranking

  Scenario: RANK-09 - Participante com mais erros do que acertos ainda pode aparecer no ranking
    Given I am on the ranking page
    And a participant had more errors than hits in the exercises
    When the participant accesses the ranking
    Then the participant must be displayed in the ranking

  Scenario: RANK-10 - Acessibilidade por teclado no ranking com foco visível
    Given the user navigates using the keyboard only
    When the user tabs through interactive items in the ranking area
    Then each control must receive a visible focus state
    And the reading order must remain logical and predictable

  Scenario: RANK-11 - Mensagem de bloqueio e ausência de dados são exibidas com feedback visual claro
    Given the ranking has insufficient data or the user is blocked by access rules
    When the page is displayed
    Then the interface must explain the reason clearly
    And the user must understand the next action to take
