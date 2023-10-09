\encoding UTF8;

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