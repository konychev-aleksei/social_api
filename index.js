import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import rootRouter from "./router.js";

const PORT = 5005 || process.env.PORT;

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use("/", rootRouter);

app.listen(PORT, () => {
  console.log(`Сервер запущен на порте ${PORT}.`);
});
