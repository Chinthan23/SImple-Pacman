export class Scene {
	constructor() {
		this.models = []
	}

	add(model) {
		if (this.models && model) {
			this.models.push(model);
			console.log(model)
		}
	}

	remove(model) {
		if (this.models && model) {
			let index = this.models.indexOf(model);
			if (index > -1) {
				this.models.splice(index, 1);
			}
		}
	}

	getmodels() {
		return this.models;
	}


	getmodel(index) {
		return this.models[index];
	}


	getmodelIndex(model) {
		return this.models.indexOf(model);
	}

	centroid() {
		// @ToDo : Return the centroid as per the requirements of mode-2
	}
}
