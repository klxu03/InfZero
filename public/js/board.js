var socket;

var theight, sub_flag, tbox;

const max_name = 16, enter_key = 13, backspace_key = 8, shift_key = 16;

$(() => {
	init_game();
	//init_start();
	//init_height();

	console.log("I can't prevent you from messing with the Javascript (without a massive overhaul), but it's more fun if you play fair :)")
});

// function init_height() {
	// ctx.font = '22px Roboto';
	// theight = ctx.measureText('M').width;
// }

// function draw_board(lines) {
	// ctx.font = "22px Roboto";
	// ctx.strokeStyle = "#000000";
	// ctx.fillStyle = "#BFBFBF";
	// ctx.lineWidth = 4;

	// text = "";
	// width = 0;

	// for (let i = 0; i < lines.length; i++) {
		// width = Math.max(width, ctx.measureText((i + 1) + ". " + lines[i][1] + ": " + lines[i][0]).width);
	// }

	// xloc = (winw - width) / 2;
	// ybot = play.y - 5 - (lines.length + 1) * (theight + 5);

	// ctx.strokeText("Top scores", xloc, ybot);
	// ctx.fillText("Top scores", xloc, ybot);
	// for (let i = 0; i < lines.length; i++) {
		// ctx.strokeText((i + 1) + ". " + lines[i][1] + ": " + lines[i][0], xloc, ybot + (i + 1) * (theight + 5));
		// ctx.fillText((i + 1) + ". " + lines[i][1] + ": " + lines[i][0], xloc, ybot + (i + 1) * (theight + 5));
	// }

	// sub_flag = lines[lines.length - 1][0];
	// sub_flag = (score > sub_flag);
	// if (sub_flag) {
		// promptUsername();
	// }
// }

// function promptUsername() {
	// tbox = new Textbox((winw - 300) / 2, play.y + play.h + 20, 300, 75, "#000000", "#BFBFBF");
	// tbox.show();

	// text = "Type in a username and press enter to submit your score!";
	// ctx.strokeStyle = "#000000";
	// ctx.fillStyle = "#BFBFBF";
	// ctx.font = "18px Roboto";
	// ctx.lineWidth = 4;
	// wid = ctx.measureText(text).width;
	// ctx.strokeText(text, (winw - wid) / 2, tbox.y + tbox.h + 20);
	// ctx.fillText(text, (winw - wid) / 2, tbox.y + tbox.h + 20);

	// submit_bind();
// }

function submit_bind() {
	document.onkeydown = function(event) {
		if (event.which == enter_key) {
			$.ajax({
				url: '/upd',
				method: 'POST',
				data: {'score': score, 'name': tbox.t},
				success: () => {
					score = 0;
					stop_fight();
				}
			});
		}
		// } else if (event.which == backspace_key) {
			// tbox.pop();
			// tbox.show();
		// } else if (event.which != shift_key) {
			// tbox.append(process_key(event));
			// tbox.show();
		// }
	}
}

function process_key(e) {
	let c = e.which;
	var _to_ascii = {
        '188': '44',
        '109': '45',
        '190': '46',
        '191': '47',
        '192': '96',
        '220': '92',
        '222': '39',
        '221': '93',
        '219': '91',
        '173': '45',
        '187': '61',
        '186': '59',
        '189': '45'
    }

    var shiftUps = {
        "96": "~",
        "49": "!",
        "50": "@",
        "51": "#",
        "52": "$",
        "53": "%",
        "54": "^",
        "55": "&",
        "56": "*",
        "57": "(",
        "48": ")",
        "45": "_",
        "61": "+",
        "91": "{",
        "93": "}",
        "92": "|",
        "59": ":",
        "39": "\"",
        "44": "<",
        "46": ">",
        "47": "?"
    };

	if (_to_ascii.hasOwnProperty(c)) {
		c = _to_ascii[c];
	}

	if (!e.shiftKey && (c >= 65 && c <= 90)) {
		c = String.fromCharCode(c + 32);
	} else if (e.shiftKey && shiftUps.hasOwnProperty(c)) {
		c = shiftUps[c];
	} else {
		c = String.fromCharCode(c);
	}

	return c;
}

// function submit_unbind() {
	// tbox = 0;
	// document.onkeydown = 0;
// }
//Part of the play button

function getBoardData() {
	$.ajax({
		url: '/get_board',
		method: 'GET',
		success: data => {
			draw_board(data['lines']);
		}
	});
}

// class Textbox extends Button {
	// constructor(tlx, tly, wid, hei, col1, col2, text = "") {
		// super(tlx, tly, wid, hei, col1, col2, text);
	// }

	// append(ch) {
		// if (this.t.length >= max_name) return;
		// this.t += ch;
	// }

	// pop(ch) {
		// this.t = this.t.substring(0, this.t.length - 1);
	// }

	// show() {
		// super.show();
	// }
// }