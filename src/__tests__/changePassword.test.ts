import app from "../app";
import request from "supertest";
import { dbDisconnect } from "../database/mongoMemoryConnect";

const currentUser: Record<string, string> = {};
const url = "/api/v1/music-box-api";
afterAll(async () => {
  await dbDisconnect();
});

describe("test relating to user signup", () => {
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
    currentUser.id = res.body.data.data._id;
  });

  it("change user password", async () => {
    const res = await request(app)
      .put(`${url}/users/change-password/${currentUser.id}`)
      .send({
        oldPassword: "12345",
        newPassword: "123456",
      })
      .set("authorization", `Bearer ${currentUser.token}`);

    expect(res.status).toBe(200);
    expect(res.body.status).toBe("successful");
  });

  it("login with new password", async () => {
    const res = await request(app).post(`${url}/users/login`).send({
      email: "emeka@gmail.com",
      password: "123456",
    });
    currentUser.token = res.body.token;
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty("token");
    expect(res.body.data.data.email).toBe("emeka@gmail.com");
    currentUser.token = res.body.data.token;
    currentUser.id = res.body.data._id;
  });

  it("should not login with old password", async () => {
    const res = await request(app).post(`${url}/users/login`).send({
      email: "emeka@gmail.com",
      password: "12345",
    });
    currentUser.token = res.body.token;
    expect(res.status).toBe(400);
  });
});

describe("Fetch Genre", () => {
  it("should fetch all genre", async () => {
    const res = await request(app).get(`${url}/genres`);

    expect(res.status).toBe(200);
    expect(res.body.status).toBe("successful");
    expect(res.body).toHaveProperty("data");
    expect(Array.isArray(res.body.data)).toBe(true);
    currentUser.genreId = res.body.data[0].id;
  });

  it("should fetch one genre by id", async () => {
    const res = await request(app).get(`${url}/genres/${currentUser.genreId}`);

    expect(res.status).toBe(200);
    expect(res.body.status).toBe("successful");
    expect(res.body).toHaveProperty("data");
  });
});
