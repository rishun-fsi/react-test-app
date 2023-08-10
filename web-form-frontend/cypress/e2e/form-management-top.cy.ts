describe('フォーム管理機能', () => {
  beforeEach(() => {
    cy.visit('/form-management');
  });

  it('新規作成ページへの遷移', () => {
    cy.get('button').eq(1).click();
    cy.url().should('eq', 'http://localhost:3000/form-management/new');
  });

  it('編集ページへの遷移', () => {
    cy.get('button').contains('編集').eq(0).click();
    cy.url().should('eq', 'http://localhost:3000/form-edit/1');
  });
});
