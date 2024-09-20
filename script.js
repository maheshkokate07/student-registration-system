const addButton = document.getElementById("add-button");
// Storing studentId to detect if editing is happening.
let editingStudentId = null;        
window.onload = loadStudents;

addButton.addEventListener("click", addOrUpdateStudent);

// Function for add or update the student.
function addOrUpdateStudent() {     

    const studentName = document.getElementById("student-name").value.trim();
    const studentId = document.getElementById("student-id").value.trim();
    const studentEmail = document.getElementById("student-email").value.trim();
    const studentContact = document.getElementById("student-contact").value.trim();

    const alphaExp = /^[a-zA-Z]+$/;

    // Check user can only enter characters into name feild.
    if(!studentName.match(alphaExp)) {
        alert("Please enter characters only into name field");
        return;
    }
    if (studentName == "" || studentId == "" || studentEmail == "" || studentContact == "") {
        alert("All fields are mandatory");
        return;
    }

    // Getting students array from localstorage.
    let students = JSON.parse(localStorage.getItem('students')) || [];      

    // If student editing is happening then execute this block of code.
    if(editingStudentId) {      
        students = students.map(student => {
            if(student.studentId == editingStudentId) {
                return { studentName, studentId, studentEmail, studentContact };
            }
            return student;
        })
        // After editing set studentId to null.
        editingStudentId = null;    
        document.getElementById("student-id").disabled = false;    
        addButton.innerHTML = "Add";
    } else {
        // Getting all id's of students from local storage to insue that duplicate entry should not be happen.
        const allId = students.map((s) => {return s.studentId});
        if(allId.includes(studentId)) {
            alert("Student with this ID already exist");
            return;
        }
    
        const student = { studentName, studentId, studentEmail, studentContact };
        students.push(student);
    }

    // Setting students array to local storage.
    localStorage.setItem('students', JSON.stringify(students));

    loadStudents();

    // Setting all inputs null after adding the student.
    document.getElementById("student-name").value = "";
    document.getElementById("student-id").value = "";
    document.getElementById("student-email").value = "";
    document.getElementById("student-contact").value = "";
}

// Function for loading the students after page reload.
function loadStudents() {
    const students = JSON.parse(localStorage.getItem('students'));
    document.getElementById("student-records").innerHTML = "";

    // Creating the entire div for each student.
    students.forEach(s => {
        const div = document.createElement('div');
        const studentName = document.createElement('p');
        studentName.innerHTML = s.studentName;
        const studentId = document.createElement('p');
        studentId.classList.add("studentId");
        studentId.innerHTML = s.studentId;
        const studentEmail = document.createElement('p');
        studentEmail.innerHTML = s.studentEmail;
        const studentContact = document.createElement('p');
        studentContact.innerHTML = s.studentContact;

        const editButton = document.createElement("button");
        editButton.innerHTML = '<i class="fa-solid fa-pen"></i>';

        editButton.addEventListener("click", editStudent);

        const deleteButton = document.createElement("button");
        deleteButton.innerHTML = '<i class="fa-solid fa-trash"></i>';

        deleteButton.addEventListener("click", deleteStudent);

        deleteButton.classList.add("deleteButton");
        editButton.classList.add("editButton");

        div.appendChild(studentName);
        div.appendChild(studentId);
        div.appendChild(studentEmail);
        div.appendChild(studentContact);
        div.appendChild(editButton);
        div.appendChild(deleteButton);

        div.classList.add("list");

        document.getElementById("student-records").appendChild(div);
    });
}

function editStudent(e) {
    // Dynamically changing the text inside the add button when editing is happening.
    addButton.innerHTML = "Update"
    const item = e.target;
    let studentId = "";

    // Getting the student id by DOM traversing.
    if (item.classList.contains('fa-pen')) {
        studentId = item.closest('.editButton').parentElement.children[1].innerHTML.trim();
    } else if (item.classList.contains('editButton')) {
        studentId = item.parentElement.children[i].innerHTML.trim();
    }

    const students = JSON.parse(localStorage.getItem('students'));
    const student = students.find(s => s.studentId == studentId);

    if(student) {
        document.getElementById("student-name").value = student.studentName;
        document.getElementById("student-id").value = student.studentId;
        document.getElementById("student-email").value = student.studentEmail;
        document.getElementById("student-contact").value = student.studentContact;

        // Ensuring that while editing Student ID should be unchanged making student ID input disable.
        document.getElementById("student-id").disabled = true;
        editingStudentId = studentId;
    }
    
}

function deleteStudent(e) {
    const item = e.target;

    if (item.classList.contains('fa-trash')) {
        const studentId = item.closest('.deleteButton').parentElement.children[1].innerHTML.trim();
        removeStudent(studentId);
    } else if (item.classList.contains('deleteButton')) {
        const studentId = item.parentElement.children[i].innerHTML.trim();
        removeStudent(studentId);
    }
}

function removeStudent(id) {
    const students = JSON.parse(localStorage.getItem('students'));

    // Filtering the students having id != studentID that we want to delete from record.
    const newStudents = students.filter(student => student.studentId != id);
    localStorage.setItem('students', JSON.stringify(newStudents));
    loadStudents();
}
