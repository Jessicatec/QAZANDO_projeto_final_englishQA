Feature: Documentação
  As a user of the English QA platform
  I want to access the documentation page
  So that I can understand the product, business rules and test users available for validation

  Scenario: Visualização da página de documentação
    Given the user is authenticated and on the documentation page
    Then the heading "Documentação" should be visible
    And the overview paragraph should describe the purpose of the platform
    And the feature list and test user table should be displayed

  Scenario: Expansão de uma funcionalidade no accordion
    Given the user is on the documentation page
    When the user expands the "Cadastro e Acesso Gratuito" section
    Then the business rules list should be displayed
    And the rules should include email validation and login restrictions

  Scenario: Listagem de usuários de teste para validação
    Given the user is on the documentation page
    Then the test user table should show the profiles admin, premium active, common user and email unconfirmed

  Scenario: Navegação por teclado dentro dos cards de documentação
    Given the user is on the documentation page
    When the user tabs through the interactive feature cards
    Then the focused card should change visually and remain accessible
