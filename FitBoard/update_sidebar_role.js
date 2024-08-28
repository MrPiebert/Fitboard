window.onload = function () {
    var accessLevel = localStorage.getItem('accessLevel');
    var userNameElement = document.getElementById('userName');
    var userRoleElement = document.getElementById('userRole');

    if (accessLevel === '1') {
        userNameElement.innerHTML = 'Kurt&nbsp;Rich';
        userRoleElement.textContent = 'Admin';
    } else if (accessLevel === '0') {
        var studentData = JSON.parse(localStorage.getItem('studentData'));
        if (studentData && studentData.givenName && studentData.surname) {
        userNameElement.innerHTML = studentData.givenName + '&nbsp;' + studentData.surname;

            userRoleElement.textContent = 'Student';
        }
    }
};
