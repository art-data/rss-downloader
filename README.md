# downloader

This thingy should download a bunch of files and then put them in an s3 bucket.

It runs on AWS Lambda.

the official lambda return value is an array that contains either successful s3 responses and/or errors. 

Website download or upload failures will not cause a lambda failure. Not finding the config file *will* cause a lambda failure.

## config

It looks in s3 for a json config file.

Set the env variable CONFIG_BUCKET to the name of the bucket it should look in. The default is 'art-data'

Set the env variable CONFIG_FILE to the s3 key of the actual file. The default is 'art-blogs.json'

That config file should look something like this:

```json
[
  {
    "name": "website-one",
    "url":  "http://website.one.com/whatever"
		"key": "this is optional. The default is 'feed.rss'".
  },
  {
    "name": "website-two",
    "url":  "http://website.two.com/whatever"
  }
]
```

The results are saved in an s3 bucket.

Set the env variable OUTPUT_BUCKET to the name of the bucket it should save to. The default is 'art-data'.

The output keys look something like:

'''javascript
`${OUTPUT_KEY_PREFIX || 'downloads/'}/${date}/${website.name}/${website.key || 'feed.rss' }`
'''

## building it

run `npm install` then `gulp` in this folder to build a lambda-ready .zip file in ./dist/aws.zip.

