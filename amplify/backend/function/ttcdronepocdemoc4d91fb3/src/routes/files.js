const express = require("express");
const { requireAuth } = require("../middlewares");
const router = express.Router();

/**
 * GET /files/auth
 * Generate S3 presigned URL for file upload
 */
router.get("/auth", requireAuth, async (req, res) => {
  // TODO: generate S3 presigned URL
  res.json({
    uploadUrl: "https://example-presigned-url",
    expiresIn: 300,
  });
});

module.exports = router;
