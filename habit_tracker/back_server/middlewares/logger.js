// function logRequest(req, res, next) {
//   console.log(`Recieved ${req.method} reqest for ${req.url}`);
//   next();
// }
// export default logRequest;

function logRequest(req, res, next) {
  console.log(`Received ${req.method} request for ${req.url}`);

  next();
}

export default logRequest;
