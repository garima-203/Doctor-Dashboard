 
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-analytics.js";
import { getDatabase, ref, onValue, update, push } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-database.js";
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
const patientTable = document.getElementById('table-body');
const mainHeading = document.getElementById('main-heading');
const tableContainer = document.getElementById('table-container');
const currentDateElement = document.getElementById('current-date');
const datePicker = document.getElementById('date-picker');
const pagination = document.getElementById('pagination');
const appointmentModal = new bootstrap.Modal(document.getElementById('appointmentModal'));
const appointmentForm = document.getElementById('appointmentForm');
const appointmentDateInput = document.getElementById('appointmentDate');
const appointmentTimeInput = document.getElementById('appointmentTime');
const patientIdInput = document.getElementById('patientId');
const saveAppointmentButton = document.getElementById('saveAppointmentButton');
const errorMessage = document.getElementById('error-message');
const seeAllButton = document.getElementById('see-all-button');

let patientData = {};
let sortedDates = [];

function updatePatientStatus(patientId, status, appointmentDate = null, appointmentTime = null) {
    const updates = { status: status };
    if (appointmentDate && appointmentTime) {
        updates.appointmentDate = appointmentDate;
        updates.appointmentTime = appointmentTime;
    }
    update(ref(database, `patients/${patientId}`), updates);
}

function renderData(patients) {
    patientTable.innerHTML = '';
    if (patients && patients.length > 0) {
        const patientsToShow = patients.slice(0, 5);
        patientsToShow.forEach(patientData => {
            const row = document.createElement('tr');
            row.innerHTML = `
            <td>${patientData.name}</td>
            <td>${patientData.gender}</td>
            <td>${patientData.email}</td>
            <td>${patientData.phoneNumber}</td>
            <td>${patientData.birthDate}</td>
            <td>${patientData.diseaseDescription}</td>
            <td>
                <div class="action-buttons">
                ${patientData.status ? `<span class="status-${patientData.status.toLowerCase()}">${patientData.status}</span>` : `
                    <button class="btn btn-success btn-accept " style="margin-bottom:5px;" data-id="${patientData.id}">Accept</button>
                    <button class="btn btn-danger btn-reject  "  style="margin-bottom:5px;" data-id="${patientData.id}">Reject</button>
                `}
            </div>
            </td>
        `;
            patientTable.appendChild(row);
        });

        document.querySelectorAll('.btn-accept').forEach(button => {
            button.addEventListener('click', function () {
                const patientId = this.getAttribute('data-id');
                patientIdInput.value = patientId;
                appointmentModal.show();
            });
        });
        document.querySelectorAll('.btn-reject').forEach(button => {
            button.addEventListener('click', function () {
                const patientId = this.getAttribute('data-id');
                updatePatientStatus(patientId, 'Rejected');
                this.parentElement.innerHTML = '<span class="status-rejected">Rejected</span>';
            });
        });

        if (patients.length > 1) {
            seeAllButton.style.display = 'block';
        } else {
            seeAllButton.style.display = 'block';
        }
    } else {
        patientTable.innerHTML = '<tr><td colspan="7"> No data available for this date.</td></tr>';
    }
}

function fetchPatients() {
    onValue(ref(database, 'patients'), (snapshot) => { 
        if (!snapshot.exists()) {
            patientTable.innerHTML = '<tr><td colspan="7">No patient data available.</td></tr>';
            return; 
        }

        patientData = {}; 
        snapshot.forEach(childSnapshot => {
            const patient = childSnapshot.val();
            patient.id = childSnapshot.key;
            const submissionDate = patient.submissionDate;
            if (!patientData[submissionDate]) {
                patientData[submissionDate] = [];
            }
            patientData[submissionDate].push(patient);
        }); 
        sortedDates = Object.keys(patientData).sort((a, b) => new Date(b) - new Date(a));
        paginateData();
    });
}


function paginateData() {
    const currentDate = getFormattedDate();
    const pageData = patientData[currentDate];
    renderData(pageData);
    datePicker.value = currentDate;
    mainHeading.style.display = 'block';
    tableContainer.style.display = 'block';
    pagination.style.display = 'block';
}

function fetchPatientsByDate(selectedDate) {
    const dataForSelectedDate = patientData[selectedDate];
    if (dataForSelectedDate && dataForSelectedDate.length > 0) {
        renderData(dataForSelectedDate);
    } else {
        patientTable.innerHTML = '<tr><td colspan="7">No data available for this date.</td></tr>';
    }
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

datePicker.addEventListener('change', (event) => {
    const selectedDate = event.target.value;
    if (sortedDates.includes(selectedDate)) {
        fetchPatientsByDate(selectedDate);
    } else {
        patientTable.innerHTML = '<tr><td colspan="7">No data available for this date.</td></tr>';
    }
});

saveAppointmentButton.addEventListener('click', () => {
    const appointmentDate = appointmentDateInput.value;
    const appointmentTime = appointmentTimeInput.value;
    if (!appointmentDate || !appointmentTime) {
        errorMessage.innerText = 'Please select both appointment date and time.';
        errorMessage.style.display = 'block';
        return;
    }
    errorMessage.style.display = 'none';
    const patientId = patientIdInput.value;
    updatePatientStatus(patientId, 'Accepted', appointmentDate, appointmentTime);
    appointmentModal.hide();
});

function resetAppointmentForm() {
    appointmentForm.reset();
    errorMessage.style.display = 'none';
}

appointmentModal._element.addEventListener('show.bs.modal', function (event) {
    resetAppointmentForm();
});

fetchPatients();
