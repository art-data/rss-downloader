'use strict'

var fs = require('fs')
var request = require('request')
var blogs = require('./art-blogs.json')
var date_format = require('date-format')

var now = new Date()

for (var blog of blogs) {
  var date = date_format(now, 'isoDateTime')
  console.log(date, blog.url, blog.name)
  var date_dir = 'feeds/' + date
  if (!fs.existsSync(date_dir)) {
    fs.mkdirSync(date_dir)
  }
  var dir = date_dir + '/' + blog.name
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir)
  }
  request(blog.url).pipe(fs.createWriteStream(dir + '/feed.rss'))
}

