import { connect } from "mongoose";

async function run(): Promise<void> {
  console.log("db connected");
  await connect("mongodb://127.0.0.1:27017/auth");
}

run().catch((err) => console.log(err));
