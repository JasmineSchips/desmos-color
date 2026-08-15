import { complexFunctions, fragMain, fragPrefix, vertSource, whiteFrag, clFunctions, cl_fragMain } from "../shader-code/shaders.js";
import { sortedByDependencies } from "./sorted-by-dependencies.js";
import { resizeCanvas } from "./resize-canvas.js";
import { gl, state } from "./setup.js";

function glslFunction(name, variables, expression) {
	return `
vec2 ${name}(${(variables[0] ? 'vec2 ' : '') + variables.join(', vec2 ')}) {
	return ${expression};
}

`;
}

function setupShader(shaderType, source) {
    const shader = gl.createShader(shaderType);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        gl.deleteShader(shader);
        throw new Error('Shader compilation failed:\n' + source);
    }
    return shader;
}

function setupProgram(fragSource) {
    const program = gl.createProgram();
    const vertShader = setupShader(gl.VERTEX_SHADER, vertSource);
    const fragShader = setupShader(gl.FRAGMENT_SHADER, fragSource);
    gl.attachShader(program, vertShader);
    gl.attachShader(program, fragShader);
    gl.linkProgram(program);
    return program;
}

function generateFragFunctions() {
    const { functions } = state
	let fragFunctions = '';
	for (const func of sortedByDependencies(functions))
		fragFunctions += glslFunction(func.name, func.argSymbols, func.value);
	return fragFunctions;
}

function generateFragUniforms() {
    const { uniforms } = state
	let fragUniforms = '';
	for (const id in uniforms) {
		const uniform = uniforms[id];
		if (uniform.type === 'real')
			fragUniforms += `\nuniform float ${uniform.name};`;
		else if (uniform.type === 'complex')
			fragUniforms += `\nuniform vec2 ${uniform.name};`;
	}
	return fragUniforms;
}

export function updateProgram(blank = false) {
    const { vao, mode, uniforms, fragPrimary } = state
	const fragFunctions = generateFragFunctions();
	const fragUniforms = generateFragUniforms();
	const fragMainChoice = mode === 'cl' ? cl_fragMain : fragMain;
	const utilFunctions = mode === 'cl' ? clFunctions : complexFunctions;
	const fragSource = blank
		? whiteFrag
		: fragPrefix +
		  fragUniforms +
		  utilFunctions +
		  fragFunctions +
		  fragPrimary +
		  fragMainChoice;
	let program;
	try {
		program = setupProgram(fragSource);
	} catch {
		console.log('Update program failed')
		// console.log(fragSource)
		return updateProgram(true);
	}

	if (state.currentProgram) gl.deleteProgram(state.currentProgram);
	state.currentProgram = program;
	gl.useProgram(state.currentProgram);

	const positionLocation = gl.getAttribLocation(state.currentProgram, 'a_position');
	gl.bindVertexArray(vao);
	gl.enableVertexAttribArray(positionLocation);
	gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
	gl.bindVertexArray(null);

	state.resolutionLocation = gl.getUniformLocation(state.currentProgram, 'Resolution');
	state.viewportLocation = gl.getUniformLocation(state.currentProgram, 'Viewport');
	for (const id in uniforms) {
		const uniform = uniforms[id];
		uniform.location = gl.getUniformLocation(state.currentProgram, uniform.name);
		if (uniform.type == 'real')
			gl.uniform1f(uniform.location, uniform.value);
		else if (uniform.type === 'complex')
			gl.uniform2f(uniform.location, uniform.value[0], uniform.value[1]);
	}
	resizeCanvas();
}