describe('アンケート回答機能', () => {
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
    cy.get('[role="button"]').eq(0).as('systemSelect');
    cy.get('[role="button"]').eq(1).as('devEnvAccordion');
  });

  it('選択形式の設問で入力できること', () => {
    cy.get('@systemSelect').click();
    cy.get('li').contains('システムA').click();
    cy.get('@systemSelect').should('have.text', 'システムA');
  });

  it('グループ化された質問を開けること', () => {
    cy.get('div').contains('開発手法').should('not.be.visible');
    cy.get('@devEnvAccordion').click();
    cy.get('div').contains('開発手法').should('be.visible');
  });

  it('ラジオボタン形式の設問で入力できること', () => {
    cy.get('@devEnvAccordion').click();
    cy.get('input[type="radio"]').eq(0).check();
    cy.get('input[type="radio"]').eq(0).should('be.checked');
    cy.get('input[type="radio"]').eq(1).check();
    cy.get('input[type="radio"]').eq(0).should('not.be.checked');
    cy.get('input[type="radio"]').eq(1).should('be.checked');
  });

  it('チェック形式の設問で入力できること', () => {
    cy.get('@devEnvAccordion').click();
    cy.get('input[type="checkbox"]').eq(0).check();
    cy.get('input[type="checkbox"]').eq(0).should('be.checked');
    cy.get('input[type="checkbox"]').eq(1).check();
    cy.get('input[type="checkbox"]').eq(0).should('be.checked');
    cy.get('input[type="checkbox"]').eq(1).should('be.checked');
    cy.get('input[type="checkbox"]').eq(1).uncheck();
    cy.get('input[type="checkbox"]').eq(1).should('not.be.checked');
  });

  it('チェック形式の記述式選択肢に記述したらチェックされること', () => {
    cy.get('@devEnvAccordion').click();
    cy.get('input[type="text"]').eq(0).type('aaa');
    cy.get('input[type="checkbox"]').eq(4).should('be.checked');
    cy.get('input[type="checkbox"]').eq(4).uncheck();
    cy.get('input[type="checkbox"]').eq(4).should('not.have.value');
  });

  it('チェック形式の記述式選択肢の記述をクリアするとチェックが外れること', () => {
    cy.get('@devEnvAccordion').click();
    cy.get('input[type="text"]').eq(0).type('aaa');
    cy.get('input[type="text"]').clear();
    cy.get('input[type="checkbox"]').eq(4).should('not.be.checked');
  });

  it('数値形式の設問に入力できること', () => {
    cy.get('input[type="text"]').eq(1).type('1');

    cy.get('input[type="text"]').eq(1).should('have.value', '1');
  });

  it('数値形式の質問に数値以外が入力された場合にバリデーションエラーが出ること', () => {
    cy.get('input[type="text"]').eq(1).type('aaa');
    cy.contains('数字で回答を入力してください。').should('exist');
  });

  it('数値形式は先頭と末尾のどちらかが小数点の場合にバリデーションエラーが出ること', () => {
    cy.get('input[type="text"]').eq(1).type('1.');
    cy.contains('数字で回答を入力してください。').should('exist');

    cy.get('input[type="text"]').eq(1).clear();
    cy.get('input[type="text"]').eq(1).type('.1');
    cy.contains('数字で回答を入力してください。').should('exist');
  });

  it('必須項目が全て充足されていないと非活性になっていること', () => {
    cy.get('button').contains('回答').should('be.disabled');
  });

  it('必須項目が充足されると回答ボタンが活性化すること', () => {
    cy.get('@systemSelect').click();
    cy.get('li').contains('システムA').click();
    cy.get('@devEnvAccordion').click();
    cy.get('input[type="radio"]').eq(0).check();
    cy.get('[role="button"]').eq(2).click();
    cy.get('li').contains('1時間以内').click();
    cy.get('input[type="text"]').eq(1).type('1');
    cy.get('button').contains('回答').should('not.be.disabled');
  });

  it('回答ボタンを押すと回答送信確認モーダルが表示されることの確認', () => {
    cy.get('@systemSelect').click();
    cy.get('li').contains('システムA').click();
    cy.get('@devEnvAccordion').click();
    cy.get('input[type="radio"]').eq(0).check();
    cy.get('[role="button"]').eq(2).click();
    cy.get('li').contains('1時間以内').click();
    cy.get('input[type="text"]').eq(1).type('1');
    cy.get('button').contains('回答').click();
    cy.contains('回答を提出してよろしいですか？').should('exist');
  });

  it('モーダルではいを押すと回答が送信されたスナックバーが表示されること', () => {
    cy.get('@systemSelect').click();
    cy.get('li').contains('システムA').click();
    cy.get('@devEnvAccordion').click();
    cy.get('input[type="radio"]').eq(0).check();
    cy.get('[role="button"]').eq(2).click();
    cy.get('li').contains('1時間以内').click();
    cy.get('input[type="text"]').eq(1).type('1');
    cy.get('button').contains('回答').click();
    cy.get('button').contains('はい').click();
    cy.contains('回答の送信が完了しました。').should('exist');
  });

  it('モーダルでいいえを押すと回答画面に戻ること', () => {
    cy.get('@systemSelect').click();
    cy.get('li').contains('システムA').click();
    cy.get('@devEnvAccordion').click();
    cy.get('input[type="radio"]').eq(0).check();
    cy.get('[role="button"]').eq(2).click();
    cy.get('li').contains('1時間以内').click();
    cy.get('input[type="text"]').eq(1).type('1');
    cy.get('button').contains('回答').click();
    cy.get('button').contains('いいえ').click();
    cy.contains('回答を提出してよろしいですか？').should('not.exist');
  });

  it('回答がない状態では一時保存ボタンが非活性であること', () => {
    cy.get('button').contains('一時保存').should('be.disabled');
  });

  it('一時保存ボタンを押すと入力画面から離れても回答状況が保存されていること', () => {
    cy.get('@systemSelect').click();
    cy.get('li').contains('システムA').click();
    cy.get('@devEnvAccordion').click();
    cy.get('input[type="radio"]').eq(0).check();
    cy.get('input[type="checkbox"]').eq(0).check();
    cy.get('input[type="text"]').eq(0).type('aaa');
    cy.get('input[type="text"]').eq(1).type('1');
    cy.get('button').contains('一時保存').click();
    cy.contains('回答を一時的に保存しました。').should('exist');

    cy.visit('/');
    cy.visit('/form-answer/1');
    cy.get('@devEnvAccordion').click();

    cy.get('@systemSelect').should('have.text', 'システムA');
    cy.get('input[type="radio"]').eq(0).should('be.checked');
    cy.get('input[type="checkbox"]').eq(0).should('be.checked');
    cy.get('input[type="checkbox"]').eq(4).should('be.checked');
    cy.get('input[type="text"]').eq(0).should('have.value', 'aaa');
    cy.get('input[type="text"]').eq(1).should('have.value', '1');
  });

  it('回答を送信したときに一時保存した内容が破棄されること', () => {
    cy.get('@systemSelect').click();
    cy.get('li').contains('システムA').click();
    cy.get('button').contains('一時保存').click();
    cy.get('@devEnvAccordion').click();
    cy.get('input[type="radio"]').eq(0).check();
    cy.get('[role="button"]').eq(2).click();
    cy.get('li').contains('1時間以内').click();
    cy.get('input[type="text"]').eq(1).type('1');
    cy.get('button').contains('回答').click();
    cy.get('button').contains('はい').click();
    cy.contains('回答の送信が完了しました。').should('exist');

    cy.visit('/');
    cy.visit('/form-answer/1');
    cy.get('@systemSelect').should('not.have.text', 'システムA');
  });
});
