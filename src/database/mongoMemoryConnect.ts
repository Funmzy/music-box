/* eslint-disable no-console */
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

const mongoServer = new MongoMemoryServer();

export const dbConnect = async (): Promise<void> => {
  const uri = await mongoServer.getUri();

  const mongooseOpts = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  };

  mongoose
    .connect(uri, mongooseOpts)
    .then(() => console.log("info", "connected to memory-server"))
    .catch(() => console.log("error", "could not connect"));
};

export const dbDisconnect = async (): Promise<void> => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
};
