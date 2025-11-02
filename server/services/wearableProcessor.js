// Service functions to process wearable data from uploaded Excel files
import Wearable from "../models/wearable.js";

/**
 * Get and process latest wearable data for a user
 * @param {string} userId - MongoDB ObjectId of the user
 * @returns {Promise<Object|null>} Latest wearable data or null if not found
 */
export async function getLatestWearableData(userId) {
    try {
        const latestFile = await Wearable.findOne({ userId })
            .sort({ uploadedAt: -1 });

        if (!latestFile || !latestFile.raw.data.length) {
            return null;
        }

        // Get the most recent row
        const latestRow = latestFile.raw.data[latestFile.raw.data.length - 1];

        return {
            fileId: latestFile._id.toString(),
            data: latestRow,
            headers: latestFile.raw.headers,
            uploadedAt: latestFile.uploadedAt,
            totalRows: latestFile.raw.totalRows,
        };
    } catch (error) {
        console.error("Error getting latest wearable data:", error);
        throw error;
    }
}

/**
 * Extract specific column values from all uploaded files
 * @param {string} userId - MongoDB ObjectId of the user
 * @param {string} columnName - Name of the column to extract
 * @returns {Promise<Array>} Array of values with metadata
 */
export async function extractColumnData(userId, columnName) {
    try {
        const files = await Wearable.find({ userId })
            .sort({ uploadedAt: -1 });

        const values = [];

        files.forEach(file => {
            file.raw.data.forEach((row, index) => {
                // Try both exact match and case-insensitive match
                const value = row[columnName] ?? row[columnName.toLowerCase()] ?? row[columnName.toUpperCase()];

                if (value !== undefined && value !== null) {
                    values.push({
                        value: value,
                        uploadedAt: file.uploadedAt,
                        fileId: file._id.toString(),
                        rowIndex: index,
                    });
                }
            });
        });

        return values.sort((a, b) =>
            new Date(b.uploadedAt) - new Date(a.uploadedAt)
        );
    } catch (error) {
        console.error("Error extracting column data:", error);
        throw error;
    }
}

/**
 * Find files containing specific columns
 * @param {string} userId - MongoDB ObjectId of the user
 * @param {Array<string>} requiredColumns - Array of column names that must exist
 * @returns {Promise<Array>} Array of compatible files
 */
export async function findFilesWithColumns(userId, requiredColumns) {
    try {
        const files = await Wearable.find({ userId });

        return files.filter(file => {
            const headers = file.raw.headers.map(h => h.toLowerCase());
            return requiredColumns.every(col =>
                headers.includes(col.toLowerCase())
            );
        }).map(file => ({
            _id: file._id,
            headers: file.raw.headers,
            totalRows: file.raw.totalRows,
            uploadedAt: file.uploadedAt,
        }));
    } catch (error) {
        console.error("Error finding files with columns:", error);
        throw error;
    }
}

/**
 * Get aggregated statistics from all uploaded files
 * @param {string} userId - MongoDB ObjectId of the user
 * @param {Array<string>} columns - Columns to aggregate (e.g., ['anxietyLevel', 'bpm'])
 * @returns {Promise<Object>} Statistics for each column
 */
export async function getAggregatedStats(userId, columns = []) {
    try {
        const files = await Wearable.find({ userId });

        const stats = {};

        columns.forEach(columnName => {
            const values = [];

            files.forEach(file => {
                file.raw.data.forEach(row => {
                    const value = row[columnName] ?? row[columnName.toLowerCase()];
                    if (value !== undefined && value !== null) {
                        const numValue = Number(value);
                        if (!isNaN(numValue)) {
                            values.push(numValue);
                        }
                    }
                });
            });

            if (values.length > 0) {
                const sum = values.reduce((a, b) => a + b, 0);
                const avg = sum / values.length;
                const min = Math.min(...values);
                const max = Math.max(...values);

                stats[columnName] = {
                    count: values.length,
                    average: avg,
                    min,
                    max,
                    sum,
                };
            }
        });

        return stats;
    } catch (error) {
        console.error("Error getting aggregated stats:", error);
        throw error;
    }
}

/**
 * Get all data points from all uploaded files, flattened
 * @param {string} userId - MongoDB ObjectId of the user
 * @param {Object} options - Options for filtering
 * @returns {Promise<Array>} Array of all data points
 */
export async function getAllDataPoints(userId, options = {}) {
    try {
        const { limit, sortBy = 'uploadedAt', sortOrder = -1 } = options;

        const files = await Wearable.find({ userId })
            .sort({ uploadedAt: sortOrder });

        const allPoints = [];

        files.forEach(file => {
            file.raw.data.forEach((row, index) => {
                allPoints.push({
                    ...row,
                    _fileId: file._id.toString(),
                    _uploadedAt: file.uploadedAt,
                    _rowIndex: index,
                });
            });
        });

        // Sort by uploadedAt if specified
        if (sortBy === 'uploadedAt') {
            allPoints.sort((a, b) =>
                sortOrder === -1
                    ? new Date(b._uploadedAt) - new Date(a._uploadedAt)
                    : new Date(a._uploadedAt) - new Date(b._uploadedAt)
            );
        }

        return limit ? allPoints.slice(0, limit) : allPoints;
    } catch (error) {
        console.error("Error getting all data points:", error);
        throw error;
    }
}

