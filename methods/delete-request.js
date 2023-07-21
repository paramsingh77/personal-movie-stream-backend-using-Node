const writeToFile = require("../util/write-to-file");

module.exports = (req, res) => {

    //Getting the base url "/api/movie/id"
    let baseUrl = req.url.substring(0, req.url.lastIndexOf("/") + 1);
    let id = req.url.split("/")[3];
    

    //regex expression for checking the id exist in data file or not.
    const regexv4 = new RegExp(
        /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i
    );
   
    //Get all the movies.
    if (!regexv4.test(id)) {
        res.writeHead(400, { "Content-type": "application/json" });
				res.end(
					JSON.stringify({
						title: "Content not valid",
						message: "UUID is not valid",
					})
				);
    }
    else if (baseUrl === "/api/movies/" && regexv4.test(id)) {
        const index = req.movies.find((movie) => {
            return movie.id === id;
        });
        if (index === -1) {
            	res.statusCode = 404;
							res.end(
								JSON.stringify({
									title: "Not found",
									message: "Movie not found",
								})
                            );
            res.end();
        }
        else {
            req.movies.splice(index, 1);
            writeToFile(req.movies);
            res.writeHead(204, { "Content-type": "application/json" });
            res.end(JSON.stringify(req.movies));
        }
    }
}