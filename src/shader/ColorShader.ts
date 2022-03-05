import * as PIXI from 'pixi.js';

const vertexSrc = `
    attribute vec2 aVertexPosition;
    uniform mat3 translationMatrix;
    uniform mat3 projectionMatrix;

    void main() {
      gl_Position = vec4((projectionMatrix * translationMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);
    }`;

const fragmentSrc = `
    uniform vec4 uColor;
    void main() {
        gl_FragColor = uColor;
    }`;

export const getColorShader = () => {
  const uniforms = {
    uColor: new Float32Array([1, 1, 1, 1]),
    tint: new Float32Array([1, 1, 1, 1]),
  };
  return PIXI.Shader.from(vertexSrc, fragmentSrc, uniforms);
}
