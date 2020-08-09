const g = require('../common/global').global;
const {format} = require('util');
// By default, the client will authenticate using the service account file
// specified by the GOOGLE_APPLICATION_CREDENTIALS environment variable and use
// the project specified by the GOOGLE_CLOUD_PROJECT environment variable. See
// https://github.com/GoogleCloudPlatform/google-cloud-node/blob/master/docs/authentication.md
// These environment variables are set automatically on Google App Engine
const {Storage} = require('@google-cloud/storage');

// Instantiate a storage client
const storage = new Storage();

const bucket = storage.bucket(g.GCLOUD_STORAGE_BUCKET);

async function saveFile(file) {
  const blob = bucket.file(file.originalname);
  const blobStream = blob.createWriteStream();

  let finish = new Promise(function(resolve, reject) {
    blobStream.on('error', reject);
    blobStream.on('finish', async () => {
        // The public URL can be used to directly access the file via HTTP.
        // const url = format(
        //   `https://storage.googleapis.com/${bucket.name}/${blob.name}`
        // );
        const options = {
            version: 'v2', // defaults to 'v2' if missing.
            action: 'read',
            expires: Date.now() + 1000 * 60 * 60, // one hour
          };
      let url;
      try {
        [url] = await storage
        .bucket(bucket.name)
        .file(blob.name)
        .getSignedUrl(options);
        resolve(url);
      } catch(e) {
          reject(e);
      }
      }); 
    });
  blobStream.end(file.buffer);
  return await finish;
}
module.exports = {
    saveFile: saveFile
}