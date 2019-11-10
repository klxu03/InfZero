var play;

$(() => {
  setPlayButton();
});

function setPlayButton() {
  play = new Button(winw / 2 - 40, winh / 1.5 - 35, 80, 70, "#000000", "#BFBFBF", "Play");
  play.show();

  canv.onclick = function(event) {
    if (play.clicked(event.clientX, event.clientY)) {
      console.log(play);
      start_fight(event.clientX, event.clientY);
      canv.onclick = 0;
      play = 0;
    }
  }
}

class Button {
  constructor(tlx, tly, wid, hei, col1 = "#000000", col2 = "#7F7F7F", text) {
    this.x = tlx;
    this.y = tly;
    this.w = wid;
    this.h = hei;
    this.t = text;
    this.c1 = col1;
    this.c2 = col2;
  }

  show() {
    ctx.beginPath();
    ctx.lineWidth = 2;

    ctx.fillStyle = this.c2;
    ctx.fillRect(this.x, this.y, this.w, this.h);
    ctx.strokeStyle = this.c1;
    ctx.strokeRect(this.x, this.y, this.w, this.h);

    ctx.fillStyle = this.c1;
    ctx.font = "30px Roboto";
    ctx.strokeText(this.t, this.x + 15, this.y + this.h / 1.7, this.w - 20);
    ctx.fillText(this.t, this.x + 15, this.y + this.h / 1.7, this.w - 20);
    ctx.closePath();
  }

  clicked(x, y) {
    return x >= this.x && x <= this.x + this.w && y >= this.y && y <= this.y + this.h;
  }
}