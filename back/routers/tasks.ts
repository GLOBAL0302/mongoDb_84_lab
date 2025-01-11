import express from "express";
import {Error} from "mongoose";
import auth, {RequestWithUser} from "../middleware/auth";
import Task from "../modules/Task";

const tasksRouter = express.Router();


tasksRouter.get('/', auth, async (req, res, next)=>{
  try{
    let expressReq = req as RequestWithUser;
    const user = expressReq.user;

    const tasks = await Task.find({user:user._id});
    res.status(200).send(tasks);

  }catch(e){
    if(e instanceof Error.ValidationError){
      res.status(400).send({error:e.message})
    }
    next(e)
  }
});

tasksRouter.put('/:id', auth, async (req, res, next)=>{
  try{
    const {id} = req.params;
    const {title, description, status} = req.body;

    if(!id)res.status(404).send({error:"Id Required"});

    let expressReq = req as RequestWithUser;
    const user = expressReq.user;

    const task = await Task.findByIdAndUpdate({_id:id},{
      title, description, status
    });

    if(!task){
      res.status(404).send({error:"No task with that id"});
      return
    }

    if(task.user.toString() !== user._id.toString()){
      res.status(403).send({error:"can not update other's task"});
      return
    }
    await task.save();
    res.status(200).send(`${id} has been updated`);
  }catch(e){
    if(e instanceof Error.ValidationError){
      res.status(400).send({error:e.message});
    }
    next(e);
  }
});


tasksRouter.delete('/:id', auth, async (req, res, next)=>{
  try{
    const {id} = req.params;
    const expressReq = req as RequestWithUser;
    const user = expressReq.user;
    const task = await Task.findOne({_id:id});

    if(!task){
      res.status(404).send({error:"No task with that id"});
      return
    }

    console.log(task.user.toString() , user.id.toString());


    if(task.user.toString() !== user.id.toString()){
      res.status(403).send({error:"can not delete Other's task"});
      return
    }

    await Task.deleteOne({_id:id});

    res.status(200).send({message:"Task has been deleted successfully"});

  }catch(e){
    if(e instanceof Error.ValidationError){
      res.status(400).send({message:e.message});
    }
    next(e)
  }
})


tasksRouter.post('/',auth,async (req, res, next) => {
  try {
    const {title, description, status} = req.body;
    let expressReq = req as RequestWithUser;
    const user = expressReq.user;

    const newTask = new Task({
      user,
      title,
      description,
      status
    });

    await newTask.save();
    res.send(newTask);
  }catch (error) {
    if(error instanceof Error.ValidationError) {
      res.status(500).send({error: error.message});
      return
    }
  }
});

export default tasksRouter;

