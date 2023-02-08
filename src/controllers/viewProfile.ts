import { Request, Response } from "express";
import { UserModel } from "../models/userModel";
import ResponseStatus from "../utils/response";

const responseStatus = new ResponseStatus();

export const viewProfile = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { id } = req.params;
    const viewUserProfile = await UserModel.findById(id);

    if (viewUserProfile) {
      responseStatus.setSuccess(200, "success", viewUserProfile);
      return responseStatus.send(res);
    }
    responseStatus.setError(404, "Cannot find user");
    return responseStatus.send(res);
  } catch (err) {
    responseStatus.setError(404, "Cannot find user");
    return responseStatus.send(res);
  }
};
