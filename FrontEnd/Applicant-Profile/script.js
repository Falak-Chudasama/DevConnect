const userId = document.getElementById('username');
const userName = document.getElementById('name');
const githubBtn = document.getElementById('github');
const linkedinBtn = document.getElementById('linkedin');
const qualification = document.getElementById('qualification');
const contact = document.getElementById('contact');
const email = document.getElementById('email');
const interests = document.getElementById('interest');
const profileBox = document.getElementById('profile-box');
const acceptBtn = document.getElementById('accept');
const rejectBtn = document.getElementById('reject');

const applicantUsername = localStorage.getItem('applicant-username');
const projectId = localStorage.getItem('project-id');
const applicationId = localStorage.getItem('application-id');

let githubURL;
let linkedinURL;

function popMessage(heading, message) {
    Swal.fire({
        icon: "error",
        title: heading,
        text: message,
        timer: 5000,
        confirmButtonText: 'Alright'
    });
}

function getUser(id) {
    return new Promise((resolve, reject) => {
        fetch(`http://localhost:8080/Api/User/${id}/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'charset': 'utf-8'
            }
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Error at fetching');
                } else {
                    return response.json();
                }
            })
            .then((data) => {
                resolve(data)
            })
            .catch((err) => {
                reject(err)
            })
    })
}

function makeThisContact(contact) {
    return '+91 ' + contact.slice(0, 5) + '-' + contact.slice(5, 10);
}

function parseQualifications(qualification) {
    return qualification.split('₹');
}

function parseInterests(interests) {
    let result = interests[0];

    for (let i = 1; i < interests.length - 1; i++) {
        result += ', ' + interests[i];
    }

    if (interests.length > 1) {
        result += ' and ' + interests[interests.length - 1]
    }

    return result;
}

function manipulateElements(userObject) {
    console.log(userObject);

    let [qual, linkedin, github] = parseQualifications(userObject.qualification);

    userName.innerText = userObject.first_name + ' ' + userObject.last_name;
    userId.innerText = '@' + userObject.username;
    contact.innerHTML = `Contact : <span class="b">${makeThisContact(userObject.mobile_no[0])}</span>`;
    email.innerHTML = `Email : <span class="b">${userObject.email_id}</span>`;
    interests.innerHTML = `Interests : <span class="b">${parseInterests(userObject.interest)}</span>`;
    qualification.innerHTML = `Interests : <span class="b">${qual}</span>`;
    githubURL = github;
    linkedinURL = linkedin;
}

function deleteApplication() {
    fetch(`http://localhost:8080/Api/Application/${applicationId}/`, {
        method: 'DELETE',
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error('Error deleting application');
            }
            return response.json();
        })
        .then((data) => {
            console.log('Application deleted successfully:', data);
            popMessage('Application removed', 'Application has been removed from your project!')
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

function addCollaborator() {
    fetch(`http://localhost:8080/Api/Project/${projectId}/Collaborator/?NewCollaborator=${applicantUsername}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'charset': 'utf-8'
        }
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error('Error adding collaborator');
            }
            return response.json();
        })
        .then((data) => {
            console.log('Collaborator added successfully:', data);
            popMessage('Collaborator Added', 'Collaborator has been added to your project!')
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

async function displayApplicant(id) {
    try {
        const userObject = await getUser(id);
        manipulateElements(userObject);
        githubBtn.addEventListener('click', (event) => {
            event.preventDefault();
            window.open(githubURL);
        })
        linkedinBtn.addEventListener('click', (event) => {
            event.preventDefault();
            window.open(linkedinURL);
        })
        acceptBtn.addEventListener('click', (event) => {
            Swal.fire({
                icon: 'question',
                title: "Click 'Confirm' to accept the application",
                showCancelButton: true,
                confirmButtonText: "Confirm",
            }).then((result) => {
                if (result.isConfirmed) {
                    Swal.fire("Application Accepted!", "", "success");
                    addCollaborator();
                }
            });
        });
        rejectBtn.addEventListener('click', (event) => {
            Swal.fire({
                icon: 'question',
                title: "Click 'Confirm' to reject the application",
                showCancelButton: true,
                confirmButtonText: "Confirm",
            }).then((result) => {
                if (result.isConfirmed) {
                    Swal.fire("Application Rejected", "", "error");
                    deleteApplication();
                }
            });
        })
    } catch (error) {
        console.log(error);
    }
}
displayApplicant(applicantUsername);