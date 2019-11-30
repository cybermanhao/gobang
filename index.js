function Player(id, score) {
    this.id = id;
    this.score = score;
};
function Chess(belongto) {
    this.belongto = belongto;
};
var game = []
function Game(player) {
    this.score1=0;
    this.score2=0;
    this.running = false;
    this.chesstable = [];
    this.player = player
    this.winner = 0;
    this.boot = function () {
        for (j = 0; j < 16; j++) {
            this.chesstable.push([])
            for (i = 0; i < 16; i++) {
                this.chesstable[j].push(0)
            };
        };
    };
    this.addChess = function (site, player) {
        this.chesstable[site[1]][site[0]] = player;
        render.drawchess(site, player);
        setTimeout(() => {
            this.checkwinner(this.chesstable, site, player);
        }, 100);
        this.switch();
    }
    this.refresh = function () {
        let ch = this.chesstable;
        for (j = 0; j < 16; j++) {
            for (i = 0; i < 16; i++) {
                ch[j][i] = 0
            };
        };
        render.clear();
        render.drawLine();
    };
    this.checkwinner = function (ctable, chess, player) {
        let x = chess[0];
        let y = chess[1];
        let left = Math.min(x, 5);
        let right = Math.min(15 - x, 5);
        let top = Math.min(y, 5);
        let bot = Math.min(15 - y, 5);
        let countx = 1;
        for (i = 1; i < left; i++) {
            if (ctable[y][x - i] == player) {
                countx = countx + 1;
            } else {
                break;
            }
        };
        for (i = 1; i < right; i++) {
            if (ctable[y][x + i] == player) {
                countx = countx + 1;
            } else {
                break;
            }
        };
        let county = 1;
        for (i = 1; i < top; i++) {
            if (ctable[y - i][x] == player) {
                county = county + 1;
            } else {
                break;
            }
        };
        for (i = 1; i < bot; i++) {
            if (ctable[y + i][x] == player) {
                county = county + 1;
            } else {
                break;
            }
        };
        let countk = 1;

        for (i = 1; i < Math.min(left, top); i++) {
            if (ctable[y - i][x - i] == player) {
                countk = countk + 1;
            } else {
                break;
            }
        };
        for (i = 1; i < Math.min(right, bot); i++) {
            if (ctable[y + i][x + i] == player) {
                countk = countk + 1;
            } else {
                break;
            }
        };
        let countj = 1;
        for (i = 1; i < Math.min(left, bot); i++) {
            if (ctable[y + i][x - i] == player) {
                countj = countj + 1;
            } else {
                break;
            }
        };
        for (i = 1; i < Math.min(right, top); i++) {
            if (ctable[y - i][x + i] == player) {
                countj = countj + 1;
            } else {
                break;
            }
        };
        console.log([x,y], countx, county, countk, countj)
        if (countx >= 5 || county >= 5 || countk >= 5 || countj >= 5) {
            this.winner = player;
            console.log("" + player + "win");
            alert("" + player + "win");
            this.refresh();
        }
    };
    this.switch = function () {
        if (this.player == 1) {
            this.player = 2
        } else if (this.player == 2) {
            this.player = 1
        }
        render.switch();
    };
}
var render = {
    drawLine: function () {
        var c = document.getElementById("canvas");
        var ctx = c.getContext("2d");
        ctx.beginPath();
        ctx.moveTo(25, 25)
        for (j = 0; j < 16; j++) {
            ctx.lineTo(775, 25 + 50 * j);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(25, 75 + 50 * j);
        };
        ctx.beginPath();
        ctx.moveTo(25, 25)
        for (i = 0; i < 16; i++) {
            ctx.lineTo(25 + 50 * i, 775);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(75 + 50 * i, 25);
        };
    },
    drawpreview: function () {
        var w = document.getElementById("white");
        var wctx = w.getContext("2d");
        wctx.beginPath();
        wctx.arc(25, 25, 24, 0, 2 * Math.PI);
        wctx.stroke();
        var b = document.getElementById("black");
        var bctx = b.getContext("2d");
        bctx.beginPath();
        bctx.arc(25, 25, 24, 0, 2 * Math.PI);
        bctx.fill();
    },
    drawchess: function (chess, player) {
        let x = chess[0] * 50 + 25;
        let y = chess[1] * 50 + 25;
        var c = document.getElementById("canvas");
        var ctx = c.getContext("2d");
        ctx.clearRect(x - 24, y - 24, 48, 48);
        ctx.beginPath();
        ctx.arc(x, y, 24, 0, 2 * Math.PI);
        if (player == 1) {
            ctx.stroke();
        } else if (player == 2) {
            ctx.fill();
        } else (console.log('根本没有这样的棋子'));
    },
    clear: function () {
        var c = document.getElementById("canvas");
        var ctx = c.getContext("2d");
        ctx.clearRect(0, 0, 800, 800);
    },
    switch() {
        var p1 = document.getElementById('white');
        var p2 = document.getElementById('black');
        if (game.player == 2) {
            p1.className = "white hide";
            p2.className = "black";
        } else if (game.player == 1) {
            p1.className = "white";
            p2.className = "black hide";
        }
    }
}
var gameFlow = function () {
    console.log('game start!')
    game = new Game(1);
    game.boot();
    render.drawpreview();
    render.clear();
    render.drawLine();
    controller.start();
}
window.onload = function () {
    gameFlow();
}
var controller = {
    start: function () {
        var c = document.getElementById("canvas");
        c.onclick = function (e) {
            e.preventDefault();
            e.stopPropagation();
            // get the canvas postion relative to the viewport
            var BB = canvas.getBoundingClientRect();
            var BBoffsetX = BB.left;
            var BBoffsetY = BB.top;
            // calculate the mouse positiony
            var mouseX = e.clientX - BBoffsetX;
            var mouseY = e.clientY - BBoffsetY;
            // report the mouse position using the h4
            var XC = (parseInt(mouseX) - 50) / 50;
            var YC = (parseInt(mouseY) - 50) / 50;
            var X = Math.ceil(XC);
            var Y = Math.ceil(YC);
            if (game.chesstable[Y][X] == 0) {
                game.addChess([X, Y], game.player);
            }
        }
    }
}