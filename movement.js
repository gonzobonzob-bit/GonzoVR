// GonzoVR Movement Component — reads Quest 3S gamepad directly
// Left stick = strafe/forward, Right stick = snap turn
AFRAME.registerComponent('gonzo-move', {
  schema: { speed: { default: 4 }, turnSnap: { default: 30 } },
  init() {
    this.rig = this.el;
    this.yaw = 0;
    this.lastRightX = 0;
    this.canSnap = true;
  },
  tick(t, dt) {
    const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
    let lx=0, ly=0, rx=0;

    for (const gp of gamepads) {
      if (!gp) continue;
      // Left stick
      if (Math.abs(gp.axes[0]) > 0.12) lx = gp.axes[0];
      if (Math.abs(gp.axes[1]) > 0.12) ly = gp.axes[1];
      // Right stick X for turning
      if (Math.abs(gp.axes[2]) > 0.3) rx = gp.axes[2];
    }

    // Snap turn
    if (rx !== 0 && this.canSnap) {
      this.yaw -= Math.sign(rx) * this.data.turnSnap * (Math.PI/180);
      this.canSnap = false;
    }
    if (rx === 0) this.canSnap = true;

    // Move relative to yaw
    if (lx !== 0 || ly !== 0) {
      const speed = this.data.speed * (dt / 1000);
      const p = this.rig.object3D.position;
      p.x += (Math.sin(this.yaw) * -ly + Math.cos(this.yaw) * lx) * speed;
      p.z += (Math.cos(this.yaw) * ly  + Math.sin(this.yaw) * lx) * speed;  // fixed sign for strafing
    }

    // Apply yaw to rig
    this.rig.object3D.rotation.y = this.yaw;
  }
});
