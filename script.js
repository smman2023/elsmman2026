//=========================================
// Google Sheets APIs
//=========================================

const API_URL = "https://script.google.com/macros/s/AKfycbzF5mN3LY937Xp3iE4c6xjwn5PTmpkoipLCM4-Ae-juTXtL4rBiEM0CKf2Fab3Ho-Xa/exec";
const ATTENDANCE_API = "https://script.google.com/macros/s/AKfycbzd0as48EDKd4k9y2IMggJzTc9QGhMuUysa0X4R1Q6plhtGtFlnfMBbXnyZamZfFPN1/exec";
const HOMEWORK_API = "https://script.google.com/macros/s/AKfycbyGgMFmNMPR6OAWNBemEoTF_jFs1u2AXaWJXFOeA6iVuOlgeJau1DuAutH89h9oP_hC-g/exec";
const EXAM_API = "https://script.google.com/macros/s/AKfycbyrSNWCMtLaFZepp3OlxuLip2Pe02X2bndnkbqJE_2DszwwPPKsSnP1wsSlv7pqjvi8fA/exec";
const PAYMENT_API = "https://script.google.com/macros/s/AKfycbwBxrvavrzIp_9tKKIk63OUYLhk30WkT_zU3JWFk7Km11Dmh8gB_ycqgoND_4Z-JwdX/exec";
const NOTICE_API = "https://script.google.com/macros/s/AKfycbyQ3ckcK_6nwcCs_Gm9yPJ6MMiRHVMoI0KYyli79w3W0cpteMQRJKuznmNWAAlxLv1D/exec";

let students = [];
let currentStudent = null;

let cacheData = {
    attendance: null,
    homework: null,
    exam: null,
    payment: null,
    notice: null
};

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
        if(searchBtn) {
            searchBtn.disabled = true;
            searchBtn.innerHTML = "جاري تحميل البيانات...";
        }

        const response = await fetch(API_URL, { method: "GET", redirect: "follow" });
        students = await response.json();

        if(searchBtn) {
            searchBtn.disabled = false;
            searchBtn.innerHTML = "استعلام";
        }

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
        if(searchBtn) {
            searchBtn.disabled = false;
            searchBtn.innerHTML = "استعلام";
        }
    }
}

loadStudents();

if(searchBtn) searchBtn.addEventListener("click", searchStudent);
if(codeInput) codeInput.addEventListener("keypress", function(e){ if(e.key === "Enter"){ searchStudent(); } });
if(passwordInput) passwordInput.addEventListener("keypress", function(e){ if(e.key === "Enter"){ searchStudent(); } });

if(attendanceBtn) attendanceBtn.addEventListener("click", showAttendance);
if(homeworkBtn) homeworkBtn.addEventListener("click", showHomework);
if(examBtn) examBtn.addEventListener("click", showExam);
if(paymentBtn) paymentBtn.addEventListener("click", showPayments);
if(noticeBtn) noticeBtn.addEventListener("click", showNotices);

function goBackToResult() {
    if(attendanceCard) attendanceCard.classList.add("hidden");
    if(homeworkCard) homeworkCard.classList.add("hidden");
    if(examCard) examCard.classList.add("hidden");
    if(paymentCard) paymentCard.classList.add("hidden");
    if(noticeCard) noticeCard.classList.add("hidden");
    if(result) result.classList.remove("hidden");
}

if(backBtn) backBtn.addEventListener("click", goBackToResult);
if(backHomeworkBtn) backHomeworkBtn.addEventListener("click", goBackToResult);
if(backExamBtn) backExamBtn.addEventListener("click", goBackToResult);
if(backPaymentBtn) backPaymentBtn.addEventListener("click", goBackToResult);
if(backNoticeBtn) backNoticeBtn.addEventListener("click", goBackToResult);

if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("studentCode");
        localStorage.removeItem("studentPhone");
        cacheData = { attendance: null, homework: null, exam: null, payment: null, notice: null };
        if(codeInput) codeInput.value = "";
        if(passwordInput) passwordInput.value = "";
        if(result) result.classList.add("hidden");
        alert("تم تسجيل الخروج بنجاح");
    });
}

function displayStudent(student){
    currentStudent = student;

    if(result) result.classList.remove("hidden");
    if(notFound) notFound.classList.add("hidden");

    if(attendanceCard) attendanceCard.classList.add("hidden");
    if(homeworkCard) homeworkCard.classList.add("hidden");
    if(examCard) examCard.classList.add("hidden");
    if(paymentCard) paymentCard.classList.add("hidden");
    if(noticeCard) noticeCard.classList.add("hidden");

    if(attendanceBtn) attendanceBtn.classList.remove("hidden");
    if(homeworkBtn) homeworkBtn.classList.remove("hidden");
    if(examBtn) examBtn.classList.remove("hidden");
    if(paymentBtn) paymentBtn.classList.remove("hidden");
    if(noticeBtn) noticeBtn.classList.remove("hidden");

    if(document.getElementById("studentCode")) document.getElementById("studentCode").textContent = student.code || "-";
    if(document.getElementById("studentName")) document.getElementById("studentName").textContent = student.name || "-";
    if(document.getElementById("studentGrade")) document.getElementById("studentGrade").textContent = student.grade || "-";
    if(document.getElementById("studentGroup")) document.getElementById("studentGroup").textContent = student.group || "-";
    if(document.getElementById("studentWhatsapp")) document.getElementById("studentWhatsapp").textContent = student.studentWhatsapp || "-";
    if(document.getElementById("parentWhatsapp")) document.getElementById("parentWhatsapp").textContent = student.parentWhatsapp || "-";

    preloadAllData(student.code);
}

function searchStudent(){
    function normalize(str) {
        if (!str) return "";
        return String(str)
            .replace(/[\u0660-\u0669]/g, d => d.charCodeAt(0) - 1632)
            .replace(/[\u06F0-\u06F9]/g, d => d.charCodeAt(0) - 1776)
            .replace(/\D/g, "");
    }

    const rawCode = codeInput ? codeInput.value.trim() : "";
    const rawPhone = passwordInput ? passwordInput.value.trim() : "";

    const code = normalize(rawCode);
    const phoneInput = normalize(rawPhone);

    if(code === "" || phoneInput === ""){
        alert("برجاء إدخال كود الطالب ورقم الواتساب");
        return;
    }

    if(result) result.classList.add("hidden");
    if(notFound) notFound.classList.add("hidden");

    const student = students.find(item => {
        const itemCode = normalize(item.code);
        const studentWa = normalize(item.studentWhatsapp);
        const parentWa = normalize(item.parentWhatsapp);

        return itemCode === code && (studentWa === phoneInput || parentWa === phoneInput);
    });

    if(!student){
        if(notFound) {
            notFound.innerHTML = `<i class="fa-solid fa-circle-xmark"></i><br><br><strong>كود الطالب أو رقم الواتساب غير صحيح</strong>`;
            notFound.classList.remove("hidden");
        }
        return;
    }

    if (rememberMeInput && rememberMeInput.checked) {
        localStorage.setItem("studentCode", rawCode);
        localStorage.setItem("studentPhone", rawPhone);
    } else {
        localStorage.removeItem("studentCode");
        localStorage.removeItem("studentPhone");
    }

    displayStudent(student);
}

async function preloadAllData(code) {
    cacheData = { attendance: null, homework: null, exam: null, payment: null, notice: null };
    
    Promise.all([
        fetch(ATTENDANCE_API + "?code=" + code).then(res => res.json()).catch(() => []),
        fetch(HOMEWORK_API + "?code=" + code).then(res => res.json()).catch(() => []),
        fetch(EXAM_API + "?code=" + code).then(res => res.json()).catch(() => []),
        fetch(PAYMENT_API + "?code=" + code).then(res => res.json()).catch(() => []),
        fetch(NOTICE_API + "?code=" + code).then(res => res.json()).catch(() => [])
    ]).then(results => {
        cacheData.attendance = results[0];
        cacheData.homework = results[1];
        cacheData.exam = results[2];
        cacheData.payment = results[3];
        cacheData.notice = results[4];
    });
}

// تصميم شريط التحميل ونسبة التقدم
function getLoadingHTML() {
    return `
        <div style="text-align:center; padding: 30px 20px;">
            <p style="font-size: 20px; font-weight: bold; color: #0d47a1; margin-bottom: 15px;">جاري التحميل...</p>
            <div style="width: 100%; background: #e0e0e0; border-radius: 15px; overflow: hidden; height: 22px; box-shadow: inset 0 2px 5px rgba(0,0,0,0.1);">
                <div id="progressBar" style="width: 0%; height: 100%; background: linear-gradient(135deg, #0d47a1, #1976d2); border-radius: 15px; transition: width 0.4s ease-in-out;"></div>
            </div>
            <p id="progressText" style="font-size: 16px; font-weight: bold; color: #555; margin-top: 10px;">0%</p>
        </div>
    `;
}

async function renderFast(apiUrl, cardElement, contentElement, mappingFn, cacheKey) {
    if(result) result.classList.add("hidden");
    attendanceCard.classList.add("hidden");
    homeworkCard.classList.add("hidden");
    examCard.classList.add("hidden");
    paymentCard.classList.add("hidden");
    noticeCard.classList.add("hidden");

    cardElement.classList.remove("hidden");

    if (cacheData[cacheKey] !== null) {
        processRender(cacheData[cacheKey], contentElement, mappingFn);
        return;
    }

    contentElement.innerHTML = getLoadingHTML();
    
    // محاكاة تصاعد شريط التحميل بنسبة مئوية بشكل سلس
    let progress = 10;
    const bar = document.getElementById("progressBar");
    const text = document.getElementById("progressText");
    
    const interval = setInterval(() => {
        if (progress < 85) {
            progress += Math.floor(Math.random() * 15) + 5;
            if(bar) bar.style.width = progress + "%";
            if(text) text.textContent = progress + "%";
        }
    }, 150);

    try {
        const response = await fetch(apiUrl + "?code=" + currentStudent.code);
        const data = await response.json();
        cacheData[cacheKey] = data;
        
        clearInterval(interval);
        if(bar) bar.style.width = "100%";
        if(text) text.textContent = "100%";
        
        setTimeout(() => {
            processRender(data, contentElement, mappingFn);
        }, 300);

    } catch (e) {
        clearInterval(interval);
        contentElement.innerHTML = "<h3>حدث خطأ أثناء تحميل البيانات</h3>";
    }
}

function processRender(data, contentElement, mappingFn) {
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
}

function showAttendance() {
    renderFast(ATTENDANCE_API, attendanceCard, attendanceContent, (item, isMobile) => {
        if (isMobile) {
            return `<div class="attendance-mobile-card"><div class="card-item"><span>📘 الحصة</span><strong>${item.lesson || '-'}</strong></div><div class="card-item"><span>📅 التاريخ</span><strong>${item.date || '-'}</strong></div><div class="card-item"><span>✅ الحالة</span><strong>${item.status || '-'}</strong></div></div>`;
        }
        let table = `<div class="table-wrapper"><table class="attendance-table"><tr><th>الحصة</th><th>التاريخ</th><th>الحالة</th></tr>`;
        item.forEach(row => {
            table += `<tr><td>${row.lesson || '-'}</td><td>${row.date || '-'}</td><td>${row.status || '-'}</td></tr>`;
        });
        return table + `</table></div>`;
    }, 'attendance');
}

function showHomework() {
    renderFast(HOMEWORK_API, homeworkCard, homeworkContent, (item, isMobile) => {
        if (isMobile) {
            return `<div class="attendance-mobile-card homework-card"><div class="card-item"><span>📚 رقم الواجب</span><strong>${item.homework || '-'}</strong></div><div class="card-item"><span>📅 التاريخ</span><strong>${item.date || '-'}</strong></div><div class="card-item"><span>🎯 درجة الطالب</span><strong>${item.grade || '-'}</strong></div><div class="card-item"><span>🏆 الدرجة النهائية</span><strong>${item.total || '-'}</strong></div></div>`;
        }
        let table = `<div class="table-wrapper"><table class="attendance-table"><tr><th>رقم الواجب</th><th>التاريخ</th><th>درجة الطالب</th><th>الدرجة النهائية</th></tr>`;
        item.forEach(row => {
            table += `<tr><td>${row.homework || '-'}</td><td>${row.date || '-'}</td><td>${row.grade || '-'}</td><td>${row.total || '-'}</td></tr>`;
        });
        return table + `</table></div>`;
    }, 'homework');
}

function showExam() {
    renderFast(EXAM_API, examCard, examContent, (item, isMobile) => {
        if (isMobile) {
            return `<div class="attendance-mobile-card exam-card"><div class="card-item"><span>📝 رقم الامتحان</span><strong>${item.exam || '-'}</strong></div><div class="card-item"><span>📅 التاريخ</span><strong>${item.date || '-'}</strong></div><div class="card-item"><span>🎯 درجة الطالب</span><strong>${item.grade || '-'}</strong></div><div class="card-item"><span>🏆 الدرجة النهائية</span><strong>${item.total || '-'}</strong></div></div>`;
        }
        let table = `<div class="table-wrapper"><table class="attendance-table"><tr><th>الامتحان</th><th>التاريخ</th><th>درجة الطالب</th><th>الدرجة النهائية</th></tr>`;
        item.forEach(row => {
            table += `<tr><td>${row.exam || '-'}</td><td>${row.date || '-'}</td><td>${row.grade || '-'}</td><td>${row.total || '-'}</td></tr>`;
        });
        return table + `</table></div>`;
    }, 'exam');
}

function showPayments() {
    renderFast(PAYMENT_API, paymentCard, paymentContent, (item, isMobile) => {
        if (isMobile) {
            return `<div class="attendance-mobile-card payment-card"><div class="card-item"><span>📅 الشهر</span><strong>${item.month || '-'}</strong></div><div class="card-item"><span>💵 المدفوع</span><strong>${item.paid || '-'}</strong></div><div class="card-item"><span>❗ المتبقى</span><strong>${item.remaining || '-'}</strong></div><div class="card-item"><span>💰 إجمالى المستحق</span><strong>${item.total || '-'}</strong></div></div>`;
        }
        let table = `<div class="table-wrapper"><table class="attendance-table"><tr><th>الشهر</th><th>المدفوع</th><th>المتبقى</th><th>إجمالى المستحق</th></tr>`;
        item.forEach(row => {
            table += `<tr><td>${row.month || '-'}</td><td>${row.paid || '-'}</td><td>${row.remaining || '-'}</td><td>${row.total || '-'}</td></tr>`;
        });
        return table + `</table></div>`;
    }, 'payment');
}

function showNotices() {
    renderFast(NOTICE_API, noticeCard, noticeContent, (item, isMobile) => {
        const imgUrl = item.image || item.imageUrl || item.photo || "";
        const imgHtmlMobile = imgUrl ? `<div class="notice-img-container"><a href="${imgUrl}" target="_blank"><img src="${imgUrl}" alt="صورة التنبيه" class="notice-img" style="max-width:100%; height:auto; border-radius:10px; margin-top:10px;"></a></div>` : "";
        
        if (isMobile) {
            return `<div class="attendance-mobile-card notice-card"><div class="card-item"><span>📘 الحصة</span><strong>${item.lesson || '-'}</strong></div><div class="card-item"><span>📅 التاريخ</span><strong>${item.date || '-'}</strong></div><div style="margin-top:15px;line-height:2"><span style="color:#d32f2f;font-weight:bold">🔔 التنبيه</span><br>${item.notice || ''}</div>${imgHtmlMobile}</div>`;
        }

        let table = `<div class="table-wrapper"><table class="attendance-table"><tr><th>الحصة</th><th>التاريخ</th><th>التنبيه أو الملاحظة</th><th>الصورة المرفقة</th></tr>`;
        item.forEach(row => {
            const rowImgUrl = row.image || row.imageUrl || row.photo || "";
            const imgHtmlDesktop = rowImgUrl ? `<a href="${rowImgUrl}" target="_blank"><img src="${rowImgUrl}" alt="صورة" style="width:150px; max-height:120px; border-radius:8px; object-fit:cover; box-shadow:0 3px 10px rgba(0,0,0,0.15);"></a>` : "لا يوجد";
            table += `<tr><td>${row.lesson || '-'}</td><td>${row.date || '-'}</td><td>${row.notice || ''}</td><td>${imgHtmlDesktop}</td></tr>`;
        });
        return table + `</table></div>`;
    }, 'notice');
}