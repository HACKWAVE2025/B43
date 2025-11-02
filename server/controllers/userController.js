import User from "../models/userModel.js";

export const saveSurvey = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const {
      anxiety_level,
      mental_health_history,
      headache,
      academic_performance,
      financial_condition,
      safety,
      extracurricular_activities,
      gender,
    } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Update survey subdocument
    user.survey = user.survey || {};
    if (anxiety_level !== undefined) user.survey.anxiety_level = Number(anxiety_level);
    if (mental_health_history !== undefined) user.survey.mental_health_history = Number(mental_health_history);
    if (headache !== undefined) user.survey.headache = Number(headache);
    if (academic_performance !== undefined) user.survey.academic_performance = Number(academic_performance);
    if (financial_condition !== undefined) user.survey.financial_condition = String(financial_condition);
    if (safety !== undefined) user.survey.safety = Number(safety);
    if (extracurricular_activities !== undefined) user.survey.extracurricular_activities = Number(extracurricular_activities);
    if (gender !== undefined) user.survey.gender = Number(gender);

    // Also update profile.gender if provided (keeps profile in sync)
    if (gender !== undefined) {
      user.profile = user.profile || {};
      user.profile.gender = Number(gender);
    }

    await user.save();

    return res.json({ message: "Survey saved", survey: user.survey });
  } catch (err) {
    console.error("Error saving survey:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const getSurvey = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Return survey data if it exists, otherwise return empty object
    return res.json({ 
      message: "Survey retrieved", 
      survey: user.survey || {} 
    });
  } catch (err) {
    console.error("Error retrieving survey:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};