// Example controller showing how to use uploaded wearable data
import { 
  getLatestWearableData, 
  extractColumnData,
  findFilesWithColumns,
  getAggregatedStats,
  getAllDataPoints
} from "../services/wearableProcessor.js";
import Wearable from "../models/wearable.js";

/**
 * Get the latest uploaded data for the authenticated user
 */
export const getLatestData = async (req, res) => {
  try {
    const userId = req.user.id;
    const latest = await getLatestWearableData(userId);
    
    if (!latest) {
      return res.json({
        success: true,
        message: "No uploaded data found",
        data: null,
      });
    }
    
    res.json({
      success: true,
      data: latest,
    });
  } catch (error) {
    console.error("Error getting latest data:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get history of a specific column (e.g., anxietyLevel)
 */
export const getColumnHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const { column } = req.query; // e.g., ?column=anxietyLevel
    
    if (!column) {
      return res.status(400).json({ error: "Column parameter is required" });
    }
    
    const history = await extractColumnData(userId, column);
    
    res.json({
      success: true,
      column,
      count: history.length,
      data: history,
    });
  } catch (error) {
    console.error("Error getting column history:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Find files that contain specific required columns
 */
export const findCompatibleFiles = async (req, res) => {
  try {
    const userId = req.user.id;
    const { columns } = req.body; // Array of required column names
    
    if (!columns || !Array.isArray(columns)) {
      return res.status(400).json({ 
        error: "columns must be an array of column names" 
      });
    }
    
    const compatibleFiles = await findFilesWithColumns(userId, columns);
    
    res.json({
      success: true,
      requiredColumns: columns,
      count: compatibleFiles.length,
      files: compatibleFiles,
    });
  } catch (error) {
    console.error("Error finding compatible files:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get aggregated statistics for specific columns
 */
export const getStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const { columns } = req.query; // Comma-separated: ?columns=anxietyLevel,bpm,headache
    
    const columnArray = columns 
      ? columns.split(',').map(c => c.trim())
      : ['anxietyLevel', 'headache', 'bpm']; // Default columns
    
    const stats = await getAggregatedStats(userId, columnArray);
    
    res.json({
      success: true,
      stats,
    });
  } catch (error) {
    console.error("Error getting stats:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get all data points from all uploaded files
 */
export const getAllPoints = async (req, res) => {
  try {
    const userId = req.user.id;
    const limit = parseInt(req.query.limit) || 100; // Default limit 100
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
    
    const dataPoints = await getAllDataPoints(userId, {
      limit,
      sortOrder,
    });
    
    res.json({
      success: true,
      count: dataPoints.length,
      limit,
      data: dataPoints,
    });
  } catch (error) {
    console.error("Error getting all data points:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Direct database query example - get all files with metadata
 */
export const getAllFilesMetadata = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Direct MongoDB query using the Wearable model
    const files = await Wearable.find({ userId })
      .sort({ uploadedAt: -1 })
      .select("raw.headers raw.totalRows source uploadedAt _id")
      .lean(); // Use lean() for better performance if you don't need Mongoose documents
    
    const metadata = files.map(file => ({
      id: file._id.toString(),
      headers: file.raw.headers,
      totalRows: file.raw.totalRows,
      columnCount: file.raw.headers.length,
      source: file.source,
      uploadedAt: file.uploadedAt,
    }));
    
    res.json({
      success: true,
      count: metadata.length,
      files: metadata,
    });
  } catch (error) {
    console.error("Error getting files metadata:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get specific row from a specific file
 */
export const getFileRow = async (req, res) => {
  try {
    const userId = req.user.id;
    const { fileId, rowIndex } = req.params;
    
    const file = await Wearable.findOne({ 
      _id: fileId, 
      userId 
    });
    
    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }
    
    const rowIndexNum = parseInt(rowIndex);
    if (isNaN(rowIndexNum) || rowIndexNum < 0 || rowIndexNum >= file.raw.data.length) {
      return res.status(400).json({ 
        error: `Invalid row index. File has ${file.raw.data.length} rows (0-${file.raw.data.length - 1})` 
      });
    }
    
    res.json({
      success: true,
      fileId: file._id.toString(),
      rowIndex: rowIndexNum,
      headers: file.raw.headers,
      data: file.raw.data[rowIndexNum],
    });
  } catch (error) {
    console.error("Error getting file row:", error);
    res.status(500).json({ error: error.message });
  }
};



