import { Pacman } from "../maze/pacman.js";
import { Ghosts } from "./Ghosts.js";
import { GridColored } from "./GridColored.js";
import { Grid } from "./Grid.js";
import { Pellets } from "./Pellets.js";
import { PowerPellets } from "./PowerPellets.js";

export class Maze {
	constructor(width, height, mazeConfig, pacmanX, pacmanY, pacmanRadius, tileSize, ghostPositions) {
		//Storing all the variables neccessary.
		this.width = width; //Width of the maze
		this.height = height; //Height of the maze
		this.gridLength = height / tileSize - 1; //The number of grid cells in each column
		this.gridWidth = width / tileSize - 1; //The number of grid cells in each row
		this.tileSize = tileSize; //The size of each grid in pixels.
		this.dimensionDifference = (this.gridWidth - this.gridLength); //A variable for rotation correction.

		this.maze = mazeConfig.slice(); //The maze configuration
		this.currentMaze = mazeConfig; //Current Maze configuration, makes checking of pacman movements easier.
		this.processMaze(); //Creating a list of mazes which consists of all the possible orientation of maze, i.e. in every direction.
		this.direction = 0; //A direction variable to update pacman variables based on it.
		this.angle = 0; //The angle to rotate all maze objects by.
		this.modify = false; //Modify mode variable.

		//initialising the maze objects
		this.gridInitial = new Grid(width, height, this.tileSize);
		this.grid = new GridColored(width, height, mazeConfig, this.tileSize);
		this.ghosts = new Ghosts(this.gridWidth, this.gridLength, this.tileSize, ghostPositions);
		this.pacman = new Pacman(pacmanRadius, [1.0, 1.0, 0.0, 1.0], pacmanX, pacmanY, tileSize, this.gridLength, this.gridWidth);
		this.Pellets = new Pellets(this.tileSize);
		this.powerPellets = new PowerPellets([1, 1, 1, this.gridLength - 1, this.gridWidth - 1, 1, this.gridWidth - 1, this.gridLength - 1], this.tileSize);
		//Storing all the models based on the order they need to be rendered.
		this.models = [this.gridInitial, this.grid, this.Pellets, this.powerPellets, this.ghosts, this.pacman];
	}
	processMaze() {
		//gets all the configurations of mazes, i.e. in every direction.
		this.maze90 = new Array(this.maze[0].length);
		let jj = 0;
		for (var j = 0; j < this.maze[0].length; j++) {
			jj = this.maze.length - 1;
			let temparr = new Array(this.maze.length);
			for (var i = 0; i < this.maze.length; i++) {
				temparr[jj] = this.maze[i][j];
				jj -= 1;
			}
			this.maze90[j] = temparr;
		}
		this.maze180 = new Array(this.maze.length)
		for (var i = 0; i < this.maze.length; i++) {
			let tempar = new Array(this.maze[0].length);
			jj = this.maze[0].length - 1;
			for (var j = 0; j < this.maze[0].length; j++, jj--) {
				tempar[jj] = this.maze[i][j];
			}
			this.maze180[this.maze.length - 1 - i] = tempar;
		}
		this.mazeMinus90 = new Array(this.maze90.length);
		for (var i = 0; i < this.maze90.length; i++) {
			let tempar = new Array(this.maze90[0].length);
			jj = this.maze90[0].length - 1;
			for (var j = 0; j < this.maze90[0].length; j++, jj--) {
				tempar[jj] = this.maze90[i][j];
			}
			this.mazeMinus90[this.maze90.length - i - 1] = tempar;
		}
		this.mazeArray = [this.currentMaze, this.maze90, this.maze180, this.mazeMinus90];
	}

	updateMaze() {
		//updating the current maze to check for pacman's movements as the direction of maze changes.
		this.currentMaze = this.mazeArray[this.direction % 4];
	}

	processEvent(event) {
		//Processing the actions which affect maze.
		// console.log(event);
		//Rotation of Maze. Happens only when pacman is not scaled or in modify mode.
		if ((event.key === '[' || event.key === ']') && this.modify !== true && this.pacman.scaled!==true) {
			//Updating angle to be rotated by.
			this.angle += event.key === '[' ? -Math.PI / 2 : Math.PI / 2;
			//Taking the previous direction as this is required to update Pacman's cordinates.
			let prevDirection = this.direction;
			//Updating direction of maze.
			this.direction += event.key === '[' ? -1 : 1;
			//Keeping it between 0 and 3, four directions.
			if (this.direction < 0) this.direction = 4 + this.direction;
			else if (this.direction > 4) this.direction = this.direction % 4;
			//update maze configuration.
			this.updateMaze();
			//Rotate all objects.
			this.models.forEach((model) => {
				//Rotating Pacman, Grid Points, Pellets(Pacman's accesed positions) and Power Pellets.
				if (model.type === 'render_normal' || model.type === 'GridPoints') {
					if (model instanceof Pacman) {
						//I update the pacman's coordinates, so I know how to much translate by in the rotated axis.
						model.updateOnGlobalRotation(this.direction,prevDirection)
						//Getting the distance the Pacman is at from its original center.
						let x = model.presentX + model.centerX - (model.initialGridX * this.tileSize + this.tileSize / 2), 
						y = model.presentY + model.centerY - (model.initialGridY * this.tileSize + this.tileSize / 2);
						let sendX = x, sendY = y;
						//As the rotation rotates axes, I need to send the distances updated based on the direction to correct translations.
						if (this.direction === 1) sendX = y, sendY = -x;
						if (this.direction === 2) sendX = -x, sendY = -y;
						if (this.direction === 3) sendX = -y, sendY = x;
						//Rotating and correcting translation to preserve grid location.
						model.transform.globalRotation(this.width / 2, this.height / 2, this.angle, sendX, sendY);
						//Padding added to remove the irregularity of rectangular grid caused by rotation.
						if (this.direction === 1) {
							model.transform.globalTranslation(this.dimensionDifference / 2 * this.tileSize, this.dimensionDifference / 2 * this.tileSize);
						}
						if (this.direction === 3) {
							model.transform.globalTranslation(-this.dimensionDifference / 2 * this.tileSize, -this.dimensionDifference / 2 * this.tileSize);
						}
						//This below line preserves orientation of the Pacman.
						model.transform.translateRotate(model.centerX ,model.centerY,-this.angle+(model.rotateWithKeysAngle*Math.PI/180))

						// Instead of adding the extra X and Y after rotation of pacman with respect to center of grid to keep pacman in place, 
						// I can directly translate it to the new position obtained by changing the grid;
						// model.transform.translation(model.presentX,model.presentY);
					}
					else {
						//If the models are not pacman I do not have to apply translation correction or orientation preservation as they are fixed objects in the maze and move along with the maze..
						model.transform.globalRotation(this.width / 2, this.height / 2, this.angle);
						if (this.direction === 1) {
							model.transform.globalTranslation(this.dimensionDifference / 2 * this.tileSize, this.dimensionDifference / 2 * this.tileSize);
						}
						if (this.direction === 3) {
							model.transform.globalTranslation(-this.dimensionDifference / 2 * this.tileSize, -this.dimensionDifference / 2 * this.tileSize);
						}
					}
				}
				else if (model.type === 'Grid') {
					//If the model is the grid cells fileed with squares.
					model.squareList.forEach(square => {
						//rotate them and apply padding.
						square.transform.globalRotation(this.width / 2, this.height / 2, this.angle);
						if (this.direction === 1) {
							square.transform.globalTranslation(this.dimensionDifference / 2 * this.tileSize, this.dimensionDifference / 2 * this.tileSize);
						}
						if (this.direction === 3) {
							square.transform.globalTranslation(-this.dimensionDifference / 2 * this.tileSize, -this.dimensionDifference / 2 * this.tileSize);
						}
					})
				}
				else if (model.type === 'Ghost') {
					//If the model is ghosts.
					model.ghostList.forEach(ghost => {
						//I need to preserve orientation so I apply a translate to object's center and rotate in the opposite direction of maze rotation and translate back.
						ghost.transform.globalRotation(this.width / 2, this.height / 2, this.angle);
						if (this.direction === 1) {
							ghost.transform.globalTranslation(this.dimensionDifference / 2 * this.tileSize, this.dimensionDifference / 2 * this.tileSize);
						}
						if (this.direction === 3) {
							ghost.transform.globalTranslation(-this.dimensionDifference / 2 * this.tileSize, -this.dimensionDifference / 2 * this.tileSize);
						}
						ghost.transform.translateRotate(ghost.canvasX, ghost.canvasY, -this.angle);
						// Instead of rotating about the center of maze i can directly translate to the point. just comment the previous lines expect updateCenter
						// ghost.transform.translation(ghost.presentX-ghost.canvasX,ghost.presentY-ghost.canvasY);
					})
				}
			}
			)
		}
		else if ((event.key === 'm' || event.key === 'M')&& this.pacman.scaled===false) { 
			//modify mode.
			// adding a pellet on the position pacman is.
			if(this.modify===false) this.Pellets.add(this.pacman.getOriginalGridPositionGivenDirection(this.direction % 4));
			this.modify = !this.modify;
			//sending the modify event to pacman to handle it.
			this.pacman.processEvent(event, this.powerPellets.vertexPositions, this.currentMaze, this.direction);
		}
		else if (this.modify !== true) {
			//If the maze is in normal mode.
			//Add a pellet at the position pacman is before it moves to the next position.
			this.Pellets.add(this.pacman.getOriginalGridPositionGivenDirection(this.direction % 4));
			//process event in pacman.
			this.pacman.processEvent(event, this.powerPellets.vertexPositions, this.currentMaze, this.direction);
			// depending on whether pacman is in power pellet grid cell or not, it will be scaled accordingly.
			//Changing color of the ghosts similarly based on whether pacman is scaled or not.
			if (this.pacman.scaled === true) {
				this.ghosts.setColor([0, 0, 1, 1]);
			}
			else {
				this.ghosts.setColor(0)
			}
		}
	}
	resetToInitialState(){
		//reset To initial state when configuration of maze is switched.
		this.direction=0; // resetting to initial direction
		//resetting pacman's variables and positions.
		this.pacman.resetToInitialState(this.direction);
		//clearing all the transform matrices by making it identity.
		this.models.forEach((model) => {
			if (model.type === 'render_normal' || model.type === 'GridPoints') {
				model.transform.clearTransformMatrix();
			}
			else if (model.type === 'Grid') {
				model.squareList.forEach(square => square.transform.clearTransformMatrix())
			}
			else if (model.type === 'Ghost') {
				model.ghostList.forEach(ghost => ghost.transform.clearTransformMatrix())
			}
		}
		)
		this.angle=0;
		//updating maze.
		this.updateMaze();
		//clearing all the pellets, aka positions covered by Pacman.
		this.Pellets.vertexPositions=[];
	}
}