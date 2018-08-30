const S3 = require('aws-sdk/clients/s3');

async function fileUpload(file) {
    this.res = {};
    let s3bucket = new S3({
        accessKeyId: process.env.ACCESS_KEY_ID,
        secretAccessKey: process.env.SECRET_ACCESS_KEY,
        Bucket: process.env.BUCKET,
    });
    const params = {
        Bucket: process.env.BUCKET,
        Key: file.name,
        Body: file.data,
    };
   /* await s3bucket.upload(params, async (err, data) => {
        if (err) {
            console.log('error in callback', err);
        }
        console.log('success', data);
        this.res = await data;
    });*/
   return await s3bucket.upload(params).promise();
}

module.exports = fileUpload;
