var crypto = require('crypto'),
    moment = require('moment'),
    request = require('request'),
    AWS = require('aws-sdk'),
    Uploader = require('s3-upload-stream').Uploader,
    Q = require('q');

exports.prepare = function(bucketName) {
  if (!sails.config.aws.accessKeyId || !sails.config.aws.secretAccessKey)
    return sails.log.error('Unable to generate S3 upload form: required AWS credentials not set.');

  var p = policy(bucketName),
      s = signature(p);

  return({
    action: 'https://s3.amazonaws.com/cloud.bethel.io',
    policy: p,
    signature: s,
    key: sails.config.aws.accessKeyId,
    bucket: bucketName
  });
};

exports.removeTemp = function(bucketName, fileName, newId) {
  AWS.config.update(sails.config.aws);
  var s3 = new AWS.S3(),
      extension = fileName.split('.').slice(-1);

  var params = {
    Bucket: 'cloud.bethel.io',
    CopySource: 'cloud.bethel.io/' + bucketName + '/tmp/' + fileName,
    Key: bucketName + '/' + newId + '.' + extension
  };

  var deferred = Q.defer();

  s3.copyObject(params, function(err, data) {
    if (err) {
      deferred.reject(new Error(err));
    } else {        
      var params = {
        Bucket: 'cloud.bethel.io',
        Key: bucketName + '/tmp/' + fileName
      };
      s3.deleteObject(params, function(err, data) {
        if (err) console.log(err, err.stack);
      });

      deferred.resolve(bucketName.replace('images/', '') + '/' + newId + '.' + extension);
    }
  });

  return deferred.promise;
};

exports.transport = function(fileUrl, bucketName, key, callback) {
  if (!fileUrl)
    return callback('S3Upload:transport no fileUrl');

  if (!sails.config.aws.accessKeyId || !sails.config.aws.secretAccessKey)
    return callback('S3Upload:transport no AWS credentials set');

  var UploadStreamObject = new Uploader(
    {
      accessKeyId: sails.config.aws.accessKeyId,
      secretAccessKey: sails.config.aws.secretAccessKey,
      region: 'us-east-1'
    },
    {
      Bucket: 'cloud.bethel.io',
      Key: bucketName + '/' + key
    },
    function (err, uploadStream) {
      if (err) return callback(err);

      uploadStream.on('uploaded', function (data) {
        sails.log.info('Finished uploading ' + fileUrl + ' to ' + bucketName + '/' + key);
        return callback();
      });

      request.get(fileUrl).pipe(uploadStream);
    }
  );
};

signature = function(policy) {
  return crypto.createHmac('sha1', sails.config.aws.secretAccessKey).update(policy).digest('base64');
};

policy = function(bucketName) {
  var s3Policy = {
    expiration: moment.utc().add('minutes', 30).format('YYYY-MM-DDTHH:mm:ss\\Z'),
    conditions: [
      { bucket: 'cloud.bethel.io' },
      { acl: 'public-read' },
      ['starts-with', '$key', bucketName],
    ]
  };

  return new Buffer(JSON.stringify(s3Policy)).toString('base64');
};
