//=========================================
// Google Sheets APIs
//=========================================

const API_URL =
"https://script.google.com/macros/s/AKfycbwngv7CY3jEG0k8HtHGrIKfwKyi1w0mm9O6gHr5SSCIqdTOvaDDnD7aOUH5IG0ntkM/exec";

const ATTENDANCE_API =
"https://script.google.com/macros/s/AKfycbzd0as48EDKd4k9y2IMggJzTc9QGhMuUysa0X4R1Q6plhtGtFlnfMBbXnyZamZfFPN1/exec";

const HOMEWORK_API =
"https://script.google.com/macros/s/AKfycbyGgMFmNMPR6OAWNBemEoTF_jFs1u2AXaWJXFOeA6iVuOlgeJau1DuAutH89h9oP_hC-g/exec";

const EXAM_API =
"https://script.google.com/macros/s/AKfycbyrSNWCMtLaFZepp3OlxuLip2Pe02X2bndnkbqJE_2DszwwPPKsSnP1wsSlv7pqjvi8fA/exec";

const PAYMENT_API =
"https://script.google.com/macros/s/AKfycbwBxrvavrzIp_9tKKIk63OUYLhk30WkT_zU3JWFk7Km11Dmh8gB_ycqgoND_4Z-JwdX/exec";

const NOTICE_API =
"https://script.google.com/macros/s/AKfycbwNYZD5TFj4x3NvqHKPNJgaH_FWxKsDOGRQPFX3VIKO7bdWsuyYPHwUvtigvwNDjazD/exec";

//=========================================
// Variables
//=========================================

let students = [];
let currentStudent = null;

//=========================================
// Elements
//=========================================

const codeInput =
document.getElementById("codeInput");

const passwordInput =
document.getElementById("passwordInput");

const searchBtn =
document.getElementById("searchBtn");

const result =
document.getElementById("result");

const notFound =
document.getElementById("notFound");

// العناصر الجديدة لحفظ تسجيل الدخول
const rememberMeInput = document.getElementById("rememberMe");
const logoutBtn = document.getElementById("logoutBtn");

//=========================================
// Buttons
//=========================================

const attendanceBtn =
document.getElementById("attendanceBtn");

const homeworkBtn =
document.getElementById("homeworkBtn");

const examBtn =
document.getElementById("examBtn");

const paymentBtn =
document.getElementById("paymentBtn");

const noticeBtn =
document.getElementById("noticeBtn");

//=========================================
// Cards
//=========================================

const attendanceCard =
document.getElementById("attendanceCard");

const homeworkCard =
document.getElementById("homeworkCard");

const examCard =
document.getElementById("examCard");

const paymentCard =
document.getElementById("paymentCard");

const noticeCard =
document.getElementById("noticeCard");

//=========================================
// Contents
//=========================================

const attendanceContent =
document.getElementById("attendanceContent");

const homeworkContent =
document.getElementById("homeworkContent");

const examContent =
document.getElementById("examContent");

const paymentContent =
document.getElementById("paymentContent");

const noticeContent =
document.getElementById("noticeContent");

//=========================================
// Back Buttons
//=========================================

const backBtn =
document.getElementById("backBtn");

const backHomeworkBtn =
document.getElementById("backHomeworkBtn");

const backExamBtn =
document.getElementById("backExamBtn");

const backPaymentBtn =
document.getElementById("backPaymentBtn");

const backNoticeBtn =
document.getElementById("backNoticeBtn");

//=========================================
// تحميل بيانات الطلاب واسترجاع الحفظ التلقائي
//=========================================

async function loadStudents(){
    try {
        searchBtn.disabled = true;
        searchBtn.innerHTML = "جارى تحميل البيانات...";

        const response = await fetch(API_URL, {
            method: "GET",
            redirect: "follow"
        });

        students = await response.json();

        console.log("Students loaded:", students.length);

        searchBtn.disabled = false;
        searchBtn.innerHTML = "استعلام";

        // التحقق من وجود بيانات محفوظة وتسجيل الدخول تلقائياً
        const savedCode = localStorage.getItem("studentCode");
        const savedPhone = localStorage.getItem("studentPhone");

        if (savedCode && savedPhone) {
            codeInput.value = savedCode;
            passwordInput.value = savedPhone;
            searchStudent(); // تنفيذ البحث مباشرة
        }
    }
    catch(error){
        console.error("Error loading students:", error);
        alert("تعذر تحميل بيانات الطلاب: " + error.message);
    }
}
loadStudents();

//=========================================
// Events
//=========================================

// زر البحث
searchBtn.addEventListener("click", searchStudent);

// الضغط على Enter
codeInput.addEventListener("keypress", function(e){
    if(e.key==="Enter"){
        searchStudent();
    }
});

passwordInput.addEventListener("keypress", function(e){
    if(e.key==="Enter"){
        searchStudent();
    }
});

// أزرار الصفحات
attendanceBtn.addEventListener("click", showAttendance);
homeworkBtn.addEventListener("click", showHomework);
examBtn.addEventListener("click", showExam);
paymentBtn.addEventListener("click", showPayments);
noticeBtn.addEventListener("click", showNotices);

//=========================================
// أزرار الرجوع
//=========================================

backBtn.addEventListener("click", function(){
    attendanceCard.classList.add("hidden");
    homeworkCard.classList.add("hidden");
    examCard.classList.add("hidden");
    paymentCard.classList.add("hidden");
    noticeCard.classList.add("hidden");
    result.classList.remove("hidden");
});

backHomeworkBtn.addEventListener("click", function(){
    attendanceCard.classList.add("hidden");
    homeworkCard.classList.add("hidden");
    examCard.classList.add("hidden");
    paymentCard.classList.add("hidden");
    noticeCard.classList.add("hidden");
    result.classList.remove("hidden");
});

backExamBtn.addEventListener("click", function(){
    attendanceCard.classList.add("hidden");
    homeworkCard.classList.add("hidden");
    examCard.classList.add("hidden");
    paymentCard.classList.add("hidden");
    noticeCard.classList.add("hidden");
    result.classList.remove("hidden");
});

backPaymentBtn.addEventListener("click", function(){
    attendanceCard.classList.add("hidden");
    homeworkCard.classList.add("hidden");
    examCard.classList.add("hidden");
    paymentCard.classList.add("hidden");
    noticeCard.classList.add("hidden");
    result.classList.remove("hidden");
});

backNoticeBtn.addEventListener("click", function(){
    attendanceCard.classList.add("hidden");
    homeworkCard.classList.add("hidden");
    examCard.classList.add("hidden");
    paymentCard.classList.add("hidden");
    noticeCard.classList.add("hidden");
    result.classList.remove("hidden");
});

// زر تسجيل الخروج
if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("studentCode");
        localStorage.removeItem("studentPhone");
        codeInput.value = "";
        passwordInput.value = "";
        result.classList.add("hidden");
        alert("تم تسجيل الخروج ومسح بيانات الحفظ بنجاح");
    });
}

//=========================================
// عرض بيانات الطالب
//=========================================

function displayStudent(student){
    currentStudent = student;

    // إظهار بطاقة البيانات
    result.classList.remove("hidden");
    notFound.classList.add("hidden");

    // إخفاء جميع الصفحات الأخرى
    attendanceCard.classList.add("hidden");
    homeworkCard.classList.add("hidden");
    examCard.classList.add("hidden");
    paymentCard.classList.add("hidden");
    noticeCard.classList.add("hidden");

    // إظهار جميع الأزرار
    attendanceBtn.classList.remove("hidden");
    homeworkBtn.classList.remove("hidden");
    examBtn.classList.remove("hidden");
    paymentBtn.classList.remove("hidden");
    noticeBtn.classList.remove("hidden");

    // تعبئة بيانات الطالب
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

    function normalizeDigits(str) {
        if (!str) return "";
        const arabicNumbers = /[\u0660-\u0669]/g;
        const persianNumbers = /[\u06F0-\u06F9]/g;
        
        return String(str)
            .replace(arabicNumbers, d => d.charCodeAt(0) - 1632)
            .replace(persianNumbers, d => d.charCodeAt(0) - 1776)
            .replace(/\D/g, "");
    }

    const rawCode = codeInput.value;
    const rawPhone = passwordInput.value;

    const code = normalizeDigits(rawCode);
    const phoneInput = normalizeDigits(rawPhone);

    if(code === "" || phoneInput === ""){
        alert("برجاء إدخال كود الطالب ورقم واتساب الطالب أو ولي الأمر");
        return;
    }

    result.classList.add("hidden");
    attendanceCard.classList.add("hidden");
    homeworkCard.classList.add("hidden");
    examCard.classList.add("hidden");
    paymentCard.classList.add("hidden");
    noticeCard.classList.add("hidden");
    notFound.classList.add("hidden");

    const student = students.find(item => {
        const itemCode = normalizeDigits(item.code);
        const studentWa = normalizeDigits(item.studentWhatsapp);
        const parentWa = normalizeDigits(item.parentWhatsapp);

        return itemCode === code && (studentWa === phoneInput || parentWa === phoneInput);
    });

    if(!student){
        notFound.innerHTML = `
            <i class="fa-solid fa-circle-xmark"></i>
            <br><br>
            <strong>كود الطالب أو رقم الواتساب غير صحيح</strong>
        `;
        notFound.classList.remove("hidden");
        return;
    }

    // حفظ البيانات في localStorage إذا كان الخيار محدداً
    if (rememberMeInput && rememberMeInput.checked) {
        localStorage.setItem("studentCode", rawCode);
        localStorage.setItem("studentPhone", rawPhone);
    } else {
        localStorage.removeItem("studentCode");
        localStorage.removeItem("studentPhone");
    }

    displayStudent(student);

    codeInput.value = "";
    passwordInput.value = "";
}

//=========================================
// عرض المدفوعات
//=========================================

async function showPayments() {
    result.classList.add("hidden");
    attendanceCard.classList.add("hidden");
    homeworkCard.classList.add("hidden");
    examCard.classList.add("hidden");
    paymentCard.classList.remove("hidden");
    noticeCard.classList.add("hidden");

    paymentContent.innerHTML = "جارى تحميل بيانات المدفوعات...";

    try {
        const response = await fetch(
            PAYMENT_API + "?code=" + currentStudent.code
        );

        const data = await response.json();

        if (data.length === 0) {
            paymentContent.innerHTML = "<h3>لا توجد بيانات مالية لهذا الطالب</h3>";
            return;
        }

        if (window.innerWidth <= 768) {
            let html = "";
            data.forEach(item => {
                html += `
                <div class="attendance-mobile-card payment-card">
                    <div class="card-item">
                        <span>📅 الشهر</span>
                        <strong>${item.month}</strong>
                    </div>
                    <div class="card-item">
                        <span>💵 المدفوع</span>
                        <strong>${item.paid}</strong>
                    </div>
                    <div class="card-item">
                        <span>❗ المتبقى</span>
                        <strong>${item.remaining}</strong>
                    </div>
                    <div class="card-item">
                        <span>💰 إجمالى المستحق</span>
                        <strong>${item.total}</strong>
                    </div>
                </div>
                `;
            });
            paymentContent.innerHTML = html;
        } else {
            let html = `
            <div class="table-wrapper">
            <table class="attendance-table">
            <tr>
                <th>الشهر</th>
                <th>المدفوع</th>
                <th>المتبقى</th>
                <th>إجمالى المستحق</th>
            </tr>
            `;
            data.forEach(item => {
                html += `
                <tr>
                    <td>${item.month}</td>
                    <td>${item.paid}</td>
                    <td>${item.remaining}</td>
                    <td>${item.total}</td>
                </tr>
                `;
            });
            html += "</table></div>";
            paymentContent.innerHTML = html;
        }
    }
    catch (e) {
        paymentContent.innerHTML = "<h3>حدث خطأ أثناء تحميل بيانات المدفوعات</h3>";
    }
}

//=========================================
// عرض الحضور
//=========================================

async function showAttendance() {
    result.classList.add("hidden");
    attendanceCard.classList.remove("hidden");
    homeworkCard.classList.add("hidden");
    examCard.classList.add("hidden");
    paymentCard.classList.add("hidden");
    noticeCard.classList.add("hidden");

    attendanceContent.innerHTML = "جارى تحميل سجل الحضور...";

    try {
        const response = await fetch(
            ATTENDANCE_API + "?code=" + currentStudent.code
        );

        const data = await response.json();

        if (data.length === 0) {
            attendanceContent.innerHTML = "<h3>لا يوجد سجل حضور</h3>";
            return;
        }

        if (window.innerWidth <= 768) {
            let html = "";
            data.forEach(item => {
                html += `
                <div class="attendance-mobile-card">
                    <div class="card-item">
                        <span>📘 الحصة</span>
                        <strong>${item.lesson}</strong>
                    </div>
                    <div class="card-item">
                        <span>📅 التاريخ</span>
                        <strong>${item.date}</strong>
                    </div>
                    <div class="card-item">
                        <span>✅ الحالة</span>
                        <strong>${item.status}</strong>
                    </div>
                </div>
                `;
            });
            attendanceContent.innerHTML = html;
        } else {
            let html = `
            <div class="table-wrapper">
            <table class="attendance-table">
            <tr>
                <th>الحصة</th>
                <th>التاريخ</th>
                <th>الحالة</th>
            </tr>
            `;
            data.forEach(item => {
                html += `
                <tr>
                    <td>${item.lesson}</td>
                    <td>${item.date}</td>
                    <td>${item.status}</td>
                </tr>
                `;
            });
            html += "</table></div>";
            attendanceContent.innerHTML = html;
        }
    }
    catch (e) {
        attendanceContent.innerHTML = "<h3>حدث خطأ أثناء تحميل سجل الحضور</h3>";
    }
}

//=========================================
// عرض درجات الواجب
//=========================================

async function showHomework() {
    result.classList.add("hidden");
    attendanceCard.classList.add("hidden");
    homeworkCard.classList.remove("hidden");
    examCard.classList.add("hidden");
    paymentCard.classList.add("hidden");
    noticeCard.classList.add("hidden");

    homeworkContent.innerHTML = "جارى تحميل درجات الواجب...";

    try {
        const response = await fetch(
            HOMEWORK_API + "?code=" + currentStudent.code
        );

        const data = await response.json();

        if (data.length === 0) {
            homeworkContent.innerHTML = "<h3>لا توجد درجات واجب</h3>";
            return;
        }

        if (window.innerWidth <= 768) {
            let html = "";
            data.forEach(item => {
                html += `
                <div class="attendance-mobile-card homework-card">
                    <div class="card-item">
                        <span>📚 رقم الواجب</span>
                        <strong>${item.homework}</strong>
                    </div>
                    <div class="card-item">
                        <span>📅 التاريخ</span>
                        <strong>${item.date}</strong>
                    </div>
                    <div class="card-item">
                        <span>🎯 درجة الطالب</span>
                        <strong>${item.grade}</strong>
                    </div>
                    <div class="card-item">
                        <span>🏆 الدرجة النهائية</span>
                        <strong>${item.total}</strong>
                    </div>
                </div>
                `;
            });
            homeworkContent.innerHTML = html;
        } else {
            let html = `
            <div class="table-wrapper">
            <table class="attendance-table">
            <tr>
                <th>رقم الواجب</th>
                <th>التاريخ</th>
                <th>درجة الطالب</th>
                <th>الدرجة النهائية</th>
            </tr>
            `;
            data.forEach(item => {
                html += `
                <tr>
                    <td>${item.homework}</td>
                    <td>${item.date}</td>
                    <td>${item.grade}</td>
                    <td>${item.total}</td>
                </tr>
                `;
            });
            html += "</table></div>";
            homeworkContent.innerHTML = html;
        }
    }
    catch (e) {
        homeworkContent.innerHTML = "<h3>حدث خطأ أثناء تحميل درجات الواجب</h3>";
    }
}

//=========================================
// عرض الامتحانات
//=========================================

async function showExam() {
    result.classList.add("hidden");
    attendanceCard.classList.add("hidden");
    homeworkCard.classList.add("hidden");
    examCard.classList.remove("hidden");
    paymentCard.classList.add("hidden");
    noticeCard.classList.add("hidden");

    examContent.innerHTML = "جارى تحميل درجات الامتحانات...";

    try {
        const response = await fetch(
            EXAM_API + "?code=" + currentStudent.code
        );

        const data = await response.json();

        if (data.length === 0) {
            examContent.innerHTML = "<h3>لا توجد درجات امتحانات</h3>";
            return;
        }

        if (window.innerWidth <= 768) {
            let html = "";
            data.forEach(item => {
                html += `
                <div class="attendance-mobile-card exam-card">
                    <div class="card-item">
                        <span>📝 رقم الامتحان</span>
                        <strong>${item.exam}</strong>
                    </div>
                    <div class="card-item">
                        <span>📅 التاريخ</span>
                        <strong>${item.date}</strong>
                    </div>
                    <div class="card-item">
                        <span>🎯 درجة الطالب</span>
                        <strong>${item.grade}</strong>
                    </div>
                    <div class="card-item">
                        <span>🏆 الدرجة النهائية</span>
                        <strong>${item.total}</strong>
                    </div>
                </div>
                `;
            });
            examContent.innerHTML = html;
        } else {
            let html = `
            <div class="table-wrapper">
            <table class="attendance-table">
            <tr>
                <th>الامتحان</th>
                <th>التاريخ</th>
                <th>درجة الطالب</th>
                <th>الدرجة النهائية</th>
            </tr>
            `;
            data.forEach(item => {
                html += `
                <tr>
                    <td>${item.exam}</td>
                    <td>${item.date}</td>
                    <td>${item.grade}</td>
                    <td>${item.total}</td>
                </tr>
                `;
            });
            html += "</table></div>";
            examContent.innerHTML = html;
        }
    }
    catch (e) {
        examContent.innerHTML = "<h3>حدث خطأ أثناء تحميل درجات الامتحانات</h3>";
    }
}

//=========================================
// عرض التنبيهات مع دعم الصور
//=========================================

async function showNotices() {
    result.classList.add("hidden");
    attendanceCard.classList.add("hidden");
    homeworkCard.classList.add("hidden");
    examCard.classList.add("hidden");
    paymentCard.classList.add("hidden");
    noticeCard.classList.remove("hidden");

    noticeContent.innerHTML = "جارى تحميل التنبيهات...";

    try {
        const response = await fetch(
            NOTICE_API + "?code=" + currentStudent.code
        );

        const data = await response.json();

        if (data.length === 0) {
            noticeContent.innerHTML = "<h3>لا توجد تنبيهات لهذا الطالب</h3>";
            return;
        }

        // ==========================
        // عرض الهاتف (بطاقات)
        // ==========================
        if (window.innerWidth <= 768) {
            let html = "";

            data.forEach(item => {
                const imgUrl = item.image || item.imageUrl || item.photo || "";
                const imageHTML = imgUrl ? `
                    <div class="notice-img-container">
                        <a href="${imgUrl}" target="_blank">
                            <img src="${imgUrl}" alt="صورة التنبيه" class="notice-img">
                        </a>
                    </div>
                ` : "";

                html += `
                <div class="attendance-mobile-card notice-card">
                    <div class="card-item">
                        <span>📘 الحصة</span>
                        <strong>${item.lesson || '-'}</strong>
                    </div>
                    <div class="card-item">
                        <span>📅 التاريخ</span>
                        <strong>${item.date || '-'}</strong>
                    </div>
                    <div style="margin-top:15px;line-height:2">
                        <span style="color:#d32f2f;font-weight:bold">
                            🔔 التنبيه
                        </span>
                        <br>
                        ${item.notice || ''}
                    </div>
                    ${imageHTML}
                </div>
                `;
            });

            noticeContent.innerHTML = html;
        }

        // ==========================
        // عرض الكمبيوتر (جدول)
        // ==========================
        else {
            let html = `
            <div class="table-wrapper">
            <table class="attendance-table">
            <tr>
                <th>الحصة</th>
                <th>التاريخ</th>
                <th>التنبيه أو الملاحظة</th>
                <th>الصورة المرفقة</th>
            </tr>
            `;

            data.forEach(item => {
                const imgUrl = item.image || item.imageUrl || item.photo || "";
                const imageHTML = imgUrl ? `
                    <a href="${imgUrl}" target="_blank">
                        <img src="${imgUrl}" alt="تنبيه" style="width:80px; height:auto; border-radius:8px;">
                    </a>
                ` : "لا يوجد";

                html += `
                <tr>
                    <td>${item.lesson || '-'}</td>
                    <td>${item.date || '-'}</td>
                    <td>${item.notice || ''}</td>
                    <td>${imageHTML}</td>
                </tr>
                `;
            });

            html += "</table></div>";
            noticeContent.innerHTML = html;
        }

    } catch (e) {
        noticeContent.innerHTML = "<h3>حدث خطأ أثناء تحميل التنبيهات</h3>";
    }
}