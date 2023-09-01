const express = require("express");
const pool = require("./db");
const app = express();
const PORT = 5000;

app.use(express.json());

app.get("/", (req, res) => {
    return res.send("Hello Express");
});


// ユーザー情報を全て取得する
app.get("/users", (req, res) => {
    pool.query("SELECT * FROM users", (error, result) => {
        if(error) throw error;
        return res.status(200).json(result.rows);
    });
});

// 特定のユーザーを取得する
app.get("/users/:id", (req, res) => {
    const id = req.params.id;
    pool.query("SELECT * FROM users WHERE id = $1", [id], (error, result) => {
        if(error) throw error;
        return res.status(200).json(result.rows);
    });
});


// ユーザーを追加する
app.post("/users", (req, res) => {
    const {name, email, age} = req.body;
    // ユーザーがすでに存在しているかどうか確認
    pool.query("SELECT s FROM users s WHERE s.email = $1", [email], (error, result) => {
        if(error) throw error;
        if(result.rows.length) {
            return res.send("すでにユーザーが存在しています");
        }
       
        pool.query("INSERT INTO users(name, email, age) values($1, $2, $3)", [name,email,age], (error, result) => {
            if(error) throw error;
            return res.status(201).send("ユーザー作成に成功しました");
        })
    });
});


// ユーザーを削除する
app.delete("/users/:email", (req, res) => {
    const email = req.params.email;


    pool.query("SELECT * FROM users WHERE email = $1", [email], (error, result) => {
        if(error) throw error;
        if(!result.rows.length) {
            return res.send("ユーザーが存在しません");
        }

        pool.query("DELETE FROM users WHERE email = $1", [email], (error, result) => {
            if(error) throw error;
            return res.status(200).json("削除に成功しました");
        });
    });


});


// ユーザーを更新する
app.put("/users/:email", (req, res) => {
    const email = req.params.email;
    const name = req.body.name;


    pool.query("SELECT * FROM users WHERE email = $1", [email], (error, result) => {
        if(error) throw error;
        if(!result.rows.length) {
            return res.send("ユーザーが存在しません");
        }

        pool.query("UPDATE users SET name = $1 WHERE email = $2", [name, email], (error, result) => {
            if(error) throw error;
            return res.status(200).json("更新に成功しました");
        });
    });


});


app.listen(PORT, () => {
    console.log("server is running on PORT " + PORT);
});