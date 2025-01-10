import mongoose, {Schema, Types} from "mongoose";

const schema = mongoose.Schema

const taskSchema = new Schema({
  user:{
    type:Schema.Types.ObjectId,
    Ref:"User",
    required:true,
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
  }
});


const Task = mongoose.model("Task", taskSchema);
export default Task;