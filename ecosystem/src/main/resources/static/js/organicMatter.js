
const OMs = [];
let OMspeed = 0.05;
let OMbesize = 4;
const creationInterval = 300;
let lastCreationTime = Date.now();
function OMDraw() {

	for (const OM of OMs) {
		ctx.beginPath();
		ctx.arc(OM.x, OM.y, OM.radius, 0, Math.PI * 2);


		ctx.shadowBlur = 10;
		ctx.shadowColor = `rgba(255, 255, 255, 1)`;

		ctx.fillStyle = `rgb(000, 102, 000)`;
		ctx.fill();


		OM.x += OM.vx;
		OM.y += OM.vy;


		if (OM.x < 0 || OM.x > canvas.width) {
			OM.vx *= -1;
		}
		if (OM.y < 0 || OM.y > canvas.height) {
			OM.vy *= -1;
		}
		ctx.closePath();
	}

	const now = Date.now();
	if (now - lastCreationTime > creationInterval) {
		lastCreationTime = now; // 마지막 생성 시간 업데이트
		addOM();

	}
	checkCollisions();
	
	requestAnimationFrame(OMDraw);
}

function addOM() {
	const x = Math.random() * canvas.width;
	const y = Math.random() * canvas.height;
	const angle = Math.random() * 2 * Math.PI;
	OMs.push({
		x,
		y,
		radius: OMbesize,
		color: 'green',
		time: Date.now(), // 생성 시간 추가
		vx: OMspeed * Math.cos(angle),
		vy: OMspeed * Math.sin(angle)
	});

}
for(let a = 0; a<80; a++)addOM();