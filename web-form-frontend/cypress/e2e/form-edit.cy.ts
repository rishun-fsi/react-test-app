describe('アンケート編集機能', () => {
  beforeEach(() => {
    cy.visit('/form-management');
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
    cy.get('button').contains('編集').click();
  });

  it('アンケート名の挙動確認', () => {
    cy.contains('プロダクト健康診断').should('exist');

    cy.contains('アンケート名').parent().find('input').type('aaa');
    cy.contains('アンケート名')
      .parent()
      .find('input')
      .should('have.value', 'PJ健康診断アンケートaaa');
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

  it('テキストの設問が増やせること', () => {
    cy.get('button').contains('質問項目追加').click();
    cy.get('li').contains('数字').click();

    cy.contains('数字').should('exist');
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
    cy.get('input[type="checkbox"]').eq(5).should('be.checked');
    cy.get('input[type="checkbox"]').eq(5).uncheck();
    cy.get('input[type="checkbox"]').eq(4).should('not.be.checked');
  });

  it('前回回答の反映にチェックが入っていると、継承用のフォームが出現すること', () => {
    cy.contains('前回回答を反映する際のキーとする質問').should('not.exist');

    cy.get('input[type="checkbox"]').eq(4).check();
    cy.contains('前回回答を反映する際のキーとする質問').should('exist');
  });

  it('同一ユーザーの前回回答を参照するのON/OFFが切り替えられること', () => {
    cy.get('input[type="checkbox"]').eq(4).check();
    cy.get('input[type="checkbox"]').eq(0).uncheck();
    cy.get('input[type="checkbox"]').eq(0).should('not.be.checked');
    cy.get('input[type="checkbox"]').eq(0).check();
    cy.get('input[type="checkbox"]').eq(0).should('be.checked');
  });

  it('同一ユーザーの前回回答を反映しない場合はキーとする質問を指定しないことを許容しないこと', () => {
    cy.get('input[type="checkbox"]').eq(4).check();
    cy.get('input[type="checkbox"]').eq(0).uncheck();
    cy.contains(
      '同一ユーザーの前回回答を参照しない場合はキーとする質問を指定してください。'
    ).should('exist');
    cy.contains('指定しない').click();
    cy.get('li[data-value="1"]').click();
    cy.contains(
      '同一ユーザーの前回回答を参照しない場合はキーとする質問を指定してください。'
    ).should('not.exist');
  });

  it('継承のキーとして指定されている質問は削除ができないこと', () => {
    cy.get('input[type="checkbox"]').eq(4).check();
    cy.get('input[type="checkbox"]').eq(0).uncheck();

    cy.contains('指定しない').click();
    cy.get('li[data-value="1"]').click();
    cy.contains('質問1: システム名')
      .parent()
      .parent()
      .parent()
      .find('button[aria-label="削除"]')
      .its('length')
      .should('eq', 3);
  });

  it('選択肢を増やせること', () => {
    cy.get('input[type="text"]').eq(5).type('選択肢1');
    cy.get('button[aria-label="追加"]').eq(0).click();
    cy.get('input[type="text"]').eq(5).should('have.value', '選択肢1');
    cy.contains('質問1: システム名')
      .parent()
      .parent()
      .parent()
      .find('input[type="checkbox"]')
      .its('length')
      .should('eq', 6);

    cy.get('input[type="text"]').eq(6).type('選択肢2{enter}');
    cy.get('input[type="text"]').eq(6).should('have.value', '選択肢2');
    cy.contains('質問1: システム名')
      .parent()
      .parent()
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
      .parent()
      .parent()
      .contains('見出し')
      .parent()
      .find('input')
      .type('aaaa');
    cy.contains('質問5: aaaa')
      .parent()
      .parent()
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
      .parent()
      .parent()
      .find('input[value="select"]')
      .should('be.disabled');
    cy.contains('質問5: システム名(削除済み)')
      .parent()
      .parent()
      .parent()
      .find('input[value="システム名"]')
      .should('be.disabled');
    cy.contains('質問5: システム名(削除済み)')
      .parent()
      .parent()
      .parent()
      .find('textarea')
      .should('be.disabled');
    cy.contains('質問5: システム名(削除済み)')
      .parent()
      .parent()
      .parent()
      .find('input[value="システムA"]')
      .should('be.disabled');
    cy.contains('質問5: システム名(削除済み)')
      .parent()
      .parent()
      .parent()
      .find('input[type="checkbox"]')
      .eq(0)
      .should('be.disabled');
    cy.contains('質問5: システム名(削除済み)')
      .parent()
      .parent()
      .parent()
      .find('input[type="checkbox"]')
      .eq(3)
      .should('be.disabled');
    cy.contains('質問5: システム名(削除済み)')
      .parent()
      .parent()
      .parent()
      .find('input[type="checkbox"]')
      .eq(4)
      .should('be.disabled');
    cy.contains('質問5: システム名(削除済み)')
      .parent()
      .parent()
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

  it('一番下の質問の下へボタンは非活性になっていること', () => {
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

  it('アコーディオンを閉じられること', () => {
    cy.contains('質問1: システム名').click();
    cy.get('input[value="システムA"]').should('not.be.visible');
  });
});

describe('編集機能 - 実際に編集する', () => {
  beforeEach(() => {
    cy.visit('/form-management');
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
    cy.get('button[aria-label="edit"]').eq(1).click();
  });

  it('既存の質問の編集', () => {
    cy.get('div[aria-label="headline-text-field"]').find('input').clear();
    cy.get('div[aria-label="headline-text-field"]')
      .find('input')
      .type('編集しました。');

    cy.contains('保存').click();
    cy.contains(
      '変更を保存しました。自動的にフォーム管理画面に移動します。'
    ).should('exist');
    cy.url().should('eq', 'http://localhost:3000/form-management');
    cy.get('button[aria-label="edit"]').eq(1).click();
    cy.get('div[aria-label="headline-text-field"]')
      .find('input')
      .should('have.value', '編集しました。');

    // 元の状態に戻す
    cy.get('div[aria-label="headline-text-field"]').find('input').clear();
    cy.get('div[aria-label="headline-text-field"]')
      .find('input')
      .type('テスト用質問');
    cy.contains('保存').click();
    cy.contains(
      '変更を保存しました。自動的にフォーム管理画面に移動します。'
    ).should('exist');
    cy.url().should('eq', 'http://localhost:3000/form-management');
  });

  it('既存の選択肢の追加', () => {
    cy.get('input[value="aaa"]').type('bbb');

    cy.contains('保存').click();
    cy.contains(
      '変更を保存しました。自動的にフォーム管理画面に移動します。'
    ).should('exist');
    cy.url().should('eq', 'http://localhost:3000/form-management');
    cy.get('button[aria-label="edit"]').eq(1).click();
    cy.get('div[aria-label="option-text-field"]')
      .eq(0)
      .find('input')
      .should('have.value', 'aaabbb');

    // 元の状態に戻す
    cy.get('div[aria-label="option-text-field"]')
      .eq(0)
      .find('input')
      .type('{backspace}{backspace}{backspace}');
    cy.contains('保存').click();
    cy.contains(
      '変更を保存しました。自動的にフォーム管理画面に移動します。'
    ).should('exist');
    cy.url().should('eq', 'http://localhost:3000/form-management');
  });
});

describe('編集機能 - 見た目のテスト', () => {
  beforeEach(() => {
    cy.visit('/form-management');
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
    cy.get('button').contains('編集').click();
  });

  it('初期状態はどの質問も青くハイライトされていないこと', () => {
    [...new Array(5)].map((_, i: number) => {
      cy.contains(`質問${i + 1}: `)
        .parent()
        .parent()
        .parent()
        .should('not.have.css', 'border', '2px solid rgb(25, 118, 210)');
    });
  });

  it('クリックすると、当該の質問のふちが青くハイライトされること', () => {
    cy.contains('質問1: ').click();
    cy.contains(`質問1: `)
      .parent()
      .parent()
      .parent()
      .should('have.css', 'border', '2px solid rgb(25, 118, 210)');
  });

  it('新しく質問を追加する、その質問が青くハイライトされること', () => {
    cy.get('button').contains('質問項目追加').click();
    cy.get('li').contains('プルダウン').click();

    cy.contains('質問5: ')
      .parent()
      .parent()
      .parent()
      .should('have.css', 'border', '2px solid rgb(25, 118, 210)');
  });

  it('既存の質問を削除すると、削除された質問のふちが青くハイライトされること', () => {
    cy.get('button[aria-label="削除"]').eq(3).click();
    cy.contains('質問5: システム名(削除済み)')
      .parent()
      .parent()
      .parent()
      .should('have.css', 'border', '2px solid rgb(25, 118, 210)');
  });

  it('新規で追加した質問を削除すると、どの質問もハイライトされていない状態になること', () => {
    cy.get('button').contains('質問項目追加').click();
    cy.get('li').contains('プルダウン').click();
    cy.contains('質問5: ')
      .parent()
      .parent()
      .parent()
      .find('button[aria-label="削除"]')
      .click();

    [...new Array(5)].map((_, i: number) => {
      cy.contains(`質問${i + 1}: `)
        .parent()
        .parent()
        .parent()
        .should('not.have.css', 'border', '2px solid rgb(25, 118, 210)');
    });
  });

  it('質問の順序を入れ替えても、同じ質問のふちがハイライトされていること', () => {
    cy.get('button[aria-label="下へ"]').eq(0).click();
    cy.contains('質問1: 開発手法')
      .parent()
      .parent()
      .parent()
      .should('not.have.css', 'border', '2px solid rgb(25, 118, 210)');
    cy.contains('質問2: システム名')
      .parent()
      .parent()
      .parent()
      .should('have.css', 'border', '2px solid rgb(25, 118, 210)');

    cy.get('button[aria-label="上へ"]').eq(0).click();
    cy.contains('質問1: システム名')
      .parent()
      .parent()
      .parent()
      .should('have.css', 'border', '2px solid rgb(25, 118, 210)');
    cy.contains('質問2: 開発手法')
      .parent()
      .parent()
      .parent()
      .should('not.have.css', 'border', '2px solid rgb(25, 118, 210)');
  });

  it('質問を復元させると、その質問がハイライトされること', () => {
    cy.get('button[aria-label="削除"]').eq(3).click();
    cy.contains('質問5: システム名(削除済み)')
      .parent()
      .parent()
      .parent()
      .find('button[aria-label="復元"]')
      .click();
    cy.contains('質問4: システム名')
      .parent()
      .parent()
      .parent()
      .should('have.css', 'border', '2px solid rgb(25, 118, 210)');
  });
});
