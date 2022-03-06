export const vertexSrc = `

    precision mediump float;
    attribute vec2 aVertexPosition;

    uniform mat3 translationMatrix;
    uniform mat3 projectionMatrix;

    void main() {
        gl_Position = vec4((projectionMatrix * translationMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);
    }`;

export const fragmentSrc = `
    precision mediump float;
    uniform vec4 uColor;

    void main() {
        gl_FragColor = uColor;
    }`;

