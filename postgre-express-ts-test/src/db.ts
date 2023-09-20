import * as pgPromise from 'pg-promise';

const pgp = pgPromise({/* Initialization Options */});

const connection = {
    user: 'postgres',
    host: 'localhost',
    password: 'postgres',
    database: 'postgres',
    port: 5432
};
 
export const db = pgp(connection);
 
