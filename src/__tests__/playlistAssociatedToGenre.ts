import app from "../app";
import request from "supertest";
import { dbDisconnect } from "../database/mongoMemoryConnect";

const currentUser: Record<string, string> = {};
const url = "/api/v1/music-box-api";
afterAll(async () => {
  await dbDisconnect();
});

describe("test relating to Auth", () => {
  it("for Register", async () => {
    const res = await request(app).post(`${url}/users/register`).send({
      firstName: "emeka",
      lastName: "okwor",
      email: "emeka@gmail.com",
      password: "12345",
      dateOfBirth: "2021/12/23",
      gender: "M",
    });
    expect(res.status).toBe(201);
    expect(res.body.data.data.email).toBe("emeka@gmail.com");
  });
  it("for Login", async () => {
    const res = await request(app).post(`${url}/users/login`).send({
      email: "emeka@gmail.com",
      password: "12345",
    });
    currentUser.token = res.body.token;
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty("token");
    expect(res.body.data.data.email).toBe("emeka@gmail.com");
    currentUser.token = res.body.data.token;
  });
});

describe("Get all artists related to a genre", () => {
  it("Should return all artists related to a genre", async () => {
    const res = await request(app)
      .get(`${url}/genres/artist/0`)
      .set("authorization", `Bearer ${currentUser.token}`);

    expect(res.status).toBe(200);
    expect(res.body.status).toBe("successful");
    expect(res.body).toHaveProperty("data");
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});

describe("Get all playlist associated to a genre", () => {
  it("Should return all artists related to a genre", async () => {
    const res = await request(app)
      .get(`${url}/genres/playlist/60b9f1b419b9c20834797ec3`)
      .set("authorization", `Bearer ${currentUser.token}`);

    expect(res.status).toBe(200);
    expect(res.body.status).toBe("successful");
    expect(res.body).toHaveProperty("data");
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});
