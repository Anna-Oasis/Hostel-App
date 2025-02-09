const asyncHandler = require("express-async-handler");
const ReAdmission = require("../model/reAdmissionModel");

// @desc    Get all re-admission entries
// @route   GET /api/readmission
// @access  Public
const getAllReAdmissions = asyncHandler(async (req, res) => {
    const reAdmissions = await ReAdmission.find({});
    if (reAdmissions.length === 0) {
        res.status(404);
        throw new Error("No re-admission entries found");
    }
    res.status(200).json(reAdmissions);
});

// @desc    Get a single re-admission entry by ID
// @route   GET /api/readmission/:id
// @access  Public
const getReAdmissionById = asyncHandler(async (req, res) => {
    const reAdmission = await ReAdmission.findById(req.params.id);
    if (!reAdmission) {
        res.status(404);
        throw new Error("Re-admission entry not found");
    }
    res.status(200).json(reAdmission);
});

// @desc    Create a new re-admission entry
// @route   POST /api/readmission
// @access  Public
const createReAdmission = asyncHandler(async (req, res) => {
    const { name, course, branch, year, semester, mobile, email, parentsContact, localGuardian, address, roomNumber } = req.body;

    console.log("New re-admission request:", req.body);

    if (!name || !course || !branch || !year || !semester || !mobile || !email || !roomNumber || !address || !parentsContact.mobile1) {
        res.status(400);
        throw new Error("All required fields must be filled");
    }

    const emailExists = await ReAdmission.findOne({ email });
    if (emailExists) {
        res.status(400);
        throw new Error("Email already exists");
    }

    const newReAdmission = new ReAdmission({
        name,
        course,
        branch,
        year,
        semester,
        mobile,
        email,
        parentsContact,
        localGuardian,
        address,
        roomNumber,
    });

    const createdReAdmission = await newReAdmission.save();

    if (createdReAdmission) {
        res.status(201).json(createdReAdmission);
    } else {
        res.status(400);
        throw new Error("Invalid Re-admission data");
    }
});

// @desc    Update a re-admission entry
// @route   PUT /api/readmission/:id
// @access  Public
const updateReAdmissionById = asyncHandler(async (req, res) => {
    const oldReAdmission = await ReAdmission.findById(req.params.id);
    if (!oldReAdmission) {
        res.status(404);
        throw new Error("Re-admission entry not found");
    }

    const { name, course, branch, year, semester, mobile, email, parentsContact, localGuardian, address, roomNumber } = req.body;

    if (!name || !course || !branch || !year || !semester || !mobile || !email || !roomNumber || !address || !parentsContact.mobile1) {
        res.status(400);
        throw new Error("All required fields must be filled");
    }

    const updatedReAdmission = await ReAdmission.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
    );

    res.status(200).json(updatedReAdmission);
});

// @desc    Delete a re-admission entry
// @route   DELETE /api/readmission/:id
// @access  Public
const deleteReAdmissionById = asyncHandler(async (req, res) => {
    const oldReAdmission = await ReAdmission.findById(req.params.id);
    
    if (!oldReAdmission) {
        res.status(404);
        throw new Error("Re-admission entry not found");
    }

    await ReAdmission.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Re-admission entry deleted successfully" });
});

module.exports = {
    getAllReAdmissions,
    getReAdmissionById,
    createReAdmission,
    updateReAdmissionById,
    deleteReAdmissionById,
};
