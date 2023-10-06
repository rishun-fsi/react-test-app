DROP TABLE IF EXISTS answers;
DROP TABLE IF EXISTS answer_metadata;
DROP TABLE IF EXISTS question_conditions;
DROP TABLE IF EXISTS inheritances;
DROP TABLE IF EXISTS question_items;
DROP TABLE IF EXISTS questions;
DROP TABLE IF EXISTS question_groups;
DROP TABLE IF EXISTS question_types;
DROP TABLE IF EXISTS questionnairs;
DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS notification_types;

CREATE TABLE questionnairs(
  id SERIAL,
  name VARCHAR(200),
  user_id VARCHAR(50),
  created_date DATE,
  updated_date DATE,
  is_deleted BOOLEAN not null DEFAULT FALSE,
  primary key(id)
);

CREATE TABLE question_types(
  id SERIAL,
  question_type VARCHAR(30) not null,
  primary key(id)
);

CREATE TABLE question_groups(
  id SERIAL,
  name VARCHAR(200),
  primary key(id)
);

CREATE TABLE questions(
  id SERIAL,
  question VARCHAR(500) not null,
  question_type_id INTEGER not null,
  required BOOLEAN not null DEFAULT FALSE,
  questionnair_id INTEGER not null,
  group_id INTEGER,
  headline VARCHAR(100),
  can_inherit BOOLEAN DEFAULT FALSE,
  is_deleted BOOLEAN DEFAULT FALSE,
  priority INTEGER not null,
  primary key(id),
  foreign key(question_type_id) references question_types(id),
  foreign key(group_id) references question_groups(id),
  foreign key(questionnair_id) references questionnairs(id)
);

CREATE TABLE inheritances(
  id SERIAL,
  questionnair_id INTEGER not null,
  is_same_user BOOLEAN not null DEFAULT TRUE,
  question_id INTEGER,
  primary key(id),
  foreign key(questionnair_id) references questionnairs(id),
  foreign key(question_id) references questions(id),
  CONSTRAINT question_id_check CHECK(is_same_user OR (NOT is_same_user AND question_id IS NOT NULL))
);

CREATE TABLE question_items(
  id SERIAL,
  question_id INTEGER not null,
  item_name VARCHAR(200) not null,
  is_description BOOLEAN not null DEFAULT FALSE,
  is_deleted BOOLEAN not null DEFAULT FALSE,
  priority INTEGER not null,
  primary key(id),
  foreign key(question_id) references questions(id)
);

CREATE TABLE question_conditions(
  id SERIAL,
  parent_question_id INTEGER not null,
  child_question_id INTEGER not null,
  question_item_id INTEGER not null,
  primary key(id),
  foreign key(parent_question_id) references questions(id),
  foreign key(child_question_id) references questions(id),
  foreign key(question_item_id) references question_items(id),
  CONSTRAINT parent_child_check CHECK(parent_question_id <> child_question_id)
);

CREATE TABLE answer_metadata(
  id SERIAL,
  created_date DATE not null,
  user_id VARCHAR(50) not null,
  update_user VARCHAR(50),
  updated_date DATE not null,
  questionnair_id INTEGER not null,
  is_deleted BOOLEAN not null DEFAULT FALSE,
  primary key(id),
  foreign key(questionnair_id) references questionnairs(id)
);

CREATE TABLE answers(
  id SERIAL,
  question_id INTEGER not null,
  metadata_id INTEGER not null,
  item_id INTEGER,
  text_answer VARCHAR(500),
  primary key(id),
  foreign key(question_id) references questions(id),
  foreign key(item_id) references question_items(id),
  foreign key(metadata_id) references answer_metadata(id),
  CONSTRAINT answer_null_check CHECK(NOT(item_id IS NULL AND text_answer IS NULL))
);

CREATE TABLE notification_types(
  id SERIAL,
  name VARCHAR(20) not null,
  severity INTEGER not null,
  primary key(id)
);

CREATE TABLE notifications(
  id SERIAL,
  title VARCHAR(200) not null,
  content VARCHAR(1000) not null,
  user_id VARCHAR(50) not null,
  type_id INTEGER not null,
  created_date DATE not null,
  updated_date DATE,
  publish_timestamp TIMESTAMP,
  expire_timestamp TIMESTAMP,
  primary key(id),
  foreign key(type_id) references notification_types(id)
);

INSERT INTO notification_types (name, severity) VALUES('重要', 100);
INSERT INTO notification_types (name, severity) VALUES('周知', 50);
INSERT INTO notification_types (name, severity) VALUES('その他', 10);

INSERT INTO questionnairs (user_id, name, created_date, updated_date) VALUES ('test', 'PJ健康診断アンケート', '2023-07-21', '2023-07-21');
INSERT INTO questionnairs (user_id, name, created_date, updated_date) VALUES ('test', 'テストアンケート', '2023-08-15', '2023-08-15');
INSERT INTO questionnairs (user_id, name, created_date, updated_date, is_deleted) VALUES ('test', '削除済みアンケート', '2023-08-15', '2023-08-15', true);

INSERT INTO question_types (question_type) VALUES ('select');
INSERT INTO question_types (question_type) VALUES ('radio');
INSERT INTO question_types (question_type) VALUES ('check');
INSERT INTO question_types (question_type) VALUES ('text');
INSERT INTO question_types (question_type) VALUES ('number');

INSERT INTO question_groups (name) VALUES ('開発環境');

INSERT INTO questions (question, question_type_id, headline, required, questionnair_id, priority) VALUES ('対象のアプリ・システム名を選択してください。', 1, 'システム名', TRUE, 1, 1);
INSERT INTO questions (question, question_type_id, headline, required, questionnair_id, group_id, can_inherit, priority) VALUES ('対象システムの開発手法を選択してください。', 2, '開発手法', TRUE, 1, 1, TRUE, 2);
INSERT INTO questions (question, question_type_id, headline, required, questionnair_id, group_id, can_inherit, priority) VALUES ('対象システムのサーバ基盤を選択してください。', 3, 'サーバーの土台', FALSE, 1, 1, TRUE, 3);
INSERT INTO questions (question, question_type_id, headline, required, questionnair_id, priority) VALUES ('コードのcommit/単体試験完了から本番環境稼働までの所要時間を選択してください。', 1, '変更のリードタイム', TRUE, 1, 4);
INSERT INTO questions (question, question_type_id, headline, required, questionnair_id, priority) VALUES ('開発チームのメンバーを数字で入力してください。', 5, '開発チームのメンバー', TRUE, 1, 5);
INSERT INTO questions (question, question_type_id, headline, required, questionnair_id, priority, is_deleted) VALUES ('削除された質問ですか？', 4, '削除済み質問', FALSE, 1, 6, TRUE);
INSERT INTO questions (question, question_type_id, headline, required, questionnair_id, priority, is_deleted) VALUES ('テスト用質問です。', 1, 'テスト用質問', TRUE, 2, 1, FALSE);
INSERT INTO questions (question, question_type_id, headline, required, questionnair_id, priority, is_deleted) VALUES ('削除された質問ですか？', 4, '削除済み質問', FALSE, 3, 1, TRUE);

INSERT INTO inheritances (questionnair_id, is_same_user, question_id) VALUES (1, FALSE, 1);
INSERT INTO inheritances (questionnair_id, is_same_user) VALUES (2, TRUE);
INSERT INTO question_items (question_id, item_name, is_description, priority) VALUES (1, 'システムA', FALSE, 1);
INSERT INTO question_items (question_id, item_name, is_description, priority) VALUES (1, 'システムB', FALSE, 2);
INSERT INTO question_items (question_id, item_name, is_description, priority) VALUES (1, 'システムC', FALSE, 3);
INSERT INTO question_items (question_id, item_name, is_description, priority) VALUES (2, 'アジャイル', FALSE, 1);
INSERT INTO question_items (question_id, item_name, is_description, priority) VALUES (2, 'ウォーターフォール', FALSE, 2);
INSERT INTO question_items (question_id, item_name, is_description, priority) VALUES (3, 'AWS', FALSE, 1);
INSERT INTO question_items (question_id, item_name, is_description, priority) VALUES (3, 'GCP', FALSE, 2);
INSERT INTO question_items (question_id, item_name, is_description, priority) VALUES (3, 'Azure', FALSE, 3);
INSERT INTO question_items (question_id, item_name, is_description, priority) VALUES (3, 'ドコモ内オンプレ', FALSE, 4);
INSERT INTO question_items (question_id, item_name, is_description, priority) VALUES (3, 'その他', TRUE, 5);
INSERT INTO question_items (question_id, item_name, is_description, priority) VALUES (4, '1時間以内', FALSE, 1);
INSERT INTO question_items (question_id, item_name, is_description, priority) VALUES (4, '1日以内', FALSE, 2);
INSERT INTO question_items (question_id, item_name, is_description, priority) VALUES (4, '1週間以内', FALSE, 3);
INSERT INTO question_items (question_id, item_name, is_description, priority) VALUES (4, 'それ以上', FALSE, 4);
INSERT INTO question_items (question_id, item_name, is_description, priority) VALUES (7, 'aaa', FALSE, 1);

-- /answer get用のテストデータ
INSERT INTO answer_metadata (created_date, user_id, update_user, updated_date, questionnair_id) VALUES ('2024-01-01', 'userZ', 'userY', '2023-10-10', 1);
INSERT INTO answers (question_id, item_id, metadata_id) VALUES (1, 1, 1);
INSERT INTO answers (question_id, item_id, metadata_id) VALUES (2, 4, 1);
INSERT INTO answers (question_id, item_id, metadata_id) VALUES (3, 6, 1);
INSERT INTO answers (question_id, item_id, metadata_id) VALUES (4, 11, 1);
INSERT INTO answers (question_id, text_answer, metadata_id) VALUES (5, '10', 1);
INSERT INTO answer_metadata (created_date, user_id, update_user, updated_date, questionnair_id) VALUES ('2023-10-02', 'userY', 'userX', '2023-10-11', 1);
INSERT INTO answers (question_id, item_id, metadata_id) VALUES (1, 2, 2);
INSERT INTO answers (question_id, item_id, metadata_id) VALUES (2, 4, 2);
INSERT INTO answers (question_id, item_id, metadata_id) VALUES (3, 6, 2);
INSERT INTO answers (question_id, item_id, metadata_id) VALUES (3, 8, 2);
INSERT INTO answers (question_id, item_id, metadata_id) VALUES (4, 12, 2);
INSERT INTO answers (question_id, text_answer, metadata_id) VALUES (5, '5', 2);

-- /answer put用のデータ
INSERT INTO answer_metadata (created_date, user_id, update_user, updated_date, questionnair_id) VALUES ('2023-07-21', 'userA', 'userB', '2023-08-01', 1);
INSERT INTO answers (question_id, item_id, metadata_id) VALUES (1, 1, 3);
INSERT INTO answers (question_id, item_id, metadata_id) VALUES (2, 4, 3);
INSERT INTO answers (question_id, item_id, metadata_id) VALUES (3, 8, 3);
INSERT INTO answers (question_id, item_id, metadata_id) VALUES (4, 12, 3);
INSERT INTO answers (question_id, text_answer, metadata_id) VALUES (5, '20', 3);

-- /answer chunk-post用のデータ
INSERT INTO answer_metadata (created_date, user_id, update_user, updated_date, questionnair_id) VALUES ('2023-07-30', 'userC', 'userD', '2023-08-30', 1);
INSERT INTO answers (question_id, item_id, metadata_id) VALUES (1, 1, 4);
INSERT INTO answers (question_id, item_id, metadata_id) VALUES (2, 4, 4);
INSERT INTO answers (question_id, item_id, metadata_id) VALUES (4, 13, 4);
INSERT INTO answers (question_id, text_answer, metadata_id) VALUES (5, '1', 4);

-- /answer chunk-put用のデータ
INSERT INTO answer_metadata (created_date, user_id, update_user, updated_date, questionnair_id) VALUES ('2023-08-11', 'userD', 'userA', '2023-11-01', 2);
INSERT INTO answers (question_id, item_id, metadata_id) VALUES (1, 1, 5);
INSERT INTO answers (question_id, item_id, metadata_id) VALUES (2, 4, 5);
INSERT INTO answers (question_id, item_id, metadata_id) VALUES (3, 8, 5);
INSERT INTO answers (question_id, item_id, metadata_id) VALUES (4, 12, 5);
INSERT INTO answers (question_id, text_answer, metadata_id) VALUES (5, '20', 5);

-- indexのput用のデータ
INSERT INTO answer_metadata (created_date, user_id, update_user, updated_date, questionnair_id) VALUES ('2023-08-12', 'userD', 'userA', '2023-11-01', 1);
INSERT INTO answers (question_id, item_id, metadata_id) VALUES (1, 1, 6);
INSERT INTO answers (question_id, item_id, metadata_id) VALUES (2, 4, 6);
INSERT INTO answers (question_id, item_id, metadata_id) VALUES (3, 8, 6);
INSERT INTO answers (question_id, item_id, metadata_id) VALUES (4, 12, 6);
INSERT INTO answers (question_id, text_answer, metadata_id) VALUES (5, '20', 6);

-- indexのchunk-put用のデータ
INSERT INTO answer_metadata (created_date, user_id, update_user, updated_date, questionnair_id) VALUES ('2023-08-13', 'userD', 'userA', '2023-11-01', 1);
INSERT INTO answers (question_id, item_id, metadata_id) VALUES (1, 1, 7);
INSERT INTO answers (question_id, item_id, metadata_id) VALUES (2, 4, 7);
INSERT INTO answers (question_id, item_id, metadata_id) VALUES (3, 9, 7);
INSERT INTO answers (question_id, item_id, metadata_id) VALUES (4, 12, 7);
INSERT INTO answers (question_id, text_answer, metadata_id) VALUES (5, '20', 7);
-- 同一ユーザーの回答取得用データ
-- 「同一ユーザーの前回回答を取得する」が有効かつ「キーとなる質問」が指定されていない場合に取得するデータ
INSERT INTO answer_metadata (created_date, user_id, update_user, updated_date, questionnair_id) VALUES ('2023-08-14', 'test@PJHealthcheckWebForm.onmicrosoft.com', 'userA', '2023-11-01', 1);
INSERT INTO answers (question_id, item_id, metadata_id) VALUES (1, 2, 8);
INSERT INTO answers (question_id, item_id, metadata_id) VALUES (2, 4, 8);
INSERT INTO answers (question_id, item_id, metadata_id) VALUES (3, 9, 8);
INSERT INTO answers (question_id, item_id, metadata_id) VALUES (4, 12, 8);
INSERT INTO answers (question_id, text_answer, metadata_id) VALUES (5, '20', 8);
-- 「同一ユーザーの前回回答を取得する」が有効かつ「キーとなる質問」が指定されている場合に取得できるデータ
INSERT INTO answer_metadata (created_date, user_id, update_user, updated_date, questionnair_id) VALUES ('2023-08-12', 'test@PJHealthcheckWebForm.onmicrosoft.com', 'userA', '2023-11-01', 1);
INSERT INTO answers (question_id, item_id, metadata_id) VALUES (1, 1, 9);
INSERT INTO answers (question_id, item_id, metadata_id) VALUES (2, 4, 9);
INSERT INTO answers (question_id, item_id, metadata_id) VALUES (3, 7, 9);
INSERT INTO answers (question_id, item_id, metadata_id) VALUES (3, 8, 9);
INSERT INTO answers (question_id, item_id, metadata_id) VALUES (3, 9, 9);
INSERT INTO answers (question_id, item_id, metadata_id) VALUES (4, 12, 9);
INSERT INTO answers (question_id, text_answer, metadata_id) VALUES (5, '20', 9);