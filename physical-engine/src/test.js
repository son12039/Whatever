import React, { useEffect } from "react";
import Phaser from "phaser";
import sky from "./assets/sky.png";
import ground from "./assets/platform.png";
import star from "./assets/11zon_cropped.png";
import bomb from "./assets/bomb.png";
import dude from "./assets/Pokemon_s-Sprite.png";

const MyPhaserGame = () => {
  useEffect(() => {
    const config = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      scene: {
        preload: preload,
        create: create,
        update: update,
      },
      physics: {
        default: "arcade",
        arcade: {
          gravity: { y: 300 },
          debug: false,
        },
      },
    };

    const game = new Phaser.Game(config);

    function preload() {
      this.load.image("sky", sky);
      this.load.image("ground", ground);
      this.load.image("star", star);
      this.load.image("bomb", bomb);
      this.load.spritesheet("dude", dude, {
        frameWidth: 64,
        frameHeight: 64,
      });
    }

    var platforms;
    var player;
    var stars;
    var bombs;
    var score = 0;
    var scoreText;
    function create() {
      this.add.image(400, 300, "sky");
      platforms = this.physics.add.staticGroup();

      platforms.create(400, 568, "ground").setScale(2).refreshBody();

      platforms.create(600, 400, "ground");
      platforms.create(50, 250, "ground");
      platforms.create(750, 220, "ground");
      // @@@@@@@@@@@@
      player = this.physics.add.sprite(100, 450, "dude");

      player.setCollideWorldBounds(true);

      this.anims.create({
        key: "left",
        frames: this.anims.generateFrameNumbers("dude", { start: 4, end: 7 }),
        frameRate: 10,
        repeat: -1,
      });

      this.anims.create({
        key: "turn",
        frames: [{ key: "dude", frame: 0 }],
        frameRate: 20,
      });

      this.anims.create({
        key: "right",
        frames: this.anims.generateFrameNumbers("dude", { start: 8, end: 11 }),
        frameRate: 10,
        repeat: -1,
      });
      this.anims.create({
        key: "up",
        frames: this.anims.generateFrameNumbers("dude", { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1,
      });
      stars = this.physics.add.group({
        key: "star",
        repeat: 11,
        setXY: { x: 12, y: 0, stepX: 70 },
      });

      stars.children.iterate(function (child) {
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        child.setScale(0.02);
      });
      function collectStar(player, star) {
        star.disableBody(true, true);

        score += 10;
        scoreText.setText("Score: " + score);

        if (stars.countActive(true) === 0) {
          stars.children.iterate(function (child) {
            child.enableBody(true, child.x, 0, true, true);
          });

          var x =
            player.x < 400
              ? Phaser.Math.Between(400, 800)
              : Phaser.Math.Between(0, 400);

          var bomb = bombs.create(x, 16, "bomb");
          bomb.setBounce(1);
          bomb.setCollideWorldBounds(true);
          bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
        }
      }
      this.physics.add.collider(player, platforms);
      this.physics.add.collider(stars, platforms);
      this.physics.add.overlap(player, stars, collectStar, null, this);

      scoreText = this.add.text(16, 16, "score: 0", {
        fontSize: "32px",
        fill: "#000",
      });
      function hitBomb(player, bomb) {
        this.physics.pause();

        player.setTint(0xff0000);

        player.anims.play("turn");

        // gameOver = true;
      }
      bombs = this.physics.add.group();

      this.physics.add.collider(bombs, platforms);

      this.physics.add.collider(player, bombs, hitBomb, null, this);
    }
    var cursors;
    function update() {
      cursors = this.input.keyboard.createCursorKeys();
      if (cursors.left.isDown) {
        player.setVelocityX(-160);

        player.anims.play("left", true);
      } else if (cursors.right.isDown) {
        player.setVelocityX(160);

        player.anims.play("right", true);
      } else if (cursors.up.isDown) {
        player.setVelocityX(0);

        player.anims.play("up", true);
      } else {
        player.setVelocityX(0);

        player.anims.play("turn");
      }

      if (cursors.up.isDown && player.body.touching.down) {
        player.setVelocityY(-330);
      }
    }

    return () => {
      game.destroy(true);
    };
  }, []);

  return (
    <div
      id="phaser-game"
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "black",
        margin: "0px",
      }}
    />
  );
};

export default MyPhaserGame;
