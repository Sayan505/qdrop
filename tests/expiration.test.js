import request               from "supertest";

import { tests }             from "../server.js";
import cleanup_expired_files from "../tasks/cleanup_expired_files.task.js";
import delete_file_by_uuid   from "../utils/delete_file_by_uuid.util.js";


// the express instance
const app = tests.app;


// wait for server to init completely
// waits for "server-ready" event to fire
beforeAll(() => {
    return new Promise((resolve) => {
        process.on("server-ready", async () => {
            resolve();
        });
    });
});

afterAll(() => {
    process.emit("graceful-shutdown");
});


describe("test file expiry by setting the expiration timer to 0 sec", () => {
    it("should return 200 for /api/upload and say 404 for /api/file query since the uploaded file is instantly deleted", async () => {
        const res_upload = await request(app).post("/api/upload").attach("target_file", "./server.js").field("expire_in", "__0sec__");
        const res_file   = await request(app).get(`/api/file/${res_upload.body.file_url.split("/").at(-1)}`);

        expect(res_upload.statusCode).toBe(200);
        expect(res_file.statusCode).toBe(404);
    });
});

describe("test file expiry by setting the expiration timer to 0 sec", () => {
    it("should return 200 for /api/upload and say 404 for /api/file/download since the uploaded file is instantly deleted", async () => {
        const res_upload          = await request(app).post("/api/upload").attach("target_file", "./server.js").field("expire_in", "__0sec__");
        const res_file_download   = await request(app).get(`/api/file/download/${res_upload.body.file_url.split("/").at(-1)}`);

        expect(res_upload.statusCode).toBe(200);
        expect(res_file_download.statusCode).toBe(404);
    });
});

describe("test expired files cleaning", () => {
    it("should return 5 for expired_files_count after uploading 5 files", async () => {
        const res_upload_1 = await request(app).post("/api/upload").attach("target_file", "./server.js").field("expire_in", "__0sec__");
        const res_upload_2 = await request(app).post("/api/upload").attach("target_file", "./server.js").field("expire_in", "__0sec__");
        const res_upload_3 = await request(app).post("/api/upload").attach("target_file", "./server.js").field("expire_in", "__0sec__");
        const res_upload_4 = await request(app).post("/api/upload").attach("target_file", "./server.js").field("expire_in", "__0sec__");
        const res_upload_5 = await request(app).post("/api/upload").attach("target_file", "./server.js").field("expire_in", "__0sec__");

        const res = await cleanup_expired_files();

        expect(res).toEqual({expired_objects_count: 5, successful_purge_count: 5});
    });
});

describe("test delete_file_by_uuid", () => {
    it("should return 1 (purged)", async () => {
        const res_upload      = await request(app).post("/api/upload").attach("target_file", "./server.js");
        const res_upload_uuid = res_upload.body.file_url.split("/").at(-1);

        const res             = await delete_file_by_uuid(res_upload_uuid);

        expect(res).toEqual(1);
    });
});


// Jest with ES6: https://jestjs.io/docs/ecmascript-modules
