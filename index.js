'use strict'

var fs = require('fs')
var request = require('request')
var blogs = require('./art-blogs.json')
var date_format = require('date-format')

var now = new Date()


for (var blog of blogs) {
  console.log(blog.url)
  var date_dir = 'feeds/' + date
  if (!fs.existsSync(date_dir)) {
    fs.mkdirSync(date_dir)
  }
  var dir = date_dir + '/' + blog.name
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir)
  }
  var date = date_format(now, 'isoDateTime')
  request(blog.url).pipe(fs.createWriteStream(dir + '/feed.rss'))
}

