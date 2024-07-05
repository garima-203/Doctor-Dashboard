 
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-analytics.js";
import { getDatabase, ref, onValue, query, orderByChild, equalTo } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-database.js";

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
const acceptedPatientTable = document.getElementById('table-body'); 
const mainHeading = document.getElementById('main-heading');
const tableContainer = document.getElementById('table-container');
const pagination = document.getElementById('pagination');
const datePicker = document.getElementById('date-picker');

let acceptedPatients = [];

function renderData(patients) {
    acceptedPatientTable.innerHTML = '';
    if (patients.length === 0) {
        acceptedPatientTable.innerHTML = '<tr><td colspan="8">No data available for this date.</td></tr>';
        return;
    }
    patients.forEach(patientData => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${patientData.name || '-'}</td>
            <td>${patientData.gender || '-'}</td>
            <td>${patientData.email || '-'}</td>
            <td>${patientData.phoneNumber || '-'}</td>
            <td>${patientData.birthDate || '-'}</td>
            <td>${patientData.diseaseDescription || '-'}</td>
            <td>${patientData.appointmentDate || '-'}</td>
            <td>${patientData.appointmentTime || '-'}</td>
        `;
        acceptedPatientTable.appendChild(row);
    });
}

function fetchAcceptedPatients() { 
    const acceptedQuery = query(ref(database, 'patients'), orderByChild('status'), equalTo('Accepted'));
    onValue(acceptedQuery, (snapshot) => {
        acceptedPatients = [];
        snapshot.forEach(childSnapshot => {
            const patient = childSnapshot.val();
            patient.id = childSnapshot.key;
            acceptedPatients.push(patient);
        });
        const currentDate = getFormattedDate();
        datePicker.value = currentDate;
        filterDataByDate(currentDate); 
    });
}

function filterDataByDate(selectedDate) {
    console.log('Selected Date:', selectedDate);
    const filteredPatients = acceptedPatients.filter(patient => patient.appointmentDate === selectedDate);
    filteredPatients.sort((a, b) => {
        const dateA = new Date(`${a.appointmentDate}T${a.appointmentTime}`);
        const dateB = new Date(`${b.appointmentDate}T${b.appointmentTime}`);
        return dateA - dateB;
    });
    console.log('Filtered Patients:', filteredPatients);
    renderData(filteredPatients);
}

function getFormattedDate() {
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



datePicker.addEventListener('change', () => {
    filterDataByDate(datePicker.value);
});

fetchAcceptedPatients();
