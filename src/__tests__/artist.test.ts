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

describe("test for artists", () => {
  it("should add artists to artist collection", async () => {
    const res = await request(app)
      .post(`${url}/artist/960`)
      .set("authorization", `Bearer ${currentUser.token}`);

    expect(res.body.status).toBe("successful");
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("data");
    expect(res.body).toHaveProperty("status");
  });

  it("should count artists' likes", async () => {
    const res = await request(app)
      .put(`${url}/artist/like/960`)
      .set("authorization", `Bearer ${currentUser.token}`);

    expect(res.body.status).toBe("successful");
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("status");
  });

  it("should update artists' listening count", async () => {
    const res = await request(app)
      .put(`${url}/artist/listened/60d65db5c7053e1cc8e70db8`)
      .set("authorization", `Bearer ${currentUser.token}`);

    expect(res.body.status).toBe("successful");
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("status");
  });
});
