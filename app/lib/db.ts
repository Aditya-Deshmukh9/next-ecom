import mongoose from "mongoose";

let connection: typeof mongoose;

const url = "mongodb://127.0.0.1:27017/next_ecom";

const startDB = async () => {
  try {
    if (!connection) {
      connection = await mongoose.connect(url);
      console.log("DB Connection Successfully");

      return connection;
    }
  } catch (error) {
    console.log("DB not Connected");
    throw new Error((error as any).message);
  }
};

export default startDB;
