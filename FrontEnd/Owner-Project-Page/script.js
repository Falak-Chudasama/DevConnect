const projectName = document.getElementById('project-name');
const ownerName = document.getElementById('owner-name');
const ownerId = document.getElementById('owner-id');
const members = document.getElementById('members');
const projectDescription = document.getElementById('project-description');
const projectCategory = document.getElementById('project-category');
const projectPhase = document.getElementById('project-phase');
const projectStatus = document.getElementById('project-status');
const buttonsContainer = document.getElementById('buttons-container');
const applicationsContainer = document.getElementById('applications-container');

const listingId = localStorage.getItem('listing-id');

function getListing(id) {
    return new Promise((resolve, reject) => {
        fetch(`http://localhost:8080/Api/Listing/${id}/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'charset': 'utf-8'
            }
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Error fetching project');
                }
                return response.json();
            })
            .then((data) => {
                resolve(data);
            })
            .catch((error) => {
                reject(error);
            });
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
                    throw new Error('Error fetching user');
                }
                return response.json();
            })
            .then((data) => {
                resolve(data);
            })
            .catch((error) => {
                reject(error);
            });
    });
}

function addApplication(application) {
    fetch(`http://localhost:8080/Api/Application/${application.applicant}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'charset': 'utf-8'
        }
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error('Fetch Error');
            }
            console.log(response);
            return response.json();
        })
        .then(async (data) => {
            console.log(data);
            let userObject = await getUser(data.applicant);
            let smallRectangle = document.createElement('div');
            let nameSpan = document.createElement('span');
            let dateDiv = document.createElement('div');
            let viewButton = document.createElement('button');
            let lineDiv = document.createElement('div');

            smallRectangle.classList.add('small-rectangle');
            nameSpan.classList.add('name');
            dateDiv.classList.add('date');
            viewButton.classList.add('c');
            lineDiv.classList.add('line');

            nameSpan.textContent = userObject.first_name + ' ' + userObject.last_name;
            dateDiv.textContent = data.date;
            viewButton.textContent = "View";

            viewButton.addEventListener('click', (event) => {
                event.preventDefault();
                localStorage.setItem('applicant-username', userObject.username);
                window.location.href = '../Applicant-Profile/index.html';
            });

            applicationsContainer.appendChild(smallRectangle);
            applicationsContainer.appendChild(nameSpan);
            applicationsContainer.appendChild(dateDiv);
            applicationsContainer.appendChild(viewButton);
            applicationsContainer.appendChild(lineDiv);
        })
        .catch((error) => {
            console.log(error);
        });
}

function getAndFilterApplications(listingObject) {
    fetch(`http://localhost:8080/Api/Application/All/Project/?ProjectId=${listingObject.listed_project.id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'charset': 'utf-8'
        }
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error('Fetch Error');
            }
            return response.json();
        })
        .then((data) => {
            data.forEach((application) => {
                if (application.applied_project === listingId) {
                    addApplication(application);
                }
            });
        })
        .catch((error) => {
            console.log(error);
        });
}

function manipulateElements(projectObject, userObject) {
    projectName.textContent = projectObject.name;
    projectDescription.textContent = projectObject.description;
    projectCategory.textContent = projectObject.domain;
    projectPhase.textContent = projectObject.status;
    projectStatus.textContent = projectObject.privacy_status;
    members.textContent = ` ${projectObject.collaborator.length}`;
    ownerId.textContent = `@${userObject.username}`;
    ownerName.textContent = `${userObject.first_name} ${userObject.last_name}`;

    projectObject.role.forEach((tech) => {
        const element = document.createElement('button');
        element.classList.add('b');
        element.textContent = tech;
        buttonsContainer.appendChild(element);
    });
}

async function main() {
    try {
        const listingObject = await getListing(listingId);
        const userObject = await getUser(listingObject.lister);
        manipulateElements(listingObject.listed_project, userObject);
        getAndFilterApplications(listingObject);
    } catch (err) {
        console.error(err);
    }
}

main();
