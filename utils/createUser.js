import { runPoolQuery } from "../config/db.js";
import getNick from "./getNick.js";

const createUserIfNotExists = async (token) => {
  const nick = getNick(token);

  await runPoolQuery(
    "INSERT INTO Users (nick) VALUES ($1) ON CONFLICT DO NOTHING",
    [nick]
  );
};

export default createUserIfNotExists;
