import { Calc, state } from "./setup.js";
import { complexParser } from "./complex-parser.js";
import { updateProgram } from "./update-program.js";
import { resizeCanvas } from "./resize-canvas.js";

function glslFunction(name, variable, expression) {
    return `\nvec2 ${name}(vec2 z) {\n    return ${expression};\n}`;
}

function top() {
	return Calc.getExpressions().find(expr => expr.id !== 'z');
}

export function updatePrimary() {
	const { fragPrimary } = state
	const latex = top().latex;
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