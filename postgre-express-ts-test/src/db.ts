import pgPromise from 'pg-promise';

const pgp = pgPromise({/* Initialization Options */});

const connection = {
    user: 'postgres',
    host: 'localhost',
    password: 'postgre',
    database: 'users',
    port: 5432
};
 
export const db = pgp(connection);
 
