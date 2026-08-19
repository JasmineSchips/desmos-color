import { Calc } from "./setup.js";

export function top() {
    const models = Calc.getExpressions()
		.filter(expr => expr.type === 'expression' && expr.latex)
		.map(expr => Calc.controller.getItemModel(expr.id));

    for (const model of models) {
		const tree = Desmos.Private.Parser.parse(model.latex);
		if (tree._dependencies.includes("z")) return model
    }
}