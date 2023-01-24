import { runPoolQuery } from "../config/db.js";

const createTables = async () => {
  try {
    await runPoolQuery(`
        CREATE TABLE IF NOT EXISTS Users (
            nick VARCHAR (31) PRIMARY KEY
        );
    `);

    await runPoolQuery(`
        CREATE TABLE IF NOT EXISTS Posts (
            id SERIAL PRIMARY KEY,
            location VARCHAR (63) NOT NULL,
            description VARCHAR (255) NOT NULL,
            tags VARCHAR (8),
            created_on TIMESTAMP NOT NULL,
            author_nick VARCHAR (31) NOT NULL,
            FOREIGN KEY (author_nick) REFERENCES Users (nick) ON DELETE CASCADE
        );
    `);

    await runPoolQuery(`
        CREATE TABLE IF NOT EXISTS Likes (
            nick VARCHAR (31) NOT NULL,
            FOREIGN KEY (nick) REFERENCES Users (nick) ON DELETE CASCADE,
            post_id INTEGER NOT NULL,
            FOREIGN KEY (post_id) REFERENCES Posts (id) ON DELETE CASCADE
        );
    `);

    await runPoolQuery(`
        CREATE TABLE IF NOT EXISTS Comments (
            id SERIAL PRIMARY KEY,
            post_id INTEGER NOT NULL,
            FOREIGN KEY (post_id) REFERENCES Posts (id) ON DELETE CASCADE,
            comment VARCHAR (255) NOT NULL,
            created_on TIMESTAMP NOT NULL,
            author_nick VARCHAR (31) NOT NULL,
            FOREIGN KEY (author_nick) REFERENCES Users (nick) ON DELETE CASCADE
        );
    `);

    console.log("Таблицы успешно добавлены.");
  } catch (e) {
    console.log("Ошибка добавления таблиц.", e);
  }
};

export default createTables;
