describe('ログイン機能', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.origin(
         Cypress.env('auth_url'),
      () => {
        cy.get('input[type="button"]').eq(1).click();
      }
    );
  });

  it('正しいIDとパスワードでログインができること', () => {
    cy.origin(   Cypress.env('login_url'),() => {
      cy.get('input[placeholder="メール、電話、Skype"]').type(
        Cypress.env('login_email')
      );
      cy.get('input[type = "submit"]').contains('次へ').click();
      cy.get('input[placeholder="パスワード"]').type(Cypress.env('login_pwd'));
      cy.get('input[type = "submit"]').contains('サインイン').click();
      cy.get('input[type="button"]').click();
    });
    cy.get('div')
      .contains('プロダクト健康診断アンケートフォーム')
      .should('exist');
  });

  it('存在しないIDではログインができないこと', () => {
    cy.origin(   Cypress.env('login_url'),() => {
      cy.get('input[placeholder="メール、電話、Skype"]').type(
        'false@PJHealthcheckWebForm.onmicrosoft.com'
      );
      cy.get('input[type = "submit"]').contains('次へ').click();
      cy.get('.col-md-24.error.ext-error').should(
        'have.text',
        'このユーザー名は間違っている可能性があります。正しく入力したことをご確認ください。入力に問題がない場合は、管理者にお問い合わせください。'
      );
    });
  });

  it('パスワードが正しくない場合はログインができないこと', () => {
    cy.origin(   Cypress.env('login_url'),() => {
      cy.get('input[placeholder="メール、電話、Skype"]').type(
        Cypress.env('login_email')
      );
      cy.get('input[type = "submit"]').contains('次へ').click();
      cy.get('input[placeholder="パスワード"]').type('Healthcheck');
      cy.get('input[type = "submit"]').contains('サインイン').click();
      cy.get('.error.ext-error').should(
        'have.text',
        'アカウントまたはパスワードが正しくありません。パスワードを忘れた場合は、今すぐリセットしてください。'
      );
    });
  });
});

describe('サインアウトのテスト', () => {
  it('サインアウト', () => {
    cy.visit('/');
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
    cy.get('.MuiAvatar-root').click();
    cy.contains('サインアウト').click();
    cy.origin(
         Cypress.env('auth_url'),
      () => {
        cy.contains('Sign in with your corporate ID').should('exist');
      }
    );
  });
});
