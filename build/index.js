'use strict';

var AWS = require('aws-sdk');
var request = require('request');
var blogs = require('./art-blogs.json');
var date_format = require('date-format');

exports.handler = function (event, context) {
  console.log('just called. event:', event, 'context:', context);

  var now = new Date();

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    var _loop = function _loop() {
      var blog = _step.value;

      var date = date_format(now, 'isoDateTime');
      console.log(date, blog.url, blog.name);

      var date_dir = 'feeds/' + date;
      var dir = date_dir + '/' + blog.name;
      var key = dir + '/feed.rss';

      var s3 = new AWS.S3();
      request(blog.url, function (err, res, body) {
        if (err) {
          console.log(err);
          return;
        }
        var params = {
          Bucket: 'art-data',
          Key: key,
          Body: body
        };
        s3.upload(params, function (err, data) {
          console.log(err, data);
        });
      });
    };

    for (var _iterator = blogs[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      _loop();
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }
};