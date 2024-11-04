const userId = document.getElementById('username');
const userName = document.getElementById('name');
const githubBtn = document.getElementById('github');
const linkedinBtn = document.getElementById('linkedin');
const qualification = document.getElementById('qualification');
const contact = document.getElementById('contact');
const email = document.getElementById('email');
const interests = document.getElementById('interest');
const acceptBtn = document.getElementById('accept');
const rejectBtn = document.getElementById('reject');

const applicantUsername = localStorage.getItem('applicant-username');
const projectId = localStorage.getItem('project-id');
const applicationId = localStorage.getItem('application-id');

let githubURL, linkedinURL;

function popMessage(heading, message) {
    Swal.fire({
        icon: "error",
        title: heading,
        text: message,
        timer: 5000,
        confirmButtonText: 'Alright'
    });
}

async function getProject(id) {
    try {
        const response = await fetch(`http://localhost:8080/Api/Project/Id/?Id=${projectId}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'charset': 'utf-8' }
        });
        if (!response.ok) throw new Error('Error fetching user');
        return await response.json();
    } catch (error) {
        console.error(error);
    }
}

async function getUser(id) {
    try {
        const response = await fetch(`http://localhost:8080/Api/User/${id}/`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'charset': 'utf-8' }
        });
        if (!response.ok) throw new Error('Error fetching user');
        return await response.json();
    } catch (error) {
        console.error(error);
    }
}

function formatContact(contact) {
    return `+91 ${contact.slice(0, 5)}-${contact.slice(5)}`;
}

function parseQualifications(qualificationString) {
    return qualificationString.split('₹');
}

function parseInterests(interestsList) {
    if (!interestsList.length) return "No specified interests";
    return interestsList.slice(0, -1).join(', ') + (interestsList.length > 1 ? ` and ${interestsList.slice(-1)}` : '');
}

function updateProfile(userObject) {
    const [qual, linkedin, github] = parseQualifications(userObject.qualification);

    userName.textContent = `${userObject.first_name} ${userObject.last_name}`;
    userId.textContent = `@${userObject.username}`;
    contact.innerHTML = `Contact: <span class="b">${formatContact(userObject.mobile_no[0])}</span>`;
    email.innerHTML = `Email: <span class="b">${userObject.email_id}</span>`;
    interests.innerHTML = `Interests: <span class="b">${parseInterests(userObject.interest)}</span>`;
    qualification.innerHTML = `Qualifications: <span class="b">${qual}</span>`;
    
    githubURL = github;
    linkedinURL = linkedin;
}

async function deleteApplication() {
    try {
        const response = await fetch(`http://localhost:8080/Api/Application/${applicationId}/`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            }
        });
        if (!response.ok) throw new Error('Error deleting application');
        popMessage('Application removed', 'Application has been removed from your project!');
    } catch (error) {
        console.error(error);
    }
}

async function addCollaborator() {
    try {
        const response = await fetch(`http://localhost:8080/Api/Project/${projectId}/Collaborator/?NewCollaborator=${applicantUsername}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'charset': 'utf-8' }
        });
        if (!response.ok) throw new Error('Error adding collaborator');
        popMessage('Collaborator Added', 'Collaborator has been added to your project!');
    } catch (error) {
        console.error(error);
    }
}

function createNotification(mssg) {
    const object = {
        'message': mssg,
        'receiver': applicantUsername,
        'type': null,
        'Data': null
    };

    fetch('http://localhost:8080/Api/Notification/Add/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'charset': 'utf-8' },
        body: JSON.stringify(object)
    })
    .then((response) => {
        if (!response.ok) {
            throw new Error('Notication could not be created');
        } else {
            return response.json();
        }
    })
    .then((data) => {
        console.log(data);
    })
    .catch((error) => {
        console.log(error);
    })
}

async function displayApplicant(id) {
    try {
        const userObject = await getUser(id);
        const projectObject = await getProject(projectId);
        if (userObject) {
            updateProfile(userObject);

            githubBtn.addEventListener('click', () => {
                if (githubURL) window.open(githubURL);
            });

            linkedinBtn.addEventListener('click', () => {
                if (linkedinURL) window.open(linkedinURL);
            });

            acceptBtn.addEventListener('click', () => {
                Swal.fire({
                    icon: 'question',
                    title: "Click 'Confirm' to accept the application",
                    showCancelButton: true,
                    confirmButtonText: "Confirm",
                }).then(async (result) => {
                    if (result.isConfirmed) {
                        try {
                            createNotification(`Congratulations! You have been accepted for ${projectObject.name}`);
                            await addCollaborator();
                            await deleteApplication();
                            Swal.fire("Application Accepted and Removed!", "", "success");
                        } catch (error) {
                            console.error('Error handling application:', error);
                            Swal.fire("Error", "Could not process application completely.", "error");
                        }
                    }
                });
            });            
            
            rejectBtn.addEventListener('click', () => {
                Swal.fire({
                    icon: 'question',
                    title: "Click 'Confirm' to reject the application",
                    showCancelButton: true,
                    confirmButtonText: "Confirm",
                }).then(result => {
                    if (result.isConfirmed) {
                        Swal.fire("Application Rejected", "", "error");
                        createNotification(`Oops! You have been rejected for ${projectObject.name}`);
                        deleteApplication();
                    }
                });
            });
        }
    } catch (error) {
        console.error(error);
    }
}

displayApplicant(applicantUsername);