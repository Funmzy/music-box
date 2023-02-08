import bcrypt from "bcryptjs";
import { Response, Request } from "express";
import { UserModel } from "../models/userModel";
import ResponseStatus from "../utils/response";
import { validateUserPassword } from "../utils/passwordValidate";

const responseStatus = new ResponseStatus();

export async function changePassword(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    // check parameter for user id and return error if no id
    if (!req.params.id) {
      responseStatus.setError(404, "bad request, no id specified");
      return responseStatus.send(res);
    }

    // find user by the request id
    const user = await UserModel.findById(req.params.id);

    // if no suer found in database, return error
    if (!user) {
      responseStatus.setError(404, "user not found");
      return responseStatus.send(res);
    }

    // get old and new password from request body and validate newPassword with joi
    const { newPassword, oldPassword } = req.body;
    const { error } = validateUserPassword({ password: newPassword });

    // if joi error property exists, return error response
    if (error) {
      responseStatus.setError(400, error.message);
      return responseStatus.send(res);
    }

    // if old and new password are the same, return error
    if (newPassword === oldPassword) {
      responseStatus.setError(
        400,
        "new password should not be same with old password"
      );
      return responseStatus.send(res);
    }

    // verify old password against the old password in the database
    const compare = await bcrypt.compare(oldPassword, user.password);

    // if no match return error
    if (!compare) {
      responseStatus.setError(401, "password mis-match");
      return responseStatus.send(res);
    }

    // hash the new password
    const salt = await bcrypt.genSalt(10);
    const newHashedPassword = await bcrypt.hash(newPassword, salt);

    // replace old password with new and update database
    user.password = newHashedPassword;

    const data = await UserModel.findByIdAndUpdate(user._id, user, {
      new: true,
      runValidators: true,
    });

    // if no data returned, return an error
    if (!data) {
      responseStatus.setError(500, "could not update");
      return responseStatus.send(res);
    }

    // return successfully updated
    responseStatus.setSuccess(200, "Successfully Updated", data);
    return responseStatus.send(res);
  } catch (error) {
    responseStatus.setError(500, "could not update");
    return responseStatus.send(res);
  }
}
