import './style.css'
import * as PIXI from 'pixi.js';
import { gsap } from "gsap";

const app = new PIXI.Application({
    background: '#191919dd',
    resizeTo: window,
});

document.body.appendChild(app.view);

const starTexture = PIXI.Texture.from('https://pixijs.com/assets/star.png');

const starAmount = 1000;
let cameraZ = 0;
const fov = 20;
const baseSpeed = 0.025;
let speed = 0;
let warpSpeed = 0;
const starStretch = 5;
const starBaseSize = 0.05;

// Create the stars
const stars = [];

for (let i = 0; i < starAmount; i++)
{
    const star = {
        sprite: new PIXI.Sprite(starTexture),
        z: 0,
        x: 0,
        y: 0,
    };

    star.sprite.anchor.x = 0.5;
    star.sprite.anchor.y = 0.7;
    randomizeStar(star, true);
    app.stage.addChild(star.sprite);
    stars.push(star);
}

function randomizeStar(star, initial)
{
    star.z = initial ? Math.random() * 2000 : cameraZ + Math.random() * 1000 + 2000;

    // Calculate star positions with radial random coordinate so no star hits the camera.
    const deg = Math.random() * Math.PI * 2;
    const distance = Math.random() * 50 + 1;

    star.x = Math.cos(deg) * distance;
    star.y = Math.sin(deg) * distance;
}

// Change flight speed every 5 seconds
setInterval(() =>
{
    warpSpeed = warpSpeed > 0 ? 0 : 1;
}, 5000);

// Listen for animate update
app.ticker.add((delta) =>
{
    // Simple easing. This should be changed to proper easing function when used for real.
    speed += (warpSpeed - speed) / 20;
    cameraZ += delta * 10 * (speed + baseSpeed);
    for (let i = 0; i < starAmount; i++)
    {
        const star = stars[i];

        if (star.z < cameraZ) randomizeStar(star);

        // Map star 3d position to 2d with really simple projection
        const z = star.z - cameraZ;

        star.sprite.x = star.x * (fov / z) * app.renderer.screen.width + app.renderer.screen.width / 2;
        star.sprite.y = star.y * (fov / z) * app.renderer.screen.width + app.renderer.screen.height / 2;

        // Calculate star scale & rotation.
        const dxCenter = star.sprite.x - app.renderer.screen.width / 2;
        const dyCenter = star.sprite.y - app.renderer.screen.height / 2;
        const distanceCenter = Math.sqrt(dxCenter * dxCenter + dyCenter * dyCenter);
        const distanceScale = Math.max(0, (2000 - z) / 2000);

        star.sprite.scale.x = distanceScale * starBaseSize;
        // Star is looking towards center so that y axis is towards center.
        // Scale the star depending on how fast we are moving, what the stretchfactor is
        // and depending on how far away it is from the center.
        star.sprite.scale.y = distanceScale * starBaseSize
            + distanceScale * speed * starStretch * distanceCenter / app.renderer.screen.width;
        star.sprite.rotation = Math.atan2(dyCenter, dxCenter) + Math.PI / 2;
    }
});

//frontend
const root = document.querySelector(':root');
const profile = document.querySelector('.profile');
const content = document.querySelector('.content');
const wrapper = document.querySelector('.wrapper');

profile.addEventListener('click', sizeToScreen);
window.onresize = () => profile.classList.contains("open")? sizeToScreen():null;

function sizeToScreen()
{

    profile.classList.add("open");
    gsap.to(profile, {width:0.8*innerWidth,height:0.8*innerHeight, duration:1})
    gsap.to(profile,{translateX:0, translateY: 0, duration:1})
    gsap.to('.table', { rotationX:0, rotationY:0, rotationZ:0,paddingRight:12, width:"100%", height:"100%", duration:1})
    gsap.to('.card', {padding:5,top:0, width:90,height:165, duration:1});
    gsap.to(".card img", {width:"100%", objectFit:"cover", duration:1})
    gsap.to(".menu", {left:12, top:0}) 
    if(wrapper.style.display !== "flex"){
        if(innerWidth <= 600)root.style.setProperty('--wrapper-width', '90%')
        else root.style.setProperty('--wrapper-width', '50%')
        setTimeout(() => {
            console.log("hello")
            wrapper.style.display = "flex";
            content.style.display = "flex";
        }, 1000);
        setTimeout(() => {
            wrapper.style.animationName = "none";
        }, 2000);
    }else{
        console.log("bbbbbb");
        if(innerWidth <= 600){
            gsap.to(wrapper, {width:"90%", left:"5%", duration:1})
        }else{
            gsap.to(wrapper, {width:"50%", left:"25%", duration:1})
        }
    }
    
    setTimeout(() => {
      const description = document.querySelector('.description');
      const text = description.textContent;
      description.innerHTML = "";
      for(let i = 0; i < text.length; i++){
        let span = document.createElement('span');
        span.textContent = text[i]
        description.appendChild(span);
        if(i == text.length-1){
            span.classList.add("enlighten");
        }
      }
    }, 2000);

}