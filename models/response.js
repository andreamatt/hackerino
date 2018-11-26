function Response(code, text, json){
	this.code = code;
	this.text = text;
	this.json = json;
}

module.exports = Response;