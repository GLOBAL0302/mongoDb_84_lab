import mongoose, {Schema, Types} from "mongoose";

const schema = mongoose.Schema

const taskSchema = new Schema({
  user:{
    type:Schema.Types.ObjectId,
    Ref:"User",
    required:[true, "User is required for task"],
  },
  title:{
    type:String,
    required:[true, 'Title required for task'],
  },
  description:{
    type:String,
    default:null
  },
  status: {
    type:String,
    enum:["new","in_progress", "completed"],
    required:[true, 'Status is required for task']
  }
});


const Task = mongoose.model("Task", taskSchema);
export default Task;