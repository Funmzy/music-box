import app from "../app";
import request from "supertest";
import { dbDisconnect } from "../database/mongoMemoryConnect";

const currentUser: Record<string, string> = {};
const url = "/api/v1/music-box-api";

const userData = {
  firstName: "james",
  lastName: "bond",
  email: "jamesbond@gmail.com",
  dateOfBirth: "2005/12/23",
  gender: "M",
};

afterAll(async () => {
  await dbDisconnect();
});

describe("test relating to Auth", () => {
  it("for Register", async () => {
    const res = await request(app).post(`${url}/users/register`).send({
      firstName: "james",
      lastName: "bond",
      email: "jamesbond@gmail.com",
      password: "12345",
      dateOfBirth: "2005/12/23",
      gender: "M",
    });
    expect(res.status).toBe(201);
    expect(res.body.data.data.email).toBe("jamesbond@gmail.com");
  });
  it("for Login", async () => {
    const res = await request(app).post(`${url}/users/login`).send({
      email: "jamesbond@gmail.com",
      password: "12345",
    });
    currentUser.token = res.body.token;
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty("token");
    expect(res.body.data.data.email).toBe("jamesbond@gmail.com");
    currentUser.token = res.body.data.token;
    currentUser.id = res.body.data.data._id;
  });
});

describe("User profile", () => {
  it("should show a user's profile", async () => {
    const res = await request(app)
      .get(`${url}/users/profile/${currentUser.id}`)
      .set("authorization", `Bearer ${currentUser.token}`);

    expect(res.body.status).toBe("successful");
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("data");
    expect(res.body).toHaveProperty("status");
  });

  it("should edit a user's profile", async () => {
    userData.lastName = "prawn";
    const res = await request(app)
      .put(`${url}/users/profile/${currentUser.id}`)
      .send(userData)
      .set("authorization", `Bearer ${currentUser.token}`);

    expect(res.body.status).toBe("successful");
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("status");
    expect(res.body.data.lastName).toBe("prawn");
  });
});
