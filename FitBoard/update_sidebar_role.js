window.onload = function () {
    console.log('onload function executed');
    var accessLevel = localStorage.getItem('accessLevel');
    var userNameElement = document.getElementById('userName');
    var userRoleElement = document.getElementById('userRole');

    if (accessLevel === '1') {
        userNameElement.textContent = 'Kurt&#160Rich';
        userRoleElement.textContent = 'Admin';
    } else if (accessLevel === '0') {
        var studentData = JSON.parse(localStorage.getItem('studentData'));
        if (studentData && studentData.givenName && studentData.surname) {
            userNameElement.textContent = studentData.givenName + '\u00A0' + studentData.surname;
            userRoleElement.textContent = 'Student';
        }
    }
};
