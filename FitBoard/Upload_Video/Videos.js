let listVideo = document.querySelectorAll('.video_list .vid');
let mainVideo = document.querySelector('.main_video iframe');
let title = document.querySelector('.main_video .title');
let description = document.querySelector('.main_video .description');

listVideo.forEach(video => {
    video.onclick = () => {
        listVideo.forEach(vid => vid.classList.remove('active'));
        video.classList.add('active');
        if (video.classList.contains('active')) {
            let src = video.children[0].getAttribute('src');
            mainVideo.src = src;
            let text = video.children[1].innerHTML;
            title.innerHTML = text;
            let desc = video.children[2].innerHTML;
            description.innerHTML = desc;
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

function promptYouTubeLink() {
    const youTubeLink = prompt("Please enter the YouTube link:");
    if (youTubeLink) {
        addVideo(youTubeLink);
    }
}

function addVideo(youTubeLink) {
    const videoId = getYouTubeVideoId(youTubeLink);
    if (videoId) {
        const videoList = document.querySelector('.video_list');
        const videoCount = videoList.children.length + 1;
        const videoTitle = prompt("Enter video title:");
        
        const newVideoDiv = document.createElement('div');
        newVideoDiv.classList.add('vid');

        const newIframe = document.createElement('iframe');
        newIframe.src = `https://www.youtube.com/embed/${videoId}`;
        newIframe.frameborder = "0";
        newIframe.allowFullscreen = true;
        newIframe.style.width = "100px";
        newIframe.style.height = "56px";
        newIframe.style.borderRadius = "5px";

        const newTitle = document.createElement('h3');
        newTitle.classList.add('title');
        newTitle.textContent = `${videoCount < 10 ? '0' + videoCount : videoCount}. ${videoTitle || 'Untitled'}`;

        const newDescription = document.createElement('div');
        newDescription.classList.add('desc');
        newDescription.style.display = 'none';
        newDescription.textContent = 'No description provided';

        const editButton = document.createElement('button');
        editButton.classList.add('edit-button');
        editButton.textContent = 'Edit';
        editButton.onclick = () => editVideo(editButton);

        newVideoDiv.appendChild(newIframe);
        newVideoDiv.appendChild(newTitle);
        newVideoDiv.appendChild(newDescription);
        newVideoDiv.appendChild(editButton);

        newVideoDiv.onclick = () => {
            document.querySelectorAll('.video_list .vid').forEach(vid => vid.classList.remove('active'));
            newVideoDiv.classList.add('active');
            mainVideo.src = newIframe.src;
            title.innerHTML = newTitle.innerHTML;
            description.innerHTML = newDescription.innerHTML;
        };

        videoList.appendChild(newVideoDiv);
    } else {
        alert("Invalid YouTube link.");
    }
}

function getYouTubeVideoId(url) {
    const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
}

// Function to make video title, description, and link editable
function editVideo(button) {
    const videoDiv = button.parentElement;
    const titleElement = videoDiv.querySelector('.title');
    const descElement = videoDiv.querySelector('.desc');
    const iframeElement = videoDiv.querySelector('iframe');

    const newTitle = prompt("Enter new title:", titleElement.textContent);
    const newDesc = prompt("Enter new description:", descElement.textContent);
    const newLink = prompt("Enter new YouTube link:", iframeElement.src);

    if (newTitle) {
        titleElement.textContent = newTitle;
    }
    if (newDesc) {
        descElement.textContent = newDesc;
    }
    const newVideoId = getYouTubeVideoId(newLink);
    if (newVideoId) {
        iframeElement.src = `https://www.youtube.com/embed/${newVideoId}`;
    } else {
        alert("Invalid YouTube link.");
    }
}
