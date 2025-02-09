const mongoose = require("mongoose");

const admissionSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please enter the student's name"],
        },
        rollNo: {
            type: String,
            required: [true, "Please enter the roll number"],
            unique: true,
        },
        course: {
            type: String,
            required: [true, "Please enter the course name"],
        },
        branch: {
            type: String,
            required: [true, "Please enter the branch"],
        },
        semester: {
            type: String,
            required: [true, "Please enter the semester"],
        },
        dateOfBirth: {
            type: Date,
            required: [true, "Please enter the date of birth"],
        },
        hostelBlock: {
            type: String,
            required: [true, "Please enter the hostel block"],
        },
        roomNumber: {
            type: String,
            required: [true, "Please enter the room number"],
        },
        studentContact: {
            type: String,
            required: [true, "Please enter the student's mobile number"],
        },
        email: {
            type: String,
            required: [true, "Please enter an email address"],
            unique: true,
        },
        category: {
            type: String,
            enum: ["NRI", "CIWGC", "FN", "LDC", "SIDS"],
            required: [true, "Please enter the admission category"],
        },
        bloodGroup: {
            type: String,
            required: [true, "Please enter the blood group"],
        },
        medicalHistory: {
            type: String,
        },
        parents: {
            father: {
                name: { type: String, required: [true, "Please enter the father's name"] },
                contact: { type: String, required: [true, "Please enter the father's contact number"] },
                email: { type: String },
            },
            mother: {
                name: { type: String, required: [true, "Please enter the mother's name"] },
                contact: { type: String, required: [true, "Please enter the mother's contact number"] },
                email: { type: String },
            },
        },
        localGuardian: {
            name: { type: String },
            contact: { type: String },
            email: { type: String },
        },
        messPreference: {
            type: String,
            enum: ["Veg", "Non-Veg"],
            required: [true, "Please enter the mess preference"],
        },
        previousResidence: {
            type: Boolean,
            required: [true, "Please specify if the student has stayed in the hostel before"],
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Admission", admissionSchema);
