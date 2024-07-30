let editMode = false;

/* On Page Load */
function onload() {
    var accessLevel = localStorage.getItem('accessLevel');
    var userNameElement = document.getElementById('userName');
    var userRoleElement = document.getElementById('userRole');
    
    if (accessLevel === '1') {
        userNameElement.textContent = 'Rurt Kich';
        userRoleElement.textContent = 'Admin';
    } else if (accessLevel === '0') {
        var studentData = JSON.parse(localStorage.getItem('studentData'));
        if (studentData && studentData.givenName && studentData.surname) {
            userNameElement.textContent = studentData.givenName + ' ' + studentData.surname;
            userRoleElement.textContent = 'Student';
        }
    }
console.log("Page loaded. Calling fetchStudentData.");
    fetchStudentData();  // Ensure this is called
    // Set the toggle switch to off when the page loads
    document.getElementById('editToggle').checked = false;
    document.querySelector(".edit-mode").style.display = "none";
     
}

/* Fetch Student Data */
function fetchStudentData() {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "fetch_students.php", true);
    xhr.onreadystatechange = function() {
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
            var response = JSON.parse(this.responseText);
            if (Array.isArray(response) && response.length > 0) {
                populateTable(response);
            } else {
                console.log("No students to display.");
            }
        } else if (this.readyState === XMLHttpRequest.DONE) {
            console.error('Failed to load data: ', this.status, this.statusText);
        }
    };
    xhr.send();
}

/* Populate the Table with Data */
function populateTable(students) {
    var tableBody = document.querySelector("#studentTable tbody");
    tableBody.innerHTML = "";

    students.forEach(function(student) {
        var row = tableBody.insertRow();
        row.dataset.id = student.id; // Add student ID as data attribute

        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        var cell4 = row.insertCell(3);

        cell1.textContent = student.firstName;
        cell2.textContent = student.lastName;
        cell3.textContent = student.year;
        cell4.textContent = student.tier;

        if (editMode) {
            cell1.contentEditable = "true";
            cell2.contentEditable = "true";
            cell3.contentEditable = "true";
            cell4.contentEditable = "true";
        }
    });
}

/* Toggle Edit Mode */
function toggleEditMode() {
    editMode = !editMode;
    document.querySelector(".edit-mode").style.display = editMode ? "inline-block" : "none";
    fetchStudentData();
}

/* Save Changes to the Database */
function saveChanges() {
    console.log("saveChanges function called");

    var table = document.getElementById("studentTable");
    var students = [];

    for (var i = 1, row; row = table.rows[i]; i++) {
        var student = {
            id: row.dataset.id,
            firstName: row.cells[0].textContent.trim(),
            lastName: row.cells[1].textContent.trim(),
            studentYear: row.cells[2].textContent.trim(),
            tier: row.cells[3].textContent.trim()
        };
        students.push(student);
    }

    console.log("Student data to be sent:", students);

    var xhr = new XMLHttpRequest();
    xhr.open("POST", "save_changes_students.php", true);
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onreadystatechange = function() {
        console.log("Ready state change: ", this.readyState);

        if (this.readyState === XMLHttpRequest.DONE) {
            console.log("XHR status: ", this.status);
            console.log("XHR response: ", this.responseText);

            if (this.status === 200) {
                var response = JSON.parse(this.responseText);
                if (response.status === 'success') {
                    alert(response.message);
                } else {
                    alert('Error: ' + response.message);
                }
            } else {
                alert('Failed to save changes. Please try again later.');
            }
        }
    };

    xhr.onerror = function() {
        console.error("Request failed");
        alert('Failed to save changes. Please try again later.');
    };

    xhr.send(JSON.stringify(students));
}

/* Show Help Modal */
function showHelp() {
    document.getElementById("helpModal").style.display = "block";
}

/* Close Help Modal */
function closeHelp() {
    document.getElementById("helpModal").style.display = "none";
}

/* Search Table Functionality */
function searchTable() {
    var input, filter, table, tr, td, i, j, txtValue;
    input = document.getElementById("searchInput");
    filter = input.value.toUpperCase();
    table = document.getElementById("studentTable");
    tr = table.getElementsByTagName("tr");

    for (i = 1; i < tr.length; i++) {
        tr[i].style.display = "none";

        for (j = 0; j < tr[i].getElementsByTagName("td").length; j++) {
            td = tr[i].getElementsByTagName("td")[j];
            if (td) {
                txtValue = td.textContent || td.innerText;
                if (txtValue.toUpperCase().indexOf(filter) > -1) {
                    tr[i].style.display = "";
                    break;
                }
            }
        }
    }
}

/* Sort Table Functionality */
function sortTable(n) {
    var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
    table = document.getElementById("studentTable");
    switching = true;
    dir = "asc"; // Set the sorting direction to ascending

    while (switching) {
        switching = false;
        rows = table.rows;

        for (i = 1; i < (rows.length - 1); i++) {
            shouldSwitch = false;
            x = rows[i].getElementsByTagName("TD")[n];
            y = rows[i + 1].getElementsByTagName("TD")[n];

            if (dir == "asc") {
                if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                    shouldSwitch = true;
                    break;
                }
            } else if (dir == "desc") {
                if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
                    shouldSwitch = true;
                    break;
                }
            }
        }

        if (shouldSwitch) {
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
            switchcount++;
        } else {
            if (switchcount == 0 && dir == "asc") {
                dir = "desc";
                switching = true;
            }
        }
    }
}

/* Initialize on page load */
window.onload = onload;
