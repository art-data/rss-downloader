require('babel-polyfill')

const AWS = require('aws-sdk')
const request = require('request')
const blogs = require('./art-blogs.json')
const date_format = require('date-format')

let s3 = new AWS.S3()

const gen_key = function (date, blog_name) {
  let date_dir = 'feeds/' + date
  let dir = date_dir + '/' + blog_name
  let key = (dir + '/feed.rss')
  return key
}

exports.handler = function (event, context) {
  let now = new Date()
  let date = date_format(now, 'YYYY-MM-dd-at-hh-mm-ss')

  for (let blog of blogs) {
    let key = gen_key(date, blog.name)

    request(blog.url, function (err, res, body) {
      if (err) {
        context.fail(err)
        return
      }
      let params = {
        Bucket: 'art-data',
        Key: key,
        Body: body
      }
      s3.upload(params, function (err, data) {
        if (err) {
          context.fail(err)
        } else {
          context.succeed(data)
        }
      })
    })
  }
}

