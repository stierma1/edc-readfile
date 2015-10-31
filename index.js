"use strict"

var Worker = require("basic-distributed-computation").Worker;
var fs = require("fs");

class ReadFileWorker extends Worker {
  constructor(parent){
    super("readfile", parent);
  }

  work(req){
    var filePath = req.body;
    var encoding = "utf8";
    var isObj = false;
    if(typeof(req.body) !== "string"){
      isObj = true;
      filePath = req.body.path;
      encoding = req.body.encoding || "utf8";
    } else {
      filePath = req.body;
    }

    fs.readFile(filePath, encoding, function(err, contents){
      if(err){
        req.status(err).next();
        return;
      }
      if(isObj){
        req.body.fileContents = contents;
      } else {
        req.body = contents;
      }
      req.next();
    });
  }
}

module.exports = ReadFileWorker;
