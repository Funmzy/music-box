import { validateUser } from "../validations/joiValidate";
import { Request, Response } from "express";
import { UserModel } from "../models/userModel";
import { generateToken } from "../utils/auth";
import ResponseStatus from "../utils/response";

const responseStatus = new ResponseStatus();

export const registerUser = async function (
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const { error } = validateUser(req.body);
    if (error) {
      responseStatus.setError(401, error.message);
      return responseStatus.send(res);
    }
    const { email, password, firstName, lastName, dateOfBirth, gender } =
      req.body;
    const exist = await UserModel.findOne({ email });
    if (exist) {
      responseStatus.setError(409, "user exist");
      return responseStatus.send(res);
    }

    const newUser = await new UserModel({
      email: email.toLowerCase(),
      password,
      firstName,
      lastName,
      dateOfBirth,
      gender,
    });
    await newUser.save();

    const token = generateToken(String(newUser._id));
    newUser.password = undefined;
    const today = new Date(Date.now());
    today.setDate(today.getDate() + 20);
    // const expiresIn = today;
    responseStatus.setSuccess(201, "successful", {
      data: newUser,
      token,
      tokenExpiresIn: today,
    });
    return responseStatus.send(res);
  } catch (error) {
    responseStatus.setError(401, "invalid credentials");
    return responseStatus.send(res);
  }
};

export async function loginUser(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const { password } = req.body;
    const email = req.body.email.toLowerCase();
    const user = await UserModel.findOne({ email });
    if (user && (await user.isPasswordMatch(password))) {
      const data = {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        gender: user.gender,
        dateOfBirth: user.dateOfBirth,
      };
      const today = new Date(Date.now());
      today.setDate(today.getDate() + 20);
      // const expiresIn = today;
      responseStatus.setSuccess(200, "success", {
        data,
        token: generateToken(user._id),
        tokenExpiresIn: today,
      });
      return responseStatus.send(res);
    }
    responseStatus.setError(400, "Invalid Credentials");
    return responseStatus.send(res);
  } catch (error) {
    responseStatus.setError(400, "Invalid Credentials");
    return responseStatus.send(res);
  }
}
