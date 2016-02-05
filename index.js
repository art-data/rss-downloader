'use strict'

var AWS = require('aws-sdk')
var request = require('request')
var blogs = require('./art-blogs.json')
var date_format = require('date-format')

exports.handler = function () {
  var now = new Date()

  for (var blog of blogs) {
    var date = date_format(now, 'isoDateTime')
    console.log(date, blog.url, blog.name)

    var date_dir = 'feeds/' + date
    var dir = date_dir + '/' + blog.name
    var key = (dir + '/feed.rss')

    var s3 = new AWS.S3()
    request(blog.url, function (err, res, body) {
      if (err) {
        console.log(err)
        return
      }
      var params = {
        Bucket: 'art-data',
        Key: key,
        Body: body
      }
      s3.upload(params, function (err, data) {
        console.log(err, data)
      })
    })
  }
}

