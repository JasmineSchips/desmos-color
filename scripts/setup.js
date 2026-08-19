const calcDiv = document.getElementById('calculator');
const Calc = Desmos.GraphingCalculator(calcDiv, {
    showGrid: false,
    showXAxis: false,
    showYAxis: false,
    border: false,
    expressions: true,
    allowComplex: true
})
window.Calc = Calc
Calc.updateSettings({ complex: true })
Calc.setExpression({ id: '1', latex: '\\frac{\\ln\\left(6-z^{6}\\right)}{z}2^a' });
Calc.setExpression({ id: '2', latex: 'a=0', sliderBounds: { min: 0, max: 1 }, playing: true })
Calc.controller.dispatch({
    type: 'set-slider-loopmode',
    id: '2',
    loopMode: 'LOOP_FORWARD'
});

const canvas = document.createElement('canvas');
canvas.className = 'shader';
const dcgGrapher2d = document.querySelector('.dcg-grapher-2d');
if (dcgGrapher2d) dcgGrapher2d.prepend(canvas);

const gl = canvas.getContext('webgl2', { preserveDrawingBuffer: true });

const state = {
    fragPrimary: '',
    currentProgram: undefined,
    resolutionLocation: undefined,
    viewportLocation: undefined,
    uniforms: [],
    functions: [],
    mode: 'c',
    vao: gl.createVertexArray()
}

gl.bindVertexArray(state.vao);

const positions = new Float32Array([
    -1, -1,
    1, -1,
    -1, 1,
    -1, 1,
    1, -1,
    1, 1,
]);
const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

export {Calc, gl, canvas, state}