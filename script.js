//=========================================
// Google Sheets
//=========================================

const API_URL = "https://script.google.com/macros/s/AKfycbxfO2j_rjDcv0lpsPiAoXeEDHogiF2OgrWUVFTNPrAQ22_zK1MMgRsFeWGea75SvvCR/exec";

const ATTENDANCE_API = "https://script.google.com/macros/s/AKfycbxVoTCp_U39WL_p31kqdX7PKC3Kq4GSntIACwvd_GqEN1iX-aDe59lDzMipFxOG2bqV/exec";

const HOMEWORK_API = "https://script.google.com/macros/s/AKfycbxIK-tYs_H5A_o1fhpSUfpRBCw8uKcylW_kAo5HE37xfUTn7gf_MCR5dyeqbfuN91tUxQ/exec";

const EXAM_API = "https://script.google.com/macros/s/AKfycbx15WOpC89mURbDxX9RzsSktMgK57kLpCgXPrLV-jiNtAe0fkdZ2xVIa7LmYzyUvvqB/exec";

let students = [];
let currentStudent = null;

//=========================================
// عناصر الصفحة
//=========================================

const codeInput = document.getElementById("codeInput");
const passwordInput = document.getElementById("passwordInput");

const searchBtn = document.getElementById("searchBtn");

const result = document.getElementById("result");
const notFound = document.getElementById("notFound");

const attendanceBtn = document.getElementById("attendanceBtn");
const homeworkBtn = document.getElementById("homeworkBtn");
const examBtn = document.getElementById("examBtn");

const attendanceCard = document.getElementById("attendanceCard");
const homeworkCard = document.getElementById("homeworkCard");
const examCard = document.getElementById("examCard");

const attendanceContent = document.getElementById("attendanceContent");
const homeworkContent = document.getElementById("homeworkContent");
const examContent = document.getElementById("examContent");

const backBtn = document.getElementById("backBtn");
const backHomeworkBtn = document.getElementById("backHomeworkBtn");
const backExamBtn = document.getElementById("backExamBtn");

//=========================================
// تحميل البيانات
//=========================================

async function loadStudents(){

    try{

        searchBtn.disabled = true;
        searchBtn.innerHTML = "جارى تحميل البيانات...";

        const response = await fetch(API_URL);

        students = await response.json();

        console.log("Students :", students.length);

        searchBtn.disabled = false;
        searchBtn.innerHTML = "استعلام";

    }

    catch(error){

        console.log(error);

        alert("تعذر تحميل البيانات");

    }

}

loadStudents();

//=========================================
// Events
//=========================================

searchBtn.addEventListener("click", searchStudent);

codeInput.addEventListener("keypress", function(e){

    if(e.key==="Enter"){

        searchStudent();

    }

});

attendanceBtn.addEventListener("click", showAttendance);

homeworkBtn.addEventListener("click", showHomework);

examBtn.addEventListener("click", showExam);

backBtn.addEventListener("click", function(){

    attendanceCard.classList.add("hidden");
    homeworkCard.classList.add("hidden");
    examCard.classList.add("hidden");

    result.classList.remove("hidden");

});

backHomeworkBtn.addEventListener("click", function(){

    attendanceCard.classList.add("hidden");
    homeworkCard.classList.add("hidden");
    examCard.classList.add("hidden");

    result.classList.remove("hidden");

});

backExamBtn.addEventListener("click", function(){

    attendanceCard.classList.add("hidden");
    homeworkCard.classList.add("hidden");
    examCard.classList.add("hidden");

    result.classList.remove("hidden");

});
//=========================================
// عرض بيانات الطالب
//=========================================

function displayStudent(student){

    currentStudent = student;

    result.classList.remove("hidden");
    notFound.classList.add("hidden");

    attendanceCard.classList.add("hidden");
    homeworkCard.classList.add("hidden");
    examCard.classList.add("hidden");

    attendanceBtn.classList.remove("hidden");
    homeworkBtn.classList.remove("hidden");
    examBtn.classList.remove("hidden");

    document.getElementById("studentCode").textContent = student.code;
    document.getElementById("studentName").textContent = student.name;
    document.getElementById("studentGrade").textContent = student.grade;
    document.getElementById("studentGroup").textContent = student.group;
    document.getElementById("studentWhatsapp").textContent = student.studentWhatsapp;
    document.getElementById("parentWhatsapp").textContent = student.parentWhatsapp;

}

//=========================================
// البحث عن الطالب
//=========================================

function searchStudent(){

    const code = codeInput.value.trim();
    const password = passwordInput.value.trim();

    if(code==="" || password===""){

        alert("برجاء إدخال كود الطالب والرقم السري");

        codeInput.focus();

        return;

    }

    result.classList.add("hidden");
    attendanceCard.classList.add("hidden");
    homeworkCard.classList.add("hidden");
    examCard.classList.add("hidden");

    notFound.classList.add("hidden");

    const matchedStudents = students.filter(student =>

        String(student.code).trim() === code &&
        String(student.password).trim() === password

    );

    if(matchedStudents.length===0){

        notFound.innerHTML = `
            <i class="fa-solid fa-circle-xmark"></i><br>
            كود الطالب أو كلمة السر غير صحيحة
        `;

        notFound.classList.remove("hidden");

        codeInput.value="";
        passwordInput.value="";

        codeInput.focus();

        return;

    }

    displayStudent(matchedStudents[0]);

    codeInput.value="";
    passwordInput.value="";

}
//=========================================
// عرض سجل الحضور
//=========================================

async function showAttendance(){

    result.classList.add("hidden");

    homeworkCard.classList.add("hidden");
    examCard.classList.add("hidden");

    attendanceCard.classList.remove("hidden");

    attendanceContent.innerHTML =
    "جارى تحميل سجل الحضور...";

    try{

        const response = await fetch(
            ATTENDANCE_API + "?code=" + currentStudent.code
        );

        const data = await response.json();

        if(data.length===0){

            attendanceContent.innerHTML =
            "<h3>لا يوجد سجل حضور لهذا الطالب</h3>";

            return;

        }

        let html = `

        <table class="attendance-table">

            <tr>

                <th>الدرس</th>

                <th>التاريخ</th>

                <th>الحالة</th>

            </tr>

        `;

        data.forEach(item=>{

            html += `

            <tr>

                <td>${item.lesson}</td>

                <td>${item.date}</td>

                <td>${item.status}</td>

            </tr>

            `;

        });

        html += "</table>";

        attendanceContent.innerHTML = html;

    }

    catch(error){

        attendanceContent.innerHTML =

        "<h3>حدث خطأ أثناء تحميل بيانات الحضور</h3>";

    }

}
//=========================================
// عرض درجات الواجب
//=========================================

async function showHomework(){

    result.classList.add("hidden");

    attendanceCard.classList.add("hidden");
    examCard.classList.add("hidden");

    homeworkCard.classList.remove("hidden");

    homeworkContent.innerHTML = "جارى تحميل درجات الواجب...";

    try{

        const response = await fetch(
            HOMEWORK_API + "?code=" + currentStudent.code
        );

        const data = await response.json();

        if(data.length === 0){

            homeworkContent.innerHTML =
            "<h3>لا توجد درجات واجبات لهذا الطالب</h3>";

            return;

        }

        let html = `

        <table class="attendance-table">

            <tr>

                <th>الواجب</th>

                <th>التاريخ</th>

                <th>الدرجة</th>

                <th>من</th>

            </tr>

        `;

        data.forEach(item=>{

            html += `

            <tr>

                <td>${item.homework}</td>

                <td>${item.date}</td>

                <td>${item.grade}</td>

                <td>${item.total}</td>

            </tr>

            `;

        });

        html += "</table>";

        homeworkContent.innerHTML = html;

    }

    catch(error){

        console.log(error);

        homeworkContent.innerHTML =
        "<h3>حدث خطأ أثناء تحميل درجات الواجب</h3>";

    }

}
//=========================================
// عرض درجات الامتحانات
//=========================================

async function showExam(){

    result.classList.add("hidden");

    attendanceCard.classList.add("hidden");
    homeworkCard.classList.add("hidden");

    examCard.classList.remove("hidden");

    examContent.innerHTML = "جارى تحميل درجات الامتحانات...";

    try{

        const response = await fetch(
            EXAM_API + "?code=" + currentStudent.code
        );

        const data = await response.json();

        if(data.length === 0){

            examContent.innerHTML =
            "<h3>لا توجد درجات امتحانات لهذا الطالب</h3>";

            return;

        }

        let html = `

        <table class="attendance-table">

            <tr>

                <th>الامتحان</th>

                <th>التاريخ</th>

                <th>الدرجة</th>

                <th>من</th>

                <th>التقدير</th>

            </tr>

        `;

        data.forEach(item=>{

            html += `

            <tr>

                <td>${item.exam}</td>

                <td>${item.date}</td>

                <td>${item.grade}</td>

                <td>${item.total}</td>

                <td>${item.level}</td>

            </tr>

            `;

        });

        html += "</table>";

        examContent.innerHTML = `
<div class="table-wrapper">
${html}
</div>
`;

    }

    catch(error){

        console.log(error);

        examContent.innerHTML =
        "<h3>حدث خطأ أثناء تحميل درجات الامتحانات</h3>";

    }

}