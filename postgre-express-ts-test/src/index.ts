import express, { NextFunction, Request, Response } from "express";
import { db } from './db';
const app = express();

app.use(express.json());

app.get("/", (req: Request, res: Response): void => {
  res.send("Hello Express");
});

app.get("/users", (req: Request, res: Response, next: NextFunction): void => {
    db.any("SELECT * FROM users")
    .then((data) => {
      return res.status(200).json(data);
    })
    .catch((error) => {
      next(error)
    });
});

// 特定のユーザーを取得する
app.get("/users/:id", (req: Request, res: Response, next: NextFunction): void => {
    const id = req.params.id;
    db.any("SELECT * FROM users WHERE id = $1", [id])
    .then((data) => {
      return res.status(200).json(data);
    })
    .catch((error) => {
      next(error)
    });
});



// ユーザーを追加する
app.post("/users", (req: Request, res: Response, next: NextFunction): void => {
    const {name, email, age} = req.body;
    // ユーザーがすでに存在しているかどうか確認
    db.any("SELECT s FROM users s WHERE s.email = $1", [email])
    .then((data) => {
      if(data.length) {
          return res.send("すでにユーザーが存在しています");
      }
      db.any("INSERT INTO users(name, email, age) values($1, $2, $3)", [name,email,age])
      .then((data) => {
        return res.status(201).send("ユーザー作成に成功しました");
      })
      .catch((error) => {
        next(error)
      });
    })
    .catch((error) => {
      next(error)
    });
});


// ユーザーを削除する
app.delete("/users/:email", (req: Request, res: Response, next: NextFunction): void => {
    const email = req.params.email;

    db.any("SELECT * FROM users WHERE email = $1", [email])
    .then((data) => {
      if(!data.length) {
        return res.send("ユーザーが存在しません");
      }
      db.any("DELETE FROM users WHERE email = $1", [email])
      .then((data) => {
        return res.status(200).json("削除に成功しました");
      })
      .catch((error) => {
        next(error)
      });
    })
    .catch((error) => {
      next(error)
    });

});


// ユーザーを更新する
app.put("/users/:email", (req: Request, res: Response, next: NextFunction): void => {
    const email = req.params.email;
    const name = req.body.name;

    db.any("SELECT * FROM users WHERE email = $1", [email])
    .then((data) => {
      if(!data.length) {
        return res.send("ユーザーが存在しません");
      }
      db.any("UPDATE users SET name = $1 WHERE email = $2", [name, email])
      .then((data) => {
        return res.status(200).json("更新に成功しました");
      })
      .catch((error) => {
        next(error)
      });
    })
    .catch((error) => {
      next(error)
    });

});


app.listen("3000", (): void => {
    console.log("Server Running!");
});