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
    return fetch(`http://localhost:8080/Api/Listing/${id}/`, { method: 'GET', headers: { 'Content-Type': 'application/json' } })
        .then(response => {
            if (!response.ok) throw new Error('Error fetching project');
            return response.json();
        });
}

function getUser(id) {
    return fetch(`http://localhost:8080/Api/User/${id}/`, { method: 'GET', headers: { 'Content-Type': 'application/json' } })
        .then(response => {
            if (!response.ok) throw new Error('Error fetching user');
            return response.json();
        });
}

function addApplication(application) {
    return getUser(application.applicant).then(userObject => {
        const smallRectangle = document.createElement('div');
        const nameSpan = document.createElement('span');
        const dateDiv = document.createElement('div');
        const viewButton = document.createElement('button');
        const lineDiv = document.createElement('div');

        // Set class names
        smallRectangle.classList.add('small-rectangle');
        nameSpan.classList.add('name');
        dateDiv.classList.add('date');
        viewButton.classList.add('c');
        lineDiv.classList.add('line');

        // Set text contents
        nameSpan.textContent = `${userObject.first_name} ${userObject.last_name}`;
        dateDiv.textContent = application.date;
        viewButton.textContent = "View";

        // Add click listener
        viewButton.addEventListener('click', (event) => {
            event.preventDefault();
            localStorage.setItem('applicant-username', userObject.username);
            localStorage.setItem('application-id', application.id); 
            window.location.href = '../Applicant-Profile/index.html';
        });

        // Append elements to smallRectangle and then to the container
        smallRectangle.appendChild(nameSpan);
        smallRectangle.appendChild(dateDiv);
        smallRectangle.appendChild(viewButton);
        smallRectangle.appendChild(lineDiv);
        applicationsContainer.appendChild(smallRectangle);
    }).catch(error => {
        console.error(error);
    });
}

function getAndFilterApplications(listingObject) {
    fetch(`http://localhost:8080/Api/Application/All/Project/?ProjectId=${listingObject.listed_project.id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    })
    .then(response => {
        if (!response.ok) throw new Error('Error fetching applications');
        return response.json();
    })
    .then(data => {
        data.forEach(application => {
            if (application.applied_project === listingObject.listed_project.id) {
                addApplication(application);
            }
        });
    })
    .catch(error => {
        console.error(error);
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
        console.error('Error in main function:', err);
    }
}

main();
