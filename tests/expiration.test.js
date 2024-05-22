import request               from "supertest";

import { tests }             from "../server.js"
import cleanup_expired_files from "../tasks/cleanup_expired_files.task.js"


// the express instance
const app = tests.app;


// wait for server to init
// waits for "server-ready" event to fire
beforeAll(() => {
    return new Promise((resolve) => {
        app.on("server-ready", async () => {
            resolve();
        });
    });
});


describe("test file expiry by setting the expiration timer to 0 sec", () => {
    it("should return 200 for /api/upload and say 404 for /api/file query since the uploaded file is instantly deleted", async () => {
        const res_upload = await request(app).post("/api/upload").attach("target_file", "./server.js").field("expire_in", "__0sec__");
        const res_file   = await request(app).get(`/api/file/${res_upload.body.file_url.split("/").at(-1)}`);

        expect(res_upload.statusCode).toBe(200)
        expect(res_file.statusCode).toBe(404);
    });
});

describe("test file expiry by setting the expiration timer to 0 sec", () => {
    it("should return 200 for /api/upload and say 404 for /api/file/download since the uploaded file is instantly deleted", async () => {
        const res_upload = await request(app).post("/api/upload").attach("target_file", "./server.js").field("expire_in", "__0sec__");
        const res_file   = await request(app).get(`/api/file/download/${res_upload.body.file_url.split("/").at(-1)}`);

        expect(res_upload.statusCode).toBe(200)
        expect(res_file.statusCode).toBe(404);
    });
});

describe("test expired files cleaning", () => {
    it("should return 5 for expired_files_count after uploading 5 files", async () => {
        const res_upload1 = await request(app).post("/api/upload").attach("target_file", "./server.js").field("expire_in", "__0sec__");
        const res_upload2 = await request(app).post("/api/upload").attach("target_file", "./server.js").field("expire_in", "__0sec__");
        const res_upload3 = await request(app).post("/api/upload").attach("target_file", "./server.js").field("expire_in", "__0sec__");
        const res_upload4 = await request(app).post("/api/upload").attach("target_file", "./server.js").field("expire_in", "__0sec__");
        const res_upload5 = await request(app).post("/api/upload").attach("target_file", "./server.js").field("expire_in", "__0sec__");

        const expired_files_count = await cleanup_expired_files();

        expect(expired_files_count).toBe(5);
    });
});


// Jest with ES6: https://jestjs.io/docs/ecmascript-modules
