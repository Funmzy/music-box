/* eslint-disable no-console */
import request from "supertest";
import app from "../app";
import { dbDisconnect } from "../database/mongoMemoryConnect";

const currentUser: Record<string, string> = {};
const uri = "/api/v1/music-box-api";
let playlistId = "";

afterAll(async () => {
  await dbDisconnect();
});

describe("test for user authentication", () => {
  it("should be able to signup ", async () => {
    const res = await request(app).post(`${uri}/users/register`).send({
      firstName: "ken",
      lastName: "bayo",
      email: "bayo@gmail.com",
      password: "12345",
      dateOfBirth: "2021/12/23",
      gender: "M",
    });

    expect(res.status).toBe(201);
    expect(res.body.data.data.gender).toBe("M");
    expect(res.body.data.data.email).toBe("bayo@gmail.com");
  });

  it("should be able to signin", async () => {
    const res = await request(app).post(`${uri}/users/login`).send({
      email: "bayo@gmail.com",
      password: "12345",
    });
    currentUser.token = res.body.data.token;

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty("token");
    expect(res.body.data.data.email).toBe("bayo@gmail.com");
  });
});

describe("POST playlist route", () => {
  it("should create a Playlist", async () => {
    const data = {
      name: "Blue sunday",
      genreId: "60b3f80a5d1a2a7af7e668e5",
      isPublic: true,
    };
    const res = await request(app)
      .post(`${uri}/playlist`)
      .set("Authorization", `Bearer ${currentUser.token}`)
      .send(data);
    playlistId = res.body.data.payload._id;

    expect(res.body.status).toBe("successful");
    expect(res.status).toBe(201);
    expect(res.body.data).toHaveProperty("payload");
    expect(res.body.data.payload).toHaveProperty("createdAt");
  });
});

describe("GET all playlists created by a user", () => {
  it("should respond with all user playlists", async () => {
    const res = await request(app)
      .get(`${uri}/playlist`)
      .set("Authorization", `Bearer ${currentUser.token}`);

    expect(res.body.status).toBe("successful");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("data");
  });
});

describe("GET all public playlist", () => {
  it("should respond with all public playlist", async () => {
    const res = await request(app)
      .get(`${uri}/playlist`)
      .set("Authorization", `Bearer ${currentUser.token}`);

    expect(res.body.status).toBe("successful");
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty("payload");
  });
});

describe("GET a user playlist By Id", () => {
  it("should respond with a single playlist", async () => {
    const res = await request(app)
      .get(`${uri}/playlist/${playlistId}`)
      .set("Authorization", `Bearer ${currentUser.token}`);

    expect(res.body.status).toBe("successful");
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty("payload");
  });

  it("should respond with a single Public playlist", async () => {
    const res = await request(app)
      .get(`${uri}/playlist/${playlistId}`)
      .set("Authorization", `Bearer ${currentUser.token}`);

    expect(res.body.status).toBe("successful");
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty("payload");
  });
});

describe("GET most played playlist", () => {
  it("should retrieve the most played Playlist", async () => {
    const res = await request(app)
      .get(`${uri}/playlist/mostPlayed`)
      .set("Authorization", `Bearer ${currentUser.token}`);

    expect(res.status).toBe(200);
    expect(res.body.status).toBe("successful");
  });
});

describe("GET most played album", () => {
  it("should retrieve the most played album", async () => {
    const res = await request(app)
      .get(`${uri}/album/mostPlayed`)
      .set("Authorization", `Bearer ${currentUser.token}`);

    expect(res.status).toBe(200);
    expect(res.body.status).toBe("successful");
    expect(res.body.data).toHaveProperty("payload");
  });
});

describe("GET most played artist", () => {
  it("should retrieve the most played artist", async () => {
    const res = await request(app)
      .get(`${uri}/artist/mostPlayed`)
      .set("Authorization", `Bearer ${currentUser.token}`);

    expect(res.status).toBe(200);
    expect(res.body.status).toBe("successful");
    expect(res.body.data).toHaveProperty("payload");
  });
});

describe("GET all album liked by a user", () => {
  it("should retrieve all album liked by a user", async () => {
    const res = await request(app)
      .get(`${uri}/album/likes`)
      .set("Authorization", `Bearer ${currentUser.token}`);

    expect(res.body.status).toBe("error");
    expect(res.status).toBe(404);
    expect(res.body.message).toBe("User liked no album");
  });
});

describe("GET all artist liked by a user", () => {
  it("should retrieve all artist liked by a user", async () => {
    const res = await request(app)
      .get(`${uri}/artist/likes`)
      .set("Authorization", `Bearer ${currentUser.token}`);

    expect(res.body.status).toBe("error");
    expect(res.status).toBe(404);
    expect(res.body.message).toBe("User liked no artist");
  });
});

describe("GET all playlist liked by a user", () => {
  it("should retrieve all playlist liked by a user", async () => {
    const res = await request(app)
      .get(`${uri}/playlist/likes`)
      .set("Authorization", `Bearer ${currentUser.token}`);

    expect(res.body.status).toBe("error");
    expect(res.status).toBe(404);
    expect(res.body.message).toBe("User liked no playlist");
  });
});

describe("ADD a track to a playlist", () => {
  const data = {
    id: 322,
    title: "playlist",
    preview:
      "https://cdns-preview-d.dzcdn.net/stream/c-deda7fa9316d9e9e880d2c6207e92260-8.mp3",
    artist: "emekus",
    album: "beetles",
    duration: "4:20",
    albumImgUrl: "https://api.deezer.com/album/302127/image",
  };

  it("should add a track to a playlist", async () => {
    const res = await request(app)
      .put(`${uri}/playlist/${playlistId}`)
      .set("Authorization", `Bearer ${currentUser.token}`)
      .send(data);

    expect(res.status).toBe(201);
    expect(res.body.status).toBe("successful");
    expect(res.body.data.payload).toHaveProperty("tracks");
  });
});

describe("DELETE a track from a playlist", () => {
  const data = {
    id: 322,
    title: "playlist",
    link: "https://www.deezer.com/track/3135556",
    preview:
      "https://cdns-preview-d.dzcdn.net/stream/c-deda7fa9316d9e9e880d2c6207e92260-8.mp3",
    artist: "emekus",
    album: "beetles",
    duration: "4:20",
    releaseDate: "2019-06-06",
  };

  it("should delete a track from a playlist", async () => {
    const res = await request(app)
      .delete(`${uri}/playlist/${playlistId}`)
      .set("Authorization", `Bearer ${currentUser.token}`)
      .send(data);

    expect(res.status).toBe(201);
    expect(res.body.status).toBe("successful");
    expect(res.body.data).toHaveProperty("payload");
  });
});

describe("DELETE a playlst", () => {
  it("should delete a playlist", async () => {
    const res = await request(app)
      .delete(`${uri}/playlist/delete/${playlistId}`)
      .set("Authorization", `Bearer ${currentUser.token}`);

    expect(res.status).toBe(201);
    expect(res.body.status).toBe("successful");
    expect(res.body.message).toBe("Successfully removed!");
    expect(res.body.data).toHaveProperty("payload");
  });
});
