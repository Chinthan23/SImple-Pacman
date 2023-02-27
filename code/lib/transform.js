import { vec3, mat4 } from 'https://cdn.skypack.dev/gl-matrix';

export class Transform {
	constructor() {
		this.translate = vec3.create();
		vec3.set(this.translate, 0, 0, 0);

		this.scale = vec3.create();
		vec3.set(this.scale, 1, 1, 1);

		this.rotationAngle = 0;
		this.rotationAxis = vec3.create();
		vec3.set(this.rotationAxis, 0, 0, 1);

		this.modelTransformMatrix = mat4.create();
		mat4.identity(this.modelTransformMatrix);
		this.updateModelTransformMatrix();
	}

	updateModelTransformMatrix() {
		// @ToDO
		// 1. Reset the transformation matrix
		// 2. Use the current transformations values to calculate the latest transformation matrix
	}
	clearTransformMatrix() {
		// This function is used to reset/clear the transformation matrix
		mat4.identity(this.modelTransformMatrix);
	}
	globalRotation(centerX, centerY, angle, extraX = 0, extraY = 0) {
		//Used for global rotation of all the objects in the screen.
		//Since I rotate the objects around the center of the maze, I first translate origin to the center of the maze.
		//Creating a transformation matrix for the translation using a translating vector with the coordinates of center of maze.
		let translateToMiddle = mat4.create();
		let translatingVector = vec3.create();
		vec3.set(translatingVector, centerX, centerY, 0);
		mat4.fromTranslation(translateToMiddle, translatingVector);

		//After translation to the center of the maze I rotate all the objects with the specified angle as per interaction along the z-axis.
		let rotationMatrix = mat4.create();
		mat4.fromRotation(rotationMatrix, angle, [0, 0, 1]);

		//After the rotation is done, I need to translate the origin back to the initial origin.
		//So i reverse the previously applied translation.
		let translationToCorrectVector = vec3.create();
		let translationToCorrect = mat4.create();
		vec3.set(translationToCorrectVector, -centerX, -centerY, 0);
		mat4.fromTranslation(translationToCorrect, translationToCorrectVector);

		//Since the graphics pipeline performs transformations on the initial vertices, to preserve location of pacman, 
		//I need to translate it to the position it was in. Using extraX and extraY for translation this is done.
		let translateBack = vec3.create();
		let translateBackMatrix = mat4.create();
		vec3.set(translateBack, extraX, extraY, 0);
		mat4.fromTranslation(translateBackMatrix, translateBack);

		//Now that I have all the matrices i multiply them., in the order they were created.
		mat4.identity(this.modelTransformMatrix);
		mat4.multiply(this.modelTransformMatrix, this.modelTransformMatrix, translateToMiddle);
		mat4.multiply(this.modelTransformMatrix, this.modelTransformMatrix, rotationMatrix);
		mat4.multiply(this.modelTransformMatrix, this.modelTransformMatrix, translationToCorrect);
		mat4.multiply(this.modelTransformMatrix, this.modelTransformMatrix, translateBackMatrix);
	}
	globalTranslation(x, y) {
		//This function is to translate all the objects by given amount. This is needed to fix the irregularities of rotating a rectangular grid.
		let translateToCorrect = mat4.create();
		let translatingVector = vec3.create();
		vec3.set(translatingVector, x, y, 0);
		mat4.fromTranslation(translateToCorrect, translatingVector);
		//The translation is multiplied to the existing transform matrix.
		mat4.multiply(this.modelTransformMatrix, this.modelTransformMatrix, translateToCorrect);
	}
	translation(presentX, presentY) {
		//For translation of pacman.
		vec3.set(this.translate, presentX, presentY, 0);
		mat4.fromTranslation(this.modelTransformMatrix, this.translate);
	}
	translateRotate(centerX, centerY, angle) {
		//This is used to rotate an object about its centre.
		//Translate to the center, rotate and translate back is done here.
		let translateToOrigin = mat4.create();
		vec3.set(this.translate, centerX, centerY, 0);
		mat4.fromTranslation(translateToOrigin, this.translate);

		let rotationMatrix = mat4.create();
		mat4.fromRotation(rotationMatrix, angle, [0, 0, 1]);

		let translateBack = mat4.create();
		vec3.set(this.translate, -(centerX), -(centerY), 0);
		mat4.fromTranslation(translateBack, this.translate);

		//I use this function to preserve orientation of the objects in global rotation, so i have multiplied these matrices to transform matrix that already exists.
		mat4.multiply(this.modelTransformMatrix, this.modelTransformMatrix, translateToOrigin);
		mat4.multiply(this.modelTransformMatrix, this.modelTransformMatrix, rotationMatrix);
		mat4.multiply(this.modelTransformMatrix, this.modelTransformMatrix, translateBack);
	}
	translateToOriginScaleRotate(centerX, centerY, presentX, presentY, angle) {
		//Used to align Pacman direction to the direction of its movement and scale it, if required.
		//translate origin to the point where pacman is to be rendered, rotate, scale if neccessary, translate back to origin and then move the pacman by the required amount.
		//The extra presentX and presentY in translation is because I have moved the pacman by presentX and presentY from its initial position.
		let translateToOrigin = mat4.create();
		vec3.set(this.translate, centerX + presentX, centerY + presentY, 0);
		mat4.fromTranslation(translateToOrigin, this.translate);

		let scalingMatrix = mat4.create();
		mat4.fromScaling(scalingMatrix, this.scale);

		let rotationMatrix = mat4.create();
		this.rotationAngle = angle;
		mat4.fromRotation(rotationMatrix, this.rotationAngle, [0, 0, 1]);

		let translateBack = mat4.create();
		vec3.set(this.translate, -(centerX + presentX), -(centerY + presentY), 0);
		mat4.fromTranslation(translateBack, this.translate);

		let translateToPoint = mat4.create();
		vec3.set(this.translate, presentX, presentY, 0);
		mat4.fromTranslation(translateToPoint, this.translate);

		//Since this is an individual event, I reset the model transform matrix and perform the matrix multiplications.
		mat4.multiply(this.modelTransformMatrix, translateToOrigin, scalingMatrix);
		mat4.multiply(this.modelTransformMatrix, this.modelTransformMatrix, rotationMatrix);
		mat4.multiply(this.modelTransformMatrix, this.modelTransformMatrix, translateBack);
		mat4.multiply(this.modelTransformMatrix, this.modelTransformMatrix, translateToPoint);
	}
}