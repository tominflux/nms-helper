const fs = require("fs-extra")
const prompt = require('prompt');
const crypto = require('crypto');

function md5(string) {
	return crypto.createHash('md5').update(string).digest('hex')
}

async function app() {
	//
	const configFile = await fs.readFile("./config.json")
	const config = JSON.parse(configFile)
	//
	const currentDate = Date.now()
	const expirationDate = currentDate + (1000 * 60 * 60 * config.shelfLife)
	const expirationSeconds = (
		(expirationDate + "").slice(0, -3)
	)
	//
	function generateAndShowAddress(stream, pass) {
		const hashValue = md5(
			`/live/${stream}-${expirationSeconds}-${pass}`
		)
		const requestAddress = (
			`${config.protocol}://${config.ip}/` +
			`${config.appName}/${stream}?sign=${expirationSeconds}-${hashValue}`
		)
		console.log(
			`Here is your request address:
			${requestAddress}`
		)
	}
	//
	const promptProps = [
		{
			name: "streamName",
			hidden: false
		},
		/*
		{
			name: "nmsPass",
			hidden: true
		},
		{
			name: "confirmPass",
			hidden: true
		}
		*/
	]
	prompt.start()
	prompt.get(promptProps, function (err, result) {
		if (err) {
			console.error(err)
			return 1
		}
		/*if (result.nmsPass !== result.confirmPass) {
			console.error("Passwords do not match.")
		} else {*/
			const stream = result.streamName
			const pass = config.nmsPass
			generateAndShowAddress(stream, pass)
		/*}*/
	})
}


app()
