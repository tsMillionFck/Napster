//-- Import Data --
import { songs } from './data.js'

//-- Selectors --
const songCoverContainer = document.querySelector('#song-cover-container');
const songCover = document.querySelector('#song-cover');
const songTitle = document.querySelector('#song-title');
const songArtist = document.querySelector('#song-artist');
const songAudio = document.querySelector('#song-audio');
const progressBar = document.querySelector('#song-progress-bar');
const progressContainer = document.querySelector('#song-progress-container');
const songPrev = document.querySelector('#song-prev');
const songPlayPause = document.querySelector('#song-play-pause');
const songNext = document.querySelector('#song-next');
const playlist = document.querySelector('#playlist');
const playlistToggle = document.querySelector('#playlist-toggle');
const playlistWrapper = document.querySelector('.playlist-wrapper');
const playlistShuffle = document.querySelector('#playlist-shuffle');
const playlistRepeat = document.querySelector('#playlist-song-repeat');
const root = document.documentElement;
const body = document.body;

//-- States --
let currentSongIndex = 0;
let isPlaying = false;
let isRepeat = false;
let isShuffle = false;
const colorThief = new ColorThief();

//-- Functions --
function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function updateTheme(img) {
    const color = colorThief.getColor(img);
    const primaryAccent = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
    root.style.setProperty('--primary-color', primaryAccent);

    // subtle radial glow using the same accent
    setBodyAfterBackground({
      background: `radial-gradient(40vmax 40vmax at var(--mouse-x) var(--mouse-y),
                     ${primaryAccent}22, transparent 60%)`
    });
}


function loadSong(song) {
    songCoverContainer.classList.remove('active');
    void songCoverContainer.offsetWidth; // Trigger reflow to restart animation
    songCoverContainer.classList.add('active');



    songCover.style.backgroundImage = `url(${song.cover})`;
    songTitle.textContent = song.name;
    songArtist.textContent = song.artist;
    songAudio.src = song.path;

    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = song.cover;
    img.onload = () => updateTheme(img);

    const activeSongEl = document.querySelector('.playlist-each-song.active');
    if (activeSongEl) activeSongEl.classList.remove('active');
    
    setTimeout(() => {
        const allSongs = document.querySelectorAll('.playlist-each-song');
        if (allSongs.length > 0) {
            allSongs[currentSongIndex].classList.add('active');
        }
    }, 100);
}

function pauseSong() {
    songPlayPause.innerHTML = `<i data-feather="play"></i>`;
    feather.replace();
    songAudio.pause();
    isPlaying = false;
    songCoverContainer.classList.remove('playing');
}

function playSong() {
    songPlayPause.innerHTML = `<i data-feather="pause"></i>`;
    feather.replace();
    songAudio.play();
    isPlaying = true;
    songCoverContainer.classList.add('playing');
}

function updateProgressBar(e) {
    const { duration, currentTime } = e.target;
    if (duration) {
        const progressPercentage = (currentTime / duration) * 100;
        progressBar.style.width = `${progressPercentage}%`;
    }
}

function setProgressBar(e) {
    const width = this.clientWidth;
    const clickX = e.offsetX;
    const { duration } = songAudio;
    if (duration) {
        songAudio.currentTime = (clickX / width) * duration;
    }
}

function nextSong() {
    if (isShuffle) {
        let randomIndex;
        do {
            randomIndex = Math.floor(Math.random() * songs.length);
        } while (randomIndex === currentSongIndex);
        currentSongIndex = randomIndex;
    } else {
        currentSongIndex = (currentSongIndex + 1) % songs.length;
    }
    loadSong(songs[currentSongIndex]);
    if (isPlaying) playSong();
}

function prevSong() {
    currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    loadSong(songs[currentSongIndex]);
    if (isPlaying) playSong();
}

function handleSongEnd() {
    isRepeat ? playSong() : nextSong();
}

function renderPlaylist() {
    let playListHtml = '';
    songs.forEach((song, index) => {
        playListHtml += `
        <li class="playlist-each-song" data-index="${index}">
            <div class="img-cont" style="background-image: url(${song.cover});"></div>
            <div class="song-info">
                <p class="song-title">${song.name}</p>
                <p class="song-artist">${song.artist}</p>
            </div>
        </li>`;
    });
    playlist.innerHTML = playListHtml;
}

//-- Event Listeners --
songPlayPause.addEventListener('click', () => {
    isPlaying ? pauseSong() : playSong();
});
songNext.addEventListener('click', nextSong);
songPrev.addEventListener('click', prevSong);
songAudio.addEventListener('timeupdate', updateProgressBar);
songAudio.addEventListener('ended', handleSongEnd);
progressContainer.addEventListener('click', setProgressBar);
playlistToggle.addEventListener('click', () => {
    playlistWrapper.classList.toggle('active');
});
playlist.addEventListener('click', (e) => {
    const clickedSong = e.target.closest('.playlist-each-song');
    if (clickedSong) {
        currentSongIndex = parseInt(clickedSong.dataset.index);
        loadSong(songs[currentSongIndex]);
        playSong();
    }
});
playlistShuffle.addEventListener('click', () => {
    isShuffle = !isShuffle;
    playlistShuffle.classList.toggle('active', isShuffle);
});
playlistRepeat.addEventListener('click', () => {
    isRepeat = !isRepeat;
    playlistRepeat.classList.toggle('active', isRepeat);
});

// --- Mouse Tracking for Spotlight and Tilt ---
const playerWrapper = document.querySelector('.player-wrapper');

body.addEventListener('mousemove', (e) => {
    // Spotlight effect
    body.style.setProperty('--mouse-x', `${e.clientX}px`);
    body.style.setProperty('--mouse-y', `${e.clientY}px`);

    // 3D Tilt effect
    const rect = playerWrapper.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / 25;
    const rotateY = (centerX - x) / 25;
    
    playerWrapper.style.setProperty('--rotate-x', `${rotateX}deg`);
    playerWrapper.style.setProperty('--rotate-y', `${rotateY}deg`);
});

body.addEventListener('mouseleave', () => {
    playerWrapper.style.setProperty('--rotate-x', '0deg');
    playerWrapper.style.setProperty('--rotate-y', '0deg');
});


//-- Initial Load --
renderPlaylist();
loadSong(songs[currentSongIndex]);
feather.replace(); // Initialize icons