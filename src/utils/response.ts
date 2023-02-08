import { ResponseData } from "../types/types";
import { Response } from "express";

class ResponseStatus {
  statusCode: number | null;

  status: string | null;

  data: ResponseData | null;

  message: string | null;

  constructor() {
    this.statusCode = null;
    this.status = null;
    this.data = null;
    this.message = null;
  }

  setSuccess(statusCode: number, message: string, data: ResponseData): void {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.status = "successful";
  }

  setError(statusCode: number, message: string): void {
    this.statusCode = statusCode;
    this.message = message;
    this.status = "error";
  }

  send(res: Response): Response {
    const result = {
      status: this.status,
      message: this.message,
      data: this.data,
    };

    if (this.status === "successful") {
      return res.status(this.statusCode ? this.statusCode : 200).json(result);
    }

    return res.status(this.statusCode ? this.statusCode : 500).json({
      status: this.status,
      message: this.message,
      data: [],
    });
  }
}
export default ResponseStatus;
