import mongoose from "mongoose";
import config from "../config";

class Database {
  fromTest: boolean;

  constructor(fromTest: boolean) {
    this.fromTest = fromTest;
  }

  async connect() {
    mongoose
      .connect(this.fromTest ? config.DB_ADDRESS_TEST : config.DB_ADDRESS)
      .then(() => {
        console.log("DB Connected");
      })
      .catch((error) => {
        console.log("Error with the connection", error);
      });
  }
}

export default Database;
export type { Database };
