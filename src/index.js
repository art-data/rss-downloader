// lambda's node environment hasn't been updated recently.
// we'll use babel to turn this contemporary javascript into old-school javascript.
// see gulpfile.js for more details
require('babel-polyfill')

const AWS = require('aws-sdk')
const request = require('request')
const blogs = require('./art-blogs.json')
const date_format = require('date-format')

// since this is running on lambda, it's automatically authorized to write to s3
let s3 = new AWS.S3()

// function to generate an s3 key (<- filename) from a date and a blog name
const gen_key = function (date, blog_name) {
  let date_dir = 'feeds/' + date
  let dir = date_dir + '/' + blog_name
  let key = (dir + '/feed.rss')
  return key
}

// this function is called by aws lambda
exports.handler = function (event, context) {
  let now = new Date()
  let date = date_format(now, 'YYYY-MM-dd hh:mm:ss')

  // track s3 successes
  let result = []

  for (let blog of blogs) {
    let key = gen_key(date, blog.name)

    request(blog.url, function (err, res, body) {
      if (err) { result.push(err); return }
      let params = {
        Bucket: 'art-data',
        Key: key,
        Body: body
      }
      s3.upload(params, function (err, data) {
        if (err) { result.push(err); return }
        result.push(data)
      })
    })
  }
  // context.succeed is a special aws lambda method
  context.succeed(result)
}

