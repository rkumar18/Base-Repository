const awsSdk = require('aws-sdk');
const fs = require('fs');
const path = require('path');
const s3 = new awsSdk.S3({accessKeyId: "AKIAJFOU3XDWZAUE7EHQ" , secretAccessKey: "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"});
exports.uploadFileToS3 = uploadFileToS3;
exports.readFileToUpload = readFileToUpload;

function uploadFileToS3(fileParams) {
    return new Promise((resolve, reject) => {
            s3.upload(fileParams, (err, res) => {
                if(err) {
                    console.log(err);
                    reject(err)
                } 
                console.log(res);
                resolve(res);
            })
    });
}

async function readFileToUpload(fileDetails) {
    try{
        const fileData = fs.readFileSync(path.join(process.cwd(), fileDetails.path));   //path.join(process.cwd,
        const linkS3 = await uploadFileToS3({
            Bucket: "shoplocally2020",
            Key: fileDetails.originalname,
            ACL : "public-read",
            Body: fileData
        })
        try{
            fs.unlinkSync(path.join(process.cwd(), fileDetails.path))
        }catch(err) {
            throw err //response 
        }
        if(!linkS3) {
            throw "Invalid Operation"
        }
        return linkS3.Location
    }
    catch(err) {
        console.log(err);
        throw err 
    }
}