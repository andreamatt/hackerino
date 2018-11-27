function Response(status, text, json){
	this.status = status;
	this.text = text;
	this.json = json;
}

module.exports = Response;