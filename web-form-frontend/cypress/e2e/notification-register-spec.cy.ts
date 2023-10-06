describe('お知らせ新規登録機能', () => {
  beforeEach(() => {
    cy.visit('/notification-register');
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

  it('最初の状態では登録ボタンが非活性であること', () => {
    cy.get('button[aria-label="register"]').should('be.disabled');
  });

  it('タイトルが入力できること', () => {
    cy.get('input').eq(0).type('aaaa');
    cy.get('input').eq(0).should('have.value', 'aaaa');
  });

  it('お知らせ種別が選択できること', () => {
    cy.contains('重要').click();
    cy.contains('周知').click();
    cy.contains('周知').should('exist');
  });

  it('内容を入力できること', () => {
    cy.get('textarea').eq(0).type('aaaa');
    cy.get('textarea').eq(0).should('have.value', 'aaaa');
  });

  it('一時保存ボタンを押すと入力内容が保存されること', () => {
    cy.get('input').eq(0).type('aaaa');
    cy.contains('一時保存').click();
    cy.get('button').eq(0).click();
    cy.contains('トップ').click();
    cy.visit('/notification-register');
    cy.get('input').eq(0).should('have.value', 'aaaa');
  });

  it('登録ができること', () => {
    cy.get('input').eq(0).type('テストお知らせ1');
    cy.get('textarea').eq(0).type('テストのお知らせです。');
    cy.get('button').eq(2).click();
    cy.contains('24').click();
    cy.contains('04').click();
    cy.contains('35').click();
    cy.get('button').eq(3).click();
    cy.contains('24').click();
    cy.contains('04').click();
    cy.contains('45').click();
    cy.get('button[aria-label="register"]').click();

    cy.contains('お知らせを新規登録しました。').should('exist');
  });

  it('一時保存した内容は保存した後に消えていること', () => {
    cy.get('input').eq(0).type('テストお知らせ2');
    cy.get('textarea').eq(0).type('テストのお知らせです。');
    cy.contains('一時保存').click();
    cy.get('button[aria-label="register"]').click();
    cy.contains('お知らせを新規登録しました。').should('exist');

    cy.get('button').eq(0).click();
    cy.contains('トップ').click();
    cy.visit('/notification-register');
    cy.get('input').eq(0).should('not.have.value', 'テストお知らせ2');
  });
});
