describe('アンケートフォームの新規作成機能', () => {
  beforeEach(() => {
    cy.visit('/form-management/new');
  });

  it('アンケート名の入力', () => {
    cy.contains('アンケート名').parent().find('input').type('aaa');
  });

  it('プルダウンの設問が増やせること', () => {
    cy.get('button').contains('質問項目追加').click();
    cy.get('li').contains('プルダウン').click();
    cy.contains('プルダウン').should('exist');
  });

  it('チェックボックスの設問が増やせること', () => {
    cy.get('button').contains('質問項目追加').click();
    cy.get('li').contains('チェックボックス').click();
    cy.contains('チェックボックス').should('exist');
  });

  it('ラジオボタンの設問が増やせること', () => {
    cy.get('button').contains('質問項目追加').click();
    cy.get('li').contains('ラジオボタン').click();
    cy.contains('ラジオボタン').should('exist');
  });

  it('テキストの設問が増やせること', () => {
    cy.get('button').contains('質問項目追加').click();
    cy.get('li').contains('テキスト').click();

    cy.contains('テキスト').should('exist');
    cy.contains('選択肢').should('not.exist');
  });

  it('見出しに入力できること', () => {
    cy.get('button').contains('質問項目追加').click();
    cy.get('li').contains('プルダウン').click();

    cy.contains('見出し').parent().find('input').type('aaaa');
    cy.contains('質問1: aaaa').should('exist');
  });

  it('質問文に入力ができること', () => {
    cy.get('button').contains('質問項目追加').click();
    cy.get('li').contains('プルダウン').click();

    cy.contains('質問文').parent().find('textarea').eq(0).type('aaaa');
  });

  it('必須のON/OFFを切り替えられること', () => {
    cy.get('button').contains('質問項目追加').click();
    cy.get('li').contains('プルダウン').click();

    cy.get('input[type="checkbox"]').eq(0).check();
    cy.get('input[type="checkbox"]').eq(0).should('be.checked');
    cy.get('input[type="checkbox"]').eq(0).uncheck();
    cy.get('input[type="checkbox"]').eq(0).should('not.be.checked');
  });

  it('前回回答の反映のON/OFFを切り替えられること', () => {
    cy.get('button').contains('質問項目追加').click();
    cy.get('li').contains('プルダウン').click();

    cy.get('input[type="checkbox"]').eq(1).check();
    cy.get('input[type="checkbox"]').eq(1).should('be.checked');
    cy.get('input[type="checkbox"]').eq(1).uncheck();
    cy.get('input[type="checkbox"]').eq(1).should('not.be.checked');
  });

  it('選択肢を増やせること', () => {
    cy.get('button').contains('質問項目追加').click();
    cy.get('li').contains('プルダウン').click();

    cy.get('input[type="text"]').eq(2).type('選択肢1');
    cy.get('button').eq(1).click();
    cy.get('input[type="text"]').eq(2).should('have.value', '選択肢1');
    cy.contains('記述式').should('exist');

    cy.get('input[type="text"]').eq(3).type('選択肢2{enter}');
    cy.get('input[type="text"]').eq(3).should('have.value', '選択肢2');
    cy.get('input[type="checkbox"]').its('length').should('eq', 4);
  });

  it('選択肢を削除できること', () => {
    cy.get('button').contains('質問項目追加').click();
    cy.get('li').contains('プルダウン').click();

    cy.get('input[type="text"]').eq(2).type('選択肢1{enter}');
    cy.get('button[aria-label="削除"]').eq(0).click();
    cy.contains('選択肢1').should('not.exist');

    cy.get('input[type="text"]').eq(2).type('選択肢1{enter}');
    cy.get('input[type="text"]').eq(2).clear();
    cy.contains('選択肢1').should('not.exist');
  });

  it('記述式のON/OFFを切り替えられること', () => {
    cy.get('button').contains('質問項目追加').click();
    cy.get('li').contains('プルダウン').click();
    cy.get('input[type="text"]').eq(2).type('選択肢1{enter}');

    cy.get('input[type="checkbox"]').eq(0).check();
    cy.get('input[type="checkbox"]').eq(0).should('be.checked');
    cy.get('input[type="checkbox"]').eq(0).uncheck();
    cy.get('input[type="checkbox"]').eq(0).should('not.be.checked');
  });

  it('質問を削除できること', () => {
    cy.get('button').contains('質問項目追加').click();
    cy.get('li').contains('プルダウン').click();

    cy.get('button[aria-label="削除"]').eq(0).click();

    cy.contains('プルダウン').should('not.exist');
  });

  it('一番上の質問の上へボタンは非活性になっていること', () => {
    cy.get('button').contains('質問項目追加').click();
    cy.get('li').contains('プルダウン').click();
    cy.contains('見出し').parent().find('input').type('A');

    cy.get('button').contains('質問項目追加').click();
    cy.get('li').contains('プルダウン').click();
    cy.contains('質問2: ')
      .parent()
      .contains('見出し')
      .parent()
      .find('input')
      .type('B');

    cy.get('button[aria-label="下へ"]').prev('button').should('be.disabled');
  });

  it('一番↓の質問の下へボタンは非活性になっていること', () => {
    cy.get('button').contains('質問項目追加').click();
    cy.get('li').contains('プルダウン').click();
    cy.contains('見出し').parent().find('input').type('A');

    cy.get('button').contains('質問項目追加').click();
    cy.get('li').contains('プルダウン').click();
    cy.contains('質問2: ')
      .parent()
      .contains('見出し')
      .parent()
      .find('input')
      .type('B');

    cy.get('button[aria-label="上へ"]').next('button').should('be.disabled');
  });

  it('質問の順序を入れ替えられること', () => {
    cy.get('button').contains('質問項目追加').click();
    cy.get('li').contains('プルダウン').click();
    cy.contains('見出し').parent().find('input').type('A');

    cy.get('button').contains('質問項目追加').click();
    cy.get('li').contains('プルダウン').click();
    cy.contains('質問2: ')
      .parent()
      .contains('見出し')
      .parent()
      .find('input')
      .type('B');

    cy.get('button').contains('質問項目追加').click();
    cy.get('li').contains('プルダウン').click();
    cy.contains('質問3: ')
      .parent()
      .contains('見出し')
      .parent()
      .find('input')
      .type('C');

    cy.get('button[aria-label="下へ"]').eq(0).click();
    cy.contains('質問1: B').should('exist');
    cy.contains('質問2: A').should('exist');

    cy.get('button[aria-label="上へ"]').eq(0).click();
    cy.contains('質問1: A').should('exist');
    cy.contains('質問2: B').should('exist');
  });
});
