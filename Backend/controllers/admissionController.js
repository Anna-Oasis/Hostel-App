import Admission from "../models/admissionModel.js";

export const getAllAdmissions = async (req, res) => {
  try {
    const admissions = await Admission.find();
    res.status(200).json({
      success: true,
      count: admissions.length,
      data: admissions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error while fetching admissions",
      error: error.message,
    });
  }
};

export const getAdmissionById = async (req, res) => {
  try {
    const admission = await Admission.findById(req.params.id);
    if (!admission) {
      return res.status(404).json({
        success: false,
        message: `Admission with ID ${req.params.id} not found`,
      });
    }
    res.status(200).json({
      success: true,
      data: admission,
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
      message: "Server error while fetching admission",
      error: error.message,
    });
  }
};

export const createAdmission = async (req, res) => {
  try {
    const admissionData = req.body;
    const newAdmission = new Admission(admissionData);
    const savedAdmission = await newAdmission.save();
    res.status(201).json({
      success: true,
      message: "Admission created successfully",
      data: savedAdmission,
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
      message: "Server error while creating admission",
      error: error.message,
    });
  }
};

export const updateAdmissionById = async (req, res) => {
  try {
    const updatedAdmission = await Admission.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!updatedAdmission) {
      return res.status(404).json({
        success: false,
        message: `Admission with ID ${req.params.id} not found`,
      });
    }
    res.status(200).json({
      success: true,
      message: "Admission updated successfully",
      data: updatedAdmission,
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
      message: "Server error while updating admission",
      error: error.message,
    });
  }
};

export const deleteAdmissionById = async (req, res) => {
  try {
    const deletedAdmission = await Admission.findByIdAndDelete(req.params.id);
    if (!deletedAdmission) {
      return res.status(404).json({
        success: false,
        message: `Admission with ID ${req.params.id} not found`,
      });
    }
    res.status(200).json({
      success: true,
      message: "Admission deleted successfully",
      data: deletedAdmission,
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
      message: "Server error while deleting admission",
      error: error.message,
    });
  }
};
