import express from "express";
import { myDataSource } from "./app-data-source.js";
import { ChangesHistory } from "./src/entity/changesHistory.entity.js";
import { Between } from "typeorm";

const { PORT = 3000 } = process.env;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

myDataSource
  .initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
  })
  .catch((err) => {
    console.error("Error during Data Source initialization:", err);
  });

app.get("/history", async function (req, res) {
  const offset = req.query.offset;
  const limit = req.query.limit;
  const results = await myDataSource
    .getRepository(ChangesHistory)
    .findAndCount({
      where: [
        {
          plu: req.body.plu,
          historyActionName: req.body.historyActionName,
          shop_id: req.body.shop_id,
          createdAt: Between(
            new Date(req.body.begining).toISOString(),
            new Date(req.body.ending).toISOString()
          ),
        },
      ],
      skip: offset,
      take: limit,
    });
  return res.send(results);
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(PORT, () => {
  console.log("Example app listening on port 3000!");
});
