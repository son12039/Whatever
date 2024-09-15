const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth - 4;
canvas.height = window.innerHeight - 4;

const lights = []; 
const lightspeed = 0.03; 

function lightDraw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	for (const light of lights) {
		ctx.beginPath();
		ctx.arc(light.x, light.y, light.radius, 0, Math.PI * 2);

		
		ctx.shadowBlur = 10;
		ctx.shadowColor = `rgba(255, 255, 255, 1)`;

		ctx.fillStyle = `rgba(255, 255, 255, ${light.alpha})`;
		ctx.fill();

		
		if (light.alpha < 1 && light.bool) {
			light.alpha += 0.006;
		} else {
			light.bool = false;
			light.alpha -= 0.004;
		}

		
		light.x += light.vx;
		light.y += light.vy;

		
		if (light.x < 0 || light.x > canvas.width) {
			light.vx *= -1;
		}
		if (light.y < 0 || light.y > canvas.height) {
			light.vy *= -1;
		}
		ctx.closePath();
	}

	
	const x = Math.random() * canvas.width;
	const y = Math.random() * canvas.height;
	const angle = Math.random() * 2 * Math.PI;
	lights.push({
		x,
		y,
		radius: 1.3,
		alpha: 0,
		color: 'white',
		time: Date.now(),
		vx: lightspeed * Math.cos(angle),
		vy: lightspeed * Math.sin(angle),
		bool: true
	});

	// 꺼진 불 지우기
	for(let i=lights.length-1; i>0;i--){		 
		if(lights[i].alpha<=0&&!lights[i].bool){
			lights.splice(i,1);
		}
			 
	}
	requestAnimationFrame(lightDraw);
}