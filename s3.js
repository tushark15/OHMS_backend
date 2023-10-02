require("dotenv").config();
const fs = require("fs");
const aws = require("aws-sdk");

const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKey = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_KEY;
const maxBucketSizeBytes = 2 * 1024 * 1024 * 1024; //2GB

aws.config.update({
  accessKeyId: accessKey,
  secretAccessKey: secretAccessKey,
  region: region,
});

const s3 = new aws.S3({
  apiVersion: "latest",
});


async function checkBucketSize() {
  try {
    const response = await s3.listObjectsV2({ Bucket: bucketName }).promise();
    const bucketSize = response.Contents.reduce(
      (total, object) => total + object.Size,
      0
    );
    return bucketSize;
  } catch (err) {
    console.error("Error checking bucket size: ", err);
    throw err;
  }
}
//upload a file to s3
async function uploadFile(file) {
  //check if bucket is full
  try {
    const bucketSize = await checkBucketSize();
    if (bucketSize + file.size > maxBucketSizeBytes) {
      console.log("Bucket is full");
      throw new Error("Bucket is full");
    }
    const fileStream = fs.createReadStream(file.path);
    const uploadParams = {
      Bucket: bucketName,
      Body: fileStream,
      Key: file.filename,
    };
    return s3.upload(uploadParams).promise();
  } catch (err) {
    console.error("Error checking bucket size: ", err);
    throw err;
  }
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
