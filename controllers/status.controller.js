async function status_controller(req, res) {
    let service_status = {
        database: "offline",
        server: "offline"
    };

    process.on("server-ready", () => {
        service_status.server = "online";
    });

    return res.status(200).send(service_status);
}


export default status_controller;
