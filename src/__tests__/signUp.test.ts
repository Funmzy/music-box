import supertest from "supertest";
import app from "../app";
import { dbDisconnect } from "../database/mongoMemoryConnect";

// const id = "";
const userData: Record<string, any> = {};
const url = "/api/v1/music-box-api/";

afterAll(async () => {
  await dbDisconnect();
});

describe("User  Register ANd Authentication", () => {
  it("should create an account for a new user", async () => {
    const logUser = {
      firstName: "Amazing",
      lastName: "Oduye",
      password: "123456",
      email: "g@gmail.com",
      gender: "F",
      dateOfBirth: "2000/05/12",
    };
    const res = await supertest(app).post(`${url}users/register`).send(logUser);
    userData.id = res.body.data.data._id;
    userData.token = res.body.data.token;
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("data");
    expect(res.body.data).toHaveProperty("token");
    expect(res.body).toHaveProperty("status");
    expect(res.body.status).toEqual("successful");
  });
});
