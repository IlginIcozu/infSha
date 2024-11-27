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

// Random function
float rand(vec2 co){
    return fract(sin(dot(co.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

// Smooth noise function using fractional Brownian motion (fBM)
float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);
    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(mix(rand(i), rand(i + vec2(1.0, 0.0)), u.x),
               mix(rand(i + vec2(0.0, 1.0)), rand(i + vec2(1.0, 1.0)), u.x), u.y);
}

// fbm (fractional Brownian motion) function to add layers of noise
float fbm(vec2 st) {
    float value = 0.0;
    float amplitude = 0.5;
    vec2 shift = vec2(100.0);
    for (int i = 0; i < 5; i++) {
        value += amplitude * noise(st);
        st = st * 2.0 + shift;
        amplitude *= 0.5;
    }
    return value;
}

float edgeDetection(vec2 uv) {
    vec3 texColor = texture2D(img, uv).rgb;
    vec3 texColorRight = texture2D(img, uv + vec2(1.0 / u_resolution.x, 0.0)).rgb;
    vec3 texColorUp = texture2D(img, uv + vec2(0.0, 1.0 / u_resolution.y)).rgb;
    float edge = length(texColor - texColorRight) + length(texColor - texColorUp);
    return edge;
}



// Vibrant color gradient function based on a noise value
vec3 colorGradient(float t) {
    vec3 col1 = vec3(0.8, 0.2, 0.6);  // Vibrant purple
    vec3 col2 = vec3(0.3, 0.2, 0.5);  // Vibrant green
    vec3 col3 = vec3(0.2, 0.4, 0.8);  // Vibrant blue
    vec3 col4 = vec3(1.0, 0.6, 0.2);  // Vibrant orange

    if (t < 0.33) {
        return mix(col1, col2, t * 3.0); // From purple to green
    } else if (t < 0.66) {
        return mix(col2, col3, (t - 0.33) * 3.0); // From green to blue
    } else {
        return mix(col3, col4, (t - 0.66) * 3.0); // From blue to orange
    }
}

vec3 quantize(vec3 color, float levels) {
    return floor(color * levels) / levels;
}

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    uv.x *= u_resolution.x / u_resolution.y; // Maintain aspect ratio

    // Move UV coordinates over time for fluid motion
    // uv.y += u_time * 0.02;  // Control speed of downward motion
    // uv.x += sin(u_time * 0.3) * 0.01;  // Horizontal wave motion

    // Introduce interactivity with mouse influence
    float distToMouse = distance(uv, u_mouse / u_resolution.xy);
    uv.y += distToMouse * 0.1;  // Introduce slight distortion based on mouse position

    // Add sortValue for vertical distortion
    float sortValue = rand(uv/2.0);

    // Adjust uv.y with sortValue to create grain effect
    vec2 sortedUV = uv;
    sortedUV.y = mix(uv.y, sortValue, 0.1); // Adjust blending factor for fluidity

    // Add fractional Brownian motion for fluid grain effect
    float grain = fbm(sortedUV * 10.0);  // The higher the multiplier, the more detail in grain

    // Subtle distortion based on noise
    float distortion = noise(sortedUV * 5.0 + u_time * 0.5);
    sortedUV.y += distortion * 0.05;

    // Combine noise for final pattern
    float finalPattern = mix(grain, distortion, 0.5);

    // Map the final pattern to vibrant color gradients
    vec3 c = colorGradient(finalPattern);

    vec2 displacement = texture2D(img, uv).rg * 0.1;

    c += texture2D(img, uv + ceil(rand(uv))).rgb * 0.3;
    c -= texture2D(img, sortedUV ).rgb * 0.75;

     // c += texture2D(img, uv + ceil(rand(uv))).rgb;
    // c -= texture2D(img, sortedUV ).rgb;

    // float levels = 20.0; // Adjust the number of levels as desired
    // c = quantize(c, levels);
    
    // Output the final vibrant color
    gl_FragColor = vec4(c, 1.0);
}
