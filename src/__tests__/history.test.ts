/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import request from "supertest";
import app from "../app";
import { dbDisconnect } from "../database/mongoMemoryConnect";

const trackId = 3201220;
let token: string;
const url = "/api/v1/music-box-api/history";
const userInfo = {
  firstName: "David",
  lastName: "Adejo",
  gender: "Male",
  dateOfBirth: "1995/10/11",
  email: "emmanuelhemarxyll12@gmail.com",
  password: "emma123",
};
let timestamp: Date;
beforeAll(async () => {
  await request(app)
    .post("/api/v1/music-box-api/users/register")
    .send(userInfo);
  const res = await request(app)
    .post("/api/v1/music-box-api/users/login")
    .send({ email: userInfo.email, password: userInfo.password });
  token = res.body.data.token as string;
});

afterAll(async () => {
  await dbDisconnect();
});

describe("POST /updateHistory/:id", () => {
  it("should add track to user's Listening History", async () => {
    const res = await request(app)
      .put(`${url}/updateHistory/${trackId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.body.status).toBe("successful");
    expect(res.statusCode).toBe(201);
    timestamp = res.body.data.history[0].timestamp;
  });
  it("should update timestamp if track already exists", async () => {
    const res = await request(app)
      .put(`${url}/updateHistory/${trackId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.body.status).toBe("successful");
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("History updated successfully");
    expect(res.body.data.history[0].timestamp === timestamp).toBe(false);
  });

  it("should throw an error if track id is invalid", async () => {
    const res = await request(app)
      .put(`${url}/updateHistory/0`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.body.status).toBe("error");
    expect(res.statusCode).toEqual(400);
  });
});

describe("GET /getHistory", () => {
  it("should fetch a user's listening history", async () => {
    const res = await request(app)
      .get(`${url}/getHistory`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe("successful");
    expect(res.body.data).toHaveProperty("history");
    expect(res.body.data.history).toHaveLength(1);
  });
});

describe("DELETE /removeHistory", () => {
  it("should delete track from listening history", async () => {
    const res = await request(app)
      .delete(`${url}/removeHistory/${trackId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe("successful");
    expect(res.body.data.history).toHaveLength(0);
  });
});
