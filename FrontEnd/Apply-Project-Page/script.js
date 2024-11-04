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
    });
}

async function getListing(id) {
    try {
        const response = await fetch(`http://localhost:8080/Api/Listing/${id}/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'charset': 'utf-8'
            }
        });
        if (!response.ok) {
            throw new Error('Error fetching project');
        }
        return await response.json();
    } catch (error) {
        popError(error.message);
        throw error;
    }
}

async function getUser(id) {
    try {
        const response = await fetch(`http://localhost:8080/Api/User/${id}/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'charset': 'utf-8'
            }
        });
        if (!response.ok) {
            throw new Error('Error fetching user');
        }
        return await response.json();
    } catch (error) {
        popError(error.message);
        throw error;
    }
}

async function checkAllApplications(applicantId, projectId) {
    try {
        const response = await fetch(`http://localhost:8080/Api/Application/All/User/?Applicant=${applicantId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'charset': 'utf-8'
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error fetching applications');
        }

        const applications = await response.json();
        applications.forEach((application) => {
            if (application.applicant === applicantId && application.applied_project === projectId) {
                const error = new Error('Duplicate application');
                error.message = 'You cannot apply to this project more than once';
                throw error;
            }
        })
        return true;

    } catch (error) {
        console.error('Error:', error.message);
        throw new Error(error.message);
    }
}

async function applyToProject(object) {
    try {
        await checkAllApplications(object.applicant, object.applied_project);
        const response = await fetch(`http://localhost:8080/Api/Application/Add/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'charset': 'utf-8'
            },
            body: JSON.stringify(object)
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Fetch Error');
        }
        return await response.json();
    } catch (error) {
        popError(error.message);
        throw error;
    }
}

async function apply(listingObject, userObject) {
    if (listingObject.lister === userObject.username) {
        console.log('COULD NOT APPLY');
        popError("Can't apply to your own project");
        return;
    }

    const date = new Date();
    const applicationObject = {
        'applicant': userObject.username,
        'applied_project': listingObject.listed_project.id,
        'applied_role': null,
        'status': null,
        'date': `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
    };

    return applyToProject(applicationObject);
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
        const userObject = await getUser(currentUsername);
        manipulateElements(listingObject.listed_project, userObject);

        applyBtn.addEventListener('click', (event) => {
            event.preventDefault();

            Swal.fire({
                icon: 'question',
                title: "Click 'Confirm' to apply for this project",
                showCancelButton: true,
                confirmButtonText: "Confirm",
            }).then(async (result) => {
                if (result.isConfirmed) {
                    try {
                        const applicationStatus = await apply(listingObject, userObject);
                        console.log("Application Status:", applicationStatus);
                        if (applicationStatus) {
                            Swal.fire("Applied!", "", "success");
                        }
                    } catch (error) {
                        popError(error.message);
                    }
                }
            });
        });
    } catch (err) {
        console.error("Error in main function:", err);
    }
}

main();
