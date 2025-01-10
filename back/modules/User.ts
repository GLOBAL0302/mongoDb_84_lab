import mongoose, {Model} from "mongoose";
import {randomUUID} from "node:crypto";
import {IUserField} from "../types";
import bcrypt from "bcrypt";



interface IUserMethods{
  checkPassword(password:string): Promise<boolean>;
  generateToken():void
}

type UserModel = Model<IUserField, {}, IUserMethods>

const Schema = mongoose.Schema;
const SALT_WORK_FACTORY = 10;
const UserSchema = new Schema<IUserField, UserModel, IUserMethods>({
  username:{
    type: String,
    unique: true,
    required: [true, 'Username is required'],
  },
  password:{
    type: String,
    required: [true, 'Password is required'],
  },
  token:{
    type:String,
    required: true,
  }
});

UserSchema.pre('save', async function(next){
  if(!this.isModified('password')){
    return next();
  }
  const salt = await bcrypt.genSalt(SALT_WORK_FACTORY);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.password;
    return ret;
  }
})

UserSchema.methods.checkPassword = async function(password:string){
  return bcrypt.compare(password, this.password);
}

UserSchema.methods.generateToken = async function(){
  this.token = randomUUID();
}


const User = mongoose.model("User", UserSchema);
export default User;