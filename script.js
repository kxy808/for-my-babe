let heartsFinished = false;

function showScene(sceneId) {
  document.querySelectorAll(".scene").forEach(scene => {
    scene.classList.remove("active");
  });

  document.getElementById(sceneId).classList.add("active");
}

const noBtn = document.getElementById("noBtn");
const yesBtn = document.getElementById("yesBtn");
const bubble = document.getElementById("speechBubble");

let noAttempts = 0;

const messages = [
  "Just say YES😏 babe❤️",
  "Nope🙃",
  "Girl🥱... leave that button alone",
  "For heaven’s sake 😭 just click YES‼️"
];

const photos = [
  { src: "images/bae1.jpg", position: "50% 15%", zoom: "zoom-out-more" },
  { src: "images/bae2.jpg", position: "50% 20%"},
  { src: "images/bae3.jpg", position: "90% 60%", zoom: "zoom-in-more"},
  { src: "images/bae4.jpg", position: "50% 90%" },
  { src: "images/bae5.jpg", position: "60% 50%" },
  { src: "images/bae6.jpg", position: "30% 10%", zoom: "zoom-out" },
  { src: "images/bae7.jpg", position: "40% 10%" },
  { src: "images/bae8.jpg", position: "center" },
  { src: "images/bae9.jpg", position: "90% 90%" },
  { src: "images/bae10.jpg", position: "90% 50%" },
  { src: "images/bae11.jpeg", position: "50% 5%" },
  { src: "images/bae12.jpeg", position: "50% 10%" }
];

let photoBag = [...photos];


function moveNoButton() {
  noAttempts++;

  const buttonWidth = noBtn.offsetWidth;
  const buttonHeight = noBtn.offsetHeight;

  const padding = 20;

  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  const maxX = viewportWidth - buttonWidth - padding;
  const maxY = viewportHeight - buttonHeight - padding;

  const randomX = Math.max(0, Math.min(Math.random() * maxX, maxX));
  const randomY = Math.max(0, Math.min(Math.random() * maxY, maxY));

  noBtn.style.position = "fixed";
  noBtn.style.left = `${randomX}px`;
  noBtn.style.top = `${randomY}px`;

  bubble.textContent = messages[Math.min(noAttempts - 1, messages.length - 1)];
  bubble.classList.remove("hidden");

  if (noAttempts === 4) {
    yesBtn.classList.add("glow");
    pulseYes();
    bubble.textContent = "👀 LOOK⁉️ YES wants you😭❤️";
  }

  if (noAttempts >= 5) {
    noBtn.style.display = "none";
  }
}


function pulseYes() {
  yesBtn.classList.add("pulse");
}


// --- The Heart wants what it wants ---
const heartContainer = document.getElementById("heartContainer");

function createHeart() {
  const heart = document.createElement("div");
  heart.classList.add("heart");
  heart.textContent = "❤️";

  const xPosition = Math.random() * window.innerWidth;
  heart.style.left = `${xPosition}px`;

  //--- When heart is tapped
  heart.addEventListener("click", () => {
    revealHeartSurprise(heart);
  });

  heartContainer.appendChild(heart);

  // Remove after animation
  setTimeout(() => {
    heart.remove();
  }, 9000);
}

let heartInterval;

function startHeartChaos() {
  console.log("💘 Heart chaos started");
  heartInterval = setInterval(createHeart, 650); /* Reduced spawn rate - was 400 */
}


function revealHeartSurprise(heart) {
  if (heart.classList.contains("used")) return;
  heart.classList.add("used");
  heart.classList.remove("heart-pop");
  void heart.offsetWidth; // Force reflow
  heart.classList.add("heart-pop");

  heart.style.position = "fixed";
  heart.style.left = "50%";
  heart.style.top = "50%";
  heart.style.transform = "translate(-50%, -50%) scale(1.3)";
  heart.style.zIndex = "10000";

  const hint = document.getElementById("heartHint");
  if (hint) hint.style.display = "none";

  document.getElementById("heartHint").classList.add("hidden");

  const photo = getNextPhoto();
  if (!photo) return;

  updateProgress();

  heart.innerHTML = `
  <img src="${photo.src}" 
       class="heart-photo large"
       style="object-position: ${photo.position};" />
  `;

  heart.classList.add("revealed-photo");

  const pop = document.getElementById("popSound");
  pop.currentTime = 0;
  pop.play();

  // if that was the final memory → roll cinema
  if (photoBag.length === 0 && !heartsFinished) {
  heartsFinished = true;
  setTimeout(finishHeartsAndStartCinema, 1200);
  }

}

function updateProgress() {
  const total = photos.length;
  const found = total - photoBag.length;

  document.getElementById("progressBox").textContent =
    `❤️ ${found} / ${total} memories discovered`;
}


function getNextPhoto() {
  if (photoBag.length === 0) return null;

  const index = Math.floor(Math.random() * photoBag.length);
  return photoBag.splice(index, 1)[0];
}


function stopHeartChaos() {
  clearInterval(heartInterval);
  heartContainer.style.pointerEvents = "none";
}


// --- CINEMA TIME‼️ ---

function finishHeartsAndStartCinema() {
  stopHeartChaos();

  clearInterval(heartInterval);
  showScene("letterScene");
  typeLetter();
}


// --- LETTER💌 Section ---

const message = `
My love ❤️, I know this reached you a little after Valentine’s Day…

but I wanted to build something special instead of sending just a text.

Every line, every photo, every moment here
is my way of saying thank you for being in my life.

You make ordinary days feel important.
You make difficult days feel lighter.
And you make me want to keep choosing you.

So yes… it’s late ❤️  
but my feelings for you are always right on time.

Happy Belated Valentine’s Day 💌
`;

function typeLetter() {
  document.getElementById("continueBtn").classList.add("hidden");
  const target = document.getElementById("typedText");
  target.textContent = "";

  const music = document.getElementById("bgMusic");
  music.volume = 0;
  music.play();

  // 🎵 smoother fade in
  const fade = setInterval(() => {
    music.volume = Math.min(music.volume + 0.02, 0.6);
    if (music.volume >= 0.6) clearInterval(fade);
  }, 200);

  let index = 0;

  function type() {
    target.textContent += message[index];
    index++;
    target.scrollTop = target.scrollHeight;


    if (index >= message.length) {
      setTimeout(showContinueButton, 800);
      return;
    }

    const char = message[index];

    let delay = 30 + Math.random() * 40;

    if (char === "," ) delay = 250;
    if (char === "." ) delay = 450;
    if (char === "\n") delay = 600;

    setTimeout(type, delay);
  }

  setTimeout(type, 400); // dramatic start delay
}


function showContinueButton() {
  document.getElementById("continueBtn").classList.remove("hidden");
}


// --- VIDEO🎥 Section ---

function showVideo() {
  const video = document.getElementById("loveVideo");
  video.classList.remove("hidden");
  video.play();

  const loveText = document.getElementById("videoLoveText");

  setTimeout(() => {
  loveText.classList.remove("hidden");
  loveText.classList.add("show");
  }, 1200);

  setTimeout(() => {
  document.getElementById("finishBtn").classList.remove("hidden");
  }, 2000);
}


const totalLinesWritten = 826; 

function showFinalScene() {
  showScene("finalScene");

  const text = document.getElementById("codeCount");
  text.textContent = `
I wrote ${totalLinesWritten} lines of code
just to make you smile.

And I would write a million more. ❤️
`;
}



// --- Mobile + Desktop friendly  (EvenListners) ---

noBtn.addEventListener("mouseenter", moveNoButton);
noBtn.addEventListener("touchstart", moveNoButton);

yesBtn.addEventListener("click", () => {
  // reset memory bag
  photoBag = [...photos];

  // reset progress display
  document.getElementById("progressBox").textContent =
    `❤️ 0 / ${photos.length} memories discovered`;

  // clear old hearts if any
  heartContainer.innerHTML = "";

  showScene("heartScene");
  startHeartChaos();

  document.getElementById("heartHint").classList.remove("hidden");
});


document.getElementById("continueBtn").addEventListener("click", () => {
  const letter = document.getElementById("letterScene");
  const videoScene = document.getElementById("videoScene");

  letter.classList.add("fade-out");
  showScene("videoScene");
  setTimeout(() => {
    videoScene.classList.remove("hidden");
    setTimeout(() => {
      videoScene.classList.add("show");
      showVideo();
    }, 100);
  }, 800);
});

document.getElementById("finishBtn").addEventListener("click", () => {
  showFinalScene();
});

// Force the app to begin at proposal every time

showScene("proposalScene");
