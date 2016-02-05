// lambda's node environment hasn't been updated recently.
// we'll use babel to turn this contemporary javascript into old-school javascript.
// see gulpfile.js for more details
require('babel-polyfill')

const AWS = require('aws-sdk')
const request = require('request')
const date_format = require('date-format')

// since this is running on lambda, it's automatically authorized to write to s3
let s3 = new AWS.S3()

const get_config = function (context) {
  s3.getObject({
    Bucket: (process.env.CONFIG_BUCKET || 'art-data'),
    Key: (process.env.CONFIG_FILE || 'art-blogs.json')
  }, function (err, data) {
    if (err) { return context.fail(err) }
    return data
  })
}

// function to generate an s3 key (<- filename) from a date and a blog name
const gen_key = function (date, blog) {
  const date_dir = (process.env.OUTPUT_KEY_PREFIX || 'downloads/') + date + '/'
  const dir = date_dir + blog.name + '/'
  const key = (dir + (blog.key || 'feed.rss'))
  return key
}

// this function is called by aws lambda
exports.handler = function (event, context) {
  const blogs = get_config(context)

  const now = new Date()
  const date = date_format(now, 'YYYY-MM-dd hh:mm:ss')

  // track s3 successes
  let result = []

  for (let blog of blogs) {
    let key = gen_key(date, blog.name)

    request(blog.url, function (err, res, body) {
      if (err) { result.push(err); return }
      let params = {
        Bucket: (process.env.OUT_BUCKET || 'art-data'),
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

