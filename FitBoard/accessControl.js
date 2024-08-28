/*
function checkAccessLevel() {
    const accessLevel = parseInt(localStorage.getItem("accessLevel"), 10);

    // Check if the access level is for a student
    if (accessLevel === 0) {
        // Retrieve studentData from localStorage and parse it
        const studentData = JSON.parse(localStorage.getItem('studentData'));
        // Extract studentId from studentData
        const studentId = studentData ? studentData.studentId : null;

        if (studentId) {
            // Verify the studentId in the database via an API request
            verifyStudentInDatabase(studentId).then(function(isValid) {
                if (!isValid) {
                    alert('Student not found in the database. Redirecting to the landing page.');
                    window.location.href = '../LandingPage.html';
                }
            }).catch(function(error) {
                console.error("Error verifying student:", error);
                alert('An error occurred. Redirecting to the landing page.');
                window.location.href = '../LandingPage.html';
            });
        } else {
            alert('No student ID found. Redirecting to the landing page.');
            window.location.href = '../LandingPage.html';
        }

    } else {
        alert('Invalid access level. Redirecting to the landing page.');
        window.location.href = '../LandingPage.html';
    }
}

function verifyStudentInDatabase(studentId) {
    return new Promise(function(resolve, reject) {
        // Perform an AJAX request to check if the student exists in the database
        fetch('../verifyStudent.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ studentId: studentId })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                resolve(true);  // Student exists
            } else {
                resolve(false);  // Student does not exist
            }
        })
        .catch(error => {
            reject(error);  // Handle error
        });
    });
}
