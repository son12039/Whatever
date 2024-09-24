import React, { useEffect } from "react";
import Phaser from "phaser";

function App() {
  useEffect(() => {
    const config = {
      type: Phaser.AUTO,
      width: window.innerWidth,
      height: window.innerHeight,
      scene: {
        preload: preload,
        create: create,
        update: update,
      },
      physics: {
        default: "arcade",
        arcade: {
          gravity: { y: 0 },
          debug: false,
        },
      },
    };
    const game = new Phaser.Game(config);

    var lights = [];
    var size = 3;
    var speed = 20;
    const lightCount = 100;
    const radius = 200; // 원의 반지름

    function preload() {}

    function create() {
      for (let i = 0; i < lightCount; i++) {
        // 각 light의 랜덤 중심을 설정
        const centerX = Phaser.Math.Between(100, window.innerWidth - 100);
        const centerY = Phaser.Math.Between(100, window.innerHeight - 100);

        // 원의 경계에서 각 light의 위치 설정
        const angle = Phaser.Math.FloatBetween(0, 2 * Math.PI);
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);

        // 원 생성
        const light = this.add.circle(x, y, size, 0xffffff);
        this.physics.add.existing(light);
        light.body.setCircle(size);
        light.body.setBounce(1);

        // 속도 설정
        light.body.setVelocity(
          Math.cos(angle) * speed,
          Math.sin(angle) * speed
        );

        light.centerX = centerX; // 중심 X
        light.centerY = centerY; // 중심 Y
        lights.push(light);
      }

      // 각 light가 벽과 충돌할 수 있도록 설정
      lights.forEach((light) => {
        light.body.setCollideWorldBounds(true);
      });
    }

    function update() {
      lights.forEach((light) => {
        // 각 light의 중심에서의 거리 계산
        const dx = light.x - light.centerX;
        const dy = light.y - light.centerY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // 원의 반지름에 따라 알파 값 계산
        const alpha = Phaser.Math.Clamp(1 - distance / radius, 0, 1); // 0~1 사이로 제한

        // 글로우 업데이트
      });
    }
  }, []);

  return <></>;
}

export default App;
