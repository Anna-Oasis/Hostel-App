import ReAdmission from "../models/reAdmissionModel.js";

export const getAllReAdmissions = async (req, res) => {
  try {
    const reAdmissions = await ReAdmission.find();
    res.status(200).json({
      success: true,
      count: reAdmissions.length,
      data: reAdmissions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error while fetching re-admissions",
      error: error.message,
    });
  }
};

export const getReAdmissionById = async (req, res) => {
  try {
    const reAdmission = await ReAdmission.findById(req.params.id);
    if (!reAdmission) {
      return res.status(404).json({
        success: false,
        message: `Re-admission with ID ${req.params.id} not found`,
      });
    }
    res.status(200).json({
      success: true,
      data: reAdmission,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid ID format",
      });
    }
    res.status(500).json({
      success: false,
      message: "Server error while fetching re-admission",
      error: error.message,
    });
  }
};

export const createReAdmission = async (req, res) => {
  try {
    const reAdmissionData = req.body;
    const newReAdmission = new ReAdmission(reAdmissionData);
    const savedReAdmission = await newReAdmission.save();
    res.status(201).json({
      success: true,
      message: "Re-admission created successfully",
      data: savedReAdmission,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors,
      });
    }
    res.status(500).json({
      success: false,
      message: "Server error while creating re-admission",
      error: error.message,
    });
  }
};

export const updateReAdmissionById = async (req, res) => {
  try {
    const updatedReAdmission = await ReAdmission.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!updatedReAdmission) {
      return res.status(404).json({
        success: false,
        message: `Re-admission with ID ${req.params.id} not found`,
      });
    }
    res.status(200).json({
      success: true,
      message: "Re-admission updated successfully",
      data: updatedReAdmission,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors,
      });
    }
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid ID format",
      });
    }
    res.status(500).json({
      success: false,
      message: "Server error while updating re-admission",
      error: error.message,
    });
  }
};

export const deleteReAdmissionById = async (req, res) => {
  try {
    const deletedReAdmission = await ReAdmission.findByIdAndDelete(
      req.params.id
    );
    if (!deletedReAdmission) {
      return res.status(404).json({
        success: false,
        message: `Re-admission with ID ${req.params.id} not found`,
      });
    }
    res.status(200).json({
      success: true,
      message: "Re-admission deleted successfully",
      data: deletedReAdmission,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid ID format",
      });
    }
    res.status(500).json({
      success: false,
      message: "Server error while deleting re-admission",
      error: error.message,
    });
  }
};
