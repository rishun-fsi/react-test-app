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
INSERT INTO answer_metadata (created_date, user_id, update_user, updated_date, questionnair_id) VALUES ('2023-10-01', 'userZ', 'userY', '2023-10-10', 1);
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

-- /answer/inheritance get用のデータ
-- これ以上に新しい日付のデータを作成しないでください。
INSERT INTO answer_metadata (created_date, user_id, update_user, updated_date, questionnair_id) VALUES ('2024-01-01', 'inheritance-user', 'userA', '2024-11-01', 1);
INSERT INTO answers (question_id, item_id, metadata_id) VALUES (1, 2, 8);
INSERT INTO answers (question_id, item_id, metadata_id) VALUES (2, 4, 8);
INSERT INTO answers (question_id, item_id, metadata_id) VALUES (3, 6, 8);
INSERT INTO answers (question_id, item_id, metadata_id) VALUES (4, 12, 8);
INSERT INTO answers (question_id, text_answer, metadata_id) VALUES (5, '5', 8);
INSERT INTO answer_metadata (created_date, user_id, update_user, updated_date, questionnair_id) VALUES ('2024-01-02', 'inheritance-user', 'userA', '2024-11-01', 1);
INSERT INTO answers (question_id, item_id, metadata_id) VALUES (1, 1, 9);
INSERT INTO answers (question_id, item_id, metadata_id) VALUES (2, 4, 9);
INSERT INTO answers (question_id, item_id, metadata_id) VALUES (3, 9, 9);
INSERT INTO answers (question_id, item_id, metadata_id) VALUES (4, 12, 9);
INSERT INTO answers (question_id, text_answer, metadata_id) VALUES (5, '20', 9);
INSERT INTO answer_metadata (created_date, user_id, update_user, updated_date, questionnair_id) VALUES ('2024-01-03', 'inheritance-user2', 'userA', '2024-11-01', 1);
INSERT INTO answers (question_id, item_id, metadata_id) VALUES (1, 1, 10);
INSERT INTO answers (question_id, item_id, metadata_id) VALUES (2, 5, 10);
INSERT INTO answers (question_id, item_id, metadata_id) VALUES (3, 8, 10);
INSERT INTO answers (question_id, item_id, metadata_id) VALUES (4, 13, 10);
INSERT INTO answers (question_id, text_answer, metadata_id) VALUES (5, '15', 10);

-- /answer delete用のデータ
INSERT INTO answer_metadata (created_date, user_id, update_user, updated_date, questionnair_id) VALUES ('2023-08-12', 'userD', 'userA', '2023-11-01', 1);
INSERT INTO answers (question_id, item_id, metadata_id) VALUES (1, 1, 11);
INSERT INTO answers (question_id, item_id, metadata_id) VALUES (2, 4, 11);
INSERT INTO answers (question_id, item_id, metadata_id) VALUES (3, 8, 11);
INSERT INTO answers (question_id, item_id, metadata_id) VALUES (4, 12, 11);
INSERT INTO answers (question_id, text_answer, metadata_id) VALUES (5, '20', 11);
INSERT INTO answer_metadata (created_date, user_id, update_user, updated_date, questionnair_id) VALUES ('2023-08-12', 'userD', 'userA', '2023-11-01', 1);
INSERT INTO answers (question_id, item_id, metadata_id) VALUES (1, 1, 12);
INSERT INTO answers (question_id, item_id, metadata_id) VALUES (2, 4, 12);
INSERT INTO answers (question_id, item_id, metadata_id) VALUES (3, 8, 12);
INSERT INTO answers (question_id, item_id, metadata_id) VALUES (4, 12, 12);
INSERT INTO answers (question_id, text_answer, metadata_id) VALUES (5, '20', 12);
INSERT INTO answer_metadata (created_date, user_id, update_user, updated_date, questionnair_id) VALUES ('2023-08-12', 'userD', 'userA', '2023-11-01', 2);
INSERT INTO answers (question_id, item_id, metadata_id) VALUES (7, 15, 13);

-- /answer indexc delete用のデータ
INSERT INTO answer_metadata (created_date, user_id, update_user, updated_date, questionnair_id) VALUES ('2023-08-12', 'userD', 'userA', '2023-11-01', 1);
INSERT INTO answers (question_id, item_id, metadata_id) VALUES (1, 1, 14);
INSERT INTO answers (question_id, item_id, metadata_id) VALUES (2, 4, 14);
INSERT INTO answers (question_id, item_id, metadata_id) VALUES (3, 8, 14);
INSERT INTO answers (question_id, item_id, metadata_id) VALUES (4, 12, 14);
INSERT INTO answers (question_id, text_answer, metadata_id) VALUES (5, '20', 14);

--/notification get-one用のデータ
INSERT INTO notifications(title,content,created_date,updated_date,publish_timestamp,expire_timestamp,user_id,type_id) VALUES('test1_title','test1_content','2023-10-01','2023-10-06','2000-01-01','2500-01-01','yosiki.yokoyama.fd@s1.nttdocomo.com',1);
INSERT INTO notifications(title,content,created_date,publish_timestamp,expire_timestamp,user_id,type_id) VALUES('test2_title','test2_content','2023-10-01','2000-01-01','2500-01-01','yosiki.yokoyama.fd@s1.nttdocomo.com',1)
