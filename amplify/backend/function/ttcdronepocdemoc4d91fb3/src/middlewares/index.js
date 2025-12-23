const { UnauthorizedError } = require("../errors");

function corsMiddleware(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Authorization,Content-Type");
  res.header(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,PATCH,DELETE,OPTIONS"
  );

  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
}

function getRequestContext(req) {
  return req.apiGateway?.event?.requestContext || null;
}

function parseGroups(groupsRaw) {
  if (Array.isArray(groupsRaw)) return groupsRaw;

  if (typeof groupsRaw === "string") {
    return groupsRaw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }

  return [];
}

function authContextMiddleware(req, res, next) {
  try {
    const requestContext = getRequestContext(req);
    console.log("authContextMiddleware requestContext: ", requestContext);

    const claims = requestContext?.authorizer?.claims;
    if (!claims) {
      req.user = null;
      return next();
    }

    const rawGroups = claims["cognito:groups"];
    const groups = parseGroups(rawGroups);

    req.user = {
      id: claims.sub,
      email: claims.email,
      username:
        claims["cognito:username"] ||
        claims.preferred_username ||
        claims.username,
      groups,
      tokenUse: claims.token_use,
      issuer: claims.iss,
      clientId: claims.aud || claims.client_id,
    };

    return next();
  } catch (err) {
    console.error("authContextMiddleware error:", err);
    req.user = null;
    return next();
  }
}

function requireAuth(req, res, next) {
  if (!req.user) return next(new UnauthorizedError("Unauthorized"));
  next();
}

module.exports = {
  corsMiddleware,
  authContextMiddleware,
  requireAuth,
};
