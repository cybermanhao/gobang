var game = {};
var buttons = new Object();
var scene = 1;
function loading() {
    console.log('解决载入太快导致按键还在生效的问题');
    render.drawloading();
};
function Game(player) {
    this.score1 = 0;
    this.score2 = 0;
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
        //console.log([x, y], countx, county, countk, countj)
        if (countx >= 5 || county >= 5 || countk >= 5 || countj >= 5) {
            this.winAndRe();
        }
    };
    this.winAndRe = function () {
        this.winner = this.player;
        console.log("" + this.player + "win");
        alert("" + this.player + "win");
        this.refresh();
    }
    this.switch = function () {
        if (this.player == 1) {
            this.player = 2
        } else if (this.player == 2) {
            this.player = 1
        }
        render.switch();
        if (this.player == 2 && scene == 3) {
            this.ai();
        }
    };
    this.ai = function () {
        let x = Math.floor(Math.random() * 16);
        let y = Math.floor(Math.random() * 16);
        while (game.chesstable[y][x] != 0) {
            x = Math.floor(Math.random() * 16);
            y = Math.floor(Math.random() * 16);
        }
        this.addChess([x, y], this.player);
    }
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
    },
    drawbutton(button) {
        var c = document.getElementById("canvas");
        var ctx = c.getContext("2d");
        c.getContext('2d').fillStyle = '#000000';
        let x = button.position[0] - button.width / 2;
        let y = button.position[1] - button.height / 2;
        ctx.rect(x, y, button.width, button.height);
        ctx.stroke();
        let fonth = button.height - 8;
        ctx.textBaseline = "top";
        ctx.font = "" + fonth + "px serif";
        ctx.fillText(button.name, x, y+4);
    },
    drawloading() {
        var c = document.getElementById("canvas");
        var ctx = c.getContext("2d");
        ctx.clearRect(0, 0, 800, 800);
        let t = 0;
        let draw=function(){
            ctx.beginPath();
            ctx.arc(400, 400, 200, 0, 2 * Math.PI * t / 360);
            ctx.stroke();
            t += 1;
    }
        var timer =setInterval(draw, 1);
        setTimeout(() => {
            clearInterval(timer);
            ctx.clearRect(0, 0, 800, 800);
            console.log('loading finished')
        }, 2000);

    }
}
var gameFlow = function () {
    console.log('hot seat mode')
    scene = 2;
    loading();
    setTimeout(() => {
        game = new Game(1);
        game.boot();
        render.drawpreview();
        render.clear();
        render.drawLine();
    }, 2002);

}
var gameFlowBot = function () {
    console.log('bot mode')
    scene = 3
    loading();
    setTimeout(() => {
        game = new Game(1);
        game.boot();
        render.drawpreview();
        render.clear();
        render.drawLine();
    }, 2002);
}
var createbutton = function () {
    buttons.hotseat = new Button("热座模式", [400, 200], 170, 50, gameFlow);

    buttons.bot = new Button("人机对战", [400, 300], 170, 50, gameFlowBot);
}
function Button(name, position, width, height, bind) {
    this.name = name;
    this.position = position;
    this.width = width;
    this.height = height;
    this.bind = bind;
    this.render = render.drawbutton(this);
}
window.onload = function () {
    this.controller.listenCanvas();
    createbutton();
}
var controller = {
    cvx: 0,
    cvy: 0,
    handle: function (scene) {
        console.log(scene)
        switch (scene) {
            case 1:
                this.choose(buttons)
                break;
            case 2:
                this.start()
                break;
            case 3:
                this.start()
                break;
        }
    },
    listenCanvas: function () {
        var c = document.getElementById("canvas");
        c.onclick = function (e) {
            e.preventDefault();
            e.stopPropagation();
            // get the canvas postion relative to the viewport
            var BB = canvas.getBoundingClientRect();
            var BBoffsetX = BB.left;
            var BBoffsetY = BB.top;
            // calculate the mouse positiony
            controller.cvx = e.clientX - BBoffsetX;
            controller.cvy = e.clientY - BBoffsetY;
            controller.handle(scene);
        }
    },
    start: function () {
        var XC = (parseInt(this.cvx) - 50) / 50;
        var YC = (parseInt(this.cvy) - 50) / 50;
        var X = Math.ceil(XC);
        var Y = Math.ceil(YC);
        if (game.chesstable[Y][X] == 0) {
            game.addChess([X, Y], game.player);
        }
    },
    choose: function (buttons) {
        Object.keys(buttons).forEach(key => {
            let button = buttons[key]
            let x = button.position[0] - button.width / 2;
            let y = button.position[1] - button.height / 2;
            let X = button.position[0] + button.width / 2;
            let Y = button.position[1] + button.height / 2;
            let cvx = this.cvx;
            let cvy = this.cvy;
            if (cvx > x && cvx < X && cvy > y && cvy < Y) {
                button.bind();
                console.log('button', button.name)
            } else (
                console.log(cvx, cvy, x, y, X, Y)
            )
        });
    }
}

