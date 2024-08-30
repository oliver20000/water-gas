"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const measurementController_1 = require("../controllers/measurementController");
const router = (0, express_1.Router)();
router.post('/upload', measurementController_1.uploadMeasurement);
exports.default = router;
