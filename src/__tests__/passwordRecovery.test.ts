/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable prefer-destructuring */
import request from "supertest";
import app from "../app";
import { dbDisconnect } from "../database/mongoMemoryConnect";

let token: string;
const url = "/api/v1/music-box-api/users";
const userInfo = {
  firstName: "David",
  lastName: "Adejo",
  gender: "Male",
  dateOfBirth: "1995/10/11",
  email: "emmanuelhemarxyll12@gmail.com",
  password: "emma123",
};
const newPassword = "newPass123";

beforeAll(async () => {
  await request(app).post(`${url}/register`).send(userInfo);
});

afterAll(async () => {
  await dbDisconnect();
});

describe("Request Password Recovery", () => {
  it("should generate a password recovery link for user", async () => {
    const res = await request(app)
      .post(`${url}/requestPasswordReset`)
      .send({ email: userInfo.email });
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe("successful");
    expect(res.body.data).toHaveProperty("link");
    expect(res.body.data).toHaveProperty("token");
    token = res.body.data.token;
  });
});

describe("Reset Password", () => {
  it("should change password successfully", async () => {
    const res = await request(app)
      .put(`${url}/resetPassword`)
      .send({ password: newPassword })
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.data.status === res.body.status).toBe(true); // they should both be "successful"
  });

  it("should log user in with new password", async () => {
    const res = await request(app)
      .post(`${url}/login`)
      .send({ email: userInfo.email, password: newPassword });

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe("successful");
    expect(res.body.data).toHaveProperty("token");
  });
});
