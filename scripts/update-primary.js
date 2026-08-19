import { Calc, state } from "./setup.js";
import { complexParser } from "./complex-parser.js";
import { updateProgram } from "./update-program.js";
import { resizeCanvas } from "./resize-canvas.js";
import { top } from "./utils.js";

function glslFunction(name, variable, expression) {
    return `\nvec2 ${name}(vec2 z) {\n    return ${expression};\n}`;
}


export function updatePrimary() {
	const { fragPrimary } = state
	if (!top()) {
		console.log("Update primary failed (no top)")
		return updateProgram(true)
	}
	const latex = top().latex
	if (!latex) {
		console.log("Update primary failed (latex check)")
		return updateProgram(true)
	};
	const tree = Desmos.Private.Parser.parse(latex);
	const expression = complexParser(tree);
	if (!expression) {
		console.log("Update primary failed (expression check)")
		return updateProgram(true);
	}
	state.fragPrimary = glslFunction(
		'renderedFunc',
		tree._argSymbols || ['z'],
		expression
	);
	updateProgram();
}