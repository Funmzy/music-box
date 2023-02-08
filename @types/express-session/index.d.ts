import "express-session";
import { IUser } from "../../src/types/types";

declare module "express-session" {
  interface Session {
    passport: IUser;
  }
}
