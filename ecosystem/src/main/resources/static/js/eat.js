
function checkCollisions() {
	for (let i = 0; i < OMs.length; i++) {
		const OM = OMs[i];
		for (let j = 0; j < microbes.length; j++) {
			const microbe = microbes[j];
			const dx = OM.x - microbe.x;
			const dy = OM.y - microbe.y;
			const distance = Math.sqrt(dx * dx + dy * dy);

			if (distance < OM.radius + microbe.radius) {
				OMs.splice(i, 1);
				microbe.radius += 3;
			}
		}
	}
}
