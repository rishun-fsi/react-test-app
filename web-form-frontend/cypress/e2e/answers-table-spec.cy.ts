describe('回答一覧トップページ機能', () => {
  beforeEach(() => {
    cy.visit('/form-answers-table');
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

  it('回答一覧ページへの遷移', () => {
    cy.get('button').eq(2).click();
    cy.url().should('eq', 'http://localhost:3000/form-answers-table/1');
  });
});

describe('回答一覧機能', () => {
  beforeEach(() => {
    cy.visit('/form-answers-table');
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

  it('回答一覧', () => {
    cy.get('button').eq(2).click();
    cy.url().should('eq', 'http://localhost:3000/form-answers-table/1');
    cy.contains('システム名').should('exist');
  });
});

describe('削除機能', () => {
  beforeEach(() => {
    cy.visit('/form-answer/1');
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

    cy.get('[role="button"]').eq(0).click();
    cy.get('li').contains('システムA').click();
    cy.get('[role="button"]').eq(1).click();
    cy.get('[role="button"]').eq(2).click();
    cy.get('li').contains('1時間以内').click();
    cy.get('input[type="text"]').eq(1).type('1');
    cy.get('button').contains('回答').click();
    cy.get('button').contains('はい').click();
    cy.contains('回答の送信が完了しました。').should('exist');

    cy.get('button').eq(0).click();
    cy.contains('フォーム回答一覧').click();
    cy.get('button').eq(2).click();
  });

  it('回答の削除', () => {
    cy.contains('システムA').should('exist');
    cy.get('input').eq(-2).check();
    let targetId: string = '';

    cy.get('input')
      .eq(-2)
      .parent()
      .parent()
      .parent()
      .find('td')
      .eq(1)
      .then((el) => {
        targetId = el[0].innerText;
      });

    cy.get('#action-select').click();
    cy.get('li[data-value="delete"]').click();
    cy.get('button').contains('はい').click();
    cy.wait(2000);

    cy.get('input')
      .eq(-2)
      .parent()
      .parent()
      .parent()
      .find('td')
      .eq(1)
      .then((el) => {
        expect(el[0].innerText).not.equal(targetId);
      });
  });
});
