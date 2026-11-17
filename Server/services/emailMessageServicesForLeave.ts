import { Student } from "../models/studentModel";
import { LeaveForm } from "../models/leaveForm";

interface RCLeaveNotificationArgs {
  student: Student;
  rcName: string;
}

export const rcLeaveNotificationMessage = ({
  student,
  rcName,
}: RCLeaveNotificationArgs): { subject: string; message: string } => {
  const subject = `Leave Notification — ${student.name} (${student.rollNo})`;

  const message = `Dear ${rcName},

A student under your floor coordination has submitted a leave request.

**Student Details:**
- Name: ${student.name}
- Roll No: ${student.rollNo}
- Hostel: ${student.hostelBlock} – Floor ${student.floor}
- Room No: ${student.roomNumber}

Please log in to the Anna Oasis app to review the complete application details and take appropriate action.

Regards,  
Anna Oasis`;

  return { subject, message };
};

interface DWLeaveNotificationArgs {
  student: Student;
  dwName: string;
}

export const dwLeaveNotificationMessage = ({
  student,
  dwName,
}: DWLeaveNotificationArgs): { subject: string; message: string } => {
  const subject = `Leave Notification — ${student.name} (${student.rollNo})`;

  const message = `Dear ${dwName},

A student's leave application has been approved by the Residential Counselor (RC) and is now awaiting your approval.

**Student Details:**
- Name: ${student.name}
- Roll No: ${student.rollNo}
- Hostel: ${student.hostelBlock} – Floor ${student.floor}
- Room No: ${student.roomNumber}

Please log in to the Anna Oasis app to review the complete application details and take appropriate action.

Regards,  
Anna Oasis`;

  return { subject, message };
};

interface StudentLeaveNotificationArgs {
  student: Student;
  status: boolean;
  role : string;
  leave : LeaveForm
}

export const studentLeaveNotificationMessage = ({
  student,
  status,
  role,
  leave
}: StudentLeaveNotificationArgs): { subject: string; message: string } => {
  const decision = status ? "approved" : "rejected";

  const subject = `Leave Application ${status ? "Approved" : "Rejected"} — ${student.name} (${student.rollNo})`;

  const message = `Dear ${student.name},

Your leave application has been reviewed by the ${role} and has been ${decision}.

**Leave Details:**
- Leave Type: ${leave.leave_type}
- From Date: ${leave.from_date}
- To Date: ${leave.to_date}

${status
  ? "Your leave has been officially approved. Please ensure that you follow the hostel leave procedures and adhere to the approved leave dates."
  : "Your leave application has not been approved. Please log in to the Anna Oasis app to check the application details and any remarks provided by the approving authority."}

For further clarification, please contact the hostel administration.

Regards,
Anna Oasis `;
  
  return { subject, message };
};

interface ParentLeaveNotificationArgs {
  student: Student;
  leave: LeaveForm;
}

export const parentLeaveNotificationMessage = ({
  student,
  leave,
}: ParentLeaveNotificationArgs): { parentSubject: string; parentMessage: string } => {
  const parentSubject = `Leave Application Approved — ${student.name} (${student.rollNo})`;

  const parentMessage = `Dear Parent/Guardian,

We are pleased to inform you that your child, ${student.name}, has had their leave application reviewed and approved by the hostel administration.

**Student Details:**
- Name: ${student.name}
- Roll No: ${student.rollNo}
- Hostel Block: ${student.hostelBlock}
- Room No: ${student.roomNumber}

**Leave Application Details:**
- Leave Type: ${leave.leave_type}
- From Date: ${leave.from_date}
- To Date: ${leave.to_date}
- Reason: ${leave.reason}
- Address During Leave: ${leave.address_of_stay}
- Contact Mobile: ${leave.mobile}
- Contact Email: ${leave.email}
- Submitted At: ${leave.created_at.toLocaleString("en-IN")}

Please ensure your child follows the approved leave dates and hostel leave procedures.

For any clarification, please contact the hostel administration.

Regards,
Anna Oasis`;

  return { parentSubject, parentMessage };
};