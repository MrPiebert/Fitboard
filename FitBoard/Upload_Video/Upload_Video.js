function addVideo(event) {
    const file = event.target.files[0];
    if (!file) return;

    const videoURL = URL.createObjectURL(file);
    const videoList = document.querySelector('.video_list');
    const videoCount = videoList.children.length + 1;
    const videoTitle = prompt("Enter video title:");
    const videoDescription = prompt("Enter video description:");

    // Create new video element
    const newVideoDiv = document.createElement('div');
    newVideoDiv.classList.add('vid');

    const newVideo = document.createElement('video');
    newVideo.src = videoURL;
    newVideo.muted = true;

    const newTitle = document.createElement('h3');
    newTitle.classList.add('title');
    newTitle.textContent = `${videoCount < 10 ? '0' + videoCount : videoCount}. ${videoTitle || 'Untitled'}`;

    const newDescription = document.createElement('div');
    newDescription.classList.add('desc');
    newDescription.style.display = 'none';
    newDescription.textContent = videoDescription || 'No description provided';

    newVideoDiv.appendChild(newVideo);
    newVideoDiv.appendChild(newTitle);
    newVideoDiv.appendChild(newDescription);

    // Add event listener to switch main video
    newVideoDiv.onclick = () => {
        document.querySelectorAll('.video_list .vid').forEach(vid => vid.classList.remove('active'));
        newVideoDiv.classList.add('active');
        document.querySelector('.main_video video').src = videoURL;
        document.querySelector('.main_video .title').innerHTML = newTitle.innerHTML;
        document.querySelector('.main_video .description').innerHTML = newDescription.innerHTML;
    };

    // Append the new video to the list
    videoList.appendChild(newVideoDiv);

    // Reset the input value to allow uploading the same file again if needed
    event.target.value = '';
}
