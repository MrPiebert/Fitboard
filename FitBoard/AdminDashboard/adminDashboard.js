let editMode = false;

/* On Page Load */
function onload() {
    var accessLevel = localStorage.getItem('accessLevel');
    var userNameElement = document.getElementById('userName');
    var userRoleElement = document.getElementById('userRole');

    if (accessLevel === '1') {
        userNameElement.textContent = 'Rurt&#160Kich';
        userRoleElement.textContent = 'Admin';
    } else if (accessLevel === '0') {
        var studentData = JSON.parse(localStorage.getItem('studentData'));
        if (studentData && studentData.givenName && studentData.surname) {
            userNameElement.textContent = studentData.givenName + '\u00A0' + studentData.surname;
            userRoleElement.textContent = 'Student';
        }
    }

    fetchStudentData();
    document.getElementById('editToggle').checked = false;
    document.querySelector(".edit-mode").style.display = "none";
}

/* Fetch Student Data */
function fetchStudentData() {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "fetch_students.php", true);
    xhr.onreadystatechange = function () {
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
// Populate the Table with Data
function populateTable(students) {
    var tableBody = document.querySelector("#studentTable tbody");
    tableBody.innerHTML = "";

    students.forEach(function (student) {
        var row = tableBody.insertRow();
        row.dataset.id = student.id;

        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        var cell4 = row.insertCell(3);
        var cell5 = row.insertCell(4);
        var cell6 = row.insertCell(5); // New column for checkbox

        cell1.textContent = student.sbhs_id;
        cell2.textContent = student.firstName;
        cell3.textContent = student.lastName;
        cell4.textContent = student.studentYear;
        cell5.textContent = student.tier;

        // Create and add a checkbox

           // Create and add a checkbox
        var checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'student-checkbox';
        checkbox.value = student.id; // Set value to student ID
        cell6.appendChild(checkbox);

        if (editMode) {
            cell1.contentEditable = "true";
            cell2.contentEditable = "true";
            cell3.contentEditable = "true";
            cell4.contentEditable = "true";
            cell5.contentEditable = "true";

            // Add validation event listeners
            cell1.addEventListener('blur', validateSBHSId);
            cell2.addEventListener('blur', validateName);
            cell3.addEventListener('blur', validateName);
            cell4.addEventListener('blur', validateYear);
        }
    });
}

function filterTable() {
    // Get filter values
    var yearFilter = document.getElementById("filterYear").value;
    
    // Get the table and its rows
    var table = document.getElementById("studentTable");
    var rows = table.getElementsByTagName("tr");
    
    // Loop through all rows, skipping the header (index 0)
    for (var i = 1; i < rows.length; i++) {
        // Get the year cells from the current row
        var yearCell = rows[i].getElementsByTagName("td")[3]; // Assuming year is in column 4 (index 3)
    
        // Check if year cells exist (for safety)
        if (yearCell) {
            // Get the values from the cells, trimmed of extra spaces
            var year = yearCell.textContent.trim();
           

            // Check if the row matches the selected filters (empty means 'all')
            var yearMatch = (yearFilter === "" || year === yearFilter);

            // Display the row if both filters match, otherwise hide it
            if (yearMatch) {
                rows[i].style.display = "";
            } else {
                rows[i].style.display = "none";
            }
        }
    }
}

/* Validate SBHS ID */
function validateSBHSId(event) {
    const sbhsId = event.target.textContent.trim();
    const sbhsIdRegex = /^\d{9}$/;

    if (!sbhsIdRegex.test(sbhsId)) {
        event.target.style.border = "2px solid red"; // Add red border for invalid SBHS ID
        alert('SBHS ID must be exactly 9 digits.');
    } else {
        event.target.style.border = ""; // Remove border if valid
    }
}

/* Validate Name */
function validateName(event) {
    const name = event.target.textContent.trim();
    const nameRegex = /^[A-Z][A-Za-z\s-]*$/;

    if (!nameRegex.test(name)) {
        event.target.style.border = "2px solid red"; // Add red border for invalid name
        alert('Name must start with a capital letter and contain only letters, spaces, and hyphens.');
    } else {
        event.target.style.border = ""; // Remove border if valid
    }
}

/* Validate Year */
function validateYear(event) {
    const year = event.target.textContent.trim();
    const yearRegex = /^(7|8|9|10|11|12)$/;

    if (!yearRegex.test(year)) {
        event.target.style.border = "2px solid red"; // Add red border for invalid year
        alert('Year must be a number between 7 and 12.');
    } else {
        event.target.style.border = ""; // Remove border if valid
    }
}


/* Save Changes to the Database */
function saveChanges() {
    console.log("saveChanges function called");

    var table = document.getElementById("studentTable");
    var students = [];
    let isValid = true;
    let invalidRows = [];

    for (var i = 1, row; row = table.rows[i]; i++) {
        var student = {
            id: row.dataset.id,
            sbhs_id: row.cells[0].textContent.trim(),
            firstName: row.cells[1].textContent.trim(),
            lastName: row.cells[2].textContent.trim(),
            studentYear: row.cells[3].textContent.trim(),
            tier: row.cells[4].textContent.trim()
        };

        const errorMsg = validateStudentData(student);
        if (errorMsg) {
            invalidRows.push(i); // Track invalid rows
            alert('Validation error: ' + errorMsg);
            isValid = false; // Mark as invalid if any error
        } else {
            students.push(student);
        }
    }

    if (!isValid) {
        highlightInvalidRows(invalidRows);
        return; // Prevent sending data if validation fails
    }

    console.log("Student data to be sent:", students);

    var xhr = new XMLHttpRequest();
    xhr.open("POST", "save_changes_students.php", true);
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onreadystatechange = function () {
        console.log("Ready state change: ", this.readyState);

        if (this.readyState === XMLHttpRequest.DONE) {
            console.log("XHR status: ", this.status);
            console.log("XHR response: ", this.responseText);

            if (this.status === 200) {
                var response = JSON.parse(this.responseText);
                if (response.status === 'success') {
                    alert('Changes saved successfully.');
                } else {
                    alert('Error: ' + response.message);
                }
            } else {
                alert('Failed to save changes. Please try again later.');
            }
        }
    };

    xhr.onerror = function () {
        console.error("Request failed");
        alert('Failed to save changes. Please try again later.');
    };

    xhr.send(JSON.stringify(students));
}
/* Highlight Invalid Data */
function highlightInvalidRows(invalidRows) {
    var table = document.getElementById('studentTable');
    var rows = table.getElementsByTagName('tbody')[0].getElementsByTagName('tr');

    // Clear previous highlights
    for (var i = 1; i < rows.length; i++) {
        var cells = rows[i].getElementsByTagName('td');
        for (var j = 0; j < cells.length; j++) {
            cells[j].style.backgroundColor = ""; // Remove red background
        }
    }

    // Highlight invalid cells
    invalidRows.forEach(function(rowIndex) {
        var row = rows[rowIndex];
        var cells = row.getElementsByTagName('td');
        cells.forEach(function(cell) {
            cell.style.backgroundColor = "red"; // Apply red background to invalid cells
        });
    });
}



/* Toggle Edit Mode */
function toggleEditMode() {
    editMode = !editMode;
    document.querySelector(".edit-mode").style.display = editMode ? "inline-block" : "none";
    fetchStudentData();
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
    dir = "asc"; // Set the default sorting direction to ascending

    while (switching) {
        switching = false;
        rows = table.rows;

        for (i = 1; i < (rows.length - 1); i++) {
            shouldSwitch = false;
            x = rows[i].getElementsByTagName("TD")[n];
            y = rows[i + 1].getElementsByTagName("TD")[n];

            // Detect if the column contains numbers (e.g., Year)
            if (!isNaN(x.innerHTML) && !isNaN(y.innerHTML)) {
                // Convert strings to numbers for comparison
                xVal = parseInt(x.innerHTML);
                yVal = parseInt(y.innerHTML);
            } else {
                // Treat as strings for other columns
                xVal = x.innerHTML.toLowerCase();
                yVal = y.innerHTML.toLowerCase();
            }

            if (dir === "asc") {
                if (xVal > yVal) {
                    shouldSwitch = true;
                    break;
                }
            } else if (dir === "desc") {
                if (xVal < yVal) {
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
            if (switchcount === 0 && dir === "asc") {
                dir = "desc";
                switching = true;
            }
        }
    }
}


/* Validate Student Data */
function validateStudentData(student) {
    const sbhsIdRegex = /^\d{9}$/;
    const nameRegex = /^[A-Z][A-Za-z\s-]*$/;
    const yearRegex = /^(7|8|9|10|11|12)$/;

    let errorMsg = null;

    if (!sbhsIdRegex.test(student.sbhs_id)) {
        errorMsg = 'SBHS ID must be exactly 9 digits.';
    } else if (!nameRegex.test(student.firstName)) {
        errorMsg = 'First Name must start with a capital letter and contain only letters, spaces, and hyphens.';
    } else if (!nameRegex.test(student.lastName)) {
        errorMsg = 'Last Name must start with a capital letter and contain only letters, spaces, and hyphens.';
    } else if (!yearRegex.test(student.studentYear)) {
        errorMsg = 'Year must be a number between 7 and 12.';
    }

    return errorMsg;
}
function confirmDelete() {
    // Get all checked checkboxes
    var checkboxes = document.querySelectorAll('#studentTable tbody input[type="checkbox"]:checked');
    
    if (checkboxes.length === 0) {
        alert("No students selected for deletion.");
        return;
    }

    // Show confirmation dialog
    if (confirm("Are you sure you want to delete the selected students? This action cannot be undone.")) {
        let idsToDelete = [];
        
        checkboxes.forEach(function(checkbox) {
            idsToDelete.push(checkbox.value); // Collect IDs from checked checkboxes
        });
        
        console.log("IDs to delete:", idsToDelete); // For debugging

        // Call delete function with selected IDs
        deleteSelectedStudents(idsToDelete);
    }
}


function deleteSelectedStudents(ids) {
    fetch('delete_students.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ids: ids })
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            alert("Selected students have been deleted successfully.");
            // Refresh the student table to reflect changes
            fetchStudentData();
        } else {
            alert("Error deleting students: " + data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}



/* Initialize on page load */
window.onload = onload;
