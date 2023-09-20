import express, { Request, Response } from "express";
import { pool } from './db';
const app = express();

app.use(express.json());

app.get("/", (req: Request, res: Response): void => {
  res.send("Hello Express");
});

app.get("/users", (req: Request, res: Response): void => {
    pool.query("SELECT * FROM users", (error, result) => {
        if(error) throw error;
        return res.status(200).json(result.rows);
    });
});

// export const getUserById = async (req: Request, res: Response): Promise<Response> => {
//     const id = parseInt(req.params.id);
//     const response: QueryResult = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
//     return res.json(response.rows);
// };

// export const createUser = async (req: Request, res: Response) => {
//     const { name, email } = req.body;
//     const response = await pool.query('INSERT INTO users (name, email) VALUES ($1, $2)', [name, email]);
//     res.json({
//         message: 'User Added successfully',
//         body: {
//             user: { name, email }
//         }
//     })
// };

// export const updateUser = async (req: Request, res: Response) => {
//     const id = parseInt(req.params.id);
//     const { name, email } = req.body;

//     const response = await pool.query('UPDATE users SET name = $1, email = $2 WHERE id = $3', [
//         name,
//         email,
//         id
//     ]);
//     res.json('User Updated Successfully');
// };

// export const deleteUser = async (req: Request, res: Response) => {
//     const id = parseInt(req.params.id);
//     await pool.query('DELETE FROM users where id = $1', [
//         id
//     ]);
//     res.json(`User ${id} deleted Successfully`);
// };

app.listen("3000", (): void => {
    console.log("Server Running!");
});