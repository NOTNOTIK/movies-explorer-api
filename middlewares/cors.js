const allowedCors = [
  "https://ikorka01.nomoredomainswork.ru",
  "http://ikorka01.nomoredomainswork.ru",
  "http://localhost:3001",
];
module.exports = (req, res, next) => {
  const { origin } = req.headers;
  const { method } = req;
  allowedCors;
  const DEFAULT_ALLOWED_METHODS = "GET, POST, PUT, DELETE, PATCH, HEAD";
  const requestHeaders = req.headers["access-control-request-headers"];
  if (allowedCors.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }
  if (method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", DEFAULT_ALLOWED_METHODS);
    res.header("Access-Control-Allow-Headers", requestHeaders);
    return res.end();
  }
  next();
};
