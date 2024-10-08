<!DOCTYPE html>

<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<title>FitBoard</title>
	<meta name="description" content="">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<link rel="stylesheet" href="Profile.css">
	<link rel="shortcut icon" type="image/x-icon" href="favicon.ico" />
	<link rel="icon" href="../favicon.ico">
	<link href="https://fonts.googleapis.com/css?family=Montserrat:500&display=swap" rel="stylesheet">
	<link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel='stylesheet'>
	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.14.0/css/all.min.css">
	<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.2/css/fontawesome.min.css">
	<link rel="stylesheet" href="../cropperjs/cropper.css">

</head>

<body>

	<!-- Sidebar -->
	<div class="sidebar">
		<!-- Top Bar -->

		<div class="top">
			<div class="logo">
				<img src="../Images/Logo.png" alt="logo" width="50px" height="50px">
                    <span>FITBOARD</span>
                </div>
                <i class='bx bx-menu' id="btn"></i>
            </div>

         

             <!-- User Profile Section -->
     <div class="user">
            <img src="../Images/User_Image.jpg" alt="profile picture" class="User_Image" id="userImage">
            <div>
                <p class="bold" id="userName">Default&#160User</p>
                <p id="userRole">Admin</p>
            </div>
        </div>
   <!-- Navigation Links -->
           <!-- Navigation Links -->
<ul>
                <li>
                    <a href="../Home_Page/Home_Page.html">
                        <i class="bx bxs-grid-alt"></i>
                        <span class="Nav_Item">Dashboard</span>
                    </a>
                    <span class="tooltip">Dashboard</span>
                </li>
                <li>
                    <a href="../Profile/Profile.html">
                        <i class="bx bxs-user-circle"></i>
                        <span class="Nav_Item">Profile</span>
                    </a>
                    <span class="tooltip">Profile</span>
                </li>
                
                <li>
                    <a href="../Notifications/StudentNotifications.html">
                        <i class="bx bxs-bell-ring"></i>
                        <span class="Nav_Item">Notifications</span>
                    </a>
                    <span class="tooltip">Notifications</span>
                </li>
                <li>
                    <a href="../Upload_Video/Videos.html">
                        <i class="bx bxs-video"></i>
                        <span class="Nav_Item">Video&#160Tutorials</span>
                    </a>
                    <span class="tooltip">Video&#160Tutorials</span>
                </li>
                <li>
                    <a href="../Settings/Settings.html">
                        <i class="bx bxs-cog"></i>
                        <span class="Nav_Item">Settings</span>
                    </a>
                    <span class="tooltip">Settings</span>
                </li>
                <li>
                    <a href="../Help/Help.html">
                        <i class="bx bxs-help-circle"></i>
                        <span class="Nav_Item">Help</span>
                    </a>
                    <span class="tooltip">Help</span>
                </li>
                <li>
        <a id="logoutLink" href="#" onclick="logout()">
            <i class="bx bxs-log-out"></i>
            <span class="Nav_Item">Logout</span>
        </a>
        <span class="tooltip">Logout</span>
    </li>
            </ul>

        </div>

    <!-- Main Content -->
        <div class="main_content">
            <div class="container" id="container">
                <h1 id="main-heading">FitBoard</h1>
                <h1 id="sub-heading">Profile</h1>
                <h3>&#160&#160Profile</h3>     
            </div>

             <div class="name">
          <p class="bold" id="studentName">Default User</p>
      </div>

      <div class="info">
          <ul style="list-style-type: none;">
              <li>
                  <span class="Student_ID"><span class="bold">Student ID</span></br><span id="studentId">442240175</span></span>
              </li>
              </br>
              <li>
                  <span class="Year"><span class="bold">Year</span></br><span id="yearGroup">12</span></span>
              </li>
              </br>
              <li>
                  <span class="Rollcall_Class"><span class="bold">Rollcall Class</span></br><span id="rollClass">Farrington</span></span>
              </li>
          </ul>
      </div>


            <!-- HTML for the modal dialog -->
            <div id="modalDialog" class="modal">
                <div class="modal-content">
                    <div class="modal-body">
                        <img id="selectedImage" src="#" alt="Selected Image">
                        <div id="cropperContainer" class="cropper-inner-container">
                            <img id="cropperImage" src="#" alt="Crop Image">
                        </div>
                        <div class="help-section">
                            <h3>Help</h3>
                            <p>Drag edges of circle too resize. Drag across a blank area to draw a new circle. Move the existing circle around by dragging it's center. Press crop to save</p>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button id="btnCrop">Crop</button>
                        <button class="close">Close</button>
                    </div>
                </div>
            </div> 
            
            <div class="profile_picture">
                <input type="file" class="editable_image" accept="image/*" id="fileInput">
                <label for="fileInput" class="upload_button">Upload Image</label>
                <img id="previewImage" src="../Images/User_Image.jpg" alt="Preview" />
            </div>

      <div class="biography">
    <span class="text"><span class="bold">Biography</span></span>
    <div class="textbox">
        <textarea id="biography" maxlength="500" oninput="updateCharCounter()"></textarea>
        <div class="char-counter" id="charCounter">0/500 characters</div>
    </div>
</div>
<button class="Save_Button">
    <i class="bx bxs-save"></i> <span>Save</span>
</button>


<script>
document.querySelector('.Save_Button').addEventListener('click', function() {
    // Get the biography text from the textarea
    var biography = document.querySelector('.biography textarea').value.trim();

    // Retrieve student data from local storage
    var studentData = JSON.parse(localStorage.getItem("studentData"));
    var studentId = studentData.studentId;

    // Check if biography is not empty
    if (biography) {
        // Perform database update
        fetch('save_biography.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                studentId: studentId,
                biography: biography
            }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Biography saved successfully!');
            } else {
                alert('Error saving biography: ' + data.error);
            }
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('An error occurred while saving the biography.');
        });
    } else {
        // Alert user if biography field is empty
        alert('Please enter a biography.');
    }
});
</script>

  <script>
      // Retrieve student data from local storage
var studentData = JSON.parse(localStorage.getItem("studentData"));

// Display student profile function
function displayStudentProfile() {
    if (studentData) {
        document.getElementById("studentName").textContent = `${studentData.givenName} ${studentData.surname}`;
        document.getElementById("studentId").textContent = studentData.studentId;
        document.getElementById("yearGroup").textContent = studentData.yearGroup;
        document.getElementById("rollClass").textContent = studentData.rollClass;

         // Fetch and display the biography
        fetchBiography(studentData.studentId);
    } else {
        document.getElementById("studentName").textContent = "No student data found.";
        document.getElementById("studentId").textContent = "";
        document.getElementById("yearGroup").textContent = "";
        document.getElementById("rollClass").textContent = "";
    }
}

// Function to logout (remove student data from local storage)
 function logout() {
        // Clear access data from localStorage
        localStorage.clear();
        
        // Redirect to the PHP logout handler
        window.location.href = "../LandingPage.html";

    }

// Execute displayStudentProfile function on page load
displayStudentProfile();

// Logout button click event handler
document.getElementById("logoutLink").addEventListener("click", function (event) {
    event.preventDefault(); // Prevent default link behavior (navigation)

    // Call logout function
    logout();

    // Optional: Redirect to logout page
    window.location.href = this.href; // Redirect to the logout page
});
document.addEventListener("DOMContentLoaded", function () {
     checkAccessLevel();
});


function updateCharCounter() {
    var biography = document.getElementById('biography');
    var charCounter = document.getElementById('charCounter');
    var currentLength = biography.value.length;
    var maxLength = biography.getAttribute('maxlength');

    charCounter.textContent = currentLength + '/' + maxLength + ' characters';
}

// Function to fetch biography from the server
function fetchBiography(studentId) {
    fetch(`fetch_biography.php?studentId=${studentId}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                document.getElementById('biography').value = data.biography || '';
                updateCharCounter();
            } else {
                console.error('Error fetching biography:', data.error);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

// Execute displayStudentProfile function on page load
displayStudentProfile();
  </script>
  
  

<script>
   
</script>

        <script src="../accessControl.js"></script>
        <script src="../update_sidebar_role.js"></script>
        <script src="../cropperjs/cropper.js"></script>
        <script src="../Home_Page/Activite_Sidebar.js"> </script>
        <script src="../Settings/darklight_mode.js"> </script>
        <script src="../Profile/Profile_Pic.js"></script>
        <script src="../Profile/Profile_Check.js"></script>
        <script src="../Settings/colour_slider.js"></script>
    </body>

</html>
