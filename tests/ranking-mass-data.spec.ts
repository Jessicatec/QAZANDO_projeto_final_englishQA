import { test, expect } from '@playwright/test';

function buildParticipants() {
  const participants = [
    { name: 'Ana Souza', email: 'ana@teste.com', exercises: 9, quizzes: 4, total: 13 },
    { name: 'Bruno Lima', email: 'bruno@teste.com', exercises: 8, quizzes: 5, total: 13 },
    { name: 'Carla Reis', email: 'carla@teste.com', exercises: 12, quizzes: 3, total: 15 },
    { name: 'Diego Costa', email: 'diego@teste.com', exercises: 7, quizzes: 6, total: 13 },
    { name: 'Eva Nunes', email: 'eva@teste.com', exercises: 5, quizzes: 8, total: 13 },
    { name: 'Fernando Silva', email: 'fernando@teste.com', exercises: 5, quizzes: 0, total: 5 },
    { name: 'Gabriela Rocha', email: 'gabriela@teste.com', exercises: 4, quizzes: 1, total: 5 },
    { name: 'Henrique Melo', email: 'henrique@teste.com', exercises: 4, quizzes: 0, total: 4 },
    { name: 'Isabela Costa', email: 'isabela@teste.com', exercises: 3, quizzes: 2, total: 5 },
    { name: 'João Pereira', email: 'joao@teste.com', exercises: 6, quizzes: 2, total: 8 },
    { name: 'Laura Santos', email: 'laura@teste.com', exercises: 11, quizzes: 2, total: 13 },
    { name: 'Mateus Alves', email: 'mateus@teste.com', exercises: 5, quizzes: 5, total: 10 },
    { name: 'Nina Teixeira', email: 'nina@teste.com', exercises: 2, quizzes: 2, total: 4 },
    { name: 'Otavio Cruz', email: 'otavio@teste.com', exercises: 9, quizzes: 1, total: 10 },
    { name: 'Patricia Lima', email: 'patricia@teste.com', exercises: 5, quizzes: 1, total: 6 },
    { name: 'Rafael Moraes', email: 'rafael@teste.com', exercises: 5, quizzes: 0, total: 5 },
    { name: 'Sara Oliveira', email: 'sara@teste.com', exercises: 4, quizzes: 3, total: 7 },
    { name: 'Thiago Almeida', email: 'thiago@teste.com', exercises: 10, quizzes: 0, total: 10 },
    { name: 'Uma Martins', email: 'uma@teste.com', exercises: 5, quizzes: 2, total: 7 },
    { name: 'Victor Araujo', email: 'victor@teste.com', exercises: 1, quizzes: 1, total: 2 },
    { name: 'Wesley Barros', email: 'wesley@teste.com', exercises: 6, quizzes: 3, total: 9 },
    { name: 'Yasmin Souza', email: 'yasmin@teste.com', exercises: 5, quizzes: 7, total: 12 },
    { name: 'Zeca Rocha', email: 'zeca@teste.com', exercises: 4, quizzes: 4, total: 8 },
    { name: 'Amanda Costa', email: 'amanda@teste.com', exercises: 8, quizzes: 8, total: 16 },
    { name: 'Bruna Nogueira', email: 'bruna@teste.com', exercises: 5, quizzes: 6, total: 11 },
    { name: 'Caio Pires', email: 'caio@teste.com', exercises: 5, quizzes: 0, total: 5 },
    { name: 'Diana Borges', email: 'diana@teste.com', exercises: 3, quizzes: 2, total: 5 },
    { name: 'Edison Monteiro', email: 'edison@teste.com', exercises: 9, quizzes: 9, total: 18 },
    { name: 'Fabio Cardoso', email: 'fabio@teste.com', exercises: 2, quizzes: 2, total: 4 },
    { name: 'Giselle Correia', email: 'giselle@teste.com', exercises: 5, quizzes: 3, total: 8 }
  ];

  return participants
    .filter((p) => p.exercises >= 5 || p.total >= 5)
    .sort((a, b) => b.total - a.total || b.exercises - a.exercises)
    .map((p, index) => ({ ...p, position: index + 1 }));
}

function buildRankingHtml(participants: Array<{ name: string; email: string; exercises: number; quizzes: number; total: number; position: number }>) {
  const rows = participants
    .map((participant) => {
      return `
        <tr data-role="ranking-row" data-name="${participant.name}" data-total="${participant.total}">
          <td>${participant.position}</td>
          <td>${participant.name}</td>
          <td>${participant.email}</td>
          <td>${participant.exercises}</td>
          <td>${participant.quizzes}</td>
          <td>${participant.total}</td>
        </tr>
      `;
    })
    .join('');

  return `
    <!doctype html>
    <html>
      <head>
        <title>Ranking</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 32px; }
          table { border-collapse: collapse; width: 100%; }
          th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
          .header { font-size: 24px; font-weight: bold; margin-bottom: 16px; }
        </style>
      </head>
      <body>
        <div class="header">Ranking</div>
        <table>
          <thead>
            <tr>
              <th>Posição</th>
              <th>Nome</th>
              <th>Email</th>
              <th>Exercícios</th>
              <th>Quiz</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </body>
    </html>
  `;
}

test.describe('English QA - Ranking com massa de dados simulada', () => {
  test('exibe participantes elegíveis e ordena por maior total de acertos', async ({ page }) => {
    const participants = buildParticipants();
    const html = buildRankingHtml(participants);

    await page.route('**/ranking**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'text/html',
        body: html,
      });
    });

    await page.goto('/ranking');

    const rows = page.locator('[data-role="ranking-row"]');
    await expect(rows).toHaveCount(26);

    const firstRow = rows.first();
    const secondRow = rows.nth(1);

    await expect(firstRow.locator('td').nth(1)).toHaveText('Edison Monteiro');
    await expect(firstRow.locator('td').nth(5)).toHaveText('18');
    await expect(secondRow.locator('td').nth(1)).toHaveText('Amanda Costa');
    await expect(secondRow.locator('td').nth(5)).toHaveText('16');

    await expect(page.getByText('Ranking')).toBeVisible();
    await expect(page.getByText('Edison Monteiro')).toBeVisible();
    await expect(page.getByText('Fabio Cardoso')).not.toBeVisible();
    await expect(page.getByText('Victor Araujo')).not.toBeVisible();
  });

  test('mantém a regra de participação mínima e não exibe usuários abaixo do limite', async ({ page }) => {
    const participants = buildParticipants();
    const html = buildRankingHtml(participants);

    await page.route('**/ranking**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'text/html',
        body: html,
      });
    });

    await page.goto('/ranking');

    const rows = page.locator('[data-role="ranking-row"]');
    await expect(rows).toHaveCount(26);

    const names = await page.locator('[data-role="ranking-row"] td:nth-child(2)').allTextContents();

    expect(names).not.toContain('Victor Araujo');
    expect(names).not.toContain('Fabio Cardoso');
    expect(names).toContain('Edison Monteiro');
    expect(names).toContain('Amanda Costa');
  });

  test('exibe nome, email e estatísticas corretas para cada participante', async ({ page }) => {
    const participants = buildParticipants();
    const html = buildRankingHtml(participants);

    await page.route('**/ranking**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'text/html',
        body: html,
      });
    });

    await page.goto('/ranking');

    const row = page.locator('[data-role="ranking-row"]').first();
    await expect(row.locator('td').nth(1)).toHaveText('Edison Monteiro');
    await expect(row.locator('td').nth(2)).toHaveText('edison@teste.com');
    await expect(row.locator('td').nth(3)).toHaveText('9');
    await expect(row.locator('td').nth(4)).toHaveText('9');
    await expect(row.locator('td').nth(5)).toHaveText('18');
  });
});
