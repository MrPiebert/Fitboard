function darkmode() {
  const wasDarkmode = localStorage.getItem('darkmode') === 'true';
  localStorage.setItem('darkmode', !wasDarkmode);

  // Select elements with desired classes
  const elements = document.querySelectorAll('.sidebar, .main_content, .heading, .main_video, .video_list, .primary_container');

  // Toggle the dark-mode class on each selected element
  for (const element of elements) {
      element.classList.toggle('dark-mode', !wasDarkmode);
  }
}

function onload() {
  // Check for dark mode preference and apply it to elements
  const isDarkmode = localStorage.getItem('darkmode') === 'true';
  const elements = document.querySelectorAll('.sidebar, .main_content, .heading, .main_video, .video_list, .primary_container');

  for (const element of elements) {
      element.classList.toggle('dark-mode', isDarkmode);
  }

  // Set the state of the dark mode switch based on the preference
  const toggle = document.getElementById("toggle");
  toggle.checked = isDarkmode;
}

document.addEventListener('DOMContentLoaded', onload);
