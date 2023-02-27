export const vertexShaderSrc = `      
	attribute vec3 aPosition;
	uniform vec3 u_resolution;
	uniform mat4 uModelMatrix;
	uniform float pointSize;
	void main () {          
		vec3 zeroToOne= (uModelMatrix * vec4(aPosition,1.0)).xyz/u_resolution;
		vec3 zeroToTwo=zeroToOne*2.0;
		vec3 clipSpace= zeroToTwo -1.0;

		gl_Position =vec4(clipSpace*vec3(1,-1,1),1.0); 
		gl_PointSize = pointSize; 
	}                          
`;