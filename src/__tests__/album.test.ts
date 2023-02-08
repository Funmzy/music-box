/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import request from "supertest";
import app from "../app";
import { dbDisconnect } from "../database/mongoMemoryConnect";

let albumId = "";
let token: string;
const userInfo = {
  firstName: "David",
  lastName: "Adejo",
  gender: "Male",
  dateOfBirth: "1995/10/11",
  email: "emmanuelhemarxyll12@gmail.com",
  password: "emma123",
};
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

describe("test relating to albums", () => {
  it("successfully searches for an album", async () => {
    const queryParams = "227789382";
    const result = await request(app)
      .get(`/api/v1/music-box-api/album?album=${queryParams}`)
      .set("authorization", `Bearer ${token}`);
    expect(result.status).toEqual(200);
    expect(result.body.message).toEqual("Successful" || "Album gotten");
    albumId = result.body.data.result._id;
  });
});

describe("user can interact with an album", () => {
  it("user successfully listens to an album", async () => {
    const result = await request(app)
      .put(`/api/v1/music-box-api/album/listened/${albumId}`)
      .set("authorization", `Bearer ${token}`);
    expect(result.status).toEqual(200);
    expect(result.body.data.listeningCount).toBe(1);
  });
  it("user successfully likes an album", async () => {
    const result = await request(app)
      .put(`/api/v1/music-box-api/album/likes/${albumId}`)
      .set("authorization", `Bearer ${token}`);
    expect(result.status).toEqual(200);
    expect(result.body.data.likeCount).toEqual(1);
  });
});
