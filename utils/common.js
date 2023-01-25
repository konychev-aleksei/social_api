import fs from "fs";
import moment from "moment";
import { runPoolQuery } from "../config/db.js";

class CommonUtils {
  static async createUserIfNotExists(token) {
    const nick = CommonUtils.getNick(token);

    await runPoolQuery(
      "INSERT INTO Users (nick) VALUES ($1) ON CONFLICT DO NOTHING",
      [nick]
    );
  }

  static getCurrentTime() {
    return moment(Date.now()).format("YYYY/MM/DD HH:mm:ss");
  }

  static formatTime(timeStamp) {
    return moment(timeStamp, "YYYY/MM/DD HH:mm:ss").format("DD-MM-YYYY");
  }

  static async saveBase64Image(base64Image, name) {
    const base64Data = base64Image.replace(/^data:image\/png;base64,/, "");
    await fs.writeFile(`${name}.png`, base64Data, "base64");
  }

  static getNick(token) {
    if (!token) {
      return null;
    }

    try {
      return JSON.parse(
        Buffer.from(token.split(".")[1], "base64").toString()
      ).email.split("@")[0];
    } catch (err) {
      return null;
    }
  }
}

export default CommonUtils;
