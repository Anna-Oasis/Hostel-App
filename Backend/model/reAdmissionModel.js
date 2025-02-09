const mongoose = require("mongoose");

const reAdmissionSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please enter the resident's name"],
        },
        course: {
            type: String,
            required: [true, "Please enter the course name"],
        },
        branch: {
            type: String,
            required: [true, "Please enter the branch"],
        },
        year: {
            type: String,
            required: [true, "Please enter the year of study"],
        },
        semester: {
            type: String,
            required: [true, "Please enter the semester"],
        },
        mobile: {
            type: String,
            required: [true, "Please enter the mobile number"],
        },
        email: {
            type: String,
            required: [true, "Please enter an email address"],
            unique: true,
        },
        parentsContact: {
            mobile1: {
                type: String,
                required: [true, "Please enter parent's mobile number"],
            },
            mobile2: String,
            email: String,
        },
        localGuardian: {
            name: String,
            mobile: String,
        },
        address: {
            type: String,
            required: [true, "Please enter the address"],
        },
        roomNumber: {
            type: String,
            required: [true, "Please enter the allotted room number"],
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("ReAdmission", reAdmissionSchema);
