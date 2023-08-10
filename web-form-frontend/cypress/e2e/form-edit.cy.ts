describe('アンケート編集機能', () => {
  beforeEach(() => {
    cy.visit('/form-management');
    cy.get('button').contains('編集').click();
  });

  it('アンケート名の挙動確認', () => {
    cy.contains('プロダクト健康診断').should('exist');

    cy.contains('アンケート名').parent().find('input').type('aaa');
    cy.contains('アンケート名')
      .parent()
      .find('input')
      .should('have.value', 'プロダクト健康診断aaa');
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
    cy.contains('質問5: ').parent().contains('選択肢').should('not.exist');
  });

  it('見出しに入力できること', () => {
    cy.contains('見出し').parent().find('input').type('aaaa');
    cy.contains('質問1: システム名aaaa').should('exist');
  });

  it('質問文に入力ができること', () => {
    cy.contains('質問文').parent().find('textarea').eq(0).type('aaaa');
  });

  it('必須のON/OFFを切り替えられること', () => {
    cy.get('input[type="checkbox"]').eq(3).check();
    cy.get('input[type="checkbox"]').eq(3).should('be.checked');
    cy.get('input[type="checkbox"]').eq(3).uncheck();
    cy.get('input[type="checkbox"]').eq(3).should('not.be.checked');
  });

  it('前回回答の反映のON/OFFを切り替えられること', () => {
    cy.get('input[type="checkbox"]').eq(4).check();
    cy.get('input[type="checkbox"]').eq(4).should('be.checked');
    cy.get('input[type="checkbox"]').eq(4).uncheck();
    cy.get('input[type="checkbox"]').eq(4).should('not.be.checked');
  });

  it('選択肢を増やせること', () => {
    cy.get('input[type="text"]').eq(5).type('選択肢1');
    cy.get('button[aria-label="追加"]').eq(0).click();
    cy.get('input[type="text"]').eq(5).should('have.value', '選択肢1');
    cy.contains('質問1: システム名')
      .parent()
      .find('input[type="checkbox"]')
      .its('length')
      .should('eq', 6);

    cy.get('input[type="text"]').eq(6).type('選択肢2{enter}');
    cy.get('input[type="text"]').eq(6).should('have.value', '選択肢2');
    cy.contains('質問1: システム名')
      .parent()
      .find('input[type="checkbox"]')
      .its('length')
      .should('eq', 7);
  });

  it('新規に追加した選択肢を削除できること', () => {
    cy.get('input[type="text"]').eq(5).type('選択肢1{enter}');
    cy.get('button[aria-label="削除"]').eq(3).click();
    cy.contains('選択肢1').should('not.exist');

    cy.get('input[type="text"]').eq(5).type('選択肢1{enter}');
    cy.get('input[type="text"]').eq(5).clear();
    cy.contains('選択肢1').should('not.exist');
  });

  it('既存の選択肢を削除すると削除済みになること', () => {
    cy.get('button[aria-label="削除"]').eq(0).click();
    cy.get('input[disabled]').should('have.value', 'システムA(削除済み)');
    cy.get('button[aria-label="復元"]').should('exist');
    cy.get('input[type="checkbox"]').eq(2).should('be.disabled');
  });

  it('削除された既存の選択肢を復元できること', () => {
    cy.get('button[aria-label="削除"]').eq(0).click();
    cy.get('button[aria-label="復元"]').eq(0).click();
    cy.get('input[value="システムA"]').should('not.be.disabled');
  });

  it('記述式のON/OFFを切り替えられること', () => {
    cy.get('input[type="checkbox"]').eq(0).check();
    cy.get('input[type="checkbox"]').eq(0).should('be.checked');
    cy.get('input[type="checkbox"]').eq(0).uncheck();
    cy.get('input[type="checkbox"]').eq(0).should('not.be.checked');
  });

  it('新規で追加した質問を削除できること', () => {
    cy.get('button').contains('質問項目追加').click();
    cy.get('li').contains('プルダウン').click();
    cy.contains('質問5: ')
      .parent()
      .contains('見出し')
      .parent()
      .find('input')
      .type('aaaa');
    cy.contains('質問5: aaaa')
      .parent()
      .find('button[aria-label="削除"]')
      .eq(0)
      .click();
    cy.contains('質問5: aaaa').should('not.exist');
  });

  it('既存の質問を削除できること', () => {
    cy.get('button[aria-label="削除"]').eq(3).click();
    cy.contains('質問5: システム名(削除済み)').should('exist');
    cy.contains('質問5: システム名(削除済み)')
      .parent()
      .find('input[value="select"]')
      .should('be.disabled');
    cy.contains('質問5: システム名(削除済み)')
      .parent()
      .find('input[value="システム名"]')
      .should('be.disabled');
    cy.contains('質問5: システム名(削除済み)')
      .parent()
      .find('textarea')
      .should('be.disabled');
    cy.contains('質問5: システム名(削除済み)')
      .parent()
      .find('input[value="システムA"]')
      .should('be.disabled');
    cy.contains('質問5: システム名(削除済み)')
      .parent()
      .find('input[type="checkbox"]')
      .eq(0)
      .should('be.disabled');
    cy.contains('質問5: システム名(削除済み)')
      .parent()
      .find('input[type="checkbox"]')
      .eq(3)
      .should('be.disabled');
    cy.contains('質問5: システム名(削除済み)')
      .parent()
      .find('input[type="checkbox"]')
      .eq(4)
      .should('be.disabled');
    cy.contains('質問5: システム名(削除済み)')
      .parent()
      .find('button[aria-label="復元"]')
      .should('exist');
  });

  it('削除された既存の質問を復元できること', () => {
    cy.get('button[aria-label="復元"]').click();
    cy.contains('質問5: 削除済み質問(削除済み)').should('not.exist');
  });

  it('一番上の質問の上へボタンは非活性になっていること', () => {
    cy.get('button[aria-label="下へ"]')
      .eq(0)
      .prev('button')
      .should('be.disabled');
  });

  it('一番↓の質問の下へボタンは非活性になっていること', () => {
    cy.get('button[aria-label="上へ"]')
      .eq(2)
      .next('button')
      .should('be.disabled');
  });

  it('質問の順序を入れ替えられること', () => {
    cy.get('button[aria-label="下へ"]').eq(0).click();
    cy.contains('質問1: 開発手法').should('exist');
    cy.contains('質問2: システム名').should('exist');

    cy.get('button[aria-label="上へ"]').eq(0).click();
    cy.contains('質問1: システム名').should('exist');
    cy.contains('質問2: 開発手法').should('exist');
  });
});
