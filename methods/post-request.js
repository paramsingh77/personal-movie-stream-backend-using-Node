const crypto = require("crypto");

const requireBodyParser = require("../util/body-parser");
const pushToFile = require("../util/write-to-file");
const { writeFile } = require("fs");
const writeToFile = require("../util/write-to-file");

module.exports = async (req, res) => {
    console.log(req.url);
    if (req.url === "/api/movies") {
        try {
            let body = await requireBodyParser(req);
            body.id = crypto.randomUUID();
            req.movies.push(body);
            writeToFile(req.movies);
            res.writeHead(201, { "Content-type": "application/json" });
            res.end();
        } catch (error) {
            console.log(error);
            res.writeHead(400, { "Content-type": "application/json" });
            res.end(
                JSON.stringify({
                    title: "Content not valid",
                    message: "Request Body is not valid",
                })
            );
        }
    }
    else {
        // res.writeHead(404, { "Content-type": "application/json" });
		// 		res.end(
		// 			JSON.stringify({ title: "Not found", message: "Movie not found" })
		// 		);
    }
};
