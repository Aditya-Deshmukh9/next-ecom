import mongoose from "mongoose";

let connection: typeof mongoose;

const url = process.env.DATABASE_URL;

const startDB = async () => {
  try {
    if (!connection) {
      connection = await mongoose.connect(url as string);
      console.log("DB Connection Successfully");

      return connection;
    }
  } catch (error) {
    console.log("DB not Connected");
    throw new Error((error as any).message);
  }
};

export default startDB;
