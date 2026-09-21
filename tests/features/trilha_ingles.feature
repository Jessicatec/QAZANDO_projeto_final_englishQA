Feature: Trilha do Inglês
  As a user of the Qazando English QA course
  I want to navigate through the progressive units and lessons
  So that I can complete lessons and gain XP in sequence

  Scenario: Visualização da grade de unidades e lições
    Given the user is on the Trilha do Inglês page
    When the page loads completely
    Then the user should see 4 progressive units
    And each unit should contain lesson cards or actions
    And the interface should be visually organized and readable

  Scenario: Desbloqueio sequencial das lições
    Given the user is on the course page
    And the first lesson is not completed yet
    When the user tries to access the next lesson before finishing the previous one
    Then the next lesson should remain blocked or visually disabled
    And the user should see a clear locked state

  Scenario: Lições concluídas geram XP
    Given the user completed a lesson successfully
    When the lesson is marked as complete
    Then the player should receive XP rewards
    And the progress indicator should be updated

  Scenario: Tentativa de avançar sem completar a etapa anterior
    Given the user opens a course unit
    And a previous lesson is still incomplete
    When the user selects a later lesson
    Then the system should prevent progression
    And the user should remain on the valid available step

  Scenario: Mensagem de validação ou erro no fluxo obrigatório
    Given the user is in a lesson flow that requires input or completion
    When the required action is not performed
    Then a validation message or error state should be displayed
    And the user should be able to retry without losing the progress already made

  Scenario: Acessibilidade por teclado e foco visível
    Given the user navigates using keyboard only
    When they tab through the interactive controls
    Then each element should receive visible focus
    And the sequence should be logical and predictable

  Scenario: Estados visuais de lição bloqueada, ativa e concluída
    Given the user views the lesson list
    When each lesson is evaluated by its state
    Then blocked lessons should be visually dimmed
    And active lessons should be highlighted
    And completed lessons should show a clear success state

  Scenario: Fluxo positivo de finalização de unidade
    Given the user completes all required lessons in sequence
    When the last lesson of the unit is completed
    Then the unit should be marked as complete
    And the next unit should unlock in the ordered progression
