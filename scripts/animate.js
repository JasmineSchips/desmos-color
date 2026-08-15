import { Calc, gl, state } from "./setup.js";

export function animate(repeat = true) {
    const { vao, viewportLocation } = state
	const { xmax, xmin, ymax, ymin } = Calc.getState().graph.viewport;
	gl.uniform4f(viewportLocation, xmin, ymin, xmax, ymax);
	gl.bindVertexArray(vao);
	gl.drawArrays(gl.TRIANGLES, 0, 6);

	if (repeat) requestAnimationFrame(animate);
}