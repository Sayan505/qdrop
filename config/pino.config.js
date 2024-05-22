const pino_config = {
    transport: {
        targets: [
            {
                target: "pino-pretty",
                options: {
                    destination: 1  // STDOUT
                }
            },
            {
                target: "pino/file",
                options: {
                    destination: "./log.txt"  // file: "log.txt" in project root
                }
            }
        ]
    }
};


export default pino_config;
