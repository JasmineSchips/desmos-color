import { state } from "./setup.js";
import { updatePrimary } from "./update-primary.js";
import { changeHandler } from "./change-handler.js";
import { sortedByDependencies } from "./sorted-by-dependencies.js";
import { Calc } from "./setup.js";

function getValueType(obj) {
	let valueType = obj.typed_constant_value.valueType;
	if (valueType === 1) return 'real';
	else if (valueType === 38) return 'complex';
}

function simplify(change) {
	const tree = Desmos.Private.Parser.parse(change.evaluated_latex);
	const isFunction = !!change.function_definition;
	const isVariable =
		change.defined_name &&
		!['x', 'y', 'z'].includes(change.defined_name) &&
		change.typed_constant_value &&
		!isFunction;
	let type, value, argSymbols;
	if (isVariable) {
		type = getValueType(change);
		value = change.typed_constant_value.value;
	}
	if (isFunction) argSymbols = tree._argSymbols;

	return {
		name: change.defined_name,
		latex: change.evaluated_latex,
		dependencies: tree._dependencies,
		isVariable: isVariable,
		isFunction: isFunction,
		type: type,
		value: value,
		argSymbols: argSymbols,
	};
}

function toggleZExpr(id, latex) {
	const line = document.querySelector(`[expr-id="${id}"]`);
	if (line) {
		if (latex.includes('z')) line.setAttribute('z-expr', true);
		else if (line.getAttribute('z-expr'))
			line.setAttribute('z-expr', false);
	}
}
function top() {
	return Calc.getExpressions().find(expr => expr.id !== 'z');
}
function eventHandler(evt) {
    const { functions, uniforms } = state
    switch (evt.type) {
		case 'set-item-latex':
			if (evt.id === top().id) updatePrimary();
			break;

		case 'on-evaluator-changes':
			let shouldUpdate = false;
			let changes = {};
			for (const [id, change] of Object.entries(evt.changes)) {
				if (change.evaluated_latex === undefined) continue;
				changes[id] = simplify(change);
				changes[id].id = id;
			}
			changes = sortedByDependencies(changes);
			for (const change of changes) {
				toggleZExpr(change.id, change.latex);
				shouldUpdate = changeHandler(change) || shouldUpdate;
			}
			if (shouldUpdate) updatePrimary();
			break;

		case 'delete-item-and-animate-out':
			if (uniforms[evt.id]) {
				delete uniforms[evt.id];
				updateProgram();
			}
			if (functions[evt.id]) {
				delete functions[evt.id];
				updateProgram();
			}
	}
};

Calc.controller.dispatcher.register(eventHandler);