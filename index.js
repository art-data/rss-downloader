'use strict'

var fs = require('fs')
var request = require('request')
var blogs = require('./art-blogs.json')

for (var blog of blogs) {
  console.log(blog.url)
  request(blog.url).pipe(fs.createWriteStream('feeds/' + blog.name))
}

