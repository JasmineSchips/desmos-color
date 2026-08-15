import { gl, canvas, state } from "./setup.js";
import { animate } from "./animate.js";

function resizeCanvas() {
    const { resolutionLocation } = state
	const graph = document.querySelector('.dcg-graph-inner');
	canvas.setAttribute('width', graph.width);
	canvas.setAttribute('height', graph.height);
	canvas.style.width = graph.style.width;
	canvas.style.height = graph.style.height;
	gl.viewport(0, 0, graph.width, graph.height);
	gl.uniform2f(resolutionLocation, graph.width, graph.height);
	animate(false);
}

const resizeObserver = new ResizeObserver(resizeCanvas);
const graphInner = document.querySelector('.dcg-graph-inner');
if (graphInner) resizeObserver.observe(graphInner);

export { resizeCanvas }