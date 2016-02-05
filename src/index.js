const AWS = require('aws-sdk')
const request = require('request')
const blogs = require('./art-blogs.json')
const date_format = require('date-format')

exports.handler = function (event, context) {
  console.log('just called. event:', event, 'context:', context)

  let now = new Date()

  for (let blog of blogs) {
    let date = date_format(now, 'isoDateTime')
    console.log(date, blog.url, blog.name)

    let date_dir = 'feeds/' + date
    let dir = date_dir + '/' + blog.name
    let key = (dir + '/feed.rss')

    let s3 = new AWS.S3()
    request(blog.url, function (err, res, body) {
      if (err) {
        console.log(err)
        return
      }
      let params = {
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

