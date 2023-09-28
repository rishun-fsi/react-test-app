describe('編集画面への到達テスト', () => {
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

  it('回答編集画面への遷移', () => {
    cy.get('button').eq(2).click();
    cy.get('input[aria-labelledby="enhanced-table-checkbox-1"]').check();
    cy.get('#action-select').click();
    cy.get('li[data-value="editAnswer"]').click();

    cy.url().should('eq', 'http://localhost:3000/form-answer-edit/1/1');
  });
});

describe('回答の編集テスト', () => {
  beforeEach(() => {
    cy.visit('/form-answer-edit/1/1');
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
    cy.get('[role="button"]').eq(0).as('systemSelect');
    cy.get('[role="button"]').eq(1).as('devEnvAccordion');
    cy.get('[role="button"]').eq(2).as('leadTimeSelect');
  });

  it('初期データとして回答が入っていること', () => {
    cy.get('@systemSelect').should('have.text', 'システムA');
    cy.get('input[type="radio"]').eq(0).should('be.checked');
  });

  it('選択形式の設問で入力できること', () => {
    cy.get('@systemSelect').click();
    cy.get('li').contains('システムB').click();
    cy.get('@systemSelect').should('have.text', 'システムB');
  });

  it('ラジオボタン形式の設問で入力できること', () => {
    cy.get('@devEnvAccordion').click();
    cy.get('input[type="radio"]').eq(1).check();
    cy.get('input[type="radio"]').eq(1).should('be.checked');
    cy.get('input[type="radio"]').eq(0).check();
    cy.get('input[type="radio"]').eq(1).should('not.be.checked');
    cy.get('input[type="radio"]').eq(0).should('be.checked');
  });

  it('チェック形式の設問で入力できること', () => {
    cy.get('@devEnvAccordion').click();
    cy.get('input[type="checkbox"]').eq(1).check();
    cy.get('input[type="checkbox"]').eq(1).should('be.checked');
    cy.get('input[type="checkbox"]').eq(1).uncheck();
    cy.get('input[type="checkbox"]').eq(1).should('not.be.checked');
  });

  it('数値形式の設問に入力できること', () => {
    cy.get('input[type="text"]').eq(1).clear();
    cy.get('input[type="text"]').eq(1).type('1');

    cy.get('input[type="text"]').eq(1).should('have.value', '1');
  });

  it('一時保存ボタンを押すと入力画面から離れても回答状況が保存されていること', () => {
    cy.get('@systemSelect').click();
    cy.get('li').contains('システムC').click();
    cy.get('@devEnvAccordion').click();
    cy.get('input[type="radio"]').eq(1).check();
    cy.get('input[type="checkbox"]').eq(4).check();
    cy.get('input[type="text"]').eq(0).type('aaa');
    cy.get('button').contains('一時保存').click();
    cy.contains('回答を一時的に保存しました。').should('exist');

    cy.visit('/');
    cy.visit('/form-answer-edit/1/1');
    cy.get('@devEnvAccordion').click();

    cy.get('@systemSelect').should('have.text', 'システムC');
    cy.get('input[type="radio"]').eq(1).should('be.checked');
    cy.get('input[type="checkbox"]').eq(4).should('be.checked');
    cy.get('input[type="text"]').eq(0).should('have.value', 'aaa');
  });

  it('一時保存した内容は同一の回答の編集ページでのみ有効であること', () => {
    cy.get('@systemSelect').click();
    cy.get('li').contains('システムB').click();
    cy.get('button').contains('一時保存').click();

    cy.visit('/');
    cy.visit('/form-answer-edit/1/3');
    cy.get('@systemSelect').should('not.have.text', 'システムB');
    cy.get('@systemSelect').should('have.text', 'システムA');
    cy.get('input[type="radio"]').eq(0).should('be.checked');
    cy.get('input[type="radio"]').eq(1).should('not.be.checked');
    cy.get('input[type="checkbox"]').eq(0).should('not.be.checked');
    cy.get('input[type="checkbox"]').eq(1).should('not.be.checked');
    cy.get('input[type="checkbox"]').eq(2).should('be.checked');
    cy.get('input[type="checkbox"]').eq(3).should('not.be.checked');
    cy.get('input[type="checkbox"]').eq(4).should('not.be.checked');
    cy.get('@leadTimeSelect').should('have.text', '1日以内');
    cy.get('input[type="text"]').eq(1).should('have.value', '20');
  });

  it('回答を送信したときに保存した内容が反映されること', () => {
    cy.get('@systemSelect').click();
    cy.get('li').contains('システムB').click();
    cy.get('@devEnvAccordion').click();
    cy.get('input[type="radio"]').eq(1).check();
    cy.get('input[type="checkbox"]').eq(2).check();
    cy.get('@leadTimeSelect').click();
    cy.get('li').contains('1日以内').click();
    cy.get('input[type="text"]').eq(1).clear();
    cy.get('input[type="text"]').eq(1).type('1');
    cy.get('button').contains('編集').click();
    cy.get('button').contains('はい').click();
    cy.contains('回答の送信が完了しました。').should('exist');
    cy.url().should('eq', 'http://localhost:3000/form-answers-table/1');

    cy.visit('/form-answer-edit/1/1');
    cy.get('@systemSelect').should('not.have.value', 'システムB');
    cy.get('input[type="radio"]').eq(0).should('not.be.checked');
    cy.get('input[type="radio"]').eq(1).should('be.checked');
    cy.get('input[type="checkbox"]').eq(0).should('be.checked');
    cy.get('input[type="checkbox"]').eq(1).should('not.be.checked');
    cy.get('input[type="checkbox"]').eq(2).should('be.checked');
    cy.get('input[type="checkbox"]').eq(3).should('not.be.checked');
    cy.get('input[type="checkbox"]').eq(4).should('not.be.checked');
    cy.get('@leadTimeSelect').should('have.text', '1日以内');
  });

  after(() => {
    cy.visit('/form-answer-edit/1/1');
    cy.origin(
      'https://pj-healthcheck-web-form.auth.ap-northeast-1.amazoncognito.com',
      () => {}
    );

    cy.get('[role="button"]').eq(0).click();
    cy.get('li').contains('システムA').click();
    cy.get('[role="button"]').eq(1).click();
    cy.get('input[type="radio"]').eq(0).check();
    cy.get('input[type="checkbox"]').eq(2).uncheck();
    cy.get('[role="button"]').eq(2).click();
    cy.get('li').contains('1時間以内').click();

    cy.get('button').contains('編集').click();
    cy.get('button').contains('はい').click();
    cy.contains('回答の送信が完了しました。').should('exist');
  });
});
