import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/userModel";
import sendEmail from "../utils/mail/sendEmail";

export const requestPasswordReset = async (
  email: string,
  url: string
): Promise<any> => {
  // Check if the user exists
  const user = await UserModel.findOne({ email });
  if (!user) throw new Error("User with this email does not exist");

  // Generate a new token with jwt
  const newToken = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET_KEY as string,
    {
      expiresIn: "1h",
    }
  );

  /**
   * Link to be implemented by frontend
   * ClientURL to be frontend route
   */
  const link = `${url}/token=${newToken}`;

  sendEmail(
    user.email,
    "Password Reset",
    { name: user.firstName, link },
    "requestMail.hbs"
  );
  return { link, token: newToken };
};

export const resetPassword = async (
  password: string,
  token: string
): Promise<any> => {
  try {
    const decodedUser = <any>(
      jwt.verify(token, process.env.JWT_SECRET_KEY as string)
    );
    const isValid = await UserModel.findById(decodedUser.id);
    if (!isValid) throw new Error("User does not exist");
    const newPassword = await bcrypt.hash(password, 10);
    const user = await UserModel.findByIdAndUpdate(
      decodedUser.id,
      {
        $set: {
          password: newPassword,
        },
      },
      { new: true }
    );
    sendEmail(
      user.email,
      "Password Reset Successfully",
      { name: user.firstName },
      "resetSuccessMail.hbs"
    );

    return "Password has been reset successfully";
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
};
