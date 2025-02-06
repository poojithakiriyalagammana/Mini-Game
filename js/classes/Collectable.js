// Utility function to generate random position within game bounds
function getRandomPosition() {
  // Define the game bounds (adjust these values based on your level size)
  const minX = 50; // Minimum X position
  const maxX = 550; // Maximum X position
  const minY = 50; // Minimum Y position
  const maxY = 400; // Maximum Y position

  return {
    x: Math.floor(Math.random() * (maxX - minX) + minX),
    y: Math.floor(Math.random() * (maxY - minY) + minY),
  };
}

class Collectable {
  constructor({ position }) {
    this.position = position;
    this.width = 20;
    this.height = 20;
    this.collected = false;

    // Load banana image
    this.image = new Image();
    this.image.src = "./img/Banana.png";
  }

  draw() {
    if (!this.collected) {
      // Draw the banana image
      c.drawImage(
        this.image,
        this.position.x,
        this.position.y,
        this.width,
        this.height
      );
    }
  }

  checkCollision(player) {
    if (this.collected) return false;

    return collision({
      object1: player.hitbox,
      object2: {
        position: this.position,
        width: this.width,
        height: this.height,
      },
    });
  }
}

// Create the collectable with random position
const collectable = new Collectable({
  position: getRandomPosition(),
});

// The rest of your animate function remains the same
function animate() {
  window.requestAnimationFrame(animate);
  c.fillStyle = "white";
  c.fillRect(0, 0, canvas.width, canvas.height);

  c.save();
  c.scale(4, 4);
  c.translate(camera.position.x, camera.position.y);
  background.update();

  // Draw the collectable (now a banana)
  collectable.draw();

  player.checkForHorizontalCanvasCollision();
  player.update();

  // Check for collision with collectable
  if (collectable.checkCollision(player)) {
    collectable.collected = true;
    // Transition to next page
    setTimeout(() => {
      window.location.href = "next-page.html"; // Replace with your next page URL
    }, 500); // Add small delay for better game feel
  }

  player.velocity.x = 0;
  if (keys.d.pressed) {
    player.switchSprite("Run");
    player.velocity.x = 2;
    player.lastDirection = "right";
    player.shouldPanCameraToTheLeft({ canvas, camera });
  } else if (keys.a.pressed) {
    player.switchSprite("RunLeft");
    player.velocity.x = -2;
    player.lastDirection = "left";
    player.shouldPanCameraToTheRight({ canvas, camera });
  } else if (player.velocity.y === 0) {
    if (player.lastDirection === "right") player.switchSprite("Idle");
    else player.switchSprite("IdleLeft");
  }

  if (player.velocity.y < 0) {
    player.shouldPanCameraDown({ camera, canvas });
    if (player.lastDirection === "right") player.switchSprite("Jump");
    else player.switchSprite("JumpLeft");
  } else if (player.velocity.y > 0) {
    player.shouldPanCameraUp({ camera, canvas });
    if (player.lastDirection === "right") player.switchSprite("Fall");
    else player.switchSprite("FallLeft");
  }

  c.restore();
}
