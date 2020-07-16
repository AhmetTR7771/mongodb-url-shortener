var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var packInfo = new Schema({
    realUrl: String,
    shortenedUrl: String
});

module.exports = mongoose.model("UrlShortener", packInfo);