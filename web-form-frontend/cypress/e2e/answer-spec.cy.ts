describe('アンケート回答機能', () => {
  beforeEach(() => {
    cy.visit('/');
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
    cy.get('input[type="text"]').type('aaa');
    cy.get('input[type="checkbox"]').eq(4).should('be.checked');
    cy.get('input[type="checkbox"]').eq(4).uncheck();
    cy.get('input[type="checkbox"]').eq(4).should('not.have.value');
  });

  it('チェック形式の記述式選択肢の記述をクリアするとチェックが外れること', () => {
    cy.get('@devEnvAccordion').click();
    cy.get('input[type="text"]').type('aaa');
    cy.get('input[type="text"]').clear();
    cy.get('input[type="checkbox"]').eq(4).should('not.be.checked');
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
    cy.get('button').contains('回答').should('not.be.disabled');
  });

  it('回答ボタンを押すと回答送信確認モーダルが表示されることの確認', () => {
    cy.get('@systemSelect').click();
    cy.get('li').contains('システムA').click();
    cy.get('@devEnvAccordion').click();
    cy.get('input[type="radio"]').eq(0).check();
    cy.get('[role="button"]').eq(2).click();
    cy.get('li').contains('1時間以内').click();
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
    cy.get('button').contains('回答').click();
    cy.get('button').contains('いいえ').click();
    cy.contains('回答を提出してよろしいですか？').should('not.exist');
  });
});
