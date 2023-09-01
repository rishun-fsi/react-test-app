## 事前準備
```
$ npx tsc --init
$ npm init -y
$ npm i express nodemon pg
```

## package.json 修正
```
"start": "node server.js"
↓
"start": "nodemon server.js"
```

## postgresql
```
# \l
# CREATE DATABASE users;
# \! cls
# \c users
# CREATE TABLE users (
    ID serial primary key,
    name varchar(255),
    email varchar(255),
    age int);
# \dt
# insert into users (name, email, age)
# values ('user1', 'user1@gmail.com', 22),  ('user2', 'user2@gmail.com', 33); 
# select * from users;  
```