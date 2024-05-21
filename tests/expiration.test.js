import request from "supertest";
import { tests } from "../server.js"


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
    it("should return 200 for upload and say 404 for file query since the uploaded file is instantly deleted", async () => {
        const res_upload = await request(app).post("/api/upload").attach("target_file", "./server.js").field("expire_in", "__testcase_0sec__");
        const res_file   = await request(app).get(`/api/file/${res_upload.body.file_url.split("/").at(-1)}`);
        // TODO: also test download route seperately

        expect(res_upload.statusCode).toBe(200)
        expect(res_file.statusCode).toBe(404);
    });
});


// Jest with ES6: https://jestjs.io/docs/ecmascript-modules
