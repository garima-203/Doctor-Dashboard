 
const genderData = {
    labels: ['Male', 'Female'],
    datasets: [{
        data: [60, 40],
        backgroundColor: ['#36A2EB', '#FF6384']
    }]
};


const visitsData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    datasets: [{
        label: 'Patient Visits',
        data: [30, 20, 25, 35, 40, 30, 20, 25, 30, 35, 40, 50],
        borderColor: '#4BC0C0',
        fill: false,
        tension: 0.1
    }]
};

const patientTypeData = {
    labels: ['Initial Visits', 'Follow-ups'],
    datasets: [{
        data: [40, 60],
        backgroundColor: ['#bdbebf', '#f7f7f7']
    }]
};

const treatedPatientsData = {
    labels: ['0-10 years', '11-20 years', '21-30 years', '31-40 years', '41-50 years', '51-60 years', '60+ years'],
    datasets: [{
        label: 'Treated Patients',
        data: [10, 20, 30, 25, 15, 12, 5],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF']
    }]
};


// Configuration for Gender Chart (Pie)
const genderChartConfig = {
    type: 'pie',
    data: genderData,
    options: {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
        }
    }
};

// Configuration for Patient Type Chart (Doughnut)
const patientTypeChartConfig = {
    type: 'doughnut',
    data: patientTypeData,
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            },
        }
    }
};

// Configuration for Treated Patients Chart (Bar)
const treatedPatientsChartConfig = {
    type: 'bar',
    data: treatedPatientsData,
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            },
        },
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
};

// Configuration for Visits Chart (Line)
const visitsChartConfig = {
    type: 'line',
    data: visitsData,
    options: {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
        },
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
};

// Initialize Charts
window.onload = function () {
    const genderCtx = document.getElementById('genderChart').getContext('2d');
    new Chart(genderCtx, genderChartConfig);

    const patientTypeCtx = document.getElementById('patientTypeChart').getContext('2d');
    new Chart(patientTypeCtx, patientTypeChartConfig);

    const treatedPatientsCtx = document.getElementById('treatedPatientsChart').getContext('2d');
    new Chart(treatedPatientsCtx, treatedPatientsChartConfig);

    const visitsCtx = document.getElementById('visitsChart').getContext('2d');
    new Chart(visitsCtx, visitsChartConfig);
};


 
 