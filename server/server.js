const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
	apiKey: process.env.OPEN_AI_KEY,
});

const openai = new OpenAIApi(configuration);

const app = express();
app.use(express.json());
// Habilitar CORS para todas las rutas
app.use(cors());

app.get("/", (req, res) => {
	return res.status(200).json({
		message: "Hola Milfer Muñoz",
	});
});

app.post("/", async (req, res) => {
	try {
		const { prompt } = req.body;
		const response = await openai.createCompletion({
			model: "text-davinci-003",
			prompt: ` ${prompt} `,
			max_tokens: 2000,
			temperature: 0.7,
			top_p: 1,
			/* frequency_penalty: 0.5,
			presence_penalty: 0, */
		});
		console.log(response.data.choices[0].text);
		return res.status(200).send({
			message: [
				{ role: "user", content: "Hola como puedo ayudarte el dia de hoy" },
			],
			success: true,
			data: response.data.choices[0].text,
		});
	} catch (error) {
		return res.status(400).json({
			success: false,
			error: error.response
				? error.response.data
				: "There was an issue on the server",
		});
	}
});

// Middleware para habilitar CORS
app.use(function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
	res.header(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content-Type, Accept"
	);
	next();
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
	console.log(`Server listening on port ${port}`);
});
