import { Request, Response } from "express";
import {
  requestPasswordReset,
  resetPassword,
} from "../services/resetPassword.service";
import ResponseStatus from "../utils/response";
import { validateUserPassword } from "../utils/passwordValidate";

const response = new ResponseStatus();

export const requestPasswordResetController = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const resp = await requestPasswordReset(
      req.body.email.toLowerCase(),
      req.body.client_url
    );
    if (!resp) {
      response.setError(400, resp);
      return response.send(res);
    }
    response.setSuccess(200, "password reset request successful", { ...resp });
    return response.send(res);
  } catch (error: any) {
    response.setError(400, error.message);
    return response.send(res);
  }
};

export const resetPasswordController = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { error } = validateUserPassword({ password: req.body.password });
    if (error) {
      response.setError(400, "Invalid password format");
      return response.send(res);
    }
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      const token = req.headers.authorization.split(" ")[1];
      const resp = await resetPassword(req.body.password, token);
      if (!resp) {
        response.setError(400, resp);
        return response.send(res);
      }
      response.setSuccess(200, resp, {
        status: "successful",
      });
      return response.send(res);
    }
    response.setError(400, "Not authorized.");
    return response.send(res);
  } catch (error) {
    response.setError(400, "password reset failed");
    return response.send(res);
  }
};
