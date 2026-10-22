//=========================================
// Google Sheets APIs
//=========================================

const API_URL = "https://script.google.com/macros/s/AKfycbzF5mN3LY937Xp3iE4c6xjwn5PTmpkoipLCM4-Ae-juTXtL4rBiEM0CKf2Fab3Ho-Xa/exec";
const ATTENDANCE_API = "https://script.google.com/macros/s/AKfycbzd0as48EDKd4k9y2IMggJzTc9QGhMuUysa0X4R1Q6plhtGtFlnfMBbXnyZamZfFPN1/exec";
const HOMEWORK_API = "https://script.google.com/macros/s/AKfycbyGgMFmNMPR6OAWNBemEoTF_jFs1u2AXaWJXFOeA6iVuOlgeJau1DuAutH89h9oP_hC-g/exec";
const EXAM_API = "https://script.google.com/macros/s/AKfycbyrSNWCMtLaFZepp3OlxuLip2Pe02X2bndnkbqJE_2DszwwPPKsSnP1wsSlv7pqjvi8fA/exec";
const PAYMENT_API = "https://script.google.com/macros/s/AKfycbwBxrvavrzIp_9tKKIk63OUYLhk30WkT_zU3JWFk7Km11Dmh8gB_ycqgoND_4Z-JwdX/exec";
const NOTICE_API = "https://script.google.com/macros/s/AKfycbwNYZD5TFj4x3NvqHKPNJgaH_FWxKsDOGRQPFX3VIKO7bdWsuyYPHwUvtigvwNDjazD/exec";

let students = [];
let currentStudent = null;

const codeInput = document.getElementById("codeInput");
const passwordInput = document.getElementById("passwordInput");
const searchBtn = document.getElementById("searchBtn");
const result = document.getElementById("result");
const notFound = document.getElementById("notFound");
const rememberMeInput = document.getElementById("rememberMe");
const logoutBtn = document.getElementById("logoutBtn");

const attendanceBtn = document.getElementById("attendanceBtn");
const homeworkBtn = document.getElementById("homeworkBtn");
const examBtn = document.getElementById("examBtn");
const paymentBtn = document.getElementById("paymentBtn");
const noticeBtn = document.getElementById("noticeBtn");

const attendanceCard = document.getElementById("attendanceCard");
const homeworkCard = document.getElementById("homeworkCard");
const examCard = document.getElementById("examCard");
const paymentCard = document.getElementById("paymentCard");
const noticeCard = document.getElementById("noticeCard");

const attendanceContent = document.getElementById("attendanceContent");
const homeworkContent = document.getElementById("homeworkContent");
const examContent = document.getElementById("examContent");
const paymentContent = document.getElementById("paymentContent");
const noticeContent = document.getElementById("noticeContent");

const backBtn = document.getElementById("backBtn");
const backHomeworkBtn = document.getElementById("backHomeworkBtn");
const backExamBtn = document.getElementById("backExamBtn");
const backPaymentBtn = document.getElementById("backPaymentBtn");
const backNoticeBtn = document.getElementById("backNoticeBtn");

async function loadStudents(){
    try {
        searchBtn.disabled = true;
        searchBtn.innerHTML = "جارى تحميل البيانات...";

        const response = await fetch(API_URL, { method: "GET", redirect: "follow" });
        students = await response.json();

        console.log("Students loaded successfully:", students.length);

        searchBtn.disabled = false;
        searchBtn.innerHTML = "استعلام";

        const savedCode = localStorage.getItem("studentCode");
        const savedPhone = localStorage.getItem("studentPhone");

        if (savedCode && savedPhone && codeInput && passwordInput) {
            codeInput.value = savedCode;
            passwordInput.value = savedPhone;
            searchStudent();
        }
    }
    catch(error){
        console.error("Error loading students:", error);
        searchBtn.disabled = false;
        searchBtn.innerHTML = "استعلام";
    }
}

loadStudents();

searchBtn.addEventListener("click", searchStudent);

codeInput.addEventListener("keypress", function(e){ if(e.key === "Enter"){ searchStudent(); } });
passwordInput.addEventListener("keypress", function(e){ if(e.key === "Enter"){ searchStudent(); } });

attendanceBtn.addEventListener("click", showAttendance);
homeworkBtn.addEventListener("click", showHomework);
examBtn.addEventListener("click", showExam);
paymentBtn.addEventListener("click", showPayments);
noticeBtn.addEventListener("click", showNotices);

function goBackToResult() {
    attendanceCard.classList.add("hidden");
    homeworkCard.classList.add("hidden");
    examCard.classList.add("hidden");
    paymentCard.classList.add("hidden");
    noticeCard.classList.add("hidden");
    result.classList.remove("hidden");
}

backBtn.addEventListener("click", goBackToResult);
backHomeworkBtn.addEventListener("click", goBackToResult);
backExamBtn.addEventListener("click", goBackToResult);
backPaymentBtn.addEventListener("click", goBackToResult);
backNoticeBtn.addEventListener("click", goBackToResult);

if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("studentCode");
        localStorage.removeItem("studentPhone");
        codeInput.value = "";
        passwordInput.value = "";
        result.classList.add("hidden");
        alert("تم تسجيل الخروج بنجاح");
    });
}

function displayStudent(student){
    currentStudent = student;

    result.classList.remove("hidden");
    notFound.classList.add("hidden");

    attendanceCard.classList.add("hidden");
    homeworkCard.classList.add("hidden");
    examCard.classList.add("hidden");
    paymentCard.classList.add("hidden");
    noticeCard.classList.add("hidden");

    attendanceBtn.classList.remove("hidden");
    homeworkBtn.classList.remove("hidden");
    examBtn.classList.remove("hidden");
    paymentBtn.classList.remove("hidden");
    noticeBtn.classList.remove("hidden");

    document.getElementById("studentCode").textContent = student.code;
    document.getElementById("studentName").textContent = student.name;
    document.getElementById("studentGrade").textContent = student.grade;
    document.getElementById("studentGroup").textContent = student.group;
    document.getElementById("studentWhatsapp").textContent = student.studentWhatsapp;
    document.getElementById("parentWhatsapp").textContent = student.parentWhatsapp;
}

function searchStudent(){
    function normalize(str) {
        if (!str) return "";
        return String(str)
            .replace(/[\u0660-\u0669]/g, d => d.charCodeAt(0) - 1632)
            .replace(/[\u06F0-\u06F9]/g, d => d.charCodeAt(0) - 1776)
            .replace(/\D/g, ""); // استخراج الأرقام فقط وتجاهل الرموز والمسافات
    }

    const rawCode = codeInput.value.trim();
    const rawPhone = passwordInput.value.trim();

    const code = normalize(rawCode);
    const phoneInput = normalize(rawPhone);

    if(code === "" || phoneInput === ""){
        alert("برجاء إدخال كود الطالب ورقم الواتساب");
        return;
    }

    result.classList.add("hidden");
    notFound.classList.add("hidden");

    // طباعة للاختبار في الـ Console لمعرفة ماذا يبحث المستخدم
    console.log("Searching for Code:", code, "Phone:", phoneInput);

    const student = students.find(item => {
        const itemCode = normalize(item.code);
        const studentWa = normalize(item.studentWhatsapp);
        const parentWa = normalize(item.parentWhatsapp);

        return itemCode === code && (studentWa === phoneInput || parentWa === phoneInput);
    });

    if(!student){
        console.warn("Student not found in the loaded list!");
        notFound.innerHTML = `<i class="fa-solid fa-circle-xmark"></i><br><br><strong>كود الطالب أو رقم الواتساب غير صحيح</strong>`;
        notFound.classList.remove("hidden");
        return;
    }

    console.log("Student found:", student.name);

    if (rememberMeInput && rememberMeInput.checked) {
        localStorage.setItem("studentCode", rawCode);
        localStorage.setItem("studentPhone", rawPhone);
    } else {
        localStorage.removeItem("studentCode");
        localStorage.removeItem("studentPhone");
    }

    displayStudent(student);
}

async function fetchAndRender(apiUrl, cardElement, contentElement, mappingFn) {
    result.classList.add("hidden");
    attendanceCard.classList.add("hidden");
    homeworkCard.classList.add("hidden");
    examCard.classList.add("hidden");
    paymentCard.classList.add("hidden");
    noticeCard.classList.add("hidden");

    cardElement.classList.remove("hidden");
    contentElement.innerHTML = "جارى التحميل...";

    try {
        const response = await fetch(apiUrl + "?code=" + currentStudent.code);
        const data = await response.json();

        if (!data || data.length === 0) {
            contentElement.innerHTML = "<h3>لا توجد بيانات متاحة</h3>";
            return;
        }

        let html = "";
        if (window.innerWidth <= 768) {
            data.forEach(item => { html += mappingFn(item, true); });
        } else {
            html = mappingFn(data, false);
        }
        contentElement.innerHTML = html;
    } catch (e) {
        contentElement.innerHTML = "<h3>حدث خطأ أثناء تحميل البيانات</h3>";
    }
}

function showAttendance() {
    fetchAndRender(ATTENDANCE_API, attendanceCard, attendanceContent, (item, isMobile) => {
        if (isMobile) {
            return `<div class="attendance-mobile-card"><div class="card-item"><span>📘 الحصة</span><strong>${item.lesson || '-'}</strong></div><div class="card-item"><span>📅 التاريخ</span><strong>${item.date || '-'}</strong></div><div class="card-item"><span>✅ الحالة</span><strong>${item.status || '-'}</strong></div></div>`;
        }
        let table = `<div class="table-wrapper"><table class="attendance-table"><tr><th>الحصة</th><th>التاريخ</th><th>الحالة</th></tr>`;
        item.forEach(row => {
            table += `<tr><td>${row.lesson || '-'}</td><td>${row.date || '-'}</td><td>${row.status || '-'}</td></tr>`;
        });
        return table + `</table></div>`;
    });
}

function showHomework() {
    fetchAndRender(HOMEWORK_API, homeworkCard, homeworkContent, (item, isMobile) => {
        if (isMobile) {
            return `<div class="attendance-mobile-card homework-card"><div class="card-item"><span>📚 رقم الواجب</span><strong>${item.homework || '-'}</strong></div><div class="card-item"><span>📅 التاريخ</span><strong>${item.date || '-'}</strong></div><div class="card-item"><span>🎯 درجة الطالب</span><strong>${item.grade || '-'}</strong></div><div class="card-item"><span>🏆 الدرجة النهائية</span><strong>${item.total || '-'}</strong></div></div>`;
        }
        let table = `<div class="table-wrapper"><table class="attendance-table"><tr><th>رقم الواجب</th><th>التاريخ</th><th>درجة الطالب</th><th>الدرجة النهائية</th></tr>`;
        item.forEach(row => {
            table += `<tr><td>${row.homework || '-'}</td><td>${row.date || '-'}</td><td>${row.grade || '-'}</td><td>${row.total || '-'}</td></tr>`;
        });
        return table + `</table></div>`;
    });
}

function showExam() {
    fetchAndRender(EXAM_API, examCard, examContent, (item, isMobile) => {
        if (isMobile) {
            return `<div class="attendance-mobile-card exam-card"><div class="card-item"><span>📝 رقم الامتحان</span><strong>${item.exam || '-'}</strong></div><div class="card-item"><span>📅 التاريخ</span><strong>${item.date || '-'}</strong></div><div class="card-item"><span>🎯 درجة الطالب</span><strong>${item.grade || '-'}</strong></div><div class="card-item"><span>🏆 الدرجة النهائية</span><strong>${item.total || '-'}</strong></div></div>`;
        }
        let table = `<div class="table-wrapper"><table class="attendance-table"><tr><th>الامتحان</th><th>التاريخ</th><th>درجة الطالب</th><th>الدرجة النهائية</th></tr>`;
        item.forEach(row => {
            table += `<tr><td>${row.exam || '-'}</td><td>${row.date || '-'}</td><td>${row.grade || '-'}</td><td>${row.total || '-'}</td></tr>`;
        });
        return table + `</table></div>`;
    });
}

function showPayments() {
    fetchAndRender(PAYMENT_API, paymentCard, paymentContent, (item, isMobile) => {
        if (isMobile) {
            return `<div class="attendance-mobile-card payment-card"><div class="card-item"><span>📅 الشهر</span><strong>${item.month || '-'}</strong></div><div class="card-item"><span>💵 المدفوع</span><strong>${item.paid || '-'}</strong></div><div class="card-item"><span>❗ المتبقى</span><strong>${item.remaining || '-'}</strong></div><div class="card-item"><span>💰 إجمالى المستحق</span><strong>${item.total || '-'}</strong></div></div>`;
        }
        let table = `<div class="table-wrapper"><table class="attendance-table"><tr><th>الشهر</th><th>المدفوع</th><th>المتبقى</th><th>إجمالى المستحق</th></tr>`;
        item.forEach(row => {
            table += `<tr><td>${row.month || '-'}</td><td>${row.paid || '-'}</td><td>${row.remaining || '-'}</td><td>${row.total || '-'}</td></tr>`;
        });
        return table + `</table></div>`;
    });
}

function showNotices() {
    fetchAndRender(NOTICE_API, noticeCard, noticeContent, (item, isMobile) => {
        const imgUrl = item.image || item.imageUrl || item.photo || "";
        const imgHtmlMobile = imgUrl ? `<div class="notice-img-container"><a href="${imgUrl}" target="_blank"><img src="${imgUrl}" alt="صورة التنبيه" class="notice-img"></a></div>` : "";
        
        if (isMobile) {
            return `<div class="attendance-mobile-card notice-card"><div class="card-item"><span>📘 الحصة</span><strong>${item.lesson || '-'}</strong></div><div class="card-item"><span>📅 التاريخ</span><strong>${item.date || '-'}</strong></div><div style="margin-top:15px;line-height:2"><span style="color:#d32f2f;font-weight:bold">🔔 التنبيه</span><br>${item.notice || ''}</div>${imgHtmlMobile}</div>`;
        }

        let table = `<div class="table-wrapper"><table class="attendance-table"><tr><th>الحصة</th><th>التاريخ</th><th>التنبيه أو الملاحظة</th><th>الصورة المرفقة</th></tr>`;
        item.forEach(row => {
            const rowImgUrl = row.image || row.imageUrl || row.photo || "";
            const imgHtmlDesktop = rowImgUrl ? `<a href="${rowImgUrl}" target="_blank"><img src="${rowImgUrl}" alt="صورة" style="width:80px;border-radius:8px;"></a>` : "لا يوجد";
            table += `<tr><td>${row.lesson || '-'}</td><td>${row.date || '-'}</td><td>${row.notice || ''}</td><td>${imgHtmlDesktop}</td></tr>`;
        });
        return table + `</table></div>`;
    });
}