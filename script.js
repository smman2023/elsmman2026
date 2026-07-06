//=========================================
// Google Sheets
//=========================================

const API_URL = "https://script.google.com/macros/s/AKfycbxfO2j_rjDcv0lpsPiAoXeEDHogiF2OgrWUVFTNPrAQ22_zK1MMgRsFeWGea75SvvCR/exec";
const ATTENDANCE_API = "https://script.google.com/macros/s/AKfycbxVoTCp_U39WL_p31kqdX7PKC3Kq4GSntIACwvd_GqEN1iX-aDe59lDzMipFxOG2bqV/exec";
const HOMEWORK_API = "https://script.google.com/macros/s/AKfycbxIK-tYs_H5A_o1fhpSUfpRBCw8uKcylW_kAo5HE37xfUTn7gf_MCR5dyeqbfuN91tUxQ/exec";

let students = [];


//=========================================
// عناصر الصفحة
//=========================================

const codeInput = document.getElementById("codeInput");
const passwordInput = document.getElementById("passwordInput");

const searchBtn = document.getElementById("searchBtn");

const result = document.getElementById("result");
const notFound = document.getElementById("notFound");

const container = document.querySelector(".container");
const attendanceBtn = document.getElementById("attendanceBtn");

const attendanceCard = document.getElementById("attendanceCard");
const attendanceContent = document.getElementById("attendanceContent");

const backBtn = document.getElementById("backBtn");
const homeworkBtn = document.getElementById("homeworkBtn");

const homeworkCard = document.getElementById("homeworkCard");

const homeworkContent = document.getElementById("homeworkContent");

const backHomeworkBtn = document.getElementById("backHomeworkBtn");

let currentStudent = null;
//=========================================
// تحميل البيانات
//=========================================

async function loadStudents(){

    try{

        searchBtn.disabled=true;

        searchBtn.innerHTML="جارى تحميل البيانات...";

        const response=await fetch(API_URL);

        students=await response.json();

        console.log("Students:",students.length);

        searchBtn.disabled=false;

        searchBtn.innerHTML="استعلام";

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

searchBtn.addEventListener("click",searchStudent);

codeInput.addEventListener("keypress", function(e){

    if(e.key==="Enter"){

        searchStudent();

    }

});

attendanceBtn.addEventListener("click", showAttendance);

homeworkBtn.addEventListener("click", showHomework);

backBtn.addEventListener("click", function () {

    attendanceCard.classList.add("hidden");
    homeworkCard.classList.add("hidden");
    result.classList.remove("hidden");

});

backHomeworkBtn.addEventListener("click", function () {

    homeworkCard.classList.add("hidden");
    attendanceCard.classList.add("hidden");
    result.classList.remove("hidden");

});
//=========================================

// عرض بيانات الطالب
//=========================================

function displayStudent(student){
currentStudent = student;
    result.classList.remove("hidden");
attendanceCard.classList.add("hidden");

    attendanceBtn.classList.remove("hidden");
homeworkBtn.classList.remove("hidden");

attendanceCard.classList.add("hidden");

homeworkCard.classList.add("hidden");
    notFound.classList.add("hidden");

    let list=document.getElementById("studentList");

    if(list){

        list.remove();

    }
currentStudent = student;

attendanceBtn.classList.remove("hidden");

    document.getElementById("studentCode").textContent=student.code;
    document.getElementById("studentName").textContent=student.name;
    document.getElementById("studentGrade").textContent=student.grade;
    document.getElementById("studentGroup").textContent=student.group;
    document.getElementById("studentWhatsapp").textContent=student.studentWhatsapp;
    document.getElementById("parentWhatsapp").textContent=student.parentWhatsapp;
}
//=========================================
// عرض الطلاب الآخرين بنفس رقم الواتساب
//=========================================

// فتح بيانات الطالب

//=========================================
// البحث عن الطالب
//=========================================

function searchStudent(){

    const code = codeInput.value.trim();
const password = passwordInput.value.trim();

    // التحقق من إدخال رقم
    if (code === "" || password === "") {

    alert("برجاء إدخال كود الطالب والرقم السري");

    codeInput.focus();

    return;

}

    // حذف القائمة القديمة
    let old=document.getElementById("studentList");

    if(old){

        old.remove();

    }

    // إخفاء النتائج السابقة
    result.classList.add("hidden");
    notFound.classList.add("hidden");

    // البحث عن جميع الطلاب
    const matchedStudents = students.filter(student =>

    String(student.code).trim() === code &&
    String(student.password).trim() === password

);

    // لا يوجد طالب
if (matchedStudents.length === 0) {

    attendanceCard.classList.add("hidden");
    homeworkCard.classList.add("hidden");
    result.classList.add("hidden");
    notFound.classList.remove("hidden");

    codeInput.value = "";
passwordInput.value = "";

    return;
}

// طالب واحد
if (matchedStudents.length === 1) {

    displayStudent(matchedStudents[0]);

    codeInput.value = "";
passwordInput.value = "";

    return;
}

// أكثر من طالب
showStudentList(matchedStudents);

codeInput.value = "";
passwordInput.value = "";
}


// الصق هنا مباشرة


async function showAttendance(){

    result.classList.add("hidden");
homeworkCard.classList.add("hidden");

    attendanceCard.classList.remove("hidden");

    attendanceContent.innerHTML="جارى تحميل سجل الحضور...";

    try{

     

const response = await fetch(ATTENDANCE_API + "?code=" + currentStudent.code);

        const data=await response.json();

        if(data.length===0){

            attendanceContent.innerHTML="<h3>لا يوجد سجل حضور لهذا الطالب</h3>";

            return;

        }

        let html=`

        <table class="attendance-table">

            <tr>

                <th>الدرس</th>

                <th>التاريخ</th>

                <th>الحالة</th>

            </tr>

        `;

        data.forEach(item=>{

            html+=`

            <tr>

                <td>${item.lesson}</td>

                <td>${item.date}</td>

                <td>${item.status}</td>

            </tr>

            `;

        });

        html+="</table>";

        attendanceContent.innerHTML=html;

    }

    catch(error){

        attendanceContent.innerHTML="<h3>حدث خطأ أثناء تحميل بيانات الحضور</h3>";

    }

}


async function showHomework(){

    result.classList.add("hidden");

    attendanceCard.classList.add("hidden");

    homeworkCard.classList.remove("hidden");

    homeworkContent.innerHTML="جارى تحميل درجات الواجب...";

    try{

        console.log("Code =", currentStudent.code);

console.log("Code =", currentStudent.code);

const response = await fetch(HOMEWORK_API + "?code=" + currentStudent.code);

        const data = await response.json();

        if(data.length===0){

            homeworkContent.innerHTML="<h3>لا توجد درجات لهذا الطالب</h3>";

            return;

        }

        let html=`
        <table class="attendance-table">
            <tr>
                <th>الواجب</th>
                <th>التاريخ</th>
                <th>الدرجة</th>
                <th>من</th>
            </tr>
        `;

        data.forEach(item=>{

            html+=`
            <tr>
                <td>${item.homework}</td>
                <td>${item.date}</td>
                <td>${item.grade}</td>
                <td>${item.total}</td>
            </tr>
            `;

        });

        html+="</table>";

        homeworkContent.innerHTML=html;

    }

    catch(error){

        homeworkContent.innerHTML="<h3>حدث خطأ أثناء تحميل درجات الواجب</h3>";

    }

}