const collabedProjectsContainer = document.getElementById('collabed-projects');
const appliedProjectsContainer = document.getElementById('applied-projects');

const currentUsername = localStorage.getItem('username');

function viewProject(object) {
    localStorage.setItem('listing-id', object.id);
    localStorage.setItem('project-id', object.listed_project.id);
    if (currentUsername === object.lister) {
        window.location.href = '../Owner-Project-Page/index.html';
    } else {
        window.location.href = '../Collaborator-Project-Page/index.html';
    }
}

function displayProject(object, container) {
    const smallRectangleDiv = document.createElement('div');
    const projectTitle = document.createElement('span');
    const dateDiv = document.createElement('div');
    const viewButton = document.createElement('button');
    const lineDiv = document.createElement('div');

    smallRectangleDiv.classList.add('small-rectangle');
    projectTitle.classList.add('Eco-shop');
    dateDiv.classList.add('date');
    viewButton.classList.add('b');
    lineDiv.classList.add('line');

    projectTitle.textContent = object.listed_project.name;
    dateDiv.textContent = object.date;
    viewButton.textContent = 'View';
    viewButton.addEventListener('click', () => {
        viewProject(object)
    });

    container.appendChild(smallRectangleDiv);
    container.appendChild(projectTitle);
    container.appendChild(dateDiv);
    container.appendChild(viewButton);
    container.appendChild(lineDiv);
}

function getProject(id) {
    return new Promise((resolve, reject) => {
        fetch(`http://localhost:8080/Api/Project/${id}/`, {
            method: 'GET',
            headers: {
                'Content-Type':'application/json',
                'charset':'utf-8'
            }
        })
        .then((response) => {
            if (!response.ok) {
                reject(response);
            } else {
                return response.json();
            }
        })
        .then((data) => {
            resolve(data);
        })
        .catch((error) => {
            reject(error);
        })
    })
}

async function displayAppliedProject(object, container) {
    const smallRectangleDiv = document.createElement('div');
    const projectTitle = document.createElement('span');
    const dateDiv = document.createElement('div');
    const viewButton = document.createElement('button');
    const lineDiv = document.createElement('div');

    smallRectangleDiv.classList.add('small-rectangle');
    projectTitle.classList.add('Eco-shop');
    dateDiv.classList.add('date');
    viewButton.classList.add('b');
    lineDiv.classList.add('line');

    try {
        const projectObject = await getProject(object.applied_project);
        projectTitle.textContent = projectObject.name;
        dateDiv.textContent = object.date;
        viewButton.textContent = 'View';
        viewButton.addEventListener('click', viewProject(object));
    } catch (error) {
        console.log(error);
        return;
    }

    container.appendChild(smallRectangleDiv);
    container.appendChild(projectTitle);
    container.appendChild(dateDiv);
    container.appendChild(viewButton);
    container.appendChild(lineDiv);
}

function processListing(listings) {
    listings.forEach((listing) => {
        if (listing.lister === currentUsername) {
            displayProject(listing, collabedProjectsContainer);
        } else {
            listing.listed_project.collaborator.forEach((collaborator) => {
                if (collaborator === currentUsername) {
                    displayProject(listing, collabedProjectsContainer);
                }
            })
        }
    })
}

function processApplications(applications) {
    applications.forEach((application) => {
        if (application.applicant === currentUsername) {
            displayAppliedProject(application, appliedProjectsContainer);
        }
    })
}

fetch('http://localhost:8080/Api/Listing/All/', {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
        'charset': 'utf-8'      
    }
})
.then((response) => {
    if (!response.ok) {
        throw new Error(response);
    } else {
        return response.json();
    }
})
.then((data) => {
    processListing(data);
})
.catch((error) => {
    console.log(error);
})