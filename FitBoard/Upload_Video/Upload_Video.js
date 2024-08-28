document.addEventListener("DOMContentLoaded", function () {
    fetchVideos();
});

function fetchVideos() {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "fetch_videos.php", true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const videos = JSON.parse(xhr.responseText);
            displayVideos(videos);
            if (videos.length > 0) {
                setDefaultVideo(videos[0]);
            }
        }
    };
    xhr.send();
}


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
function displayVideos(videos) {
    const videoList = document.querySelector('.video_list');
    videoList.innerHTML = '';

    videos.forEach((video, index) => {
        const newVideoDiv = document.createElement('div');
        newVideoDiv.classList.add('vid');
        newVideoDiv.dataset.id = video.id; // Add a data attribute to store the video ID

        const videoId = getYouTubeVideoId(video.link);
        const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
        const newThumbnail = document.createElement('img');
        newThumbnail.src = thumbnailUrl;
        newThumbnail.style.width = "100px";
        newThumbnail.style.height = "56px";
        newThumbnail.style.borderRadius = "5px";

        const newTitle = document.createElement('h3');
        newTitle.classList.add('title');
        newTitle.textContent = `${index + 1 < 10 ? '0' + (index + 1) : index + 1}. ${video.title}`;

        const newDescription = document.createElement('div');
        newDescription.classList.add('desc');
        newDescription.style.display = 'none';
        newDescription.textContent = video.description || 'No description provided';

        const editButton = document.createElement('button');
        editButton.classList.add('edit-button');
        editButton.textContent = 'Edit';
        editButton.onclick = () => editVideo(newVideoDiv);

        const deleteButton = document.createElement('button');
        deleteButton.classList.add('delete-button');
        deleteButton.textContent = 'Delete';
        deleteButton.onclick = () => deleteVideo(video.id);

        newVideoDiv.appendChild(newThumbnail);
        newVideoDiv.appendChild(newTitle);
        newVideoDiv.appendChild(newDescription);
        newVideoDiv.appendChild(editButton);
        newVideoDiv.appendChild(deleteButton);

        newVideoDiv.onclick = () => {
            document.querySelectorAll('.video_list .vid').forEach(vid => vid.classList.remove('active'));
            newVideoDiv.classList.add('active');
            document.querySelector('.main_video iframe').src = video.link;
            document.querySelector('.main_video .title').innerHTML = newTitle.innerHTML;
            document.querySelector('.main_video .description').innerHTML = newDescription.innerHTML;
        };

        videoList.appendChild(newVideoDiv);
    });
}

function setDefaultVideo(video) {
    const mainIframe = document.querySelector('.main_video iframe');
    mainIframe.src = video.link;
    document.querySelector('.main_video .title').innerHTML = video.title;
    document.querySelector('.main_video .description').innerHTML = video.description || 'No description provided';
}

function promptYouTubeLink() {
    const youTubeLink = prompt("Enter the YouTube link:");
    if (youTubeLink) {
        addVideo(youTubeLink);
    }
}

function addVideo(youTubeLink) {
    const videoId = getYouTubeVideoId(youTubeLink);
    if (videoId) {
        const videoTitle = prompt("Enter video title:");
        if (videoTitle) {
            const newVideoDiv = document.createElement('div');
            newVideoDiv.classList.add('vid');
            newVideoDiv.dataset.id = ''; // Temporary ID until saved to the database

            const newIframe = document.createElement('iframe');
            newIframe.src = `https://www.youtube.com/embed/${videoId}`;
            newIframe.frameborder = "0";
            newIframe.allowFullscreen = true;
            newIframe.style.width = "100px";
            newIframe.style.height = "56px";
            newIframe.style.borderRadius = "5px";
            newIframe.style.pointerEvents = 'none';

            const newTitle = document.createElement('h3');
            newTitle.classList.add('title');
            newTitle.textContent = `${document.querySelectorAll('.video_list .vid').length + 1}. ${videoTitle || 'Untitled'}`;

            const newDescription = document.createElement('div');
            newDescription.classList.add('desc');
            newDescription.style.display = 'none';
            newDescription.textContent = 'No description provided';

            const editButton = document.createElement('button');
            editButton.classList.add('edit-button');
            editButton.textContent = 'Edit';
            editButton.onclick = () => editVideo(newVideoDiv);

            const deleteButton = document.createElement('button');
            deleteButton.classList.add('delete-button');
            deleteButton.textContent = 'Delete';
            deleteButton.onclick = () => deleteVideo(newVideoDiv.dataset.id);

            newVideoDiv.appendChild(newIframe);
            newVideoDiv.appendChild(newTitle);
            newVideoDiv.appendChild(newDescription);
            newVideoDiv.appendChild(editButton);
            newVideoDiv.appendChild(deleteButton);

            newVideoDiv.onclick = () => {
                document.querySelectorAll('.video_list .vid').forEach(vid => vid.classList.remove('active'));
                newVideoDiv.classList.add('active');
                document.querySelector('.main_video iframe').src = newIframe.src;
                document.querySelector('.main_video .title').innerHTML = newTitle.innerHTML;
                document.querySelector('.main_video .description').innerHTML = newDescription.innerHTML;
            };

            document.querySelector('.video_list').appendChild(newVideoDiv);

            // Save to database
            const xhr = new XMLHttpRequest();
            xhr.open("POST", "save_video.php", true);
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    const response = JSON.parse(xhr.responseText);
                    newVideoDiv.dataset.id = response.id; // Set the video ID returned from the server
                }
            };
            const params = `title=${encodeURIComponent(videoTitle)}&description=${encodeURIComponent(newDescription.textContent)}&youtube_link=${encodeURIComponent(newIframe.src)}`;
            xhr.send(params);
        }
    } else {
        alert("Invalid YouTube link.");
    }
}

function getYouTubeVideoId(url) {
    const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
}
function editVideo(videoElement) {
    const videoId = videoElement.dataset.id; // Get the video ID from the dataset
    const newTitle = prompt("Enter new title:", videoElement.querySelector('.title').textContent);
    const newDescription = prompt("Enter new description:", videoElement.querySelector('.desc').textContent);
    const newLink = prompt("Enter new YouTube link:", document.querySelector('.main_video iframe').src);

    if (newTitle && newDescription && newLink) {
        // Send the updated data to the server
        const xhr = new XMLHttpRequest();
        xhr.open("POST", "update_video.php", true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                // Successfully updated video, update the UI
                videoElement.querySelector('.title').textContent = newTitle;
                videoElement.querySelector('.desc').textContent = newDescription;
                videoElement.querySelector('iframe').src = `https://www.youtube.com/embed/${getYouTubeVideoId(newLink)}`;
                alert("Video updated successfully!");
            }
        };

        // Send data to the server-side script
        xhr.send(`id=${videoId}&title=${encodeURIComponent(newTitle)}&description=${encodeURIComponent(newDescription)}&link=${encodeURIComponent(newLink)}`);
    }
}




function deleteVideo(videoId) {
    if (confirm("Are you sure you want to delete this video?")) {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", "delete_video.php", true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                console.log("Video deleted:", xhr.responseText);
                document.querySelector(`[data-id='${videoId}']`).remove();
            }
        };
        const params = `id=${encodeURIComponent(videoId)}`;
        xhr.send(params);
    }
}
