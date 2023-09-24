describe('フォーム管理機能', () => {
  beforeEach(() => {
    cy.visit('/form-management');
    cy.origin(
         Cypress.env('auth_url'),
      () => {
        cy.get('input[type="button"]').eq(1).click();
      }
    );
    cy.origin(   Cypress.env('login_url'),() => {
      cy.get('input[placeholder="メール、電話、Skype"]').type(
        Cypress.env('login_email')
      );
      cy.get('input[type = "submit"]').contains('次へ').click();
      cy.get('input[placeholder="パスワード"]').type(Cypress.env('login_pwd'));
      cy.get('input[type = "submit"]').contains('サインイン').click();
      cy.get('input[type="button"]').click();
    });
    cy.origin(
         Cypress.env('auth_url'),
      () => {}
    );
  });

  it('新規作成ページへの遷移', () => {
    cy.get('button').eq(2).click();
    cy.url().should('eq', 'http://localhost:3000/form-management/new');
  });

  it('編集ページへの遷移', () => {
    cy.get('button').contains('編集').eq(0).click();
    cy.url().should('eq', 'http://localhost:3000/form-edit/1');
  });
});
