import supertest from "supertest";
import app from "../app";
import { dbDisconnect } from "../database/mongoMemoryConnect";

// const id = "";
const userData: Record<string, any> = {};
const url = "/api/v1/music-box-api/";

afterAll(async () => {
  await dbDisconnect();
});

beforeAll(async () => {
  const logUser = {
    firstName: "Amazing",
    lastName: "Oduye",
    password: "123456",
    email: "g@gmail.com",
    gender: "F",
    dateOfBirth: "2000/05/12",
  };
  await supertest(app)
    .post("/api/v1/music-box-api/users/register")
    .send(logUser);
});
describe("User  Login", () => {
  it("should create login a registered user", async () => {
    const logUser = {
      email: "g@gmail.com",
      password: "123456",
    };
    const res = await supertest(app).post(`${url}users/login`).send(logUser);

    userData.id = res.body.data._id;
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("data");
    expect(res.body.data).toHaveProperty("token");
    expect(res.body).toHaveProperty("status");
    expect(res.body.status).toEqual("successful");
  });
});
