const {SecretManagerServiceClient} = require('@google-cloud/secret-manager');
const client = new SecretManagerServiceClient();
const g = require('../common/global').global;

async function getSecret(name) {
    const [accessResponse] = await client.accessSecretVersion({
        name: 'projects/'+ g.PROJECT_NUMBER + '/secrets/'+ name + '/versions/latest'
    });
    return accessResponse.payload.data.toString('utf8');
}

async function addSecret(name, value) {
    let parent = 'projects/' + g.PROJECT_ID;
    const [secret] = await client.createSecret({
        parent: parent,
        secretId: name,
        secret: {
          name: name,
          replication: {
            automatic: {},
          },
        },
        name,
      });
      console.info(`Created secret ${secret.name}`);
      const [version] = await client.addSecretVersion({
        parent: secret.name,
        payload: {
          data: Buffer.from(value, 'utf8'),
        },
      });
      console.info(`Added secret version ${version.name}`);
}
module.exports = {
    getSecret: getSecret,
    addSecret: addSecret
}