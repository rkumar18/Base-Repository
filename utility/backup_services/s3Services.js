const AWS = require('aws-sdk')
const Promise = require("bluebird")
class s3Upload {
    constructor() {
        this._s3Object = config.get("s3BucketCredentials")
        this._s3 = new AWS.S3({
            accessKeyId: this._s3Object.accessKeyId,
            secretAccessKey: this._s3Object.secretAccessKey
        });   
    }

    get s3(){
        return this._s3
    }

    get s3Object() {
        return this._s3Object
    }

    uploadFile(apiContext, params) {
        return new Promise((resolve, reject)=>{
            this._s3.upload(params, (s3Error, s3Data)=>{
                if (s3Error) {
                    logger.error({context: apiContext.module, event: "uploadFile", message: JSON.stringify(s3Error)});
                    reject(s3Error)
                }
                logger.info({context: apiContext.module, event: "uploadFile", message: `File uploaded Successfully to path:  ${s3Data.Location}`});
                resolve(s3Data.Location)
            })
        })
    }

    uploadFileWithACL(apiContext, file, fileKey, fileType, acl, me) {
        return new Promise(async function(resolve, reject) {
            Promise.coroutine(function* (){
                const params = {
                    Bucket: me._s3Object.bucket, // pass your bucket name
                    Key: fileKey,
                    ACL: acl,
                    Body: file
                };
                if (fileType) 
                    params.ContentType = fileType
                let uploadResponse =  yield me.uploadFile(apiContext, params)
                resolve(uploadResponse)
            })().catch(error=>{
                reject(error)
            })
        })
    }

    uploadPublicFile(apiContext, file, fileKey, fileType) {
        return this.uploadFileWithACL(apiContext, file, fileKey, fileType, "public-read", this)
    }

    uploadPrivateFile(apiContext, file, fileKey, fileType) {
        return this.uploadFileWithACL(apiContext, file, fileKey, fileType, "private", this)
    }

    uploadMultipleFilesWithAcl(apiContext, fileArray, acl, me) {
        let uploadPipeline = []
        for (let fileObject of fileArray) {
            uploadPipeline.push(me.uploadFileWithACL(apiContext, fileObject.file, fileObject.fileKey, fileObject.fileType, acl))
        }
        return Promise.all(uploadPipeline)
    }
    
    uploadMultiplePublicFiles(apiContext, fileArray) {
        return this.uploadMultipleFilesWithAcl(apiContext, fileArray, "public-read", this)
    }

    uploadMultiplePrivateFiles(apiContext, fileArray) {
        return this.uploadMultipleFilesWithAcl(apiContext, fileArray, "private", this)
    }
}

exports.uploadManager = new s3Upload()