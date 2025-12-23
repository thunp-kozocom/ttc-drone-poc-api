const express = require("express");
const awsServerlessExpressMiddleware = require("aws-serverless-express/middleware");

const { corsMiddleware, authContextMiddleware } = require("./middlewares");
const { errorHandler, NotFoundError } = require("./errors");

const filesRoutes = require("./routes/files");
const inspectionsRoutes = require("./routes/inspections");
const structuresRoutes = require("./routes/structures");

const app = express();

app.use(awsServerlessExpressMiddleware.eventContext());

// =========================
// Body Parser Middleware
// =========================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// =========================
// CORS Middleware (API Gateway)
// =========================
app.use(corsMiddleware);

// =========================
// Auth Context Middleware (Cognito)
// =========================
app.use(authContextMiddleware);

// =========================
// Routes
// =========================
app.use("/files", filesRoutes);
app.use("/inspections", inspectionsRoutes);
app.use("/structures", structuresRoutes);
app.use("/", (req, res) => {
  res.json({
    message: "Hello World",
  });
});

// =========================
// 404 Handler
// =========================
app.use((req, res, next) => {
  next(new NotFoundError());
});

// =========================
// Error Handler
// =========================
app.use(errorHandler);

module.exports = app;
