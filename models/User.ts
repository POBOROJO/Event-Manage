import { model, models, Schema } from "mongoose";
import bcrypt from "bcrypt";

const UserSchema = new Schema({
  name: { type: String, require: true },
  email: { type: String, require: true },
  password: { type: String, require: true },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
    require: true,
  },
  createdAt: { type: Date, default: Date.now },
});

UserSchema.pre("save", async function (next) {
  if (this.isModified("password") && typeof this.password === "string") {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

UserSchema.methods.comparePasswordc = async function(candidatePassword: string){
    return await bcrypt.compare(candidatePassword, this.password);
}

export default models.User || model("User", UserSchema);
