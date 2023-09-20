// import * as pgPromise from 'pg-promise';
// import * as pg from 'pg-promise/typescript/pg-subset';

// const pgp = pgPromise({});

// export const connectDB = (
//   password: string
// ): pgPromise.IDatabase<Record<string, never>, pg.IClient> => {
//   const proxyEndpoint = process.env['DB_ENDPOINT'];
//   const username = 'postgres';
//   const database = 'postgres';
//   const cn = {
//     host: proxyEndpoint,
//     port: 5432,
//     database: database,
//     user: username,
//     password: password,
//     allowExitOnIdle: true,
//     ssl: process.env['STAGE'] !== 'test'
//   };

//   const db = pgp(cn);
//   return db;
// };
