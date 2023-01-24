import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import PostRoutes from "./components/Post/routes.js";
import CommentRoutes from "./components/Comment/routes.js";
import createTables from "./utils/createTables.js";

const PORT = 5005;

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use("/post", PostRoutes);
app.use("/comment", CommentRoutes);

(async () => {
  await createTables();
  app.listen(PORT, () => {
    console.log(`Сервер запущен на порте ${PORT}.`);
  });
})();
