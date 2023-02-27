import { Scene, Square,Triangle, Quadrilateral, WebGLRenderer, Shader } from './lib/threeD.js';
import {vertexShaderSrc} from './shaders/vertex.js';
import {fragmentShaderSrc} from './shaders/fragment.js';
import {Maze} from "./maze/Maze.js"
import { mazeConfig } from './maze/mazeConfiguration.js';
const renderer = new WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

const shader = new Shader(renderer.glContext(),vertexShaderSrc,fragmentShaderSrc);

shader.use();

const maze=new Maze(1200,1000,mazeConfig[0],6,12,14,40,[4,18,19,19,23,5,13,14]);
const maze2=new Maze(1000,1200,mazeConfig[1],12,15,14,40,[3,3,11,13,12,13,13,13])
const maze3=new Maze(900,900,mazeConfig[2],15,15,13,30,[13,18,14,18,15,18,16,18])
const mazeList=[maze, maze2 , maze3];

let selectedMazeIndex=0;
let selectedMaze=mazeList[selectedMazeIndex];
document.addEventListener('keydown', (event) => {
	if(event.key==='c' && selectedMaze.modify===false){
		selectedMazeIndex+=1;
		selectedMazeIndex%=3;
		selectedMaze.resetToInitialState();
		selectedMaze=mazeList[selectedMazeIndex];
	}
})
document.addEventListener( 'keydown', (event) => selectedMaze.processEvent(event));
document.addEventListener( 'mousedown', (event) => selectedMaze.pacman.modifyPacman(event,selectedMaze.currentMaze));
document.addEventListener( 'mousemove', (event) => selectedMaze.pacman.modifyPacman(event,selectedMaze.currentMaze));

renderer.setAnimationLoop(animation);

//Draw loop
function animation() 
{
	if(selectedMaze.modify===true) renderer.clear(0.2,0.2,0.2,1);
	else renderer.clear(0, 0, 0.2, 1);
	renderer.render(selectedMaze, shader);
}
