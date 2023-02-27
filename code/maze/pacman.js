import { Transform } from "../lib/transform.js";
export class Pacman {
	constructor(radius, color, centerX, centerY, tileSize, gridLength, gridWidth) {
		//Storing the color, grid cell size in pixels.
		this.color = color;
		this.tileSize = tileSize;
		this.gridLength = gridLength; //The number of grid cells in each column in maze
		this.gridWidth = gridWidth; //The number of grid cells in each row in maze.
		
		//All the centers in various direction of the maze.
		this.centers = [centerX, centerY, this.gridLength - centerY, centerX, this.gridWidth - centerX, this.gridLength - centerY, centerY, this.gridWidth - centerX]
		//The original centers of pacman where it is rendered.
		this.centerX = centerX * this.tileSize + this.tileSize / 2;
		this.centerY = centerY * this.tileSize + this.tileSize / 2;
		//cordinates to invalidate mouse move
		this.mouseInitialX=0;
		this.mouseInitialY=0;
		//Distance from the center of pacman. In values of multiples of tile size.
		this.presentX = 0;
		this.presentY = 0;
		this.radius = radius; //Radius of pacman.

		this.rotateWithKeysAngle = 0; //The orientation of pacman with respect to x axis at any given time.
		this.direction = "right"; //Direction tracker.
		this.modify = false; //Modify mode toggle variable.
		this.select = false; //Selected by mouse variable.
		this.pointSize = 3.0; //Point size for each vertex, does not matter points are rendered as triangles.
		this.scaled = false; //Scaled or not variable.

		//Storing the initial grid coordinates of pacman in different orientations of maze.
		this.initialGridX = centerX;
		this.initialGridY = centerY;
		//Present grid coordinates, gets updated as translation of Pacman happens or Rotation of maze takes place.
		this.gridX = centerX; 
		this.gridY = centerY;

		this.vertexPositionsinit = [];
		//Getting the triangle coordinates to make a circle with a slice of pie.
		for (var i = 135; i <= 405; i += 1) {
			var j = i * Math.PI / 180;

			var v1 = [this.centerX + this.radius * (Math.sin(j)), this.centerY + this.radius * Math.cos(j)];
			this.vertexPositionsinit.push(v1);
		}
		this.vertexPositions = [];
		for (i = 0; i < this.vertexPositionsinit.length - 1; i++) {
			this.vertexPositions = this.vertexPositions.concat(this.centerX, this.centerY, 0);
			this.vertexPositions = this.vertexPositions.concat(this.vertexPositionsinit[i], 0);
			this.vertexPositions = this.vertexPositions.concat(this.vertexPositionsinit[i + 1], 0);
		}
		//Final vertices of triangle forming circle.
		this.vertexPositions = new Float32Array(this.vertexPositions)
		//A transform instance as pacman movements are neccessary.
		this.transform = new Transform();
		this.type = "render_normal";
	}

	processEvent(event, array, maze, directionOfMaze) {
		//Event Handler, which has the power pellets positions, the current maze array and the direction of maze.
		if (event.key === 'ArrowRight' && this.modify === false) {
			//Move right event. Pacman need not be rotated by any angle, simple translation from Pacman center to right.
			this.rotateWithKeysAngle = 0;
			//Check if move is viable according the grid.
			this.checkMove(this.tileSize, 0, maze);
			//Check if it is in a power pellet Position.
			this.checkPellet(array, directionOfMaze);
			//translate the pacman.
			this.transform.translation(this.presentX, this.presentY);
			//update direction
			this.direction = "right";
			//translate to origin and rotate as required.
			this.transform.translateToOriginScaleRotate(this.centerX, this.centerY, this.presentX, this.presentY, 0);
		}
		else if (event.key === 'ArrowLeft' && this.modify === false) {
			//Move Left event. Pacman needs to be rotated by a 180 degree angle and a simple translation from Pacman center to left.
			this.rotateWithKeysAngle = -180;
			//Check if move is viable according the grid.
			this.checkMove(-this.tileSize, 0, maze);
			//Check if it is in a power pellet Position.
			this.checkPellet(array, directionOfMaze);
			//translate the pacman.
			this.transform.translation(this.presentX, this.presentY);
			//update direction.
			this.direction = "left";
			//translate to origin and rotate as required.
			this.transform.translateToOriginScaleRotate(this.centerX, this.centerY, this.presentX, this.presentY, -Math.PI);
		}
		else if (event.key === 'ArrowUp' && this.modify === false) {
			//Move up event. Pacman needs to be rotated by -90 degree angle, simple translation from Pacman center above.
			this.rotateWithKeysAngle = -90;
			//Check if move is viable according the grid.
			this.checkMove(0, -this.tileSize, maze);
			//Check if it is in a power pellet Position.
			this.checkPellet(array, directionOfMaze);
			//translate the pacman.
			this.transform.translation(this.presentX, this.presentY);
			//update direction.
			this.direction = "up";
			//translate to origin and rotate as required..
			this.transform.translateToOriginScaleRotate(this.centerX, this.centerY, this.presentX, this.presentY, -Math.PI / 2);
		}
		else if (event.key === 'ArrowDown' && this.modify === false) {
			//Move down event. Pacman needs to be rotated by 90 degree angle, simple translation from Pacman center below.
			this.rotateWithKeysAngle = 90;
			//Check if move is viable according the grid.
			this.checkMove(0, this.tileSize, maze);
			//Check if it is in a power pellet Position.
			this.checkPellet(array, directionOfMaze);
			//translate the pacman.
			this.transform.translation(this.presentX, this.presentY);
			//update direction.
			this.direction = "down";
			//translate to origin and rotate as required..
			this.transform.translateToOriginScaleRotate(this.centerX, this.centerY, this.presentX, this.presentY, Math.PI / 2);
		}
		else if (event.key === '(' && this.modify === false && this.scaled === false) {
			//rotation of pacman by 45 degree anti clockwise direction.
			this.rotateWithKeysAngle -= 45;
			this.transform.translateToOriginScaleRotate(this.centerX, this.centerY, this.presentX, this.presentY, this.rotateWithKeysAngle * Math.PI / 180);
		}
		else if (event.key === ')' && this.modify === false && this.scaled === false) {
			//rotation of pacman by 45 degree clockwise direction.
			this.rotateWithKeysAngle += 45;
			this.transform.translateToOriginScaleRotate(this.centerX, this.centerY, this.presentX, this.presentY, this.rotateWithKeysAngle * Math.PI / 180);
		}
		else if ((event.key === 'm' || event.key === 'M') && this.scaled === false) {
			//setting modify mode.
			this.modify = !this.modify;
		}
		console.log(event.key, this.presentX + this.centerX, this.presentY + this.centerY);
	}
	checkPellet(array, direction) {
		//Get pacman's position in non rotated maze based on the direction it is in now and the gird position it is in now.
		let pacmanPosition = this.getOriginalGridPositionGivenDirection(direction);
		if (pacmanPosition !== undefined) {
			pacmanPosition.map(x => x * this.tileSize + this.tileSize / 2); //change pacman's grid coordinates to pixel values.
			// console.log(pacmanPosition)
			for (var i = 0; i < array.length - 2; i += 3) {
				//check if the center of power pellets and pacman mathc.
				if (pacmanPosition[0] * this.tileSize + this.tileSize / 2 === array[i] && pacmanPosition[1] * this.tileSize + this.tileSize / 2 === array[i + 1]) {
					//Scale by 1.5 times at center of model and set the scaled variable to true.
					this.transform.scale = [1.5, 1.5, 1.5];
					this.scaled = true;
					return;
				}
			}
			this.scaled = false;
			this.transform.scale = [1, 1, 1];
		}
	}
	modifyPacman(event, array) {
		//Handle Picking and placing of Pacman
		if (event.type === 'mousedown') console.log(event);
		if (this.modify === true && event.type === 'mousedown' && this.select===false) {
			// If in modify mode and mouse click is detected.
			let mouseX = event.x, mouseY = event.y;
			//Check if mouse position's grid coordinates match with pacman's present grid coordinates.
			if (mouseX / 40 >> 0 === this.gridX && mouseY / 40 >> 0 === this.gridY) {
				this.select = !this.select; //toggle selected 
				this.mouseInitialX=this.gridX;
				this.mouseInitialY=this.gridY;
			}
		}
		else if (this.modify === true && event.type === 'mousedown' && this.select === true) {
			//If selected is true and another click is observed, we place the pacman to its last valid position and change the select.
			this.select = !this.select;
		}
		if (this.modify === true && event.type === 'mousemove' && this.select === true) {
			//If mouse is moved we translate pacman with it.
			this.checkMouseMove(event.x, event.y, array)
		}
	}
	checkMouseMove(moveX, moveY, array) {
		//Checking the grid coordinates of the mouse is accessible in present grid or not.
		if (array[moveY / this.tileSize >> 0][moveX / this.tileSize >> 0] === 1) {
			this.presentX = (moveX / this.tileSize >> 0) * this.tileSize + this.tileSize / 2 - this.centerX;
			this.presentY = (moveY / this.tileSize >> 0) * this.tileSize + this.tileSize / 2 - this.centerY;
			this.transform.translation(this.presentX, this.presentY);
			this.gridX = Math.floor(moveX / this.tileSize)
			this.gridY = Math.floor(moveY / this.tileSize)
		}
	}
	checkMove(moveX, moveY, array) {
		//Check if a move is valid or not and update coordinates and grid coordinates accordingly.
		if (array[this.gridY + moveY / this.tileSize][this.gridX + moveX / this.tileSize] === 1) {
			this.presentX += moveX;
			this.presentY += moveY;
			this.gridX += Math.floor(moveX / this.tileSize)
			this.gridY += Math.floor(moveY / this.tileSize)
		}
	}
	updatePresentXY() {
		//Update present pixel values of pacman.
		this.presentX = this.gridX * this.tileSize - this.centerX + this.tileSize / 2;
		this.presentY = this.gridY * this.tileSize - this.centerY + this.tileSize / 2;
	}
	updateInitialCenter(direction) {
		//update the grid coordinates as the direction of maze is changed.
		let i = direction * 2, j = direction * 2 + 1;
		this.initialGridX = this.centers[i]
		this.initialGridY = this.centers[j]
	}
	updateOnGlobalRotation(direction, prevDirection) {
		//updates to be made on rotation of maze.
		//updating center of pacman grid coordinates.
		this.updateInitialCenter(direction % 4)
		//updating orientation.
		this.rotateWithKeysAngle+= (direction-prevDirection)*90;
		//based on direction change updating the grid coordinates of pacman.
		if (direction === 1 && prevDirection % 4 === 0) {
			let temp = this.gridX;
			this.gridX = this.gridLength - this.gridY;
			this.gridY = temp
		}
		if (direction === 2 && prevDirection === 1) {
			let temp = this.gridX;
			this.gridX = this.gridWidth - this.gridY;
			this.gridY = temp;
		}
		if (direction === 3 && prevDirection === 2) {
			let temp = this.gridY;
			this.gridY = this.gridX;
			this.gridX = this.gridLength - temp;
		}
		if (direction % 4 === 0 && prevDirection === 3) {
			let temp = this.gridX;
			this.gridX = this.gridWidth - this.gridY;
			this.gridY = temp;
		}
		if (direction % 4 === 0 && prevDirection === 1) {
			let temp = this.gridY;
			this.gridY = this.gridLength - this.gridX;
			this.gridX = temp;
		}
		if (direction === 1 && prevDirection === 2) {
			let temp = this.gridX;
			this.gridX = this.gridY;
			this.gridY = this.gridWidth - temp;
		}
		if (direction === 2 && prevDirection === 3) {
			let temp = this.gridY;
			this.gridY = this.gridLength - this.gridX;
			this.gridX = temp;
		}
		if (direction === 3 && prevDirection % 4 === 0) {
			let temp = this.gridY;
			this.gridY = this.gridWidth - this.gridX;
			this.gridX = temp;
		}
		//updating pixel values.
		this.updatePresentXY();
	}
	getOriginalGridPositionGivenDirection(direction, i = this.gridX, j = this.gridY) {
		// a helper function to get grid coordinates of original orientation for power pellets comparison.
		if (direction === 0) {
			return new Array(i, j);
		}
		if (direction === 1) {
			return new Array(j, this.gridLength - i);
		}
		if (direction === 2) {
			return new Array(this.gridWidth - i, this.gridLength - j);
		}
		if (direction === 3) {
			return new Array(this.gridWidth - j, i);
		}
	}
	resetToInitialState(direction) {
		//resetting pacman variables when maze is changed.
		this.updateInitialCenter(direction%4)
		//changing grid coordinates to the original pacman cordinates.
		this.gridX = this.initialGridX;
		this.gridY = this.initialGridY;
		this.presentX = 0;
		this.presentY = 0;
		this.rotateWithKeysAngle = 0;
		this.scaled=false;
		this.direction="right";
	}
}