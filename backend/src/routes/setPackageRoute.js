const express = require("express");
const router = express.Router();
const setPackageController = require("../controllers/setPackageController");

router.post("/", setPackageController.createSetPackage);
router.get("/", setPackageController.getAllSetPackages);
router.get("/:id", setPackageController.getSetPackageById);
router.put("/:id", setPackageController.updateSetPackage);
router.delete("/:id", setPackageController.deleteSetPackage);

module.exports = router;
