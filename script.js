console.log("Welcome to Spotify");

// Initialize the Variables
let songIndex = 0;
let audioElement = new Audio('songs/1.mp3');
let masterPlay = document.getElementById('masterPlay');
let myProgressBar = document.getElementById('myProgressBar');
let gif = document.getElementById('gif');
let masterSongName = document.getElementById('masterSongName');
let songItems = Array.from(document.getElementsByClassName('songItem'));

let songs = [
    {songName: "Warriyo - Mortals [NCS Release]", filePath: "songs/1.mp3", coverPath: "covers/1.jpg"},
    {songName: "Cielo - Huma-Huma", filePath: "songs/2.mp3", coverPath: "covers/2.jpg"},
    {songName: "DEAF KEV - Invincible [NCS Release]-320k", filePath: "songs/3.mp3", coverPath: "covers/3.jpg"},
    {songName: "Different Heaven & EH!DE - My Heart [NCS Release]", filePath: "songs/4.mp3", coverPath: "covers/4.jpg"},
    {songName: "Janji-Heroes-Tonight-feat-Johnning-NCS-Release", filePath: "songs/5.mp3", coverPath: "covers/5.jpg"},
    {songName: "Rabba - Salam-e-Ishq", filePath: "songs/6.mp3", coverPath: "covers/6.jpg"},
    {songName: "Sakhiyaan - Salam-e-Ishq", filePath: "songs/7.mp3", coverPath: "covers/7.jpg"},
    {songName: "Bhula Dena - Salam-e-Ishq", filePath: "songs/8.mp3", coverPath: "covers/8.jpg"},
    {songName: "Tumhari Kasam - Salam-e-Ishq", filePath: "songs/9.mp3", coverPath: "covers/9.jpg"},
    {songName: "Na Jaana - Salam-e-Ishq", filePath: "songs/10.mp3", coverPath: "covers/10.jpg"},
]

// Populate song items with correct data
songItems.forEach((element, i)=>{ 
    if(songs[i]) {
        element.getElementsByTagName("img")[0].src = songs[i].coverPath; 
        element.getElementsByClassName("songName")[0].innerText = songs[i].songName; 
    }
})

// Handle play/pause click
masterPlay.addEventListener('click', ()=>{
    if(audioElement.paused || audioElement.currentTime<=0){
        audioElement.play().catch(e => {
            console.log("Error playing audio:", e);
        });
        masterPlay.classList.remove('fa-play-circle');
        masterPlay.classList.add('fa-pause-circle');
        gif.style.opacity = 1;
    }
    else{
        audioElement.pause();
        masterPlay.classList.remove('fa-pause-circle');
        masterPlay.classList.add('fa-play-circle');
        gif.style.opacity = 0;
    }
})

// Listen to Events
audioElement.addEventListener('timeupdate', ()=>{ 
    // Update Seekbar
    if(audioElement.duration) {
        progress = parseInt((audioElement.currentTime/audioElement.duration)* 100); 
        myProgressBar.value = progress;
    }
})

myProgressBar.addEventListener('change', ()=>{
    if(audioElement.duration) {
        audioElement.currentTime = myProgressBar.value * audioElement.duration/100;
    }
})

const makeAllPlays = ()=>{
    Array.from(document.getElementsByClassName('songItemPlay')).forEach((element)=>{
        element.classList.remove('fa-pause-circle');
        element.classList.add('fa-play-circle');
    })
}

// Function to play a specific song
const playSong = (index) => {
    makeAllPlays();
    songIndex = index;
    
    // Update the play button for current song
    const currentPlayButton = document.getElementById(songIndex.toString());
    if(currentPlayButton) {
        currentPlayButton.classList.remove('fa-play-circle');
        currentPlayButton.classList.add('fa-pause-circle');
    }
    
    // Set audio source using the filePath from songs array
    audioElement.src = songs[songIndex].filePath;
    masterSongName.innerText = songs[songIndex].songName;
    audioElement.currentTime = 0;
    
    // Play the audio
    audioElement.play().catch(e => {
        console.log("Error playing audio:", e);
        // Reset UI if play fails
        makeAllPlays();
        masterPlay.classList.remove('fa-pause-circle');
        masterPlay.classList.add('fa-play-circle');
        gif.style.opacity = 0;
    });
    
    gif.style.opacity = 1;
    masterPlay.classList.remove('fa-play-circle');
    masterPlay.classList.add('fa-pause-circle');
}

// Handle individual song play buttons
Array.from(document.getElementsByClassName('songItemPlay')).forEach((element)=>{
    element.addEventListener('click', (e)=>{ 
        const clickedIndex = parseInt(e.target.id);
        
        // If clicking the same song that's playing, toggle play/pause
        if(songIndex === clickedIndex && !audioElement.paused) {
            audioElement.pause();
            makeAllPlays();
            masterPlay.classList.remove('fa-pause-circle');
            masterPlay.classList.add('fa-play-circle');
            gif.style.opacity = 0;
        } else {
            // Play the selected song
            playSong(clickedIndex);
        }
    })
})

// Next button
document.getElementById('next').addEventListener('click', ()=>{
    if(songIndex >= songs.length - 1){
        songIndex = 0;
    } else {
        songIndex += 1;
    }
    playSong(songIndex);
})

// Previous button
document.getElementById('previous').addEventListener('click', ()=>{
    if(songIndex <= 0){
        songIndex = songs.length - 1;
    } else {
        songIndex -= 1;
    }
    playSong(songIndex);
})

// Auto play next song when current song ends
audioElement.addEventListener('ended', ()=>{
    if(songIndex >= songs.length - 1){
        songIndex = 0;
    } else {
        songIndex += 1;
    }
    playSong(songIndex);
})

// Handle audio loading errors
audioElement.addEventListener('error', (e) => {
    console.log("Audio loading error:", e);
    alert(`Error loading song: ${songs[songIndex].songName}. Please check if the file exists.`);
});