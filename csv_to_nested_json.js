const fs = require("fs");
const csv = require("csv-parser");

const students = [];
let count = 0;

fs.createReadStream("ECS_II_Div_A_100_Students_Mongo_FILLED.csv")
  .pipe(csv({
    mapHeaders: ({ header }) => header.trim()
  }))
  .on("data", (row) => {
    count++;

    // DEBUG: see first row once
    if (count === 1) {
      console.log("FIRST ROW 👉", row);
    }

    students.push({
      personaldetails: {
        name: String(row["name"] || "UNKNOWN"),
        address: String(row["address"] || "NA"),
        pincode: Number(row["pincode"]) || 413000,
        dob: row["DOB"] ? new Date(row["dob"]) : new Date("2000-01-01"),
        gender: String(row["gender"] || "male").toLowerCase(),
        aadharno: Number(row["aadharno"]) || (900000000000 + count),
        fathername: String(row["fathername"] || "NA"),
        mothername: String(row["mothername"] || "NA"),
        mobileno: Number(row["mobileno"]) || (9000000000 + count),
        parentno: Number(row["parentno"]) || (8000000000 + count),
        sscpercentage: Number(row["sscpercentage"]) || 60,
        hscpercentage: Number(row["hscpercentage"]) || 60
      },
      collagedetails: {
        department: String(row["department"] || "Science"),
        course: String(row["course"] || "BSC"),
        year: String(row["year"] || "Second"),
        division: String(row["division"] || "A"),
        rollno: Number(row["rollno"]) || (1000 + count),
        idno: String(row["idno"] || `BT${1000 + count}`),
        mentor: null
      }
    });
  })
  .on("end", () => {
    fs.writeFileSync(
      "students_compass_ready.json",
      JSON.stringify(students, null, 2)
    );
    console.log(`✅ DONE: ${students.length} documents created`);
  });
