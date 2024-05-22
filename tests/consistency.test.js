import request               from "supertest";

import { tests }             from "../server.js";
import delete_file_by_uuid   from "../utils/delete_file_by_uuid.util.js";


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

afterAll(() => {
    //process.emit("graceful-shutdown");
});


describe("test file uuid consistency across the response from upload to the file info query", () => {
    it("should be consistent", async () => {
        const res_upload      = await request(app).post("/api/upload").attach("target_file", "./server.js");
        const res_upload_uuid = res_upload.body.file_url.split("/").at(-1);
        
        const res_file        = await request(app).get(`/api/file/${res_upload_uuid}`);
        const res_file_uuid   = res_file.body.download_uri.split("/").at(-1);

        await delete_file_by_uuid(res_upload_uuid);

        expect(res_file_uuid).toEqual(res_upload_uuid);
    });
});

describe("test file name consistency across the response from upload to the file info query", () => {
    it("should be consistent", async () => {
        const res_upload      = await request(app).post("/api/upload").attach("target_file", "./server.js");
        const res_upload_uuid = res_upload.body.file_url.split("/").at(-1);
        
        const res_file        = await request(app).get(`/api/file/${res_upload_uuid}`);
        const res_file_filename   = res_file.body.filename;

        await delete_file_by_uuid(res_upload_uuid);

        expect(res_file_filename).toEqual("server.js");
    });
});


// Jest with ES6: https://jestjs.io/docs/ecmascript-modules
