var service_status = {
    database: "offline",
    server: "offline"
};


async function init() {
    process.on("server-ready", () => {
        service_status.server = "online";
    });

    process.on("db-ready", () => {
        service_status.database = "online";
    });
}

export default service_status;
export const init_status_monitor = init;
