import express from "express";
import cors from "cors";
import * as mongoose from "mongoose";
import config from "./config";
import mongoDb from "./mongoDb";
import MongoDb from "./mongoDb";
import usersRouter from "./routers/users";
import tasksRouter from "./routers/tasks";

const app = express();
const port  = 8000;

app.use(express.json());
app.use(cors());

app.use("/users", usersRouter);
app.use("/tasks", tasksRouter);


const run = async()=>{
    await mongoose.connect(config.db);

    app.listen(port, ()=>{
        console.log(`Server running on http://localhost:${port}`);
    });

    process.on("exit", () => {
        mongoose.disconnect();
    });
}

run().catch(err=>{
    console.error(err);
})
