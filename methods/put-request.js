const requireBodyParser = require("../util/body-parser");
const writeToFile = require("../util/write-to-file");

module.exports = async (req, res) => {

    //Getting the base url "/api/movie/id"
    let baseUrl = req.url.substring(0, req.url.lastIndexOf("/") + 1);
    let id = req.url.split("/")[3];
    console.log(baseUrl);

    //regex expression for checking the id exist in data file or not.
    const regexv4 = new RegExp(
        /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i
    );

    if (!regexv4.test(id)) {
			console.log(id);
			res.writeHead(400, { "Content-type": "application/json" });
			res.end(
				JSON.stringify({
					title: "Content not valid",
					message: "UUID is not valid",
				})
			);
    }
    else if (baseUrl === "/api/movies/" && regexv4.test(id)) {
        try {
            let body = await requireBodyParser(req);
            const index = req.movies.find((movie) => {
							return movie.id === id;
						});
						if (index === -1) {
							res.statusCode = 404;
							res.write(
								JSON.stringify({
									title: "Not found",
									message: "Movie not found",
								})
							);
							res.end();
                        }
                        else {
                            req.movies[index] = { id, ...body };
                            writeToFile(req.movies);
                            res.writeHead(200, { "Content-Type": "application/json" });
                            res.end(JSON.stringify(req.movies[index]))
                        }
        } catch (error) {
            res.writeHead(400, { "Content-type": "application/json" });
						res.end(
							JSON.stringify({
								title: "Content not valid",
								message: "Requested Movie is not valid",
							})
						);
        }
    }
    else {
        res.writeHead(404, { "Content-type": "application/json" });
				res.end(
					JSON.stringify({ title: "Not found", message: "Movie not found" })
				);
    }
}