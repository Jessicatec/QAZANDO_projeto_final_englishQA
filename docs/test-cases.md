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
