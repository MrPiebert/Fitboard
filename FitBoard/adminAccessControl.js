/*
function checkAdminAccess() {
    const accessLevel = parseInt(localStorage.getItem("accessLevel"), 10);

    // Check if the access level is invalid for admin access
    if (accessLevel !== 1) {
        alert('Invalid access level. Redirecting to the landing page.');
        window.location.href = '../LandingPage.html';
    }
}
