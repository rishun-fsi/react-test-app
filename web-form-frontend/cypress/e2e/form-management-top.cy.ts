describe('フォーム管理機能', () => {
  beforeEach(() => {
    cy.visit('/form-management');
    cy.origin(
      'https://pj-healthcheck-web-form.auth.ap-northeast-1.amazoncognito.com',
      () => {
        cy.get('input[type="button"]').eq(1).click();
      }
    );
    cy.origin('https://login.microsoftonline.com', () => {
      cy.get('input[placeholder="メール、電話、Skype"]').type(
        'test@PJHealthcheckWebForm.onmicrosoft.com'
      );
      cy.get('input[type = "submit"]').contains('次へ').click();
      cy.get('input[placeholder="パスワード"]').type('Healthcheck@123');
      cy.get('input[type = "submit"]').contains('サインイン').click();
      cy.get('input[type="button"]').click();
    });
    cy.origin(
      'https://pj-healthcheck-web-form.auth.ap-northeast-1.amazoncognito.com',
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
