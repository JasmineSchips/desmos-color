import { state } from "./setup.js";

function findUniform(uniformName) {
    const { uniforms } = state
	return Object.values(uniforms).find(s => s.name === uniformName);
}

export function complexParser(tree, variables = []) {
    const { mode, functions } = state
    const pre = mode + '_';
	const log = mode === 'cl';
	if (!tree) return '';
	const args = tree.args?.map(arg => complexParser(arg, variables));
	switch (tree.type) {
		case 'Add':
			return `${pre}add(${args.join()})`;
		case 'Subtract':
			return `${pre}sub(${args.join()})`;
		case 'Multiply':
			return `${pre}mul(${args.join()})`;
		case 'DotMultiply':
			return `${pre}mul(${args.join()})`;
		case 'Divide':
			return `${pre}div(${args.join()})`;
		case 'Negative':
			return log
				? `(vec2(0, 3.14159265359) + ${args.join()})`
				: `(-1. * (${args.join()}))`;
		case 'Exponent':
			return `${pre}pow(${args.join()})`;
		case 'Factorial':
			return `${pre}factorial(${args.join()})`;
		case 'Norm':
			return log
				? `vec2(${args.join()}.x, 0.)`
				: `vec2(length(${args.join()}), 0.)`;
		case 'Constant':
			const constant = `vec2(${tree._constantValue.n}. / ${tree._constantValue.d}., 0.)`;
			return log ? `cl(${constant})` : constant;
		case 'Identifier':
			switch (tree._symbol) {
				case 'z':
					return 'z';
				case 'i':
					return `i`;
				case 'pi':
					return `pi`;
				case 'tau':
					return `tau`;
				case 'e':
					return `e`;
				default:
					if (variables.includes(tree._symbol)) return tree._symbol;
					const uniform = findUniform(tree._symbol);
					if (!uniform) return `vec2(${tree._symbol}, 0.)`;
					if (uniform.type === 'real')
						return log
							? `cl(vec2(${uniform.name}, 0.))`
							: `vec2(${uniform.name}, 0.)`;
					else if (uniform.type === 'complex')
						return log ? `cl(${uniform.name})` : uniform.name;
			}
		case 'DotAccess':
			let dot = tree.args[1]._symbol;
			if (['r', 'g', 's', 't'].includes(dot)) return;
			if (dot === 'real') dot = 'x';
			else if (dot === 'imag') dot = 'y';
			return log
				? `cl_ln(vec2(cl_exp(${args[0]}).${dot}, 0.))`
				: `vec2(${args[0]}.${dot}, 0.)`;
		case 'NamedCoordinateAccess':
			return log
				? `cl_ln(vec2(cl_exp(${args[0]}).${tree.symbol}, 0.))`
				: `vec2(${args[0]}.${tree.symbol}, 0.)`;
		case 'FunctionCall':
			switch (tree._symbol) {
				case 'z':
					return `${pre}mul(z, ${args.join()})`;
				case 'i':
					return `${pre}mul(i, ${args.join()})`;
				case 'pi':
					return `${pre}mul(pi, ${args.join()})`;
				case 'tau':
					return `${pre}mul(tau, ${args.join()})`;
				case 'e':
					return `${pre}mul(e, ${args.join()})`;
				case 'logbase':
					return `${pre}logbase(${args.join()})`;
				case 'mod':
					return `vec2(mod(${args[0]}.x, ${args[1]}.x), 0.)`;
				case 'arctan':
					if (tree.args.length === 1)
						return `${pre}arctan(${args.join()})`;
					else return; // TODO: add case for atan2, possibly need to rewrite to keep track of real/imag
			}
			if (
				Object.values(functions).find(
					func => func.name === tree._symbol
				)
			) {
				return `${tree._symbol}(${args.join()})`;
			}
			return `${pre}${tree._symbol}(${args.join()})`;
		case 'FunctionDefinition':
			return complexParser(tree._expression, variables);
	}
}