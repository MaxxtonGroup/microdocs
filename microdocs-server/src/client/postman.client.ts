
const Client = require( 'node-rest-client' ).Client;

export class PostmanClient {

  public updateCollection( collection: any, collectionInfo: {collectionId: string, postmanId: string}, apiKey: string ): Promise<{collectionId: string, postmanId: string}> {
    return new Promise( ( resolve: (collectionInfo: {collectionId: string, postmanId: string} ) => void, reject: ( err?: any ) => void ) => {
      try {
        console.info("Update postman collection: ", collectionInfo.collectionId);
        const client = new Client();
        client.on( 'error', reject);
        const args: any = {
          headers: {
            "Content-Type": "application/json",
            "X-Api-Key": apiKey
          },
          data: { collection }
        };
        collection.info._postman_id = collectionInfo.postmanId;
        const url = `https://api.getpostman.com/collections/${collectionInfo.collectionId}`;
        client.put( url, args, ( data: any, response: any ) => {
          if ( response.statusCode >= 200 && response.statusCode < 300 ) {
            resolve( {collectionId: data.collection.uid, postmanId: data.collection.id} );
          } else {
            const message = "Wrong response status " + response.statusCode + ", expected 2xx -> body:\n " + JSON.stringify(data);
            reject( message );
          }
        } ).on( 'error', ( error: any ) => {
          const message = "Failed to POST to " + url + " (" + error + ")";
          reject( message );
        } );
      } catch ( e ) {
        reject(e);
      }
    });
  }

  public createCollection( collection: any, apiKey: string ): Promise<{collectionId: string, postmanId: string}> {
    return new Promise( ( resolve: (collectionInfo: {collectionId: string, postmanId: string} ) => void, reject: ( err?: any ) => void ) => {
      try {
        console.info("Create postman collection");
        const client = new Client();
        client.on( 'error', reject);
        const args: any = {
          headers: {
            "Content-Type": "application/json",
            "X-Api-Key": apiKey
          },
          data: { collection }
        };
        const url = `https://api.getpostman.com/collections`;
        client.post( url, args, ( data: any, response: any ) => {
          if ( response.statusCode >= 200 && response.statusCode < 300 ) {
            resolve( {collectionId: data.collection.uid, postmanId: data.collection.id} );
          } else {
            const message = "Wrong response status " + response.statusCode + ", expected 2xx -> body:\n " + data.toString();
            reject( message );
          }
        } ).on( 'error', ( error: any ) => {
          const message = "Failed to POST to " + url + " (" + error + ")";
          reject( message );
        } );
      } catch ( e ) {
        reject(e);
      }
    });
  }

}
