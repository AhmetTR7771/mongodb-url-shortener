var express = require('express');
var mongoose = require("mongoose");
var config = require("../config.json")
var router = express.Router();
var dirName = "../public/";
mongoose.connect(
    `${config.mongo}`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
);
const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB Bağlantısı Başarılı!");
});
connection.once('error', err => {
  console.error(err);
  console.log("MongoDB Bağlantısı Yapılamadı!")
});
const UrlShortener = require("../models/UrlShortener");
/* Ana Sayfa*/
router.get('/', function(req, res, next) {
  res.sendFile(dirName + "index.html", "", () => {});
});

/* Kisaltma */
router.post("/kisalt", async function(req, res, next) {
    let link = req.body.link;
    let shortUrl;
    if (!link.startsWith("http://") && !link.startsWith("https://")) {
        return res.end("Link oldugunu onaylamamiz icin http:// veya https:// ile baslamasi gerek!");
    }
    /* Son IDyi bulma */
    const find = await UrlShortener.find({}).sort({"shortenedUrl":-1});
    if (find[0] == null) {
        shortUrl = "100000";
    } else {
        shortUrl = Number(find[0].shortenedUrl) + 1;
    }

    let urlShort = new UrlShortener({
        realUrl: link,
        shortenedUrl: shortUrl
    })
    await urlShort.save();
    return res.end("/go/"+shortUrl);
});

router.get("/go/:short", async function(req,res,next) {
    let short = req.params.short;
    const find = await UrlShortener.findOne({ shortenedUrl: short });
    if (find == null) {
        return res.end("Kisaltilmis bir url bulamadim!");
    } else {
        res.redirect(find.realUrl);
    }
 });

module.exports = router;
