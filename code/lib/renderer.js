export class WebGLRenderer {
	constructor() {
		this.domElement = document.createElement("canvas");
		this.gl =
			this.domElement.getContext("webgl", { preserveDrawingBuffer: true }) ||
			this.domElement.getContext("experimental-webgl");

		if (!this.gl) throw new Error("WebGL is not supported");

		this.setSize(50, 50);
		this.clear(1.0, 1.0, 1.0, 1.0);
	}


	setSize(width, height) {
		this.domElement.width = width;
		this.domElement.height = height;
		this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
		this.resolution = new Float32Array([this.gl.canvas.width, this.gl.canvas.height, 1.0]);
	}
	clear(r, g, b, a) {
		this.gl.clearColor(r, g, b, a);
		this.gl.clear(this.gl.COLOR_BUFFER_BIT);
	}

	setAnimationLoop(animation) {
		function renderLoop() {
			animation();
			window.requestAnimationFrame(renderLoop);
		}

		renderLoop();
	}

	// render function executes all the time
	// can be thought of as the main game loop
	// @param {scene} - Scene to render
	// @param {shader} - Shader to use
	// for each model in the scene, updates the transform matrix and renders the primitve
	render(scene, shader) {
		let resolution = this.resolution;
		scene.models.forEach(function (model) {
			if (model.type === "render_normal") {
				model.transform.updateModelTransformMatrix();
				shader.bindArrayBuffer(shader.vertexAttributesBuffer, model.vertexPositions);
				shader.setUniform("pointSize", model.pointSize);
				shader.setUniform3f("u_resolution", resolution);
				shader.fillAttributeData("aPosition",
					model.vertexPositions,
					3,
					0,
					0);
				shader.setUniform4f("uColor", model.color);
				shader.setUniformMatrix4fv("uModelMatrix", model.transform.modelTransformMatrix);
				if (model.pointsFlag === true) shader.drawArrays(model.vertexPositions.length / 3, "L");
				else shader.drawArrays(model.vertexPositions.length / 3);
			}
			else {
				model.render(shader, resolution);
			}
		});
	}


	glContext() {
		return this.gl;
	}

	getCanvas() {
		return this.domElement;
	}


	// gets mouse click reduced to the form of clip space
	// uses the mouseEvent target attribute to calculate the mouse position in clip space of webGL canvas
	mouseToClipCoord(mouseEvent) {
		// TO DO 
	}
}
