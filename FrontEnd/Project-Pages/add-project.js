const form = document.getElementById('form');
const title = document.getElementById('title');
const category = document.getElementById('category');
const description = document.getElementById('Description-size');
const techBtns = document.querySelectorAll('.tech');
const privacyBtns = document.querySelectorAll('.privacy-status');
const projectBtns = document.querySelectorAll('.project-status');
const submitBtn = document.getElementById('submit');
const homeBtn = document.getElementById('home');

homeBtn.addEventListener('click', (event) => {
    event.preventDefault();
    window.location.replace('../home.html');
})

const techStack = [null, null, null];
const privacyValues = ['private', 'public'];
const projectValues = ['research', 'design', 'development'];
let selectedPrivacy;
let selectedProjectStatus;


function popError(message) {
    Swal.fire({
        icon: "error",
        title: "Oops...",
        text: message,
        timer: 5000,
        confirmButtonText: 'Alright'
    });
}

form.addEventListener('submit', (event) => {
    event.preventDefault();
    handleSubmission();
})
submitBtn.addEventListener('click', (event) => {
    event.preventDefault();
    handleSubmission();
});

function handleSubmission() {
    let execute = true;
    const titleInput = title.value;
    const categoryInput = category.value;
    const descriptionInput = description.value;

    if (titleInput === '') {
        popError('Enter TITLE');
        execute = false;
    } else if (categoryInput === '') {
        popError('Select CATEGORY');
        execute = false;
    } else if (descriptionInput === '') {
        popError('Enter DESCRIPTION');
        execute = false;
    } else if (!selectedPrivacy) {
        popError("Select either of the PRIVACY STATUS'");
        execute = false;
    } else if (!selectedProjectStatus) {
        popError("Select any of the PROJECT STATUS'");
        execute = false;
    } else if (!techStack[0] && !techStack[1] && !techStack[2]) {
        popError('Enter atleast one technology in the TECH-STACK');
        execute = false;
    }

    if (execute) {
        postThings(titleInput, categoryInput, descriptionInput);
    }
}

function postThings(title, category, description) {
    let listOfRoles = [];
    techStack.forEach((element) => {
        if (element) {
            listOfRoles.push(element);
        }
    });

    const ownerID = localStorage.getItem('username');
    const today = new Date();
    const date = today.getDate() + '/' + (today.getMonth() + 1) + '/' + today.getFullYear();

    if (!ownerID) {
        console.log('NO USERNAME FOUND');
        return;
    }

    let projectObject = {
        'collaborator': [],
        'name': title,
        'description': description,
        'aim': null,
        'status': selectedProjectStatus,
        'privacy_status': selectedPrivacy,
        'scope': null,
        'domain': category,
        'role': listOfRoles,
        'category': null
    }

    let listingObject = {
        'listed_project': projectObject,
        'lister': ownerID,
        'date': date
    }

    fetch('http://localhost:8080/Api/Listing/Add/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'charset': 'utf-8'
        },
        body: JSON.stringify(listingObject)
    })
    .then((response) => {
        if (!response.ok) {
            return response.json().then((errorData) => {
                throw new Error(`Error ${response.status}: ${errorData.message}`);
            });
        }
        return response.json();
    })
    .then((data) => {
        redirectToPrevious();
        console.log(data);
    })
    .catch((error) => {
        popError(error.message);
    });
    
}

function redirectToPrevious() {
    window.location.replace(document.referrer);
}

function choosePrivacyBtn(index, chosenBtn, notChosenBtn) {
    notChosenBtn.classList.remove('selected');
    chosenBtn.classList.add('selected');
    selectedPrivacy = privacyValues[index];
}

function chooseProjectBtn(index, chosenBtn, notChosenBtn1, notChosenBtn2) {
    notChosenBtn1.classList.remove('selected');
    notChosenBtn2.classList.remove('selected');
    chosenBtn.classList.add('selected');
    selectedProjectStatus = projectValues[index];
}

privacyBtns[0].addEventListener('click', (event) => {
    event.preventDefault();
    choosePrivacyBtn(0, privacyBtns[0], privacyBtns[1]);
});
privacyBtns[1].addEventListener('click', (event) => {
    event.preventDefault();
    choosePrivacyBtn(1, privacyBtns[1], privacyBtns[0]);
});

projectBtns[0].addEventListener('click', (event) => {
    event.preventDefault();
    chooseProjectBtn(0, projectBtns[0], projectBtns[1], projectBtns[2]);
});
projectBtns[1].addEventListener('click', (event) => {
    event.preventDefault();
    chooseProjectBtn(1, projectBtns[1], projectBtns[0], projectBtns[2]);
});
projectBtns[2].addEventListener('click', (event) => {
    event.preventDefault();
    chooseProjectBtn(2, projectBtns[2], projectBtns[0], projectBtns[1]);
});

function craftButton(button, idx) {
    button.classList.add('A');
    button.classList.add('tech');

    button.addEventListener('click', (event) => {
        // Kill button
        const currentText = button.textContent;
        const techInput = document.createElement('input');
        techInput.setAttribute('type', 'text');
        techInput.textContent = currentText === 'add' ? '' : currentText;
        techInput.classList.add('tech');
        button.replaceWith(techInput);
        techInput.focus();

        techInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === 'Escape') {
                killInput(techInput, idx);
            }
        });
    })
}

function killInput(techInput, idx) {
    const newBtn = document.createElement('button');
    if (techInput.value === '') {
        techStack[idx] = null;
        newBtn.innerHTML = '<i>add</i>';
    } else {
        techStack[idx] = techInput.value;
        newBtn.textContent = techStack[idx];
    }
    newBtn.classList.add('tech');
    newBtn.classList.add('A');
    techInput.replaceWith(newBtn);
    craftButton(newBtn);
}

techBtns.forEach((button, idx) => {
    craftButton(button, idx);
})