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

function containsZ(change) {
	return change.variables.includes('z')
		|| change.table_info?.independent_variable.includes('z')
}

function toggleZExpr(id, latex) {
	const lines = document.querySelectorAll(`[expr-id="${id}"]`);
	if (!lines[0]) return
	for (const line of lines) {
		if (latex.includes('z')) line.setAttribute('z-expr', true);
		else if (line.getAttribute('z-expr'))
			line.setAttribute('z-expr', false);
	}
}

function removeMisunderstandings(change, id) {
	if (change.error?.key === 'shared-calculator-error-equation-required-symbol') change.error = undefined
	if (change.variables) change.variables = change.variables.filter(v => v !== 'z');
	if (change.error?.vars?.variables) {
		let variables = change.error.vars.variables.split("', '")
		variables = variables.filter(v => v !== "z")
		change.error.vars.variables = variables.join("', '")
	} 
	const model = Calc.controller.getItemModel(id);
	if (model) model.error = undefined;
}

function top() {
	return Calc.getExpressions().find(expr => expr.latex.includes('z'));
}
export function eventHandler(evt) {
    const { functions, uniforms } = state
	let shouldUpdate = false
    switch (evt.type) {
		case 'set-item-latex':
			if (evt.id === top().id) shouldUpdate = true
			break;

		case 'on-evaluator-changes': // called for pretty much any change, including writing
			let changes = {};
			for (const [id, change] of Object.entries(evt.changes)) {
				if (change.evaluated_latex === undefined) continue;		
				if (containsZ(change)) removeMisunderstandings(change, id)
				changes[id] = simplify(change);
				changes[id].id = id;
			}
			changes = sortedByDependencies(changes);
			for (const change of changes) {
				toggleZExpr(change.id, change.latex);
				shouldUpdate = changeHandler(change) || shouldUpdate;
			}
			
			break;

		case 'delete-item-and-animate-out':
			if (uniforms[evt.id]) {
				delete uniforms[evt.id];
				shouldUpdate = true
			}
			if (functions[evt.id]) {
				delete functions[evt.id];
				shouldUpdate = true
			}
	}
	if (shouldUpdate) updatePrimary();
	return evt
};

const dispatcher = Calc.controller.dispatcher
const origDispatcher = dispatcher.dispatch.bind(dispatcher)
dispatcher.dispatch = evt => origDispatcher(eventHandler(evt));
