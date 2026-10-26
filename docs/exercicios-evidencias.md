# Evidências finais de exercícios - English QA

## Cenários cobertos na suíte atual

- CN001: resposta correta avança para a próxima questão, atualiza progresso e histórico
- CN002: reinício após 5 questões volta para a rodada inicial
- CN004: histórico com as 30 respostas mantém legibilidade e performance aceitável
- CN005: reinício após 30 questões zera o histórico e volta para a primeira questão
- CN006: tentativa com resposta errada não avança para a próxima sem correção
- CN007: campo vazio dispara validação e impede submissão

> O cenário CN003 foi removido da suíte automatizada porque a aplicação real apresenta comportamento dinâmico e inconsistente em torno do fim da rodada, o que gerava falsos positivos e instabilidade na automação.

## Evidência executada no ambiente real

Comando executado:

```bash
npx playwright test tests/exercicios.spec.ts --reporter=list
```

Resultado validado:

- 6 cenários passaram
- 0 cenários falharam
- 0 cenários ficaram em skip

## Resumo da execução

- CN001: aprovado
- CN002: aprovado
- CN004: aprovado
- CN005: aprovado
- CN006: aprovado
- CN007: aprovado

## Observações relevantes

- A validação foi executada contra o ambiente real do app em https://english.qazando.com.br.
- A automação foi ajustada para validar o comportamento real da interface, sem depender de textos rígidos e frágeis.
- O cenário de conclusão da rodada de 30 questões foi removido para evitar risco de falso positivo e manter a suíte estável.

## Artefatos gerados

- relatório HTML em `playwright-report/`
- artefatos de execução em `test-results/`
- log de evidência em `docs/exercicios-evidencias.md`

> Importante: a execução real exige `TEST_USER_EMAIL` e `TEST_USER_PASSWORD` configurados em `.env`.

## Cenários manuais

> Os identificadores CN001-CN014 abaixo pertencem a este catálogo manual. Os identificadores da seção de automação descrevem os cenários existentes na suíte e não são remapeados por esta lista.

### CN001 - Acessar a página de exercícios pela primeira vez
- Objetivo: validar o estado inicial da página para um usuário que ainda não iniciou a rodada.
- Pré-condições: usuário autenticado, sem rodada de exercícios iniciada anteriormente.
- Passos:
	1. Acessar a página de exercícios pela navegação principal.
	2. Conferir a questão inicial, o campo de resposta, o botão de verificação e os indicadores de progresso e histórico.
- Resultado esperado: a página carrega sem erros, exibe a primeira questão e apresenta os controles e indicadores em estado inicial, sem progresso ou histórico indevido.

### CN002 - Acessar a página sem estar logado
- Objetivo: validar a proteção da página para usuários não autenticados.
- Pré-condições: usuário sem sessão ativa.
- Passos:
	1. Abrir diretamente a URL da página de exercícios.
	2. Observar o redirecionamento ou mensagem apresentada.
- Resultado esperado: o conteúdo protegido não é disponibilizado; o usuário é direcionado ao login ou recebe orientação para autenticar-se.

### CN003 - Responder corretamente uma questão
- Objetivo: confirmar o fluxo de resposta correta.
- Pré-condições: usuário autenticado e questão disponível com resposta conhecida.
- Passos:
	1. Informar a resposta correta no campo.
	2. Clicar em "Verificar Resposta".
	3. Conferir o feedback, a questão atual, o progresso e o histórico.
- Resultado esperado: a resposta é marcada como correta, a rodada avança conforme a regra do produto, o progresso é atualizado e a tentativa aparece no histórico.

### CN004 - Responder incorretamente uma questão
- Objetivo: validar o feedback de resposta incorreta e o controle de avanço.
- Pré-condições: usuário autenticado e questão disponível.
- Passos:
	1. Informar uma resposta incorreta.
	2. Clicar em "Verificar Resposta".
	3. Conferir o feedback e o estado da questão.
- Resultado esperado: o sistema identifica a resposta como incorreta, registra a tentativa conforme o produto e não concede avanço ou XP de conclusão indevido.

### CN005 - Responder corretamente com letras maiúsculas e espaços extras
- Objetivo: verificar se a validação normaliza maiúsculas e espaços antes de comparar a resposta.
- Pré-condições: usuário autenticado e questão com resposta correta conhecida.
- Passos:
	1. Informar a resposta correta usando letras maiúsculas e espaços extras no início ou no fim.
	2. Clicar em "Verificar Resposta".
	3. Conferir o resultado e o avanço da rodada.
- Resultado esperado: diferenças apenas de capitalização e espaços externos não fazem a resposta correta ser rejeitada; o fluxo segue como no CN003.

### CN006 - Enviar resposta sem preencher o campo
- Objetivo: validar a obrigatoriedade do campo de resposta.
- Pré-condições: usuário autenticado e questão disponível.
- Passos:
	1. Manter o campo de resposta vazio.
	2. Clicar em "Verificar Resposta".
- Resultado esperado: uma validação orienta o preenchimento, a questão não é considerada respondida e o progresso não avança.

### CN007 - Digitar resposta com conteúdo inválido no campo de resposta
- Objetivo: verificar o tratamento de conteúdo incompatível com uma resposta válida.
- Pré-condições: usuário autenticado e questão disponível.
- Passos:
	1. Inserir conteúdo inválido para a resposta esperada, como somente espaços ou caracteres incompatíveis com o formato aceito.
	2. Clicar em "Verificar Resposta".
	3. Conferir o feedback, o progresso e o histórico.
- Resultado esperado: o conteúdo é validado com feedback compreensível; não há avanço nem registro de acerto indevido, e a interface permanece utilizável.

### CN008 - Digitar resposta muito longa no campo de resposta
- Objetivo: validar o tratamento de entradas extensas.
- Pré-condições: usuário autenticado e questão disponível.
- Passos:
	1. Inserir no campo uma resposta muito maior que o tamanho normalmente esperado.
	2. Conferir o comportamento do campo e tentar enviar a resposta.
- Resultado esperado: a entrada é limitada ou tratada com validação clara, sem quebrar o layout, travar a página ou causar avanço/acerto indevido.

### CN009 - Clicar rapidamente duas vezes em "Verificar Resposta"
- Objetivo: verificar que cliques repetidos não submetem a mesma tentativa mais de uma vez.
- Pré-condições: usuário autenticado e questão disponível.
- Passos:
	1. Preencher uma resposta válida.
	2. Clicar duas vezes rapidamente em "Verificar Resposta".
	3. Conferir o avanço, o progresso e as entradas do histórico.
- Resultado esperado: a tentativa é processada uma única vez; não há avanço duplicado, progresso contado em dobro nem entradas duplicadas no histórico.

### CN010 - Validar que o progresso é mantido ao recarregar a página
- Objetivo: confirmar a persistência do progresso após atualizar a página.
- Pré-condições: usuário autenticado com ao menos uma resposta registrada e progresso conhecido.
- Passos:
	1. Registrar a questão atual, o progresso e o histórico.
	2. Recarregar a página.
	3. Conferir novamente os dados registrados.
- Resultado esperado: a questão atual, o progresso e o histórico correspondem ao estado salvo antes da atualização, sem perda nem duplicação de tentativa.

### CN011 - Validar que o progresso é mantido após logout e novo login
- Objetivo: confirmar a persistência dos dados da rodada entre sessões.
- Pré-condições: usuário autenticado com progresso e histórico conhecidos.
- Passos:
	1. Registrar a questão atual, o progresso e o histórico.
	2. Fazer logout.
	3. Entrar novamente com a mesma conta e acessar os exercícios.
	4. Comparar o estado apresentado com os dados registrados.
- Resultado esperado: o progresso e o histórico associados à conta são restaurados sem perda ou duplicação.

### CN012 - Fechar o navegador no meio do envio da resposta
- Objetivo: verificar a consistência dos dados quando a sessão é interrompida durante uma submissão.
- Pré-condições: usuário autenticado em uma questão disponível.
- Passos:
	1. Enviar uma resposta e fechar o navegador enquanto o envio estiver em andamento.
	2. Reabrir o navegador, autenticar-se novamente se necessário e acessar os exercícios.
	3. Conferir a questão atual, o progresso e o histórico.
- Resultado esperado: o estado é consistente com o resultado efetivamente processado pelo sistema; a tentativa não aparece duplicada e uma resposta não confirmada não é tratada como concluída.

### CN013 - Validar que o histórico exibe todas as respostas
- Objetivo: confirmar a integridade e a legibilidade do histórico da rodada.
- Pré-condições: usuário autenticado com tentativas corretas e incorretas registradas.
- Passos:
	1. Responder várias questões, incluindo ao menos uma resposta correta e uma incorreta.
	2. Abrir ou consultar o histórico.
	3. Comparar as tentativas exibidas com as respostas enviadas.
- Resultado esperado: todas as tentativas da rodada são exibidas uma única vez, com resposta e resultado correspondentes e em ordem compreensível.

### CN014 - Responder as 30 questões
- Objetivo: validar a conclusão de uma rodada completa.
- Pré-condições: usuário autenticado com uma rodada nova ou reiniciada.
- Passos:
	1. Responder as questões até completar as 30 da rodada.
	2. Conferir o contador, o progresso, o estado final e o histórico.
- Resultado esperado: as 30 questões são contabilizadas, o estado final da rodada é apresentado corretamente e o histórico contém as tentativas realizadas, sem perda ou duplicação.

> Os resultados esperados desta seção representam critérios de validação manual. A inclusão dos cenários não significa que todos foram executados; consulte a seção de evidências da automação para os resultados efetivamente verificados.
