const projectName = document.getElementById('project-name');
const ownerName = document.getElementById('owner-name');
const ownerId = document.getElementById('owner-id');
const members = document.getElementById('members');
const projectDescription = document.getElementById('project-description');
const projectCategory = document.getElementById('project-category');
const projectPhase = document.getElementById('project-phase');
const projectStatus = document.getElementById('project-status');
const buttonsContainer = document.getElementById('buttons-container');
const applyBtn = document.getElementById('send-application-btn');

const listingId = localStorage.getItem('listing-id');
const currentUsername = localStorage.getItem('username');

function popError(mssg) {
    Swal.fire({
        title: 'Oops...',
        text: mssg,
        icon: 'error'
    })
}

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

function apply(listingObject, userObject) {
    if (listingObject.lister === userObject.username) {
        popError(`Can't apply to your own project`);
        return;
    }
    let date = new Date();
    const applicationObject = {
        'applicant': userObject.username,
        'applied_project': listingObject.listed_project.id,
        'applied_role': null,
        'status': null,
        'date': `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
    }

    fetch(`http://localhost:8080/Api/Application/Add/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'charset': 'utf-8'
        },
        body: JSON.stringify(applicationObject)
    })
    .then((response) => {
        if (!response.ok) { 
            throw new Error('Fetch Error');
        } else {
            return response.json();
        }
    })
    .then((data) => {
        console.log(data);
    })
    .catch((error) => {
        popError(error.message);
    })
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
        applyBtn.addEventListener('click', (event) => {
            event.preventDefault();
            Swal.fire({
                icon: 'question',
                title: "Click 'Confirm' to apply for this project",
                showCancelButton: true,
                confirmButtonText: "Confirm",
            }).then((result) => {
                if (result.isConfirmed) {
                    try {
                        apply(listingObject, userObject);
                        Swal.fire("Applied!", "", "success");
                    } catch(error) {
                        popError(error.message);
                    }
                }
            });
        })
    } catch (err) {
        console.error(err);
    }
}

main();