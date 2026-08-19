import { Calc, state, gl } from "./setup.js";
import { updatePrimary } from "./update-primary.js";
import { complexParser } from "./complex-parser.js";

function top() {
	return Calc.getExpressions().find(expr => expr.id !== 'z');
}

export function changeHandler(change) {
    const { functions, uniforms } = state
	const id = change.id;
	if (id === top().id) updatePrimary();
	let shouldUpdate = true;
	const inUniforms = !!uniforms[id];
	const isVar = change.isVariable;

	if (change.isFunction) {
		const tree = Desmos.Private.Parser.parse(change.latex);
		change.value = complexParser(tree, change.argSymbols);
		functions[id] = change;
	}
	
	else if (functions[id]) delete functions[id];
	else if (isVar && !inUniforms) uniforms[id] = change;
	
	else if (isVar && inUniforms) {
		const uniform = uniforms[id];
		if (uniform.type === change.type) shouldUpdate = false;

		uniform.value = change.value;
		uniform.type = change.type;

		if (uniform.type == 'real')
			gl.uniform1f(uniform.location, uniform.value);

		else if (uniform.type === 'complex')
			gl.uniform2f(uniform.location, uniform.value[0], uniform.value[1]);

	}

	else if (inUniforms) delete uniforms[id];
	else shouldUpdate = false;
	return shouldUpdate;
}