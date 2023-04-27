const express = require("express")
const app = express()
const http = require("http").createServer(app)
const ffmpeg = require('fluent-ffmpeg');

const compressImages = require("compress-images")
const formidable = require("express-formidable")
app.use(formidable())

const fileSystem = require("fs")
app.set("view engine", "ejs")

const port = process.env.PORT || 5000

http.listen(port, function () {
	console.log("Server started running at port: " + port)

	app.post('/compressMedia', (req, res) => {
		const video = req.files.video;
		if (video.size > 0) {
		  if (video.type == 'video/mp4') {
			const inputFilePath = video.path;
			const outputFilePath = `uploads/${new Date().getTime()}-${video.name}`;
			const compressionLevel = 28;
	  
			ffmpeg(inputFilePath)
			  .outputOptions([
				'-c:v libx264',
				'-crf ' + compressionLevel,
				'-preset veryfast',
				'-c:a aac',
				'-b:a 128k',
			  ])
			  .output(outputFilePath)
			  .on('end', () => {
				console.log('Compression completed');
				res.send('File has been compressed and saved.');
			  })
			  .on('error', (err) => {
				console.error('An error occurred while compressing the video:', err);
				res.status(500).send('An error occurred while compressing the video.');
			  })
			  .run();
		  } else {
			res.send('Please select a video file');
		  }
		} else {
		  res.send('Please select a video file');
		}
	  });

	app.get("/", function (request, result) {
		result.render("index")
	})
})