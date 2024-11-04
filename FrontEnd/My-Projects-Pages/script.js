const collabedProjectsContainer = document.getElementById('collabed-projects');
const appliedProjectsContainer = document.getElementById('applied-projects');
const currentUsername = localStorage.getItem('username');

function viewProject(object) {
    localStorage.setItem('listing-id', object.id);
    localStorage.setItem('project-id', object.listed_project.id);
    if (currentUsername === object.lister) {
        window.location.href = '../Owner-Project-Page/index.html';
    } else {
        window.location.href = '../Apply-Project-Page/index.html';
    }
}

function displayProject(object, date, container) {
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
    dateDiv.textContent = date;
    viewButton.textContent = 'View';
    viewButton.addEventListener('click', (event) => {
        event.preventDefault();
        viewProject(object);
    });

    smallRectangleDiv.appendChild(projectTitle);
    smallRectangleDiv.appendChild(dateDiv);
    smallRectangleDiv.appendChild(viewButton);
    smallRectangleDiv.appendChild(lineDiv);

    container.appendChild(smallRectangleDiv);
}

async function displayAppliedProject(object, name, date, container) {
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

    projectTitle.textContent = name;
    dateDiv.textContent = date;
    viewButton.textContent = 'View';
    viewButton.addEventListener('click', (event) => {
        event.preventDefault();
        viewProject(object);
    });

    smallRectangleDiv.appendChild(projectTitle);
    smallRectangleDiv.appendChild(dateDiv);
    smallRectangleDiv.appendChild(viewButton);
    smallRectangleDiv.appendChild(lineDiv);

    container.appendChild(smallRectangleDiv);
}

function processListing(listings) {
    listings.forEach((listing) => {
        if (listing.lister === currentUsername) {
            displayProject(listing, listing.date, collabedProjectsContainer);
        } else {
            listing.listed_project.collaborator.forEach((collaborator) => {
                if (collaborator === currentUsername) {
                    displayProject(listing, listing.date, collabedProjectsContainer);
                }
            });
        }
    });
}

function getAllListings() {
    return fetch(`http://localhost:8080/Api/Listing/All/`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'charset': 'utf-8'
        }
    })
    .then(async (response) => {
        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.message);
        }
        return response.json();
    });
}

function getListing(projectId) {
    return getAllListings()
        .then((allListings) => {
            const listing = allListings.find(listing => listing.listed_project.id === projectId);
            if (listing) return listing;
            else throw new Error("Listing not found");
        });
}

async function processApplications(applications) {
    for (const application of applications) {
        try {
            const listingObject = await getListing(application.applied_project);
            displayAppliedProject(listingObject, listingObject.listed_project.name, application.date, appliedProjectsContainer);
        } catch (error) {
            console.error(`Error processing application: ${error}`);
        }
    }
}

async function main() {
    try {
        const listings = await getAllListings();
        processListing(listings);
    } catch (error) {
        console.error(`Error fetching listings: ${error}`);
    }

    try {
        const response = await fetch(`http://localhost:8080/Api/Application/All/User/?Applicant=${currentUsername}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'charset': 'utf-8'
            }
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Fetch Error');
        }
        const applications = await response.json();
        processApplications(applications);
    } catch (error) {
        console.error(`Error fetching applications: ${error}`);
    }
}

main();
