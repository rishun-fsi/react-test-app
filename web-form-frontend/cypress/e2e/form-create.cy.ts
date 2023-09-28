describe('アンケートフォームの新規作成機能', () => {
  beforeEach(() => {
    cy.visit('/form-management/new');
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

  it('数字の設問が増やせること', () => {
    cy.get('button').contains('質問項目追加').click();
    cy.get('li').contains('数字').click();

    cy.contains('数字').should('exist');
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
    cy.get('input[type="checkbox"]').eq(2).should('be.checked');
    cy.get('input[type="checkbox"]').eq(2).uncheck();
    cy.get('input[type="checkbox"]').eq(1).should('not.be.checked');
  });

  it('前回回答の反映にチェックが入っていると、継承用のフォームが出現すること', () => {
    cy.contains('前回回答を反映する際のキーとする質問').should('not.exist');

    cy.get('button').contains('質問項目追加').click();
    cy.get('li').contains('プルダウン').click();

    cy.get('input[type="checkbox"]').eq(1).check();
    cy.contains('前回回答を反映する際のキーとする質問').should('exist');
  });

  it('同一ユーザーの前回回答を参照するのON/OFFが切り替えられること', () => {
    cy.get('button').contains('質問項目追加').click();
    cy.get('li').contains('プルダウン').click();

    cy.get('input[type="checkbox"]').eq(1).check();
    cy.get('input[type="checkbox"]').eq(0).uncheck();
    cy.get('input[type="checkbox"]').eq(0).should('not.be.checked');
    cy.get('input[type="checkbox"]').eq(0).check();
    cy.get('input[type="checkbox"]').eq(0).should('be.checked');
  });

  it('同一ユーザーの前回回答を反映しない場合はキーとする質問を指定しないことを許容しないこと', () => {
    cy.get('button').contains('質問項目追加').click();
    cy.get('li').contains('プルダウン').click();
    cy.contains('見出し').parent().find('input').type('A');

    cy.get('input[type="checkbox"]').eq(1).check();
    cy.get('input[type="checkbox"]').eq(0).uncheck();
    cy.contains(
      '同一ユーザーの前回回答を参照しない場合はキーとする質問を指定してください。'
    ).should('exist');
    cy.contains('指定しない').click();
    cy.get('li[data-value="-1"]').click();
    cy.contains(
      '同一ユーザーの前回回答を参照しない場合はキーとする質問を指定してください。'
    ).should('not.exist');
  });

  it('継承のキーとして指定されている質問は削除ができないこと', () => {
    cy.get('button').contains('質問項目追加').click();
    cy.get('li').contains('プルダウン').click();
    cy.contains('見出し').parent().find('input').type('A');
    cy.get('input[type="checkbox"]').eq(1).check();
    cy.get('input[type="checkbox"]').eq(0).uncheck();

    cy.contains('指定しない').click();
    cy.get('li[data-value="-1"]').click();
    cy.get('button[aria-label="削除"]').should('not.exist');
  });

  it('選択肢を増やせること', () => {
    cy.get('button').contains('質問項目追加').click();
    cy.get('li').contains('プルダウン').click();

    cy.get('input[type="text"]').eq(2).type('選択肢1');
    cy.get('button').eq(2).click();
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
      .parent()
      .parent()
      .contains('見出し')
      .parent()
      .find('input')
      .type('B');

    cy.get('button[aria-label="下へ"]').prev('button').should('be.disabled');
  });

  it('一番下の質問の下へボタンは非活性になっていること', () => {
    cy.get('button').contains('質問項目追加').click();
    cy.get('li').contains('プルダウン').click();
    cy.contains('見出し').parent().find('input').type('A');

    cy.get('button').contains('質問項目追加').click();
    cy.get('li').contains('プルダウン').click();
    cy.contains('質問2: ')
      .parent()
      .parent()
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
      .parent()
      .parent()
      .contains('見出し')
      .parent()
      .find('input')
      .type('B');

    cy.get('button').contains('質問項目追加').click();
    cy.get('li').contains('プルダウン').click();
    cy.contains('質問3: ')
      .parent()
      .parent()
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

  it('アコーディオンを閉じられること', () => {
    cy.get('button').contains('質問項目追加').click();
    cy.get('li').contains('プルダウン').click();
    cy.contains('見出し').parent().find('input').type('A');

    cy.contains('質問1: A').click();
    cy.contains('見出し').should('not.be.visible');
  });

  it('保存できること', () => {
    cy.get('button').contains('質問項目追加').click();
    cy.get('li').contains('プルダウン').click();
    cy.contains('アンケート名').parent().find('input').type('aaa');
    cy.contains('見出し').parent().find('input').type('A');
    cy.contains('質問文').parent().find('textarea').eq(0).type('aaaa');
    cy.get('input[type="text"]').eq(2).type('選択肢1{enter}');
    cy.contains('保存').click();

    cy.contains(
      '変更を保存しました。自動的にフォーム管理画面に移動します。'
    ).should('exist');
    cy.url().should('eq', 'http://localhost:3000/form-management/new');
  });
});

describe('新規作成機能 - 見た目のテスト', () => {
  beforeEach(() => {
    cy.visit('/form-management/new');
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
    cy.get('button').contains('質問項目追加').click();
    cy.get('li').contains('プルダウン').click();
    cy.contains('見出し').parent().find('input').type('A');

    cy.get('button').contains('質問項目追加').click();
    cy.get('li').contains('プルダウン').click();
    cy.contains('質問2: ')
      .parent()
      .parent()
      .parent()
      .contains('見出し')
      .parent()
      .find('input')
      .type('B');

    cy.get('button').contains('質問項目追加').click();
    cy.get('li').contains('プルダウン').click();
    cy.contains('質問3: ')
      .parent()
      .parent()
      .parent()
      .contains('見出し')
      .parent()
      .find('input')
      .type('C');
  });

  it('クリックすると、当該の質問のふちが青くハイライトされること', () => {
    cy.contains('質問1: A').click();
    cy.contains('質問1: A')
      .parent()
      .parent()
      .parent()
      .should('have.css', 'border', '2px solid rgb(25, 118, 210)');
  });

  it('新しく質問を追加するとその質問のふちが青くハイライトされること', () => {
    cy.get('button').contains('質問項目追加').click();
    cy.get('li').contains('プルダウン').click();
    cy.contains('質問4:')
      .parent()
      .parent()
      .parent()
      .should('have.css', 'border', '2px solid rgb(25, 118, 210)');
  });

  it('質問を削除するとどの質問もハイライトされてない状態になること', () => {
    cy.get('button[aria-label="削除"]').eq(0).click();

    cy.contains('質問1: B')
      .parent()
      .parent()
      .parent()
      .should('not.have.css', 'border', '2px solid rgb(25, 118, 210)');
    cy.contains('質問2: C')
      .parent()
      .parent()
      .parent()
      .should('not.have.css', 'border', '2px solid rgb(25, 118, 210)');
  });

  it('質問の順番を変えても同じ質問をハイライトすること', () => {
    cy.get('button[aria-label="下へ"]').eq(0).click();
    cy.contains('質問1: B')
      .parent()
      .parent()
      .parent()
      .should('not.have.css', 'border', '2px solid rgb(25, 118, 210)');
    cy.contains('質問2: A')
      .parent()
      .parent()
      .parent()
      .should('have.css', 'border', '2px solid rgb(25, 118, 210)');

    cy.get('button[aria-label="上へ"]').eq(0).click();
    cy.contains('質問1: A')
      .parent()
      .parent()
      .parent()
      .should('have.css', 'border', '2px solid rgb(25, 118, 210)');
    cy.contains('質問2: B')
      .parent()
      .parent()
      .parent()
      .should('not.have.css', 'border', '2px solid rgb(25, 118, 210)');
  });
});
