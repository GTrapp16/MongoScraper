module.exports = function(app, axios, cheerio, db) {
	console.log("API routes imported");


	app.post("/api/articles/scrape", (req, res) => {
		var counter = 0;
		
		axios.get("https://www.reddit.com")
			.then(response => {
				
				var $ = cheerio.load(response.data);
				
				$("#siteTable p.title").each((i, element) => {
					var article = {};
					article.title = $(element)
						.children("a")
						.text();

					article.link = $(element)
						.children("a")
						.attr("href");

					db.Article.create(article);
				});
			})
			.then(() => {
				res.redirect("/api/articles");
			})
			.catch(error => console.log(error));
	});

	app.get("/", (req, res) => {
		res.redirect("/api/articles");
	});

	
	app.get("/api/articles", (req, res) => {
		db.Article
			.find({})
			.populate("notes")
			.sort({ _id: -1 })
			.then(allArticles => {
				res.render("index", allArticles);
			});
	});

	
	app.get("/api/articles/saved", (req, res) => {
		db.Article
			.find({ isSaved: true })
			.populate("notes")
			.sort({ _id: -1 })
			.then(allSaved => {
				res.render("index", allSaved);
			});
	});

	
	app.post("/api/articles/:id/save", (req, res) => {
		db.Article
			.findOneAndUpdate(
				{ _id: req.params.id },
				{ $set: { isSaved: true } },
				{ new: true }
			)
			.then(data => {
				res.json(data);
			});
	});

	
	app.post("/api/articles/:id/unsave", (req, res) => {
		db.Article
			.findOneAndUpdate(
				{ _id: req.params.id },
				{ $set: { isSaved: false } },
				{ new: true }
			)
			.then(data => {
				res.json(data);
			});
	});

	
	app.get("/api/articles/:id", (req, res) => {
		db.Article
			.findOne({
				_id: req.params.id
			})
			.populate("notes")
			.then(fullArticleInfo => {
				res.json(fullArticleInfo);
			});
	});


	app.post("/api/articles/:id/notes/new", (req, res) => {
		db.Notes
			.create(req.body)
			.then(newNote => {
				return db.Article.findOneAndUpdate(
					{ _id: req.params.id },
					{ $push: { notes: newNote._id } },
					{ new: true }
				);
			})
			.then(data => {
				res.json(data);
			});
	});

	
	app.post("/api/notes/:id/delete", (req, res) => {
		db.Notes.remove({ _id: req.params.id }).then(() => {
			db.Article
				.update(
					{ notes: req.params.id },
					
					{ $pullAll: { notes: [{ _id: req.params.id }] } }
				)
				
				.then(data => {
					res.json(data);
				});
		});
	});
};
