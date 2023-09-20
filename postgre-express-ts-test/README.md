## 事前準備
```
$ npm init -y
$ npm i express pg-promise
$ npm i -D nodemon typescript ts-node
$ npx tsc --init
$ npm i -D @types/express @types/pg-promise
```

## package.json 修正
```
  "scripts": {
    "start": "node ./build/index.js",
    "build": "tsc -p .",
    "dev": "nodemon ./src/index.ts"
  },
```

## tsconfig.json 修正
```
"target": "es2020",  

"rootDir": "./src", 
"moduleResolution": "node",  

"outDir": "./dist", 
```

## postgresql
```
$ psql -h localhost -p 5432 -U postgres -d postgres -f ../web-form/db/init.sql

$ psql -h localhost -p 5432 -U postgres -d postgres -f ../web-form/db/insert_test_data.sql

$ psql -h localhost -p 5432 -U postgres -d postgres

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