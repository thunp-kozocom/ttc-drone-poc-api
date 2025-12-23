const express = require("express");
const { requireAuth } = require("../middlewares");
const router = express.Router();

/**
 * GET /structures
 * Get list of structures
 */
router.get("/", requireAuth, async (req, res) => {
  res.json({
    items: [],
  });
});

/**
 * GET /structures/:structureId/inspections
 * Get inspections for a specific structure
 */
router.get("/:structureId/inspections", requireAuth, async (req, res) => {
  res.json({
    structureId: req.params.structureId,
    inspections: [],
  });
});

module.exports = router;
