import service_status from "../utils/service_status.util.js";


async function status_controller(req, res) {
    return res.status(200).send(service_status);
}


export default status_controller;
