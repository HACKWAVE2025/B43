import express from "express";
import { predictClassifier, predictRegressor } from "../services/ml_client.js";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { uploadExcel, getUserWearableData, getWearableDataById, upload } from "../controllers/wearableController.js";
import {
  getLatestData,
  getColumnHistory,
  findCompatibleFiles,
  getStats,
  getAllPoints,
  getAllFilesMetadata,
  getFileRow,
} from "../controllers/wearableDataController.js";

const router = express.Router();

/* ---------------------------------------------
   🧩 INLINE FEATURE MAPPING HELPERS
--------------------------------------------- */

// Convert anxiety level (1–20 → 1–5)
function mapAnxiety(value) {
  const num = parseFloat(value ?? 0);
  if (num <= 4) return 1;
  if (num <= 8) return 2;
  if (num <= 12) return 3;
  if (num <= 16) return 4;
  return 5;
}

// Convert financial condition (yes/no → numeric)
function mapFinancialCondition(value) {
  if (!value) return 3; // neutral fallback
  const v = value.toString().toLowerCase().trim();
  if (v === "yes") return 5;
  if (v === "no") return 1;
  return 3;
}

// Convert academic performance (CGPA or grade → 1–5 bucket)
function mapAcademicPerformance(value) {
  const g = parseFloat(value ?? 0);
  if (g >= 9) return 5;
  if (g >= 8) return 4;
  if (g >= 7) return 3;
  if (g >= 6) return 2;
  return 1;
}

// Handle screen time if user provided or fallback default
function mapScreenTime(value) {
  if (value !== undefined && value !== null && !isNaN(value)) {
    return parseFloat(value);
  }
  // Default realistic average (if not provided)
  return 6;
}

/* ---------------------------------------------
   🧠 PREDICTION ROUTE
--------------------------------------------- */

const handlePredict = async (req, res) => {
  try {
    const { wearableData, userInputs, periodData } = req.body;

    if (!wearableData || !userInputs) {
      return res.status(400).json({
        error: "Both wearableData and userInputs are required in the request body",
      });
    }

    // ✅ Map incoming values properly (using nullish coalescing)
    const mappedFeatures = [
      mapAnxiety(userInputs.anxiety_level),                     // 1
      parseFloat(userInputs.mental_health_history ?? 0),        // 2
      parseFloat(userInputs.headache ?? 0),                     // 3
      parseFloat(wearableData.bpm ?? 0),                        // 4
      parseFloat(wearableData.sleep_duration ?? 0),             // 5
      mapAcademicPerformance(userInputs.academic_performance),  // 6
      mapFinancialCondition(userInputs.financial_condition),    // 7
      parseFloat(userInputs.safety ?? 0),                       // 8
      mapScreenTime(userInputs.screen_time),                    // 9
      parseFloat(userInputs.extracurricular_activities ?? 0),   // 10
      parseFloat(userInputs.gender ?? 0),                       // 11
      parseFloat(wearableData.blood_oxygen_spo2 ?? 0),          // 12
      parseFloat(wearableData.step_count ?? 0),                 // 13
      parseFloat(userInputs.bmi ?? 0),                          // 14
    ];

    console.log("🧠 Final mapped features for classifier:");
    mappedFeatures.forEach((f, i) => console.log(`${i + 1}: ${f}`));

    // 🔮 Predict using ML microservice
    const classifierOut = await predictClassifier(mappedFeatures);

    const response = {
      normal_stress: {
        level: classifierOut.label_text,
        value: classifierOut.label,
      },
    };

    // 🩸 Female user → add period stress regression
    if (periodData) {
      const regFeatures = [
        parseFloat(periodData.period_flow ?? 0),
        parseFloat(periodData.expected_vs_actual_date_difference ?? 0),
      ];

      console.log("🩸 Regressor features:", regFeatures);
      const regressorOut = await predictRegressor(regFeatures);

      response.period_stress = {
        value: regressorOut.period_stress,
      };
    }

    res.json(response);
  } catch (err) {
    console.error("❌ Prediction failed:", err);
    res.status(500).json({ error: "Prediction failed", details: err.message });
  }
};

/* ---------------------------------------------
   🚀 ROUTE EXPORT
--------------------------------------------- */

// Excel file upload route (protected)
router.post("/upload", verifyToken, upload.single("file"), uploadExcel);

// Get all uploaded data for authenticated user (protected)
router.get("/data", verifyToken, getUserWearableData);

// Additional data access routes (must come before /data/:id)
router.get("/data/latest", verifyToken, getLatestData);
router.get("/data/history", verifyToken, getColumnHistory);
router.post("/data/compatible", verifyToken, findCompatibleFiles);
router.get("/data/stats", verifyToken, getStats);
router.get("/data/points", verifyToken, getAllPoints);
router.get("/data/meta", verifyToken, getAllFilesMetadata);
router.get("/data/:fileId/row/:rowIndex", verifyToken, getFileRow);

// Get specific uploaded file by ID (protected) - must be last
router.get("/data/:id", verifyToken, getWearableDataById);

// ML Prediction route (protected)
router.post("/predict", verifyToken, handlePredict);

export default router;
