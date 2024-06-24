console.log("lets go ")
let currentsong = new Audio()
let songs
let currentfolder
async function getSongs(folder) {
    currentfolder = folder;
    let a = await fetch(`http://127.0.0.1:5500/songs/${folder}`)
    let response = await a.text()
    let div = document.createElement("div")
    div.innerHTML = response
    let as = div.getElementsByTagName("a")
    let songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index]
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1])
        }
    }
    return songs
}

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

const playMusic = (track, pause = false) => {
    currentsong.src = `/songs/${currentfolder}/` + track
    if (!pause) {
        currentsong.play()
        play.src = "pause.svg"
    }

    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = `00:00/00:00`


}
async function main() {
    //get list all the songs
    songs = await getSongs("f1")
    playMusic(songs[0], true)

    //show all the songs in the playlist
    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li> 
        <img class="invert" src="music.svg" alt="">
        <div class="info">
            <div>${song.replaceAll("%20", " ")}</div>
            <div>Roshan</div>
        </div>
        <div class="playNow">
            <span>Play Now</span>
            <img class="invert" src="play.svg" alt="">
        </div>
        </li>`;
    }

    // attach event listener to each li
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })
    })

    //attach event listenre to each play prev next
    play.addEventListener("click", () => {
        if (currentsong.paused) {
            currentsong.play()
            play.src = "pause.svg"

        }
        else {
            currentsong.pause()
            play.src = "play.svg"
        }
    })

    currentsong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML =
            `${secondsToMinutesSeconds(currentsong.currentTime)} / ${secondsToMinutesSeconds(currentsong.duration)}`
        document.querySelector(".circle").style.left =
            (currentsong.currentTime) / (currentsong.duration) * 100 + "%";
    })

    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentsong.currentTime = ((currentsong.duration) * percent) / 100
    })

    //add event listener to prev and next
    previous.addEventListener("click", () => {
        let index = songs.indexOf(currentsong.src.split("/songs/")[1])
        if (index - 1 >= 0) {
            playMusic(songs[index - 1])
        }
    })

    next.addEventListener("click", () => {
        let index = songs.indexOf(currentsong.src.split("/songs/")[1])
        if (index + 1 < songs.length) {
            playMusic(songs[index + 1])
        }
    })

    //add event listener to range
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        currentsong.volume = e.target.value / 100;
    });

    //load the library when the card is clicked
        

}
main() 