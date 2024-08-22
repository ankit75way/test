
// SHARE_POINT_CLIENT_ID = 'fcaaf52a-ff56-4379-ac5d-797bacb51d68'
// SHARE_POINT_CLIENT_SECRET = '1JeI+hMwOaVY0PJxC4TKFHU0rCpdMf6s0P5csgCv8W4='
// SHARE_POINT_TENANT_ID = '620fe631-7c33-4e0b-9020-7122c7c82899'
// SHARE_POINT_SITE_ID = 'fcfa8496-89f6-49d2-9ae2-485cbf2cd6b9'
// SHARE_POINT_DRIVE_ID = 'b!CbtYWrofwUGBJWnaJkNwoNrBLp_kC3RKklSXPwrdeP3yH8_qmH9xT5Y6RODPNfYI'
// SHARE_POINT_FOLDER_PdadsATH = 'https://metsolv.sharepoint.com/sites/MetSolv/Shared%20Documents/test'
SHARE_POINT_CLIENT_ID = 'fcaaf52a-ff56-4379-ac5d-797bacb51d68'
SHARE_POINT_CLIENT_SECRET = '1JeI+hMwOaVY0PJxC4TKFHU0rCpdMf6s0P5csgCv8W4='
SHARE_POINT_TENANT_ID = '620fe631-7c33-4e0b-9020-7122c7c82899'
SHARE_POINT_SITE_ID = 'fcfa8496-89f6-49d2-9ae2-485cbf2cd6b9'
SHARE_POINT_DRIVE_ID = 'b!CbtYWrofwUGBJWnaJkNwoNrBLp_kC3RKklSXPwrdeP3yH8_qmH9xT5Y6RODPNfYI'
SHARE_POINT_FOLDER_PATH = 'https://metsolv.sharepoint.com/sites/MetSolv/Shared%20Documents/test'



const axios = require('axios');
const { ConfidentialClientApplication }  =require ('@azure/msal-node');
const fs = require('fs').promises;
const path = require('path')


async function getAccessToken(config )  {
     const cca = new ConfidentialClientApplication({
          auth: {
               clientId: config.clientId,
               authority: `https://login.microsoftonline.com/${config.tenantId}`,
               clientSecret: config.clientSecret,
          },
     });

     const result = await cca.acquireTokenByClientCredential({
          scopes: ['https://graph.microsoft.com/.default'],
     });

     if (!result || !result.accessToken) {
          throw new Error('Failed to obtain access token');
     }
     return result.accessToken;
}

async function uploadFileToSharePoint(
     config,
     filePath,
     fileContent,
     fileName
){
     try {
          const accessToken = await getAccessToken(config);
          console.log(accessToken)
          const url = `https://graph.microsoft.com/v1.0/sites/${config.siteId}/drives/${config.driveId}/root:/${config.folderPath}/${fileName}:/content`;

          const response = await axios.put(url, fileContent, {
               headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/octet-stream',
               },
          });

          if (response.status !== 201) {
               throw new Error(`Failed to upload file: ${response.statusText}`);
          }

          console.log(`Uploaded file ${fileName} to SharePoint successfully`);
     } catch (error) {
          console.error('Error uploading file to SharePoint:', error);
          throw error;
     }
}

 async function uploadCsvToSharePoint(config, filePath, fileName) {
     try {

        let newpath = path.join(__dirname,filePath)
          const fileContent = await fs.readFile(newpath);
          console.log(filePath, "filePath", config)
          await uploadFileToSharePoint(config, filePath, fileContent, fileName);
     } catch (error) {
          console.error('Error uploading CSV to SharePoint:', error);
          throw error;
     }
}
let config = {
    clientId: "fcaaf52a-ff56-4379-ac5d-797bacb51d68",
    clientSecret: "1JeI+hMwOaVY0PJxC4TKFHU0rCpdMf6s0P5csgCv8W4=",
    tenantId: "620fe631-7c33-4e0b-9020-7122c7c82899",
    siteId: "fcfa8496-89f6-49d2-9ae2-485cbf2cd6b9",
    driveId: "b!CbtYWrofwUGBJWnaJkNwoNrBLp_kC3RKklSXPwrdeP3yH8_qmH9xT5Y6RODPNfYI",
    folderPath: "MetSolv/Shared Documents/test",
}


uploadCsvToSharePoint(config,'./test.txt','abc.txt')