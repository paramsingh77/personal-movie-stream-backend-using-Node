module.exports = (req, res) => {

    //Getting the base url "/api/movie/id"
	let baseUrl = req.url.substring(0, req.url.lastIndexOf("/") + 1);
    let id = req.url.split("/")[3];
    

    //regex expression for checking the id exist in data file or not.
	const regexv4 = new RegExp(
		/^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i
	);
   
    //Get all the movies.
	if (req.url === "/api/movies") {
		res.statusCode = 200;
		res.setHeader("Content-type", "application/json");
        res.write(JSON.stringify(req.movies));
		res.end();
    } 

    //Check if the regex id is valid or not.
    else if (!regexv4.test(id)) {
		console.log(id);
		res.writeHead(400, { "Content-type": "application/json" });
		res.end(
			JSON.stringify({
				title: "Content not valid",
				message: "UUID is not valid",
			})
		);
    }
    //Check if base url with id is correct or not.
    else if (baseUrl === "/api/movies/" && regexv4.test(id)) {
		res.statusCode = 200;
		res.setHeader("Content-type", "application/json");
		let filteredMovie = req.movies.filter((movie) => {
			return movie.id === id;
		});
        //if the length of the string is gt zero that means we got the movie
		if (filteredMovie.length > 0) {
			res.write(JSON.stringify(filteredMovie));
			res.end();
		} else {
			res.statusCode = 404;
			res.end(
				JSON.stringify({ title: "Not found", message: "Movie not found" })
			);
		}
    }
    //Default case : if movie is not in data base
    else {
		res.writeHead(404, { "Content-type": "application/json" });
		res.end(JSON.stringify({ title: "Not found", message: "Movie not found" }));
	}
};
