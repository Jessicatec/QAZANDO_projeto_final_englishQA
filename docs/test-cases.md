# Casos de teste resumidos - Trilha do Inglês Qazando

## 1. Visualização da grade de unidades
- Objetivo: verificar a apresentação inicial da jornada de aprendizagem.
- Pré-condições: usuário acessa a página da trilha de inglês.
- Passos:
  1. Abrir a URL da página.
  2. Observar a área principal de unidades.
  3. Validar a presença de 4 unidades e lições.
- Resultado esperado: layout com unidades progressivas, lições visíveis e elementos interativos legíveis.

## 2. Desbloqueio sequencial de lições
- Objetivo: validar que não é possível pular etapas.
- Pré-condições: usuário na página do curso.
- Passos:
  1. Identificar a lição atual.
  2. Tentar abrir uma lição seguinte sem concluir a anterior.
  3. Observar o estado da lição.
- Resultado esperado: lição bloqueada ou desabilitada, com feedback visual claro.

## 3. Conclusão de lição e XP
- Objetivo: validar a recompensa de experiência.
- Pré-condições: usuário em uma lição disponível.
- Passos:
  1. Concluir a lição com sucesso.
  2. Verificar os indicadores de progresso.
  3. Observar o XP ganho.
- Resultado esperado: a lição passa para concluída, nova pontuação aparece e o progresso atualiza.

## 4. Validação de fluxo obrigatório
- Objetivo: verificar feedback para ação obrigatória não executada.
- Pré-condições: usuário em um passo do módulo que exige resposta ou conclusão.
- Passos:
  1. Tentar avançar sem concluir a etapa.
  2. Observar a mensagem exibida.
- Resultado esperado: erro ou validação informando o problema e permitindo nova tentativa.

## 5. Acessibilidade e foco visual
- Objetivo: garantir navegação por teclado.
- Pré-condições: página carregada.
- Passos:
  1. Usar tab para navegar nos elementos.
  2. Observar foco em botões e links.
- Resultado esperado: foco visível, ordem lógica e sem elementos inacessíveis.

## 6. Estados visuais da lição
- Objetivo: confirmar distinção dos estados possíveis.
- Pré-condições: página com unidade ativa.
- Passos:
  1. Inspecionar lições bloqueadas, ativas e concluídas.
  2. Comparar como cada uma é representada visualmente.
- Resultado esperado: diferenças claras para cada estado.

## 7. Falha na lição bloqueia avanço
- Objetivo: verificar que uma lição errada impede o desbloqueio da próxima etapa.
- Pré-condições: usuário acessa uma lição disponível e ainda não concluída.
- Passos:
  1. Iniciar uma lição do módulo.
  2. Responder incorretamente toda a lição ou falhar a etapa principal.
  3. Observar o estado da próxima lição.
- Resultado esperado: a lição falhada permanece bloqueada ou não concede avanço; a próxima lição continua indisponível até nova tentativa bem-sucedida.

## 8. Fluxo positivo de unidade
- Objetivo: validar avanço completo da unidade.
- Pré-condições: todas as lições anteriores concluídas.
- Passos:
  1. Finalizar a última lição da unidade.
  2. Observar a liberação da próxima unidade.
- Resultado esperado: unidade marcada como concluída e próxima etapa desbloqueada.

## Cenários manuais detalhados

### CN01 - Validar que não existem erros ortográficos na Trilha do Inglês
- Objetivo: verificar a correção ortográfica e gramatical dos textos apresentados na trilha.
- Pré-condições: usuário autenticado e página da Trilha do Inglês acessível.
- Passos:
  1. Percorrer os títulos, descrições, instruções, botões e mensagens das unidades e lições.
  2. Conferir acentuação, ortografia, concordância e consistência dos textos.
- Resultado esperado: nenhum erro ortográfico ou gramatical; textos legíveis e consistentes.

### CN02 - Validar desbloqueio da próxima lição após conclusão
- Objetivo: confirmar que concluir uma lição libera a próxima lição da sequência.
- Pré-condições: usuário autenticado com uma lição disponível e a lição seguinte bloqueada.
- Passos:
  1. Abrir a lição disponível e concluí-la com sucesso.
  2. Retornar à visão da unidade.
  3. Conferir o estado da próxima lição.
- Resultado esperado: a lição concluída é marcada como concluída e a próxima lição é desbloqueada.

### CN03 - Validar concessão de XP ao completar uma lição
- Objetivo: verificar que a conclusão bem-sucedida concede a quantidade de XP prevista.
- Pré-condições: usuário autenticado com uma lição disponível e saldo de XP conhecido.
- Passos:
  1. Registrar o saldo de XP antes da tentativa.
  2. Concluir a lição com sucesso.
  3. Conferir a confirmação e o saldo atualizado.
- Resultado esperado: o sistema concede o XP previsto para a lição e apresenta o saldo atualizado.

### CN04 - Validar exibição correta do total de XP
- Objetivo: confirmar que o total exibido corresponde aos pontos de experiência acumulados.
- Pré-condições: usuário autenticado com histórico de XP conhecido.
- Passos:
  1. Registrar os XP recebidos nas lições concluídas.
  2. Somar os valores registrados.
  3. Comparar a soma com o total de XP exibido na trilha.
- Resultado esperado: o total de XP exibido corresponde à soma dos XP concedidos ao usuário.

### CN05 - Validar progresso total de 100% após concluir todas as lições
- Objetivo: verificar que a conclusão de todas as lições atualiza o progresso geral para completo.
- Pré-condições: usuário autenticado com todas as lições da trilha disponíveis.
- Passos:
  1. Concluir todas as lições de todas as unidades.
  2. Retornar à visão geral da trilha.
  3. Conferir o indicador de progresso geral.
- Resultado esperado: todas as lições aparecem como concluídas e o progresso total é exibido como 100% ou equivalente.

### CN06 - Validar consistência do progresso total entre as unidades
- Objetivo: verificar se o progresso geral corresponde ao estado de conclusão das lições em cada unidade.
- Pré-condições: usuário autenticado com todas as lições concluídas.
- Passos:
  1. Conferir o progresso exibido para cada unidade.
  2. Conferir a quantidade de lições concluídas e o progresso geral da trilha.
- Resultado esperado: os indicadores das unidades e o progresso geral são consistentes; com todas as lições concluídas, a trilha permanece em 100%.

### CN07 - Validar retenção de XP em caso de falha ou desistência
- Objetivo: confirmar que falhar ou desistir de uma lição não remove XP já conquistado nem concede a recompensa da lição incompleta.
- Pré-condições: usuário autenticado com saldo de XP conhecido e uma lição ainda não concluída.
- Passos:
  1. Registrar o saldo de XP atual.
  2. Iniciar uma lição e falhar ou desistir antes da conclusão.
  3. Conferir o saldo e o estado da lição.
- Resultado esperado: o XP já acumulado é mantido, nenhum XP de conclusão é concedido pela lição incompleta e a lição continua disponível para nova tentativa.

### CN08 - Validar bloqueio da próxima lição enquanto a anterior não for concluída
- Objetivo: garantir o desbloqueio sequencial das lições.
- Pré-condições: usuário autenticado com uma lição anterior pendente e a próxima lição bloqueada.
- Passos:
  1. Tentar abrir a próxima lição sem concluir a anterior.
  2. Conferir o estado da lição e qualquer mensagem apresentada.
- Resultado esperado: a próxima lição permanece bloqueada e o usuário recebe indicação clara de que deve concluir a lição anterior.

### CN09 - Validar tentativa de refazer uma lição já concluída
- Objetivo: verificar o comportamento ao reabrir uma lição concluída e evitar duplicidade indevida de progresso ou XP.
- Pré-condições: usuário autenticado com uma lição concluída e saldo de XP registrado.
- Passos:
  1. Abrir novamente a lição concluída.
  2. Refazer e finalizar a lição, se o sistema permitir.
  3. Conferir o estado de conclusão, o progresso e o total de XP.
- Resultado esperado: o estado concluído é preservado; refazer a lição não duplica o progresso nem concede XP adicional, salvo se essa regra estiver explicitamente prevista pelo produto.

### CN10 - Validar persistência do progresso após logout
- Objetivo: confirmar que o progresso e o XP do usuário são mantidos após encerrar e iniciar uma nova sessão.
- Pré-condições: usuário autenticado com progresso e saldo de XP registrados.
- Passos:
  1. Registrar as lições concluídas, o progresso e o total de XP.
  2. Fazer logout.
  3. Fazer login novamente com o mesmo usuário e acessar a Trilha do Inglês.
  4. Comparar os dados exibidos com os valores registrados antes do logout.
- Resultado esperado: lições concluídas, progresso e total de XP permanecem iguais após o novo login.

### CN11 - Validar exibição do progresso ao concluir uma unidade
- Objetivo: verificar a atualização do progresso da unidade após a conclusão de todas as suas lições.
- Pré-condições: usuário autenticado com uma unidade em andamento e todas as lições necessárias disponíveis.
- Passos:
  1. Concluir todas as lições da unidade.
  2. Retornar à visão geral da trilha.
  3. Conferir o estado da unidade e o progresso geral.
- Resultado esperado: a unidade aparece como concluída, seu progresso é atualizado corretamente e a próxima unidade é liberada conforme a regra do produto.
