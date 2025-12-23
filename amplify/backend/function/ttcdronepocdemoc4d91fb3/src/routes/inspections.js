const express = require("express");
const { requireAuth } = require("../middlewares");
const router = express.Router();

/**
 * GET /inspections
 * Get list of inspections with filters
 */
router.get("/", requireAuth, async (req, res) => {
  const { keyword, fromDate, toDate, abnormal } = req.query;

  res.json({
    items: [],
    filters: { keyword, fromDate, toDate, abnormal },
    pagination: { page: 1, total: 0 },
  });
});

/**
 * POST /inspections
 * Create a new inspection
 */
router.post("/", requireAuth, async (req, res) => {
  const payload = req.body;

  // TODO: validate & save
  res.status(201).json({
    inspectionId: "inspection-id",
  });
});

/**
 * GET /inspections/:inspectionId
 * Get inspection details by ID
 */
router.get("/:inspectionId", requireAuth, async (req, res) => {
  res.json({
    inspectionId: req.params.inspectionId,
    detail: {},
  });
});

/**
 * PATCH /inspections/:inspectionId
 * Update inspection by ID
 */
router.patch("/:inspectionId", requireAuth, async (req, res) => {
  res.json({
    inspectionId: req.params.inspectionId,
    status: "UPDATED",
  });
});

module.exports = router;
