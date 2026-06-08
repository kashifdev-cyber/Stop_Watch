const display = document.getElementById("display");
const progress = document.querySelector(".progress");
const laps = document.getElementById("laps");
const sound = document.getElementById("clickSound");

const circumference = 817;

let timer = null;
let running = false;
let elapsed = 0;
let startTime = 0;

for(let i=0;i<30;i++){

    const p = document.createElement("span");

    p.classList.add("particle");

    p.style.left = Math.random()*100+"%";
    p.style.top = Math.random()*100+"%";
    p.style.animationDelay =
    Math.random()*3+"s";

    document
    .getElementById("particles")
    .appendChild(p);
}

function playSound(){

    sound.currentTime = 0;

    sound.play().catch(()=>{});
}

function update(){

    elapsed = Date.now() - startTime;

    let ms =
    Math.floor((elapsed%1000)/10);

    let sec =
    Math.floor(elapsed/1000)%60;

    let min =
    Math.floor(elapsed/60000)%60;

    let hr =
    Math.floor(elapsed/3600000);

    display.textContent =
    `${String(hr).padStart(2,"0")}:`+
    `${String(min).padStart(2,"0")}:`+
    `${String(sec).padStart(2,"0")}.`+
    `${String(ms).padStart(2,"0")}`;

    const offset =
    circumference -
    ((sec+ms/100)/60)*circumference;

    progress.style.strokeDashoffset =
    offset;
}

function startStop(){

    playSound();

    if(!running){

        startTime =
        Date.now() - elapsed;

        timer =
        setInterval(update,10);

        running=true;

    }else{

        clearInterval(timer);

        running=false;
    }
}

function lap(){

    playSound();

    if(elapsed===0) return;

    const li =
    document.createElement("li");

    li.textContent =
    display.textContent;

    laps.prepend(li);

    localStorage.setItem(
        "laps",
        laps.innerHTML
    );
}

function reset(){

    playSound();

    clearInterval(timer);

    running=false;

    elapsed=0;

    display.textContent =
    "00:00:00.00";

    progress.style.strokeDashoffset =
    circumference;

    laps.innerHTML="";

    localStorage.removeItem("laps");
}

function exportLaps(){

    const text =
    [...document.querySelectorAll("#laps li")]
    .map(li=>li.textContent)
    .join("\n");

    const blob =
    new Blob([text]);

    const link =
    document.createElement("a");

    link.href =
    URL.createObjectURL(blob);

    link.download =
    "laps.txt";

    link.click();
}

function toggleFullscreen(){

    if(!document.fullscreenElement){

        document.documentElement
        .requestFullscreen();

    }else{

        document.exitFullscreen();
    }
}

function setTheme(theme){

    const colors={
        blue:"#00e5ff",
        purple:"#b026ff",
        green:"#00ff88",
        red:"#ff355e"
    };

    document.documentElement
    .style
    .setProperty(
        "--accent",
        colors[theme]
    );
}

document.addEventListener(
"keydown",
e=>{

    if(e.code==="Space"){

        e.preventDefault();

        startStop();
    }

    if(e.key==="l") lap();

    if(e.key==="r") reset();
});

setInterval(()=>{

document.getElementById("clock")
.textContent =
new Date()
.toLocaleTimeString();

},1000);

laps.innerHTML =
localStorage.getItem("laps") || "";