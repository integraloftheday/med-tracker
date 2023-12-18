


function changeContent() {
    // Your form submission logic here
    // After form submission, hide initial content and show new content
    document.getElementById("initialContent").style.display = "none";
    document.getElementById("newContent").style.display = "block";
}

// particles.js configuration
particlesJS('particles-js', {
    particles: {
        number: {
            value: 80,
            density: {
                enable: true,
                value_area: 800
            }
        },
        color: {
            value: '#ffffff' // White color
        },
        shape: {
            type: 'circle',
            stroke: {
                width: 0,
                color: '#000000'
            },
            polygon: {
                nb_sides: 5
            },
            image: {
                src: 'img/github.svg',
                width: 100,
                height: 100
            }
        },
        opacity: {
            value: 0.5,
            random: true,
            anim: {
                enable: true,
                speed: 1,
                opacity_min: 0.1,
                sync: false
            }
        },
        size: {
            value: 3,
            random: true,
            anim: {
                enable: false,
                speed: 40,
                size_min: 0.1,
                sync: false
            }
        },
        line_linked: {
            enable: true,
            distance: 150,
            color: '#e91e63', // Pink color
            opacity: 0.4,
            width: 1
        },
        move: {
            enable: true,
            speed: 6,
            direction: 'none',
            random: false,
            straight: false,
            out_mode: 'out',
            bounce: false,
            attract: {
                enable: false,
                rotateX: 600,
                rotateY: 1200
            }
        }
    },
    interactivity: {
        detect_on: 'canvas',
        events: {
            onhover: {
                enable: true,
                mode: 'grab'
            },
            onclick: {
                enable: true,
                mode: 'push'
            },
            resize: true
        },
        modes: {
            grab: {
                distance: 140,
                line_linked: {
                    opacity: 1
                }
            },
            bubble: {
                distance: 400,
                size: 40,
                duration: 2,
                opacity: 8,
                speed: 3
            },
            repulse: {
                distance: 200,
                duration: 0.4
            },
            push: {
                particles_nb: 4
            },
            remove: {
                particles_nb: 2
            }
        }
    },
    retina_detect: true
});

var doing = false;
var spin = [new Audio("res/sounds/spin.mp3"),new Audio("res/sounds/spin.mp3"),new Audio("res/sounds/spin.mp3"),new Audio("res/sounds/spin.mp3"),new Audio("res/sounds/spin.mp3"),new Audio("res/sounds/spin.mp3"),new Audio("res/sounds/spin.mp3")];
var coin = [new Audio("res/sounds/coin.mp3"),new Audio("res/sounds/coin.mp3"),new Audio("res/sounds/coin.mp3")]
var win = new Audio("res/sounds/win.mp3");
var lose = new Audio("res/sounds/lose.mp3");
var audio = false;
let status = document.getElementById("status")
var info = true;
var prize ="None";

WinData = {
scale: 10000,
prizes:[
{text:"Epic High Five",prob:0.10},
{text:"Ice Cream !!!", prob:0.13},
{text:"Scandinavian Swimmers",prob:0.23},
{text:"Butchers Son",prob:0.02},
{text:"Movie Night Your Choice",prob:0.25},
{text:"Insomia Cookie", prob:0.22},
{text:"1 Mango", prob:0.05}

]
}; 

function submitForm(){
    var form = document.getElementById("medForm");
    var prizeText = document.getElementById("PrizeText");
    prizeText.value = prize; 
    form.submit();
}

function generateRandomPrize() {
// Create an array to store entries
const entries = [];
// Generate entries based on the scale and probability
WinData.prizes.forEach((prize) => {
const numEntries = Math.floor(WinData.scale * prize.prob);
entries.push(...Array(numEntries).fill(prize.text));
});

// Select a random entry from the array
const randomIndex = Math.floor(Math.random() * entries.length);
const selectedPrize = entries[randomIndex];

return selectedPrize;
}

function doSlot(){
if (doing){return null;}
doing = true;
var winChance = 0.1;
var win = Math.random() < winChance; 
var numChanges = randomInt(1,4)*7
var numeberSlot1 = numChanges+randomInt(1,7)
var numeberSlot2 = numChanges+2*7+randomInt(1,7)
var numeberSlot3 = numChanges+4*7+randomInt(1,7)


var i1 = 0;
var i2 = 0;
var i3 = 0;
var sound = 0
status.innerHTML = "SPINNING"
slot1 = setInterval(spin1, 50);
slot2 = setInterval(spin2, 50);
slot3 = setInterval(spin3, 50);
function spin1(){
i1++;
if (i1>=numeberSlot1){
    coin[0].play()
    clearInterval(slot1);
    return null;
}
slotTile = document.getElementById("slot1");
if (slotTile.className=="a7"){
    slotTile.className = "a0";
}
slotTile.className = "a"+(parseInt(slotTile.className.substring(1))+1)
}
function spin2(){
i2++;
if (i2>=numeberSlot2){
    coin[1].play()
    clearInterval(slot2);
    return null;
}
slotTile = document.getElementById("slot2");
if (slotTile.className=="a7"){
    slotTile.className = "a0";
}
slotTile.className = "a"+(parseInt(slotTile.className.substring(1))+1)
}
function spin3(){
i3++;
if (i3>=numeberSlot3){
    coin[2].play()
    clearInterval(slot3);
    testWin();
    return null;
}
slotTile = document.getElementById("slot3");
if (slotTile.className=="a7"){
    slotTile.className = "a0";
}
sound++;
if (sound==spin.length){
    sound=0;
}
spin[sound].play();
slotTile.className = "a"+(parseInt(slotTile.className.substring(1))+1)
}
}

function testWin(){
var slot1 = document.getElementById("slot1").className
var slot2 = document.getElementById("slot2").className
var slot3 = document.getElementById("slot3").className

if (((slot1 == slot2 && slot2 == slot3) ||
(slot1 == slot2 && slot3 == "a7") ||
(slot1 == slot3 && slot2 == "a7") ||
(slot2 == slot3 && slot1 == "a7") ||
(slot1 == slot2 && slot1 == "a7") ||
(slot1 == slot3 && slot1 == "a7") ||
(slot2 == slot3 && slot2 == "a7") ) && !(slot1 == slot2 && slot2 == slot3 && slot1=="a7")){

prize = generateRandomPrize();
status.innerHTML = "YOU WIN! " + prize;
win.play();
}else{
status.innerHTML = "YOU LOSE!"
lose.play();
}
//submit form in 5 seconds 
setTimeout(function() {
submitForm();
}, 2500);
doing = false;
}

function toggleAudio(){
if (!audio){
audio = !audio;
for (var x of spin){
    x.volume = 0.5;
}
for (var x of coin){
    x.volume = 0.5;
}
win.volume = 1.0;
lose.volume = 1.0;
}else{
audio = !audio;
for (var x of spin){
    x.volume = 0;
}
for (var x of coin){
    x.volume = 0;
}
win.volume = 0;
lose.volume = 0;
}
document.getElementById("audio").src = "res/icons/audio"+(audio?"On":"Off")+".png";
}

function randomInt(min, max){
return Math.floor((Math.random() * (max-min+1)) + min);
}
