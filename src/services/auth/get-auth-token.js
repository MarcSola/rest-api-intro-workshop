// get the jsonwebtoken. the headers param gathers
// all headers that come within a request
function getAuthToken(headers = {}) {
  // console.log(headers);
  return new Promise(function getAuthTokenHandler(resolve, reject) {
    if (
      !headers.authorization ||
      !headers.authorization.startsWith("Bearer ")
    ) {
      reject(new Error("Missing authorization header"));
    }

    // formatting the bearerToken to remove the "Bearer " string
    // and only keep the token.
    const bearerToken = headers.authorization.substr(7);
    resolve(bearerToken);
  });
}

module.exports = {
  getAuthToken: getAuthToken,
};
