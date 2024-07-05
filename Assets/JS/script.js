//NOTIFICATION CODE
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-analytics.js";
import { getDatabase, ref, onValue, update, push, onChildAdded } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-database.js";
const firebaseConfig = {
    apiKey: "AIzaSyB-Fp38c9GUdO6AekTpdKhwtd6IHg6v-Ns",
    authDomain: "patient-detail-cb679.firebaseapp.com",
    databaseURL: "https://patient-detail-cb679-default-rtdb.firebaseio.com",
    projectId: "patient-detail-cb679",
    storageBucket: "patient-detail-cb679.appspot.com",
    messagingSenderId: "429925058854",
    appId: "1:429925058854:web:03af403cf4a869825559e7",
    measurementId: "G-LLKGNSZ2H5"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase(app);
const notificationList = document.getElementById('notificationList');
const bellIcon = document.querySelector('.notification .icon');
const notificationBadge = document.getElementById('notification-badge');
const notificationCard = document.getElementById('notificationCard');
const notificationCardBody = document.getElementById('notificationCardBody');
const closeNotificationCard = document.getElementById('closeNotificationCard');


let notificationsViewed = sessionStorage.getItem('notificationsViewed') === 'true';
let newNotificationAdded = sessionStorage.getItem('newNotificationAdded') === 'true';
let notificationCardOpen = false;

function showNotificationBadge() {
    notificationBadge.style.display = 'block';
}

function hideNotificationBadge() {
    notificationBadge.style.display = 'none';
}


function toggleNotificationCard() {
    if (!notificationCardOpen) {
        notificationCard.style.display = 'block';
        notificationCardOpen = true;
        notificationsViewed = true;
        sessionStorage.setItem('notificationsViewed', true);
        hideNotificationBadge();
        newNotificationAdded = false;
        sessionStorage.setItem('newNotificationAdded', false);

    } else {
        notificationCard.style.display = 'none';
        notificationCardOpen = false;
    }
}
bellIcon.addEventListener('click', toggleNotificationCard);



function addNotificationToCard(patientName) {
    const notificationCardBody = document.getElementById('notificationCardBody');
    const notificationItem = document.createElement('div');
    notificationItem.classList.add('notification-item');
    notificationItem.innerHTML = `
<p><strong>${patientName}</strong> has registered.</p>
`;
    notificationCardBody.insertAdjacentHTML('afterbegin', notificationItem.outerHTML);

    showNotificationBadge();
    sessionStorage.setItem('badgeShown', true);



}

function getFormattedCurrentDate() {
    const now = new Date();
    const year = now.getFullYear();
    let month = now.getMonth() + 1;
    let day = now.getDate();

    if (month < 10) {
        month = '0' + month;
    }
    if (day < 10) {
        day = '0' + day;
    }

    return `${year}-${month}-${day}`;
}


onChildAdded(ref(database, 'patients'), (snapshot) => {
    const patient = snapshot.val();
    const submissionDate = patient.submissionDate;


    if (submissionDate === getFormattedCurrentDate()) {
        addNotificationToCard(patient.name);

    }
});


document.addEventListener('DOMContentLoaded', function () {
    if (!sessionStorage.getItem('badgeShown')) {
        hideNotificationBadge();
    }
});
