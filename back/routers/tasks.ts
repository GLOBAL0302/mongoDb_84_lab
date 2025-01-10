import express from "express";
import {Error} from "mongoose";

const tasksRouter = express.Router();


tasksRouter.get('/', (req, res, next) => {
  try {

  }catch (error) {
    if(error instanceof Error.ValidationError) {
      res.status(500).send({error: error.message});
      return
    }
  }
});

