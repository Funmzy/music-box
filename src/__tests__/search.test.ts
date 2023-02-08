import request from "supertest";
import app from "../app";
import { dbDisconnect } from "../database/mongoMemoryConnect";
// const userData: Record<string, any> = {};

let token: string;
const url = "/api/v1/music-box-api/";
const userInfo = {
  firstName: "David",
  lastName: "Adejo",
  gender: "Male",
  dateOfBirth: "1995/10/11",
  email: "emmanuelhemarxyll12@gmail.com",
  password: "emma123",
};
beforeAll(async () => {
  await request(app).post(`${url}users/register`).send(userInfo);
  const res = await request(app)
    .post("/api/v1/music-box-api/users/login")
    .send({ email: userInfo.email, password: userInfo.password });
  token = res.body.data.token as string;
});
afterAll(async () => {
  await dbDisconnect();
});
describe("search playlist album artist", () => {
  it("should create an account for a new user", async () => {
    const res = await request(app)
      .get(`${url}search?name=eniment`)
      .set("Authorization", `Bearer ${token}`);
    // id = res.body.data._id;
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("data");
    expect(res.body).toHaveProperty("status");
    expect(res.body.status).toEqual("successful");
  });
});
