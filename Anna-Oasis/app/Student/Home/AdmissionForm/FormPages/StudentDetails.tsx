import React from "react";
import TextField from "@/components/form/TextField";
import SelectField from "@/components/form/SelectField";
import RadioField from "@/components/form/RadioField";

const StudentDetails = () => (
  <>
    <TextField label="Name" value="name" placeholder="Enter name" />
    <TextField label="Roll No" value="rollNo" placeholder="Roll number" />
    <SelectField label="Course" value="course" options={[{ label: "B.Tech", value: "B.Tech" }, { label: "M.Tech", value: "M.Tech" }]} />
    <SelectField label="Branch" value="branch" options={[{ label: "CSE", value: "Computer Science" }]} />
    <SelectField label="Semester" value="semester" options={[{ label: "1", value: "1" }, { label: "2", value: "2" }]} />
    <TextField label="Date of Birth" value="dateOfBirth" placeholder="YYYY-MM-DD" />
    <TextField label="Age" value="age" placeholder="Age" />
    <TextField label="Mobile" value="mobile" placeholder="Mobile Number" />
    <TextField label="Email" value="email" placeholder="Email" />
    <SelectField label="Admission Category" value="admissionCategory" options={[{ label: "NRI", value: "NRI" }, { label: "General", value: "General" }]} />
    <TextField label="Blood Group" value="bloodGroup" placeholder="e.g. B+" />
    <TextField label="Medical History" value="medicalHistory" placeholder="Optional" />
    <RadioField label="Previous Resident" value="previousResident" options={[{ label: "Yes", value: "yes" }, { label: "No", value: "no" }]} />
  </>
);

export default StudentDetails;
