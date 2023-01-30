import fs from "fs";
import moment from "moment";
import formidable from "formidable";
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

  static async saveImageById(image, id) {
    if (image) {
      await fs.rename(image.filepath, `./public/${id}.png`, (error) => {
        if (error) {
          throw new UnprocessableEntityError(error);
        }
      });
    }
  }

  static async parseFormData(req) {
    const form = new formidable.IncomingForm({ multiples: true });

    return new Promise((resolve, reject) => {
      form.parse(req, (error, fields, files) => {
        if (error) {
          reject(error);
        }

        console.log("ttt", fields);

        resolve({
          ...fields,
          ...files,
        });
      });
    });
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
