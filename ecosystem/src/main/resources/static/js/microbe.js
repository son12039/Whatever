
const microbes = [];
let microbespeed = 1;
let microbesize = 10;
function microbeDraw() {

	for (const microbe of microbes) {
		ctx.beginPath();
		ctx.arc(microbe.x, microbe.y, microbe.radius, 0, Math.PI * 2);
		ctx.shadowBlur = 15;
		ctx.shadowColor = `rgba(0, 255, 255, 1)`;
		ctx.fillStyle = microbe.color;
		ctx.fill();
		microbe.x += microbe.vx;
		microbe.y += microbe.vy;
		if (microbe.radius >= 25) {
			addMicrobe(microbe.x, microbe.y);
			microbe.radius = 10;
		}

		if (microbe.x < microbe.radius || microbe.x > canvas.width - microbe.radius) {
			microbe.vx *= -1;
		}
		if (microbe.y < microbe.radius || microbe.y > canvas.height - microbe.radius) {
			microbe.vy *= -1;
		}
		ctx.closePath();
	}


	if (microbes.length <= 1) {
		startMicrobe();
	}
	requestAnimationFrame(microbeDraw);
}

function addMicrobe(x, y) {
	const angle = Math.random() * 2 * Math.PI;
	microbes.push({
		x,
		y,
		radius: microbesize,
		color: 'white',
		vx: microbespeed * Math.cos(angle),
		vy: microbespeed * Math.sin(angle)
	});
}

function startMicrobe() {
	const margin = microbesize * 2;
	const x = Math.random() * (canvas.width - 2 * margin) + margin;
	const y = Math.random() * (canvas.height - 2 * margin) + margin;
	const angle = Math.random() * 2 * Math.PI;
	microbes.push({
		x,
		y,
		radius: microbesize,
		color: 'white',
		vx: microbespeed * Math.cos(angle),
		vy: microbespeed * Math.sin(angle)
	});
}

