import multer from "multer";
import ExcelJS from "exceljs";
import Wearable from "../models/wearable.js";

// Configure multer for memory storage
const storage = multer.memoryStorage();
export const upload = multer({ storage: storage });

/**
 * Upload Excel file and save all headers to database
 */
export const uploadExcel = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const userId = req.user.id; // From verifyToken middleware

    // Parse Excel file using ExcelJS
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(req.file.buffer);

    // Get the first worksheet
    const worksheet = workbook.getWorksheet(1);
    if (!worksheet) {
      return res.status(400).json({ error: "Excel file is empty" });
    }

    // Extract headers from first row
    const headers = [];
    worksheet.getRow(1).eachCell((cell, colNumber) => {
      headers[colNumber] = cell.value?.toString() || `Column${colNumber}`;
    });

    // Convert worksheet to JSON (all rows)
    const jsonData = [];
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return; // Skip header row
      
      const rowData = {};
      row.eachCell((cell, colNumber) => {
        const header = headers[colNumber];
        if (header) {
          rowData[header] = cell.value;
        }
      });
      if (Object.keys(rowData).length > 0) {
        jsonData.push(rowData);
      }
    });

    // Save to database
    const wearableData = new Wearable({
      userId,
      raw: {
        headers,
        data: jsonData,
        totalRows: jsonData.length,
        uploadedAt: new Date(),
      },
      source: "excel_upload",
    });

    await wearableData.save();

    res.json({
      success: true,
      records: jsonData.length,
      headers,
      message: `Successfully uploaded ${jsonData.length} record(s) with ${headers.length} columns`,
    });
  } catch (error) {
    console.error("Excel upload error:", error);
    res.status(500).json({ error: "Failed to process Excel file", details: error.message });
  }
};

/**
 * Get all uploaded wearable data for the authenticated user
 */
export const getUserWearableData = async (req, res) => {
  try {
    const userId = req.user.id;

    const wearableData = await Wearable.find({ userId })
      .sort({ uploadedAt: -1 }) // Most recent first
      .select("raw source uploadedAt");

    res.json({
      success: true,
      count: wearableData.length,
      data: wearableData,
    });
  } catch (error) {
    console.error("Error fetching wearable data:", error);
    res.status(500).json({ error: "Failed to fetch wearable data", details: error.message });
  }
};

/**
 * Get specific uploaded file by ID
 */
export const getWearableDataById = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const wearableData = await Wearable.findOne({ _id: id, userId });

    if (!wearableData) {
      return res.status(404).json({ error: "Wearable data not found" });
    }

    res.json({
      success: true,
      data: wearableData,
    });
  } catch (error) {
    console.error("Error fetching wearable data:", error);
    res.status(500).json({ error: "Failed to fetch wearable data", details: error.message });
  }
};



