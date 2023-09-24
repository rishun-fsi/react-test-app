describe('回答一覧トップページ機能', () => {
  beforeEach(() => {
    cy.visit('/form-answers-table');
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

  it('回答一覧ページへの遷移', () => {
    cy.get('button').eq(2).click();
    cy.url().should('eq', 'http://localhost:3000/form-answers-table/1');
  });
});

describe('回答一覧機能', () => {
  beforeEach(() => {
    cy.visit('/form-answers-table');
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

  it('回答一覧', () => {
    cy.get('button').eq(2).click();
    cy.url().should('eq', 'http://localhost:3000/form-answers-table/1');
    cy.contains('システム名').should('exist');
  });
});

describe('CSV一括ダウンロード機能', () => {
  beforeEach(() => {
    cy.visit('/form-answers-table');
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

  it('CSVダウンロード', () => {
    cy.get('button').eq(2).click();
    cy.url().should('eq', 'http://localhost:3000/form-answers-table/1');
    cy.get('#select-small').click();
    cy.get('[data-value="allDownload"]').click();

    const formatDate = (date: Date): string => {
      return `${date.getFullYear()}-${('0' + (date.getMonth() + 1)).slice(
        -2
      )}-${('0' + date.getDate()).slice(-2)}`;
    };
    const fileName: string = `cypress/downloads/PJ健康診断アンケート_${formatDate(
      new Date()
    )}.csv`;
    cy.readFile(fileName).should('include', 'システム名');
  });
});
