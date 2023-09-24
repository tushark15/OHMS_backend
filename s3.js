require("dotenv").config();
const fs = require("fs");
const aws = require("aws-sdk");

const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKey = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_KEY;


const s3 =  new aws.S3({
  region,
  apiVersion: "latest",
  credentials:{ accessKey, secretAccessKey },
});

//upload a file to s3
function uploadFile(file) {
  const fileStream = fs.createReadStream(file.path);
  const uploadParams = {
    Bucket: bucketName,
    Body: fileStream,
    Key: file.filename,
  };
  return s3.putObject(uploadParams, (error, data)=>{
    console.log({error, data})
  });
}

exports.uploadFile = uploadFile;
