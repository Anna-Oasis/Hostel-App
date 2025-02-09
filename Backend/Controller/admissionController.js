const asyncHandler = require("express-async-handler");
const Admission = require("../model/admissionModel");

// @desc    Get all admission entries
// @route   GET /api/admission
// @access  Public
const getAllAdmissions = asyncHandler(async (req, res) => {
    const admissions = await Admission.find({});
    
    if (!admissions || admissions.length === 0) {
        res.status(404);
        throw new Error("No admission entries found");
    }

    res.status(200).json(admissions);
});

// @desc    Get a single admission entry by ID
// @route   GET /api/admission/:id
// @access  Public
const getAdmissionById = asyncHandler(async (req, res) => {
    const admission = await Admission.findById(req.params.id);

    if (!admission) {
        res.status(404);
        throw new Error("Admission entry not found");
    }

    res.status(200).json(admission);
});

// @desc    Create a new admission entry
// @route   POST /api/admission
// @access  Public
const createAdmission = asyncHandler(async (req, res) => {
    const {
        name,
        rollNo,
        course,
        branch,
        semester,
        dateOfBirth,
        hostelBlock,
        roomNumber,
        studentContact,
        email,
        category,
        bloodGroup,
        medicalHistory,
        parents,
        localGuardian,
        messPreference,
        previousResidence
    } = req.body;

    console.log("New admission request:", req.body);

    if (
        !name || !rollNo || !course || !branch || !semester || !dateOfBirth || !hostelBlock || !roomNumber ||
        !studentContact || !email || !category || !bloodGroup || !messPreference || !parents || 
        !parents.father || !parents.father.contact || 
        !parents.mother || !parents.mother.contact
    ) {
        res.status(400);
        throw new Error("All required fields must be filled");
    }

    const existingAdmission = await Admission.findOne({ email });
    if (existingAdmission) {
        res.status(400);
        throw new Error("Email already exists");
    }

    const newAdmission = new Admission({
        name,
        rollNo,
        course,
        branch,
        semester,
        dateOfBirth,
        hostelBlock,
        roomNumber,
        studentContact,
        email,
        category,
        bloodGroup,
        medicalHistory,
        parents,
        localGuardian,
        messPreference,
        previousResidence
    });

    const createdAdmission = await newAdmission.save();

    if (createdAdmission) {
        res.status(201).json(createdAdmission);
    } else {
        res.status(400);
        throw new Error("Invalid admission data");
    }
});

// @desc    Update an admission entry
// @route   PUT /api/admission/:id
// @access  Public
const updateAdmissionById = asyncHandler(async (req, res) => {
    const admission = await Admission.findById(req.params.id);

    if (!admission) {
        res.status(404);
        throw new Error("Admission entry not found");
    }

    const updatedAdmission = await Admission.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

    res.status(200).json(updatedAdmission);
});

// @desc    Delete an admission entry
// @route   DELETE /api/admission/:id
// @access  Public
const deleteAdmissionById = asyncHandler(async (req, res) => {
    const admission = await Admission.findById(req.params.id);

    if (!admission) {
        res.status(404);
        throw new Error("Admission entry not found");
    }

    await Admission.findByIdAndDelete(req.params.id);
    
    res.status(200).json({ message: "Admission entry deleted successfully" });
});

module.exports = {
    getAllAdmissions,
    getAdmissionById,
    createAdmission,
    updateAdmissionById,
    deleteAdmissionById,
};
