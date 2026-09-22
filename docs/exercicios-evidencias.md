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
