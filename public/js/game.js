var canv, ctx;
var winh, winw;

var infinitus, capzero;
var enemy_bullets = [], player_bullets = [];

const fps = 60, interval = 1000 / fps;
const enemy_bullet_vel = 150, enemy_bullet_rad = 2;
const inf_margin = 30;
const full = 2 * Math.PI;

var prevtime;

var difficulty, bullet_factor;

var invincibility;
const flash = fps / 10, inv_time = 2 * fps;

var running;

var hp, score;

function init_game() {
  //winh = window.innerHeight;
  //winw = window.innerWidth;
  winh = $(window).height() - 25;
  winw = $(window).width() - 25;
  canv = document.getElementById('canv');
  ctx = canv.getContext('2d');

  canv.height = winh;
  canv.width = winw;
}

function start_fight(stx, sty) {
  infinitus = new Inf(100, winh / 2, 25, 0);
  capzero = new Zero(stx, sty, 6, 9, 0);

  canv.onmousemove = function(event) {
    capzero.x = event.clientX;
    capzero.y = event.clientY;
  }

  hp = 3;
  score = 0;
  running = 1;
  invincibility = 0;

  difficulty = 1;
  bullet_factor = 1 + Math.log(difficulty);

  clear();

  //submit_unbind();

  document.oncontextmenu = () => false;

  prevtime = new Date().getTime();
  makethespinhappen();
}

function stop_fight() {
  running = 0;

  clear();
  drawscorelives();

  enemy_bullets = [];
  player_bullets = [];

  //getBoardData(); Comment out for now, put in later

  //submit_unbind();

  document.oncontextmenu = 0;

  //setPlayButton();

  window.location.replace("/leaderboard/" + score);
}

function clear() {
  ctx.clearRect(0, 0, winw, winh);
  ctx.fillStyle = "#AFAFAF";
  ctx.fillRect(0, 0, winw, winh);
}

function makethespinhappen() {
  if (hp <= 0) {
    hp = 0;
    stop_fight();
  }
  if (!running) return;
  let curtime = new Date().getTime();

  past = curtime - prevtime;

  if (curtime - prevtime > interval) {
    prevtime = curtime - (past % interval);

    clear();

    movebullets();
    checkenemybullets();
    checkplayerbullets();
    showbullets();

	difficulty = Math.max(1, Math.log(score) / 5.5);
	bullet_factor = 1 + difficulty;

    capzero.shoot();
    if (invincibility > 0) {
      capzero.show(Math.floor(invincibility / flash) % 2);
      --invincibility;
    } else {
      capzero.show();
    }

    infinitus.attack(Math.floor(2 * Math.random()) * bullet_factor);
    infinitus.show();

    drawscorelives();
  }

  requestAnimationFrame(makethespinhappen);
}

function logstar(n) {
	if (n <= 1) return n;
	return 1 + logstar(Math.log(n));
}

function drawscorelives() {
  score_text = "Score: " + score;
  ctx.fillStyle = "#00FF00";
  ctx.font = "20px Roboto";
  ctx.fillText(score_text, 15, 20);

  life_text = "Lives: " + hp;
  ctx.fillStyle = "#FF0000";
  ctx.fillText(life_text, 15, 40);
}

function movebullets() {
  for (let i = 0; i < enemy_bullets.length; i++) {
    enemy_bullets[i].move();
  }
  for (let i = 0; i < player_bullets.length; i++) {
    player_bullets[i].move();
  }
}

function checkenemybullets() {
  newb = []
  for (let i = 0; i < enemy_bullets.length; i++) {
    if (invincibility == 0 && capzero.collides(enemy_bullets[i])) {
      --hp;
      invincibility = inv_time;
    } else if (!enemy_bullets[i].out()) {
      newb.push(enemy_bullets[i]);
    }
  }
  enemy_bullets = newb;
}

function checkplayerbullets() {
  newb = []
  for (let i = 0; i < player_bullets.length; i++) {
    if (infinitus.collides(player_bullets[i])) {
      score += 10;
    } else if (!player_bullets[i].out()) {
      newb.push(player_bullets[i]);
    }
  }
  player_bullets = newb;
}

function showbullets() {
  for (let i = 0; i < enemy_bullets.length; i++) {
    enemy_bullets[i].show();
  }
  for (let i = 0; i < player_bullets.length; i++) {
    player_bullets[i].show("#007F00");
  }
}

class Circle {
  constructor(cx, cy, rad) {
    this.x = cx;
    this.y = cy;
    this.r = rad;
  }

  show(col = "#000000") {
    ctx.beginPath();
    ctx.strokeStyle = col;
    ctx.arc(this.x, this.y, this.r, 0, full, 0);
    ctx.stroke();
    ctx.closePath();
  }

  collides(bullet) {
    let dist = Math.sqrt(Math.pow(this.x - bullet.x, 2) + Math.pow(this.y - bullet.y, 2));
    return (dist <= this.r + bullet.r);
  }
}

class Bullet extends Circle {
  constructor(cx, cy, rad, vel, dir) {
    super(cx, cy, rad);
    this.d = dir;
    this.v = vel;
  }

  show(col = "#000000") {
    ctx.lineWidth = 1;
    super.show(col);
  }

  move() {
    let dx = Math.cos(this.d) * this.v / fps;
    let dy = Math.sin(this.d) * this.v / fps;

    this.x += dx;
    this.y += dy;
  }

  out() {
    return this.x < 0 || this.x >= winw || this.y < 0 || this.y >= winh;
  }
}

class Inf {
  constructor(cx, cy, rad, rot) {
    this.x = cx;
    this.y = cy;
    this.r = rad;
    this.spin = rot;
    this.timer = [0, 0]; /* steps, type */
    this.move = [0, 0, 0]; /* steps, angle, vel */

    this.attacks = [];

    /* spin move */
    this.attacks.push(function(num) {
      this.rotate(full/(fps / 2));
      for (let i = 0; i < num; i++) {
        // let traj = full * Math.random();
        let traj = (this.spin + (Math.random() - 0.5) / 1.5) % full;

        let nx = this.x + 2 * this.r * Math.cos(traj);
        let ny = this.y + 2 * this.r * Math.sin(traj);

        let vel_mul = 1 + Math.random() / 4 * difficulty;
        enemy_bullets.push(new Bullet(nx, ny, 2, enemy_bullet_vel * vel_mul, traj));

        traj = (Math.PI + this.spin + (Math.random() - 0.5) / 1.5) % full;

        nx = this.x + 2 * this.r * Math.cos(traj);
        ny = this.y + 2 * this.r * Math.sin(traj);

        vel_mul = 1 + Math.random() / 4 * difficulty;
        enemy_bullets.push(new Bullet(nx, ny, 2, enemy_bullet_vel * vel_mul, traj));
      }
    }.bind(this));

    /* straight shot */
    this.attacks.push(function(num) {
      if (this.move[0] > 0) {
        --this.move[0];
        let dx = Math.cos(this.move[1]) * this.move[2];
        let dy = Math.sin(this.move[1]) * this.move[2];

        this.shift(dx, dy);
      } else {
        let up_max = this.y - this.r - inf_margin;
        let down_max = winh - 1 - inf_margin - this.r - this.y;

        let dir = Math.floor(2 * Math.random());

        if (dir) { /* go up */
          let mag = up_max * Math.random();
          let steps = 30 + Math.floor(mag / 5 * Math.random());

          this.move = [steps, 3 * full / 4, mag / steps];
        } else {
          let mag = down_max * Math.random();
          let steps = 30 + Math.floor(mag / 5 * Math.random());

          this.move = [steps, full / 4, mag / steps];
        }
      }

      this.spin = full / 4;
      for (let i = 0; i < num; i++) {
        // let traj = full * Math.random();
        let traj = 0;

        let nx = this.x + this.r;

        if (Math.random() > .7 / bullet_factor) {
          enemy_bullets.push(new Bullet(nx, this.y + this.r, 5, enemy_bullet_vel * 3 * difficulty, traj));
        }

        if (Math.random() > .7 / bullet_factor) {
          enemy_bullets.push(new Bullet(nx, this.y - this.r, 5, enemy_bullet_vel * 3 * difficulty, traj));
        }
      }
    }.bind(this));
  }

  /* straight move */
  attack(num) {
    if (this.timer[0] > 0) {
      --this.timer[0];
      this.attacks[this.timer[1]](num);
    } else {
      this.timer[0] = 2 * fps * (Math.random() + .5);
      let ind = this.attacks.length * Math.random();
      this.timer[1] = Math.floor(ind);
    }
  }

  getCircles() {
    let dx = Math.cos(this.spin) * this.r;
    let dy = Math.sin(this.spin) * this.r;

    let c1 = new Circle(this.x + dx, this.y + dy, this.r);
    let c2 = new Circle(this.x - dx, this.y - dy, this.r);

    return [c1, c2];
  }

  show() {
    let circ = this.getCircles();

    ctx.lineWidth = 5;
    circ[0].show("#7F0000")
    circ[1].show("#7F0000")
  }

  rotate(diff) {
    this.spin += diff;
    this.spin %= full;
  }

  shift(dx, dy) {
    this.x += dx;
    this.y += dy;
  }

  set_pos(x, y) {
    this.x = x;
    this.y = y;
  }

  collides(bullet) {
    let circ = this.getCircles();
    return circ[0].collides(bullet) || circ[1].collides(bullet);
  }
}

class Ellipse {
  constructor(cx, cy, xrad, yrad, rot) {
    this.x = cx;
    this.y = cy;
    this.xr = xrad;
    this.yr = yrad;
    this.spin = rot;
  }

  show(col = "#000000") {
    ctx.beginPath();
    ctx.strokeStyle = col;
    ctx.lineWidth = 3;
    ctx.ellipse(this.x, this.y, this.xr, this.yr, this.spin, 0, full, 0);
    ctx.stroke();
    ctx.closePath();
  }

  collides(bullet) {
    let lazy = new Circle(this.x, this.y, (this.xr + this.yr) / 2);

    return lazy.collides(bullet);
  }
}

class Zero extends Ellipse {
  constructor(cx, cy, xrad, yrad, rot) {
    super(cx, cy, xrad, yrad, rot);
  }

  show(flashing = 0) {
    ctx.lineWidth = 3;
    if (flashing) {
      super.show("#00BF00");
    } else {
      super.show("#007F00");
    }
  }

  rotate(diff) {
    this.spin += diff;
    this.spin %= full;
  }

  shift(dx, dy) {
    this.x += dx;
    this.y += dy;
  }

  set_pos(x, y) {
    this.x = x;
    this.y = y;
  }

  shoot() {
    let traj = full / 2 + .1 * (Math.random() - 0.5);

    let nx = this.x - this.xr;

    if (Math.random() > .5 / difficulty) {
      player_bullets.push(new Bullet(nx, this.y, 1, 500, traj));
    }
  }
}

/*
things to add:
maybe spot-on collision detection
better score/lives ui
better graphics?
**********sound**********

attacks:
dark side
homing barrage

*/