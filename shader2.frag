#ifdef GL_ES
precision mediump float;
#endif
#define PI 3.14159265359
const float PHI = 1.61803398874989484820459;
const float SEED = 43758.0;

uniform float u_time;         // Time uniform for animation
uniform vec2 u_resolution;    // Resolution uniform for aspect ratio
uniform vec2 u_mouse;         // Mouse position for interactivity
uniform sampler2D img;
uniform float u_t;
uniform float u_colorFreq;
uniform float u_randomSeed; 
uniform float u_dir;
uniform float u_tex;
uniform float u_cols;
uniform float u_grid;
uniform float u_clear;
uniform float u_mousePressTime;
uniform vec2 u_mousePressPosition;
uniform float u_mousePressed;
uniform vec2 u_dropPositions[50]; // Positions of color drops
uniform vec3 u_dropColors[50];    // Colors of color drops
uniform int u_numDrops;           // Number of active color drops
uniform float u_chro;
uniform sampler2D u_prevFrame; // Previous frame texture for feedback loop




// Random function
float rand(vec2 co){
    return fract(sin(dot(co.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

// Smooth noise function using fractional Brownian motion (fBM)
float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);
    vec2 u = f * f * (3.0 - 2.0 * f);

    // return mix(mix(rand(i), rand(i + vec2(1.0, 0.0)), u.y),
    return mix(mix(rand(i), rand(i + vec2(1.0, 0.0)), u.x),
            mix(rand(i + vec2(0.0, 1.0)), rand(i + vec2(1.0, 1.0)), u.x), u.y);

            
            // mix(rand(i + vec2(0.0, 1.0)), rand(i + vec2(1.0, 1.0)), u.x), u.x);
}

float noised(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);
    vec2 u = f * f * (3.0 - 2.0 * f);

    // return mix(mix(rand(i), rand(i + vec2(1.0, 0.0)), u.y),
    return mix(mix(rand(i), rand(i + vec2(1.0, 0.0)), u.x),
            mix(rand(i + vec2(0.0, 1.0)), rand(i + vec2(1.0, 1.0)), u.x), u.y);

    
}
// fbm (fractional Brownian motion) function to add layers of noise
float fbm(vec2 st) {
    float value = 0.0;
    float amplitude = 0.8;
    vec2 shift = vec2(10.0);
    for (int i = 0; i < 10; i++) {
        value += amplitude * noise(st);
        st = st * 2.0 + shift;
        amplitude *= 0.6;
    }
    return value;
}


float moirePattern(vec2 uv, float scale) {
    return sin((uv.x + uv.y) * scale) * sin((uv.x - uv.y) * scale);
}


// Vibrant color gradient function based on a noise value
vec3 colorGradient(float t) {

    vec3 col1;
    vec3 col2;
    vec3 col3; 
    vec3 col4; 

    if(u_cols == 0.0){
     col1 = vec3(0.8, 0.2, 0.6);  // Vibrant purple
     col2 = vec3(0.35, 0.25, 0.55);  // Vibrant green
     col3 = vec3(0.2, 0.4, 0.8);  // Vibrant blue
     col4 = vec3(1.0, 0.6, 0.2);  // Vibrant orange
    }else if(u_cols == 1.0){
     col1 = vec3(0.129, 0.145, 0.161);   // #212529
     col2 = vec3(0.204, 0.227, 0.251);   // #343A40
     col3 = vec3(0.424, 0.459, 0.490);   // #6C757D
     col4 = vec3(0.678, 0.71, 0.741);   // #ADB5BD
    }else if(u_cols == 2.0){
    col1 = vec3(0.039, 0.035, 0.031);
    col2 = vec3(0.133, 0.2, 0.231);
    col3 = vec3(0.918, 0.878, 0.835);
    col4 = vec3(0.776, 0.675, 0.561);
    }else if(u_cols == 3.0){
     col1 = vec3(0.749, 0.741, 0.757);   // #BFBDC1
     col2 = vec3(0.427, 0.416, 0.459);   // #6D6A75
     col3 = vec3(0.216, 0.196, 0.243);   // #37323E
     col4 = vec3(0.871, 0.722, 0.255);   // #DEB841
    }else if(u_cols == 4.0){
     col1 = vec3(0.0, 0.278, 0.467);    // #004777
     col2 = vec3(0.639, 0.0, 0.0);      // #A30000
     col3 = vec3(1.0, 0.467, 0.0);      // #FF7700
     col4 = vec3(0.937, 0.824, 0.553);  // #EFD28D
    }else if(u_cols == 5.0){
     col1 = vec3(0.855, 0.824, 0.847);   // #DAD2D8
     col2 = vec3(0.078, 0.212, 0.259);   // #143642
     col3 = vec3(0.059, 0.545, 0.553);   // #0F8B8D
     col4 = vec3(0.925, 0.604, 0.161);   // #EC9A29
    }

        // Generate permutation index from random seed
    float permutation = mod(floor(u_randomSeed * 6.0), 6.0);
    // Declare variables for colors in the selected order
    vec3 c1, c2, c3, c4;

    // Assign colors based on the permutation index using float comparisons
    if (permutation < 1.0) {
        c1 = col1; c2 = col2; c3 = col3; c4 = col4;
    } else if (permutation < 2.0) {
        c1 = col1; c2 = col3; c3 = col2; c4 = col4;
    } else if (permutation < 3.0) {
        c1 = col1; c2 = col4; c3 = col2; c4 = col3;
    } else if (permutation < 4.0) {
        c1 = col2; c2 = col1; c3 = col3; c4 = col4;
    } else if (permutation < 5.0) {
        c1 = col2; c2 = col3; c3 = col1; c4 = col4;
    } else {
        c1 = col2; c2 = col4; c3 = col1; c4 = col3;
    }

    if (t < 0.33) {
        return mix(c1, c2, t * 3.0); // From purple to green
    } else if (t < 0.66) {
        return mix(c2, c3, (t - 0.33) * 3.0); // From green to blue
    } else {
        return mix(c3, c4, (t - 0.66) * 3.0); // From blue to orange
    }

//    // Normalize t to [0, 1]
//     t = clamp(t, 0.0, 1.0);

//     // Calculate weights using smoothstep functions
//     float w1 = smoothstep(0.0, 0.5, 1.0 - t);
//     float w2 = smoothstep(0.0, 0.5, t);
//     float w3 = smoothstep(0.5, 1.0, t);
//     float w4 = smoothstep(0.5, 1.0, 1.0 - t);

//     // Normalize weights
//     float totalWeight = w1 + w2 + w3 + w4;
//     w1 /= totalWeight;
//     w2 /= totalWeight;
//     w3 /= totalWeight;
//     w4 /= totalWeight;

//     // Blend the colors
//     vec3 color = c1 * w1 + c2 * w2 + c3 * w3 + c4 * w4;

//     return color;

}

vec2 simulateMotion(vec2 uv, float time) {
    float motionScale = 20.0;       // Adjusts the scale of the motion vectors
    float motionSpeed = 0.5;        // Controls the speed of the motion
    float displacementStrength = 0.02; // Strength of the displacement

    // Generate motion vectors using noise
    float angle = noise(uv * motionScale + time * motionSpeed) * PI * 2.0;

    // Create a displacement vector from the angle
    vec2 motionVector = vec2(cos(angle), sin(angle)) * displacementStrength;

    return motionVector;
}


vec2 computeDisplacement(vec2 uv, float time) {
    float noiseScale = 500.0;          // Controls particle density
    float noiseSpeed = 0.1 * (u_dir * -1.0);           // Controls particle movement speed
    float displacementStrength = 0.0005; // Controls displacement amount

    // Use fbm for detailed noise
    float n = fbm(uv * noiseScale + time * noiseSpeed);

    // Map noise to an angle to create directional displacement
    float angle = n * PI * 2.0;

    // Compute displacement vector based on angle
    vec2 displacement = vec2(cos(angle), sin(angle)) * displacementStrength;

    return displacement;
}



void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    // uv.x *= u_resolution.x / u_resolution.y; // Maintain aspect ratio

 // Compute displacement using the function
    vec2 displacement = computeDisplacement(uv, u_time);

    // Apply displacement to UV coordinates
    vec2 displacedUV = uv + displacement;
    // Add sortValue for vertical distortion

    vec2 sortedUV = displacedUV;

    float sortValue = rand(displacedUV*1.0);
    if(u_t < 0.5){
    sortedUV.y = mix(displacedUV.y, sortValue, 0.1); // Adjust blending factor for fluidity
    }else{
    sortedUV.x = mix(displacedUV.x, sortValue, 0.1); // Adjust blending factor for fluidity
    }
    
    // 

    // Add fractional Brownian motion for fluid grain effect
    float grain = fbm(sortedUV * u_clear);  // The higher the multiplier, the more detail in grain

    // Subtle distortion based on noise
    float distortion = noise(vec2(sortedUV.x,sortedUV.x) * 5.0 - (u_time * 0.5) * u_dir);
    sortedUV.x += distortion * 0.05;
    float blendScale = u_grid;    // Controls spatial frequency of blending variations
    float timeScale = 1.0;     // Controls temporal variation speed
    float blendFactor = noise(vec2(uv.x,uv.y) * blendScale * timeScale ) ;


    float finalPattern;

    if(u_tex == 1.0){
    finalPattern = mix(grain, distortion, 0.5 * (blendFactor*u_colorFreq));
    }else if(u_tex == 2.0){
    finalPattern = mix(grain, distortion, 0.5 / (blendFactor*u_colorFreq));
    }else if(u_tex == 3.0){
    finalPattern = mix(grain, distortion, 0.5 + (blendFactor*u_colorFreq));
    }else if(u_tex == 4.0){
    finalPattern = mix(grain, distortion, 0.5 - (blendFactor*u_colorFreq));
    }
    


    vec3 baseColor = colorGradient(finalPattern);

    // Initialize the color with the base color
    vec3 c = baseColor;



    // Loop over the color drops
    for (int i = 0; i < 50; i++) {
        if (i >= u_numDrops) {
            break; // No more active drops
        }

        // Get the drop position and color
        vec2 dropPos = u_dropPositions[i];
        vec3 dropColor = u_dropColors[i];

        // Compute the distance from the drop
        float dist = length(uv - dropPos);

        // Define the radius of influence
        float radius = 0.2; // Adjust as needed

        // Compute the influence based on distance
        float influence = smoothstep(radius, 0.0, dist);

        // Apply the influence to blend the drop color with the base color
        c = mix(c, dropColor, influence);
    }



    // --- Datamosh Effect Using Previous Frame ---

    // Sample the previous frame at current UV
    vec3 prevColor = texture2D(img, uv).rgb;

    // Compute frame difference
    vec3 frameDifference = c - prevColor;

    // Compute motion vector field based on frame difference
    vec2 motionVector = frameDifference.rg * 0.1; // Adjust scaling as needed

    // Apply motion vector to UV coordinates
    vec2 moshUV = uv + motionVector;

    // Ensure moshUV stays within [0.0, 1.0]
    moshUV = mod(moshUV, 1.0);

    // Sample the previous frame with displaced UVs
    vec3 moshColor = texture2D(img, moshUV).rgb;

    // Blend the mosh color with the current color
    float feedbackAmount = 0.9; // Adjust for desired effect
    c = mix(c, moshColor, feedbackAmount);


    c = clamp(c, 0.0, 1.0);


     float randomOffset = rand(sortedUV) * 0.02;  // Scale down to make changes subtle

    c += texture2D(img, sortedUV - randomOffset ).rgb * 0.05;  
    c -= texture2D(img, vec2(sortedUV.x,sortedUV.y) * sortedUV).rgb * 0.05;       


    
    // c += texture2D(img, sortedUV - randomOffset ).rgb * 0.5;  
    // c -= texture2D(img, vec2(sortedUV.x,sortedUV.y) * sortedUV).rgb * 0.5;       

float offset = 1.0 / min(u_resolution.x, u_resolution.y);




float aberrationAmount = 0.002; // Adjust for intensity
vec2 aberrationOffset = vec2(aberrationAmount, 0.0);


float r = texture2D(img, uv - offset + vec2(aberrationOffset.x, 0.0)).r;
float g = texture2D(img, uv - offset).g;
float b = texture2D(img, uv - offset - vec2(aberrationOffset.x, 0.0)).b;

vec3 chro = vec3(r, g, b);



c = mix(c, chro, u_chro);////0.9 bayay iyi

c += vec3(0.001);






    gl_FragColor = vec4(c, 1.0);
}