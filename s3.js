require("dotenv").config();
const fs = require("fs");
const aws = require("aws-sdk");

const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKey = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_KEY;

aws.config.update({
  accessKeyId: accessKey,
  secretAccessKey: secretAccessKey,
  region: region,
});

const s3 =  new aws.S3({
  apiVersion: "latest",
});

//upload a file to s3
function uploadFile(file) {
  const fileStream = fs.createReadStream(file.path);
  const uploadParams = {
    Bucket: bucketName,
    Body: fileStream,
    Key: file.filename,
  };
  return s3.upload(uploadParams).promise();
}

//download a file from s3
function getFileStream(fileKey) {
  const downloadParams = {
    Key: fileKey,
    Bucket: bucketName,
  };
  return s3.getObject(downloadParams).createReadStream();
}

exports.uploadFile = uploadFile;
exports.getFileStream = getFileStream;
