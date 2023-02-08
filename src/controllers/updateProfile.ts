import { Request, Response } from "express";
import { UserModel } from "../models/userModel";
import ResponseStatus from "../utils/response";
import { validateUpdatedUser } from "../validations/joiValidate";

const responseStatus = new ResponseStatus();

export const updateProfile = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    if (req.body.password) {
      responseStatus.setError(404, "you cannot update password");
      return responseStatus.send(res);
    }
    const { error } = validateUpdatedUser(req.body);
    if (error) {
      responseStatus.setError(401, error.message);
      return responseStatus.send(res);
    }
    const { id } = req.params;

    const updateUserProfile = await UserModel.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    responseStatus.setSuccess(200, "success", updateUserProfile);
    return responseStatus.send(res);
  } catch (error) {
    responseStatus.setError(404, "you cannot update password");
    return responseStatus.send(res);
  }
};
