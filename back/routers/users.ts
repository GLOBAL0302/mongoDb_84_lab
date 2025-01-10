import express from "express";
import {Error} from "mongoose"
import User from "../modules/User";

const usersRouter = express.Router();


usersRouter.post("/", async (req, res, next) => {
  try{
    const user = new User({
      username:req.body.username,
      password:req.body.password,
    });
    user.generateToken();
    await user.save();
    res.status(200).send(user)
  }catch(e){
    if(e instanceof Error.ValidationError){
      res.status(400).send({error:e.message})
    }
    next(e)
  }
})

usersRouter.post("/sessions", async (req, res, next) => {
  try{
    const user = await User.findOne({
      username:req.body.username
    });

    if(!user){
      res.status(400).send({error:"User not found"});
      return;
    }

    const isMatch = await user.checkPassword(req.body.password);
    if(!isMatch){
      res.status(400).send({error:"Wrong Password"});
      return
    }

    user.generateToken();
    await user.save();
    res.status(200).send({message:"Session successfully created", user});

  }catch(e){
    if(e instanceof Error.ValidationError){
      res.status(400).send({error:e.message})
    }
    next(e)
  }
});

export default usersRouter