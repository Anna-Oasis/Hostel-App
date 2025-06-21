
 const hostelBlock = {
  BOYS: "Flora",
  GIRLS: "Lavender"
}

type student = {
    rollNo : number;
    name : string;
    floor : number;
    block : typeof hostelBlock[keyof typeof hostelBlock];
    present ?: boolean;
}


//sample recodrs from backend
let sampleStudents: student[] = [
  { rollNo: 2023115001, name: "Aarav Kumar", floor: 1, block: "Flora" },
  { rollNo: 2023115002, name: "Meera Iyer", floor: 2, block: "Lavender" },
  { rollNo: 2023115003, name: "Rohan Das", floor: 3, block: "Flora" },
  { rollNo: 2023115004, name: "Diya Reddy", floor: 1, block: "Lavender" },
  { rollNo: 2023115005, name: "Karan Verma", floor: 2, block: "Flora" },
  { rollNo: 2023115006, name: "Sneha Nair", floor: 3, block: "Lavender" },
  { rollNo: 2023115007, name: "Vikram Singh", floor: 1, block: "Flora" },
  { rollNo: 2023115008, name: "Pooja Sharma", floor: 2, block: "Lavender" },
  { rollNo: 2023115009, name: "Aditya Menon", floor: 3, block: "Flora" },
  { rollNo: 2023115010, name: "Nisha Patel", floor: 1, block: "Lavender" },
];

//Adding the extra field present to the values from backend by default false
sampleStudents.forEach(item => {
  item.present = false;
});

//Marking the student present or absent
const markPresent = (index : number) => {
    const updated = [...sampleStudents]
    updated[index].present = !updated[index].present
    sampleStudents = updated
}



//for submiting the attendance list
type attendanceListType = {
  hostel : typeof hostelBlock[keyof typeof hostelBlock];
  floor : number;
  no_present : number;
  no_absent : number;
  absentees : number[]
}

const handelRCAttendance = (floor : number) => {
     const attendance : attendanceListType = {
        hostel: "",
        floor,
        no_present: 0,
        no_absent: 0,
        absentees: [] as number[], // assuming rollNo is a string
      };
    (sampleStudents.filter(val => val.floor === floor)).
    forEach(item => {
      attendance.hostel = item.block
      item.present ? attendance.no_present += 1 : attendance.no_absent += 1
      !item.present && attendance.absentees.push(item.rollNo)
    })

    console.log(attendance)
}

export {sampleStudents, markPresent, handelRCAttendance}

