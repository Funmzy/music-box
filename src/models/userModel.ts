import { Schema, model } from "mongoose";
import { IUser } from "../types/types";
import bcrypt from "bcryptjs";

const userSchema = new Schema<IUser>(
  {
    email: { type: String, require: true, unique: true },
    firstName: { type: String, require: true },
    lastName: { type: String, require: true },
    dateOfBirth: { type: Date, require: true },
    gender: { type: String, require: true },
    last_login: { type: Date, default: Date.now() },
    provider: {
      type: String,
      enum: ["local", "google", "facebook"],
      default: "local",
    },
    password: {
      type: String,
    },
  },
  { timestamps: true }
);
userSchema.methods.toJSON = function () {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const user = this;
  const userObject = user.toObject();

  delete userObject.password;

  return userObject;
};
// hash password
userSchema.pre("save", async function (next) {
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password as string, salt);
    next();
  } catch (error) {
    // eslint-disable-next-line no-console
  }
});
// verify password
userSchema.methods.isPasswordMatch = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password as string);
};
export const UserModel = model("User", userSchema);
