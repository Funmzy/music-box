import jwt from "jsonwebtoken";

export const generateToken = function (userId: string): string {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET_KEY as string, {
    expiresIn: "20d",
  });
};
