const addProjectBtn = document.getElementById('add-project');
addProjectBtn.addEventListener('click', () => {
    window.location.href = '../Project-Pages/add-project.html';
})

const projectsContainer = document.getElementById('projects-container');
const domain = localStorage.getItem('current-domain');
const projectIDs = [];

function popError(message) {
    Swal.fire({
        icon: "error",
        title: "Oops...",
        text: message,
        timer: 5000,
        confirmButtonText: 'Alright'
    });
}

function getName(id) {
    return new Promise((resolve, reject) => {
        fetch(`http://localhost:8080/Api/User/${id}/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error('Reponse Error');
            } else {
                return response.json();
            }
        })
        .then((data) => {
            resolve(`${data.first_name} ${data.last_name}`);
        })
        .catch((error) => {
            reject(error);
        })
    })
}

async function loadProject(object) {
    const projectObject = object.listed_project;
    const ownerUsername = object.lister;

    const project = document.createElement('div');
    const topPortion = document.createElement('div');
    const profileCircle = document.createElement('div');
    const ownerInfo = document.createElement('div');
    const ownerID = document.createElement('p');
    const ownerName = document.createElement('h2');
    const midPortion = document.createElement('div');
    const projectName = document.createElement('h2');
    const projectDescription = document.createElement('p');
    const bottomPortion = document.createElement('div');
    const requiredSkills = document.createElement('ul');
    const learnMoreBtn = document.createElement('button');

    project.classList.add('project');
    topPortion.classList.add('top-portion');
    profileCircle.classList.add('profile-circle');
    ownerInfo.classList.add('owner-info');
    ownerID.classList.add('owner-id');
    ownerName.classList.add('owner-name');
    midPortion.classList.add('mid-portion');
    projectName.classList.add('project-name');
    projectDescription.classList.add('project-description');
    bottomPortion.classList.add('bottom-portion');
    requiredSkills.classList.add('required-skills');
    learnMoreBtn.classList.add('learn-more-btn');

    ownerID.textContent = '@' + ownerUsername;
    try {
        ownerName.textContent = await getName(ownerUsername);
    } catch (error) {
        popError(error);
        return;
    }
    projectIDs.push(projectObject.id);
    projectName.textContent = projectObject.name;
    projectDescription.textContent = projectObject.description;
    projectObject.role.forEach((tech) => {
        let listItem = document.createElement('li');
        listItem.textContent = tech;
        requiredSkills.appendChild(listItem);
    });
    learnMoreBtn.textContent = 'Learn More';
    learnMoreBtn.addEventListener('click', (event) => {
        event.preventDefault();
        localStorage.setItem('listing-id', object.id);
        window.location.href = '../Apply-Project-Page/index.html';
    })

    topPortion.appendChild(profileCircle);
    ownerInfo.appendChild(ownerID);
    ownerInfo.appendChild(ownerName);
    topPortion.appendChild(ownerInfo);
    midPortion.appendChild(projectName);
    midPortion.appendChild(projectDescription);
    bottomPortion.appendChild(requiredSkills);
    bottomPortion.appendChild(learnMoreBtn);
    project.appendChild(topPortion);
    project.appendChild(midPortion);
    project.appendChild(bottomPortion);
    projectsContainer.appendChild(project);
}

function filterList(list) {
    list.forEach(listItem => {
        if (listItem.listed_project.domain === domain) {
            loadProject(listItem);
        }
    });
}

fetch('http://localhost:8080/Api/Listing/All/', {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json'
    }
})
.then((response) => {
    if (!response.ok) {
        throw new Error('Error while fetching');
    }
    return response.json();
})
.then((data) => {
    // console.log(data);
    filterList(data);
})
.catch((error) => {
    console.log(error);
})