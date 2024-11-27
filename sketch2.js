let basicShader;
let shaderTexture;
let randT, colorFreq, rseed;
let dir = 1; // Current direction
let targetDir = 1; // Target direction to interpolate to
let transitionStartTime = 0; // Time when the transition started
let transitionDuration = 10000; // 2 seconds (in milliseconds)

let mousePressedTime = 0;
let mousePressPosition = [0, 0];
let mousePressedFlag = false;
let numColors = 2; // Start with 2 colors
const maxColors = 4; // Maximum number of colors in the palette

const maxShaderDrops = 50; // Maximum number of color drops
let colorDrops = []; // Array to store color drops
let paletteColors = []; // Array to store the current color palette

let tex, cols, grid, clear

let isMousePressed = false; // Flag to track if the mouse is pressed
let chro

let bufferA, bufferB;
let shaderA, shaderB;


let vertSrc, fragSrc;

function preload() {
    // Load shader source code as strings
    vertSrc = loadStrings('shader.vert');
    fragSrc = loadStrings('shader2.frag');
}

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);

    let seed = random() * 999999;
    // seed = 741974.3771401073
    console.log(seed)
    randomSeed(seed);
    noiseSeed(seed);

    // Create two buffers for ping-pong rendering
    bufferA = createGraphics(width, height, WEBGL);
    bufferB = createGraphics(width, height, WEBGL);

    bufferA.noStroke();
    bufferB.noStroke();
    bufferA.pixelDensity(1);
    bufferB.pixelDensity(1);

    // Convert shader source arrays to strings
    vertSrc = vertSrc.join('\n');
    fragSrc = fragSrc.join('\n');

    // Compile shaders in each buffer's context
    shaderA = bufferA.createShader(vertSrc, fragSrc);
    shaderB = bufferB.createShader(vertSrc, fragSrc);


    pixelDensity(1);
    noStroke();

    randT = random(1);
    rseed = random(1);
    colorFreq = random(0.5, random([5.0, 3.0, 4.0, 8.0]));
    tex = random([1.0, 1.0, 2.0, 3.0]) ////4 tehlikeli gibi
    cols = random([0.0, 1.0, 2.0, 3.0, 4.0, 5.0])
    grid = random([1.0, 1.0, 1.0, 1.0, 2.0, 1.0, 2.0, 3.0])
    clear = random([1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 1.0, 2.0, 10.0])



    console.log("tex: " + tex)

    chro = random([.1, .8, .3, .4, .5, .5, .6, .7, .8, .9, .9])





    // **Initialize the palette based on cols value**
    if (cols === 0.0) {
        paletteColors = [
            [0.8, 0.2, 0.6], // Vibrant purple
            [0.35, 0.25, 0.55], // Vibrant green
            [0.2, 0.4, 0.8], // Vibrant blue
            [1.0, 0.6, 0.2] // Vibrant orange
        ];
    } else if (cols === 1.0) {
        paletteColors = [
            [0.129, 0.145, 0.161], // #212529
            [0.204, 0.227, 0.251], // #343A40
            [0.424, 0.459, 0.490], // #6C757D
            [0.678, 0.71, 0.741] // #ADB5BD
        ];
    } else if (cols === 2.0) {
        paletteColors = [
            [0.039, 0.035, 0.031], // Dark tone
            [0.133, 0.2, 0.231], // Greenish tone
            [0.918, 0.878, 0.835], // Light tone
            [0.776, 0.675, 0.561] // Earth tone
        ];
    } else if (cols === 3.0) {
        paletteColors = [
            [0.749, 0.741, 0.757], // Grayish purple
            [0.427, 0.416, 0.459], // Dark purple
            [0.216, 0.196, 0.243], // Deep purple
            [0.871, 0.722, 0.255] // Golden
        ];
    } else if (cols === 4.0) {
        paletteColors = [
            [0.0, 0.278, 0.467], // Blue
            [0.639, 0.0, 0.0], // Red
            [1.0, 0.467, 0.0], // Orange
            [0.937, 0.824, 0.553] // Light brown
        ];
    } else if (cols === 5.0) {
        paletteColors = [
            [0.855, 0.824, 0.847], // Light purple
            [0.078, 0.212, 0.259], // Dark greenish
            [0.059, 0.545, 0.553], // Greenish blue
            [0.925, 0.604, 0.161] // Orange
        ];
    }

    dir = random([-1, 1, 1, 1])
}

function draw() {


    let elapsedTime2 = millis() / 1000.0 - mousePressedTime;

    if (elapsedTime2 > 2.0) {
        mousePressedFlag = false;
    }

    let dropPositions = [];
    let dropColors = [];
    let latestDrops = colorDrops.slice(-maxShaderDrops);

    for (let i = 0; i < maxShaderDrops; i++) {
        if (i < latestDrops.length) {
            dropPositions.push(latestDrops[i].position);
            dropColors.push(latestDrops[i].color);
        } else {
            dropPositions.push([0.0, 0.0]);
            dropColors.push([0.0, 0.0, 0.0]);
        }
    }

    bufferB.shader(shaderB);

    shaderB.setUniform('u_prevFrame', bufferA);

    shaderB.setUniform('u_dropPositions', dropPositions.flat());
    shaderB.setUniform('u_dropColors', dropColors.flat());
    shaderB.setUniform('u_numDrops', latestDrops.length);
    shaderB.setUniform('u_cols', cols);
    shaderB.setUniform('u_pixelDensity', pixelDensity());
    shaderB.setUniform('img', bufferB);
    shaderB.setUniform('u_resolution', [width, height]);
    shaderB.setUniform('u_time', millis() / 1000.0);
    shaderB.setUniform('u_speed', 1.0);
    shaderB.setUniform('u_windSpeed', 1.0);
    shaderB.setUniform('u_mouse', [mouseX, height - mouseY]);
    shaderB.setUniform('u_middle', [width, height]);
    shaderB.setUniform('u_t', randT);
    shaderB.setUniform('u_colorFreq', colorFreq);
    shaderB.setUniform('u_randomSeed', rseed);
    shaderB.setUniform('u_dir', dir); /////////////////////////////////direction
    shaderB.setUniform('u_tex', tex);
    shaderB.setUniform('u_grid', grid);
    shaderB.setUniform('u_clear', clear);
    shaderB.setUniform('u_mousePressTime', mousePressedTime);
    shaderB.setUniform('u_mousePressPosition', mousePressPosition);
    shaderB.setUniform('u_mousePressed', mousePressedFlag ? 1.0 : 0.0);
    shaderB.setUniform('u_numColors', numColors);
    shaderB.setUniform('u_chro', chro);


    bufferB.shader(shaderB);
    bufferB.rect(0, 0, width, height);

    translate(-width / 2, -height / 2);
    image(bufferB, 0, 0);

    let tempBuffer = bufferA;
    bufferA = bufferB;
    bufferB = tempBuffer;

    let tempShader = shaderA;
    shaderA = shaderB;
    shaderB = tempShader;

}

function mousePressed() {
    targetDir *= -1;
    transitionStartTime = millis();

    mousePressedTime = millis() / 1000.0; // Record the time in seconds
    mousePressPosition = [mouseX / width, (height - mouseY) / height]; // Normalize mouse position
    mousePressedFlag = true; // Set the flag to true

    let mouseXNorm = mouseX / width;
    let mouseYNorm = 1.0 - mouseY / height;

    let randomColor = random(paletteColors);

    colorDrops.push({
        position: [mouseXNorm, mouseYNorm],
        color: randomColor
    });
}

function keyPressed() {
    if (key === 'r') {
        colorDrops = [];
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight, WEBGL);
    bufferA.resizeCanvas(windowWidth, windowHeight, WEBGL);
    bufferB.resizeCanvas(windowWidth, windowHeight, WEBGL);
}