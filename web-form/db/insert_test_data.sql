INSERT INTO questionnairs (user_id, name, created_date, updated_date) VALUES ('test', 'PJ健康診断アンケート', '2023-07-21', '2023-07-21');

INSERT INTO question_types (question_type) VALUES ('select');
INSERT INTO question_types (question_type) VALUES ('radio');
INSERT INTO question_types (question_type) VALUES ('check');
INSERT INTO question_types (question_type) VALUES ('text');

INSERT INTO question_groups (name) VALUES ('開発環境');

INSERT INTO questions (question, question_type_id, headline, required, questionnair_id, priority) VALUES ('対象のアプリ・システム名を選択してください。', 1, 'システム名', TRUE, 1, 1);
INSERT INTO questions (question, question_type_id, headline, required, questionnair_id, group_id, can_inherit, priority) VALUES ('対象システムの開発手法を選択してください。', 2, '開発手法', TRUE, 1, 1, TRUE, 2);
INSERT INTO questions (question, question_type_id, headline, required, questionnair_id, group_id, can_inherit, priority) VALUES ('対象システムのサーバ基盤を選択してください。', 3, 'サーバーの土台', FALSE, 1, 1, TRUE, 3);
INSERT INTO questions (question, question_type_id, headline, required, questionnair_id, priority) VALUES ('コードのcommit/単体試験完了から本番環境稼働までの所要時間を選択してください。', 1, '変更のリードタイム', TRUE, 1, 4);
INSERT INTO questions (question, question_type_id, headline, required, questionnair_id, priority, is_deleted) VALUES ('削除された質問ですか？', 4, '削除済み質問', FALSE, 1, 5, TRUE);

INSERT INTO inheritances (questionnair_id, is_same_user, question_id) VALUES (1, FALSE, 1);

INSERT INTO question_items (question_id, item_name, is_discription, priority) VALUES (1, 'システムA', FALSE, 1);
INSERT INTO question_items (question_id, item_name, is_discription, priority) VALUES (1, 'システムB', FALSE, 2);
INSERT INTO question_items (question_id, item_name, is_discription, priority) VALUES (1, 'システムC', FALSE, 3);
INSERT INTO question_items (question_id, item_name, is_discription, priority) VALUES (2, 'アジャイル', FALSE, 1);
INSERT INTO question_items (question_id, item_name, is_discription, priority) VALUES (2, 'ウォーターフォール', FALSE, 2);
INSERT INTO question_items (question_id, item_name, is_discription, priority) VALUES (3, 'AWS', FALSE, 1);
INSERT INTO question_items (question_id, item_name, is_discription, priority) VALUES (3, 'GCP', FALSE, 2);
INSERT INTO question_items (question_id, item_name, is_discription, priority) VALUES (3, 'Azure', FALSE, 3);
INSERT INTO question_items (question_id, item_name, is_discription, priority) VALUES (3, 'ドコモ内オンプレ', FALSE, 4);
INSERT INTO question_items (question_id, item_name, is_discription, priority) VALUES (3, 'その他', TRUE, 5);
INSERT INTO question_items (question_id, item_name, is_discription, priority) VALUES (4, '1時間以内', FALSE, 1);
INSERT INTO question_items (question_id, item_name, is_discription, priority) VALUES (4, '1日以内', FALSE, 2);
INSERT INTO question_items (question_id, item_name, is_discription, priority) VALUES (4, '1週間以内', FALSE, 3);
INSERT INTO question_items (question_id, item_name, is_discription, priority) VALUES (4, 'それ以上', FALSE, 4);
INSERT INTO question_items (question_id, item_name, is_discription, priority) VALUES (5, 'xxxx', FALSE, 1);