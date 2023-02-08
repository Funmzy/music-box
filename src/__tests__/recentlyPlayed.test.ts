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

describe("Save to recently played collection", () => {
  it("should create a playlist", async () => {
    const playlist = {
      name: "myplaylist",
      genre_id: "60bbf32e6d0d135bb9c2cd32",
    };
    const res = await request(app)
      .post(`${url}/playlist`)
      .send(playlist)
      .set("authorization", `Bearer ${currentUser.token}`);
    expect(res.status).toBe(201);
    expect(res.body.status).toBe("successful");
    expect(res.body).toHaveProperty("data");
    expect(res.body.data.payload.name).toBe(playlist.name);
    currentUser.playlistId = res.body.data.payload._id;
  });

  it("Should save the recently played playlist", async () => {
    const playlistData = {
      directory: "playlist",
      id: currentUser.playlistId,
    };
    const res = await request(app)
      .post(`${url}/recently-played`)
      .send(playlistData)
      .set("authorization", `Bearer ${currentUser.token}`);

    expect(res.status).toBe(201);
    expect(res.body.status).toBe("successful");
    expect(res.body).toHaveProperty("data");
  });

  it("Should save the recently played artist", async () => {
    const artistData = {
      directory: "artist",
      id: "60bd5c32f134759588289077",
    };
    const res = await request(app)
      .post(`${url}/recently-played`)
      .send(artistData)
      .set("authorization", `Bearer ${currentUser.token}`);

    expect(res.status).toBe(201);
    expect(res.body.status).toBe("successful");
    expect(res.body.data.directory_info).toBe(artistData.id);
  });

  it("Should save the recently played album", async () => {
    const albumData = {
      directory: "album",
      id: "60bd642e6d46f3af2adea824",
    };
    const res = await request(app)
      .post(`${url}/recently-played`)
      .send(albumData)
      .set("authorization", `Bearer ${currentUser.token}`);

    expect(res.status).toBe(201);
    expect(res.body.status).toBe("successful");
    expect(res.body).toHaveProperty("data");
    expect(res.body.data.directory_info).toBe(albumData.id);
  });
});

describe("Get all recently played of a user", () => {
  it("Should return recently played playlist, album and artist", async () => {
    const res = await request(app)
      .get(`${url}/recently-played`)
      .set("authorization", `Bearer ${currentUser.token}`);

    expect(res.status).toBe(200);
    expect(res.body.status).toBe("successful");
    expect(res.body).toHaveProperty("data");
    expect(res.body.data).toHaveProperty("playlist");
    expect(res.body.data).toHaveProperty("artist");
    expect(res.body.data).toHaveProperty("album");
  });
});
