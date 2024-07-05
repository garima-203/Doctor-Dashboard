 
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
const patientCardContainer = document.getElementById('patient-card');

function renderPatientCard(patients) {
    patientCardContainer.innerHTML = '';
    const card = document.createElement('div');
    card.classList.add('patient-card');
    card.innerHTML = `               
        <div class="card-body">               
            <ul class="list-group">
                ${patients.slice(0, 5).map(patient => `
                    <li class="list-group-item">
                        <strong>Name:</strong> ${patient.name || '-'}<br>
                        <strong>Gender:</strong> ${patient.gender || '-'}<br>
                        <strong>Disease Description:</strong> ${patient.diseaseDescription || '-'}<br>
                        <strong>Appointment Time:</strong> ${patient.appointmentTime || '-'}<br>
                    </li> 
                `).join('')}
            </ul><br>                         
       </div>
    
`;
    patientCardContainer.appendChild(card);
}

function fetchPatientsForToday() {
    const currentDate = new Date();
    const today = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`;

    const acceptedQuery = query(ref(database, 'patients'), orderByChild('status'), equalTo('Accepted'));
    onValue(acceptedQuery, (snapshot) => {
        const patients = [];
        snapshot.forEach(childSnapshot => {
            const patient = childSnapshot.val();
            if (patient.appointmentDate === today) {
                patients.push(patient);
            }
        });
        renderPatientCard(patients);
    });
}

fetchPatientsForToday();
