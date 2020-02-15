import express from 'express';
import bodyParser from 'body-parser';
import {deleteLocalFiles, filterImageFromURL} from './util/util';

import {ResponseBody} from './response/ResponseBody';

const isImageUrl = require('is-image-url');

const HTTP_OK = 200;
const HTTP_UNPROCESSABLE_ENTITY = 422;


(async () => {

  const app = express();
  const port = process.env.PORT || 8082;


  // Use the body parser middleware for post requests
  app.use(bodyParser.json());


  // filteredimage endpoint
  app.get( "/filteredimage", async ( req, res ) => {

    // Gets the image_url request parameter
    let image_url = req.query.image_url;

    // Validate the image_url
    if (!isImageUrl(image_url)) {
      let response = new ResponseBody(HTTP_UNPROCESSABLE_ENTITY, 'The image_url is not valid');
      return res.status(response.code).send(response);
    }

    // call filterImageFromURL(image_url) to filter the imageLocalPath
    const imageLocalPath = await filterImageFromURL(image_url);

    // send the resulting file in the response and delete it from server
    res.status(HTTP_OK).sendFile(imageLocalPath, function (err) {
      if (err) {
      } else {
        deleteFileFromServer(imageLocalPath);
      }
    });

  });


  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  });


  // Start the Server
  app.listen( port, () => {
    console.log( `server running http://localhost:${ port }` );
    console.log( `press CTRL+C to stop server` );
  });

})();


function deleteFileFromServer(image: string) {
  deleteLocalFiles( [ image ] ).then(() => console.debug('File deleted: ' + image));
}
