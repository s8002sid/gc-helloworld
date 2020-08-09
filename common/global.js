/*
Mandatory environment variables:
"GOOGLE_APPLICATION_CREDENTIALS": "${workspaceFolder}\\abc.json",
"CLIENT_ID": "used for oauth",
"CLIENT_SECRET": "used for oauth",
"WEBSERVER_URL": "used for whereever we require URL reference"
*/
let global = {
    PROJECT_NAME: "SIDDJAIN-VM",
    PROJECT_ID: "siddjain-vm",
    PROJECT_NUMBER: "462043570647",
    LOG_LEVEL: "info",
    GCLOUD_STORAGE_BUCKET: "siddjain_storage",
    //Secret
    SECRET_EMAIL_ID: "gmail-emailid",
    SECRET_EMAIL_PASSWORD: "gmail-password",
    SECRET_OAUTH_CLIENT_ID: "oauth-clientid",
    SECRET_OAUTH_CLIENT_SECRET: "oauth-clientsecret"
}
function initialize() {
    
}
module.exports = {
    global: global,
    ginit: initialize
};