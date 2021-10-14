const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);


const player = $(".player");
const cd = $(".cd");
const heading = $("header h2");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const playBtn = $(".btn-toggle-play");
const progress = $("#progress");
const nextBtn = $(".btn-next");
const prevBtn = $(".btn-prev");
const randomBtn = $(".btn-random");
const repeatBtn = $(".btn-repeat");


const app = {
    currentIndex: 6,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    songs: [
        {
          name: "LiLac",
          singer: "IU",
          path: "./songs/song-1-lilac.mp3",
          image: "./images/song-1-lilac.jpg"
        },
        {
            name: "Flu",
            singer: "IU",
            path: "./songs/song-2-flu.mp3",
            image: "./images/song-2-flu.jpg"
        },
        {
            name: "Coin",
            singer: "IU",
            path: "./songs/song-3-coin.mp3",
            image: "./images/song-3-coin.jpg"
        },
        {
            name: "Hi Spring Bye",
            singer: "IU",
            path: "./songs/song-4-hi spring bye.mp3",
            image: "./images/song-4-hi spring bye.jpg"
        },
        {
            name: "Celebrity",
            singer: "IU",
            path: "./songs/song-5-celebrity.mp3",
            image: "./images/song-5-celebrity.png"
        },
        {
            name: "Blueming",
            singer: "IU",
            path: "./songs/song-6-blueming.mp3",
            image: "./images/song-6-blueming.jpg"
        },
        {
            name: "Love Poem",
            singer: "IU",
            path: "./songs/song-7-love poem.mp3",
            image: "./images/song-7-love poem.jpg"
        },
        {
            name: "Above The Time",
            singer: "IU",
            path: "./songs/song-8-above the time.mp3",
            image: "./images/song-8-above the time.png"
        },
        
      ],

    render: function() {
        const htmls = this.songs.map((song , index) => {
            return `
                <div class="song ${index === this.currentIndex ? "active" : ""}">
                    <div class="thumb" style="background-image: url('${song.image}')">
                </div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                    <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>
            `
        })
        $(".playlist").innerHTML = htmls.join("");
    },
    defineProperties: function() {
        Object.defineProperty(this, "currentSong", {
            get: function() { 
                return this.songs[this.currentIndex];
            },
        })
    },



    handleEvents: function(){
        const _this = this;
        const cdWidth = cd.offsetWidth

        // Xử lý CD quay / dừng
        const cdThumbAnimate = cdThumb.animate([
            { transform: "rotate(360deg)"}
        ], { 
            duration: 10000, // 10 seconds
            iterations: Infinity
            
        })
        cdThumbAnimate.pause();

        // Xử lý phóng to / thu nhỏ CD
        document.onscroll = function(){
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newcdWidth = cdWidth - scrollTop;

            cd.style.width = newcdWidth > 0 ? newcdWidth + "px" : "0px";
            cd.style.opacity = newcdWidth / cdWidth;
        }

        // Xử lý khi click Play
        playBtn.onclick = function () {
            // _this.isPlaying ? audio.pause() : audio.play();
            if (_this.isPlaying) {
                audio.pause();
            } else {
                audio.play();         
            }
        }

        // Khi song play
        audio.onplay = function () {
            _this.isPlaying = true;
            player.classList.add("playing");
            cdThumbAnimate.play();
        }

        // Khi song paused
        audio.onpause = function () {
            _this.isPlaying = false;
            player.classList.remove("playing");
            cdThumbAnimate.pause();
        }

        // Khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function () {
            if (audio.duration) {
                const progressPercentage = Math.floor(audio.currentTime / audio.duration * 100);
                progress.value = progressPercentage;
            }
        }

        // Xử lý khi tua bài hát 
        progress.oninput = function (e) {
            audio.pause();
            setTimeout(() => {
                audio.play();
            }, 300);
            //Lấy ra thời gian sau khi click tua
            const seekTime = e.target.value * (audio.duration / 100);
            audio.currentTime = seekTime;
          };

        // Khi next song
        nextBtn.onclick = function () {
            _this.isRandom ? _this.playRandomSong() : _this.nextSong();
            audio.play();
            _this.render();
            _this.scrollToactivesong();
        }

        // Khi previous song
        prevBtn.onclick = function () {
            _this.isRandom ? _this.playRandomSong() : _this.prevSong();
            audio.play();
            _this.render();
            _this.scrollToactivesong();
        }

        // Xử lý random bật / tắt random song
        randomBtn.onclick = function () {
            _this.isRandom = !_this.isRandom;
            randomBtn.classList.toggle("active", _this.isRandom);
        }

        // Xử lý khi bật / tắt repeat song
        repeatBtn.onclick = function () {
            _this.isRepeat = !_this.isRepeat;
            repeatBtn.classList.toggle("active", _this.isRepeat);
        }

        // Xử lý next song khi audio ended 
        audio.onended = function () {
            _this.isRepeat ? audio.play() : nextBtn.click();
        }
    },
    scrollToactivesong: function(){
        setTimeout (function (){
            if(this.currentIndex === 0 || this.currentIndex === 1){
                window.scrollTo(0, 0);
            }
            else{
                $('.song.active').scrollIntoView({
                    behavior : 'smooth',
                    block : 'nearest'
                 })    
            }
        },300)
       
    },
    loadCurrentSong: function () {
        heading.innerText = this.currentSong.name;
        cdThumb.style.backgroundImage = `url("${this.currentSong.image}")`;
        audio.src = this.currentSong.path;

    },
    nextSong: function () {
        this.currentIndex++; 
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },
    prevSong: function () {
        this.currentIndex--; 
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong();
    },
    playRandomSong: function () {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.songs.length);
        } while (this.currentIndex === newIndex);
        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },

    start: function() {
        // Định nghĩa các thuộc tính cho object
        this.defineProperties();

        
        // Lắng nghe và xử lý các sự kiện (DOM events)
        this.handleEvents();


        // Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
        this.loadCurrentSong();

        // Render Playlist
        this.render();

        //
        
    }

}

app.start();
