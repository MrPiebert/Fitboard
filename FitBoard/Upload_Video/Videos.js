let listVideo = document.querySelectorAll('.video_list .vid');
let mainVideo = document.querySelector('.main_video video');
let title = document.querySelector('.main_video .title');
let description = document.querySelector('.main_video .description'); // Added this line

listVideo.forEach(video => {
    video.onclick = () => {
        listVideo.forEach(vid => vid.classList.remove('active'));
        video.classList.add('active');
        if (video.classList.contains('active')) {
            let src = video.children[0].getAttribute('src');
            mainVideo.src = src;
            let text = video.children[1].innerHTML;
            title.innerHTML = text;
            let desc = video.children[2].innerHTML; // Assuming the description is the third child
            description.innerHTML = desc; // Set the main description
        }
    }
});

document.getElementById('searchInput').addEventListener('input', searchVideos);

function searchVideos() {
    const input = document.getElementById('searchInput').value.toLowerCase();
    const videoTitles = document.querySelectorAll('.video_list .vid .title');

    videoTitles.forEach(title => {
        const vid = title.parentElement;
        const titleText = title.textContent.toLowerCase();
        if (titleText.includes(input)) {
            vid.style.display = 'block';
        } else {
            vid.style.display = 'none';
        }
    });
}

// Function to make video title editable
function makeEditable(titleElement) {
    const originalTitle = titleElement.textContent;
    const input = document.createElement('input');
    input.type = 'text';
    input.value = originalTitle;
    input.classList.add('editable-input');

    input.addEventListener('blur', () => {
        const newTitle = input.value.trim();
        if (newTitle !== '' && newTitle !== originalTitle) {
            titleElement.textContent = newTitle;
        } else {
            titleElement.textContent = originalTitle;
        }
    });

    titleElement.textContent = '';
    titleElement.appendChild(input);
    input.focus();
}

// Event listener to make video titles editable on double click
document.querySelectorAll('.video_list .vid .title').forEach(title => {
    title.addEventListener('dblclick', () => {
        makeEditable(title);
    });
});
