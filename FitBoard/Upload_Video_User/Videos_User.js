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
