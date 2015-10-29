function init() {
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");

    gui.init();

    menu.init();
    state = menu;

    window.setInterval("run()", 1000 / 33);

    menu.button.easy();
}

function run() {
    update();
    draw();
}

function draw() {
    ctx.clearRect(0, 0, 800, 600);

    state.draw();
}

function update() {
    state.update();
}

function getElementsByClass(searchClass, node, tag) {
    var classElements = [];

    if (node == null)
        node = document;

    if (tag == null)
        tag = '*';

    var els = node.getElementsByTagName(tag);
    var elsLen = els.length;
    var pattern = new RegExp("(^|\\s)" + searchClass + "(\\s|$)");

    for (i = 0, j = 0; i < elsLen; i++) {
        if (pattern.test(els[i].className)) {
            classElements[j] = els[i];
            j++;
        }
    }

    return classElements;
}

serveradress = "http://unsnarl-it.jonasjuffinger.com/";
var random_p = [
    '412|383|474|266|412|299|352|350|348|264|412|300|411|232|412|298|412|299|478|345|#4|9|9|8|8|4|4|5|5|0|0|4|9|5|5|6|6|9|9|3|3|8|8|7|7|3|3|6|6|2|2|5|5|1|1|0|1|2|2|3|7|2|0|2|8|0|',
    '507|207|179|442|526|164|555|162|404|323|113|543|241|471|160|384|656|303|79|345|386|459|329|378|260|380|#9|0|0|10|0|11|11|12|12|0|0|1|1|2|2|0|0|3|3|4|4|0|0|5|5|4|4|6|6|5|1|11|11|10|10|9|9|5|6|3|3|8|8|6|6|7|7|8|8|2|2|3|12|1|6|9|11|9|8|1|',
    '519|209|273|310|374|457|404|458|504|310|256|210|#4|5|5|2|2|4|4|3|3|5|5|0|0|2|3|0|0|1|1|3|4|1|'];
function save_puzzle() {
    save_puzzle_Request = new XMLHttpRequest();

    save_puzzle_Request.open("POST", serveradress + "savePuzzle.php", false);
    save_puzzle_Request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    points_string = "";
    for (i = 0; i < points.length; i++)
        points_string += Math.round(points[i][0]) + "|" + Math.round(points[i][1]) + "|";

    joints_string = "";
    for (i = 0; i < joints.length; i++)
        joints_string += joints[i][0] + "|" + joints[i][1] + "|";

    save_puzzle_Request.send("difficulty=" + difficulty + "&points=" + points_string + "&joints=" + joints_string);

    alert(save_puzzle_Request.responseText);
}
// использование Math.round() даст неравномерное распределение!
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


function get_puzzle() {
    // get_puzzle_Request=new XMLHttpRequest();

    //get_puzzle_Request.open("GET", serveradress+"getPuzzle.php?difficulty="+difficulty, false);
    // get_puzzle_Request.send();


    response = random_p[getRandomInt(0, random_p.length - 1)];

    points_string = response.split("#")[0].split("|");
    for (i = 0; i < points_string.length - 2; i++) {
        points.push(new Array(4));
        points[points.length - 1][0] = points_string[i];
        points[points.length - 1][1] = points_string[++i];
        points[points.length - 1][2] = false;
        points[points.length - 1][3] = false;
    }

    joints_string = response.split("#")[1].split("|");
    for (i = 0; i < joints_string.length - 2; i++) {
        joints.push(new Array(4));
        joints[joints.length - 1][0] = joints_string[i];
        joints[joints.length - 1][1] = joints_string[++i];
        joints[joints.length - 1][2] = false;
        joints[joints.length - 1][3] = false;
    }
}

active_menu = "";
menu_before_error_window = "";
menu_elements = null;

button_clicked = -1;

var gui =
{
    init: function () {
        document.getElementById("gui").style.left = canvas.offsetLeft + "px";
        document.getElementById("gui").style.display = "block";

        menu_elements = getElementsByClass("menu");

        this.hide_menus();
    },

    change_menu: function (new_menu) {
        if (active_menu != "")
            document.getElementById(active_menu).style.display = "none";

        document.getElementById(new_menu).style.display = "block";

        active_menu = new_menu;
    },

    hide_menus: function () {
        for (i = 0; i < menu_elements.length; i++) {
            menu_elements[i].style.display = "none";
        }

        active_menu = "";
    }
};

window.onresize = function () {
    //document.getElementById("gui").style.left = canvas.offsetLeft+"px";

};

points = [];
onpoint = -1;
joints = [];
newjoint = new Array(3);

pointradius = 12;

gamemode = 0;        //0 ... spielen     1 ... Rätsel erstellen
solved = false;      //Das Rätsel ist "solved" wenn keine Überschneidung mehr vorhanden ist. Wenn der Spieler dann die linke Maustaste loslässt ist das Spiel "finished".
finished = false;
pause = false;
locked = false;
confirmed = false;
remove = false;
drawjoint = false;

clock = 0;
now_date = null;
before_date = null;
difficulty = 0;
clicks = 0;


var game =
{
    /*
     ************* INIT *************
     */
    init: function () {
        onpoint = -1;
        pause = false;
        solved = false;
        finished = false;
        locked = false;
        clock = 0;
        clicks = 0;

        points = [];

        joints = [];

        if (gamemode == 0) {
            get_puzzle();

            before_date = new Date();
        }
        if (gamemode == 1) {
            gui.change_menu("create_puzzle_help");
            locked = true;
            confirmed = false;
            remove = false;
        }
    },

    /*
     ************* DESTROY *************
     */
    destroy: function () {
        gui.hide_menus();
    },

    /*
     ************* DRAW *************
     */
    draw: function () {
        for (i = 0; i < joints.length; i++) {
            ctx.beginPath();
            ctx.moveTo(points[joints[i][0]][0], points[joints[i][0]][1]);
            ctx.lineTo(points[joints[i][1]][0], points[joints[i][1]][1]);

            if (joints[i][2] == false)
                ctx.strokeStyle = "#0057eb";
            else
                ctx.strokeStyle = "#ef5010";

            if (joints[i][3] == true)
                ctx.lineWidth = 3;
            else
                ctx.lineWidth = 2;

            ctx.stroke();
        }
        if (gamemode == 1) {
            if (drawjoint == true) {
                ctx.beginPath();
                ctx.moveTo(points[newjoint[0]][0], points[newjoint[0]][1]);
                ctx.lineTo(mouse.x, mouse.y);

                if (newjoint[2] == false)
                    ctx.strokeStyle = "#0057eb";
                else
                    ctx.strokeStyle = "#ef5010";

                ctx.stroke();
            }
        }

        ctx.lineWidth = 2;

        for (i = 0; i < points.length; i++) {
            ctx.beginPath();
            ctx.arc(points[i][0], points[i][1], 12, 0, 2 * Math.PI, false);

            if (points[i][2] == true) {
                ctx.strokeStyle = "#cf0007";
            }
            else
                ctx.strokeStyle = "#009d07";

            if (points[i][3] == true)
                ctx.fillStyle = "#9bf3a0";
            else
                ctx.fillStyle = "#93d997";

            ctx.fill();
            ctx.stroke();
        }

        if (gamemode == 0) {
            if (finished == false) {
                ctx.font = "20pt Arial";
                ctx.textAlign = "right";
                ctx.textBaseline = "bottom";
                ctx.fillStyle = "#262626";
                ctx.fillText(clicks, 790, 540)

                ctx.font = "20pt Arial";
                ctx.textAlign = "right";
                ctx.textBaseline = "bottom";
                ctx.fillStyle = "#262626";
                if (Math.round(10 * clock) / 10 == Math.round(clock))
                    ctx.fillText(Math.round(clock) + ".0s", 790, 570)
                else
                    ctx.fillText(Math.round(10 * clock) / 10 + "s", 790, 570)
            }
            else {
                ctx.strokeStyle = "#009d07";
                ctx.font = "70pt Arial";
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillStyle = "#262626";
                ctx.fillText("Finished!", 400, 120);

                ctx.font = "40pt Arial";
                ctx.fillText(Math.round(10 * clock) / 10 + "s", 400, 210);
                ctx.fillText(clicks + " clicks", 400, 290);
            }
        }
    },

    /*
     ************* UPDATE *************
     */
    update: function () {
        if (pause == false) {
            crossed_over();

            if (gamemode == 0) {
                if (finished == true) {
                    gui.change_menu("game_finished_menu");
                }
                if (finished == false) {
                    now_date = new Date();

                    if (before_date.getSeconds() == now_date.getSeconds())
                        clock += now_date.getMilliseconds() / 1000 - before_date.getMilliseconds() / 1000;

                    if (before_date.getSeconds() < now_date.getSeconds())
                        clock += (1000 - before_date.getMilliseconds() + now_date.getMilliseconds()) / 1000 + now_date.getSeconds() - before_date.getSeconds() - 1;

                    before_date = now_date;
                }
            }
            if (onpoint > -1) {
                points[onpoint][0] = mouse.x;
                points[onpoint][1] = mouse.y;
            }
        }
    },

    /*
     ************* MOUSE DOWN EVENT *************
     */
    mousedownhandler: function (event) {
        if (gamemode == 0) {
            if (finished == false) {
                for (i = 0; i < points.length; i++) {
                    if ((points[i][0] - mouse.x) * (points[i][0] - mouse.x) + (points[i][1] - mouse.y) * (points[i][1] - mouse.y) < pointradius * pointradius) {
                        /*
                         Auf punkt geklicked
                         */
                        onpoint = i;
                        clicks++;

                        //verbundene Punkte und verknüpfte Linien finden
                        for (j = 0; j < joints.length; j++) {
                            if (joints[j][0] == i) {
                                points[joints[j][1]][3] = true;
                                joints[j][3] = true;
                            }

                            if (joints[j][1] == i) {
                                points[joints[j][0]][3] = true;
                                joints[j][3] = true;
                            }
                        }
                    }
                }
            }
        }


        if (gamemode == 1 && locked == false) {
            if (event.button == 0) {
                for (i = 0; i < points.length; i++) {
                    if ((points[i][0] - mouse.x) * (points[i][0] - mouse.x) + (points[i][1] - mouse.y) * (points[i][1] - mouse.y) < pointradius * pointradius) {
                        /*
                         Auf punkt geklicked
                         */
                        onpoint = i;
                    }
                }
                if (confirmed == false) {
                    if (onpoint == -1) {
                        /*
                         Neuen Punkt erstellen
                         */
                        points.push(new Array(4));
                        points[points.length - 1][0] = mouse.x;
                        points[points.length - 1][1] = mouse.y;
                        points[points.length - 1][2] = false;
                        points[points.length - 1][3] = false;

                        onpoint = points.length - 1;

                        calculate_difficulty();
                    }

                    if (onpoint > -1) {
                        if (remove == true) {
                            /*
                             Punkt löschen
                             */
                            points.splice(onpoint, 1);

                            for (i = 0; i < joints.length; i++) {
                                if (joints[i][0] == onpoint || joints[i][1] == onpoint) {
                                    joints.splice(i, 1);
                                    i--;
                                }
                            }

                            for (i = 0; i < joints.length; i++) {
                                if (joints[i][0] > onpoint)
                                    joints[i][0]--;

                                if (joints[i][1] > onpoint)
                                    joints[i][1]--;
                            }

                            onpoint = -1;

                            calculate_difficulty();
                        }
                        else if (drawjoint == true) {
                            if (newjoint != onpoint) {
                                /*
                                 Punkte verbinden
                                 */
                                jointExisting = false;
                                for (j = 0; j < joints.length; j++) {
                                    if ((joints[j][0] == newjoint[0] && joints[j][1] == onpoint) || (joints[j][1] == newjoint[0] && joints[j][0] == onpoint))
                                        jointExisting = true;
                                }
                                if (jointExisting == false) {
                                    joints.push(new Array(3));
                                    joints[joints.length - 1][0] = newjoint[0];
                                    joints[joints.length - 1][1] = onpoint;
                                    joints[joints.length - 1][2] = false;
                                }

                                newjoint[0] = onpoint;
                            }

                            onpoint = -1;
                        }
                    }
                }
            }
            if (event.button == 2) {
                if (confirmed == false) {
                    if (drawjoint == false) {
                        for (i = 0; i < points.length; i++) {
                            if ((points[i][0] - mouse.x) * (points[i][0] - mouse.x) + (points[i][1] - mouse.y) * (points[i][1] - mouse.y) < pointradius * pointradius) {
                                drawjoint = true;
                                newjoint[0] = i;
                                newjoint[2] = false;
                            }
                        }
                    }
                    else {
                        drawjoint = false;
                    }
                }
            }
        }
    },

    /*
     ************* MOUSE UP EVENT *************
     */
    mouseuphandler: function () {
        if (gamemode == 0) {
            if (solved == true)
                finished = true;
        }

        for (i = 0; i < points.length; i++)
            points[i][3] = false;

        for (i = 0; i < joints.length; i++)
            joints[i][3] = false;

        onpoint = -1;
    },

    /*
     ************* MOUSE MOVE EVENT *************
     */

    /*
     ************* KEY PRESSED *************
     */
    keyPressed: function (keyCode) {
        if (gamemode == 0) {
            if (keyCode == 27) // Esc
            {
                gui.change_menu("game_escape_menu");
                pause = true;
            }
        }
        if (gamemode == 1) {
            if (keyCode == 32 && locked == false)
                remove = true;

            if (keyCode == 72) // H
            {
                if (active_menu == "create_puzzle_help") {
                    gui.change_menu("create_puzzle_menu");
                    locked = false;
                }
                else {
                    gui.change_menu("create_puzzle_help");
                    locked = true;
                    onpoint = -1;
                }
            }
        }
    },

    /*
     ************* KEY RELEASED *************
     */
    keyReleased: function (keyCode) {
        if (gamemode == 1) {
            if (keyCode == 32)
                remove = false;
        }
    },

    /*
     ************* BUTTONS *************
     */
    button: {
        next: function () {
            game.destroy();
            game.init();
        },
        menu: function () {
            game.destroy();
            menu.init();
            state = menu;
        },
        new_game: function () {
            game.init();
            gui.hide_menus();
        },
        resume: function () {
            pause = false;
            gui.hide_menus();

            before_date = new Date();
        },

        confirm: function () {
            if (solved == false)
                alert("The puzzle isn't solved!");

            else if (points.length < 4)
                alert("The has to contain at least 4 points!");

            else if (unconnected_points() > 0)
                alert(unconnected_points() + " Points aren't connected!");

            else {
                confirmed = confirm("Are you sure you want to confirm?\nAfter confirming you can't add/remove points or joints.");
                if (confirmed == true) {
                    for (i = 0; i < points.length; i++) {
                        points[i][0] = Math.random() * 750 + 25;
                        points[i][1] = Math.random() * 550 + 25;
                    }
                }
            }
        },
        shuffle: function () {
            for (i = 0; i < points.length; i++) {
                points[i][0] = Math.random() * 750 + 25;
                points[i][1] = Math.random() * 550 + 25;
            }
        },
        save: function () {
            if (confirmed == true) {
                if (solved == false) {
                    save_puzzle();
                    game.init();
                }
                else {
                    alert("The puzzle must not be solved!");
                }
            }
            else {
                alert("Confirm the puzzle before saving!");
            }
        },
        create_puzzle_resume: function () {
            gui.change_menu("create_puzzle_menu");
            locked = false;
        }
    }
}


function crossed_over() {
    solved = true;

    for (i = 0; i < joints.length; i++) joints[i][2] = false;

    for (i = 0; i < joints.length; i++) {
        p11 = points[joints[i][0]]; //erster Punkt
        p12 = points[joints[i][1]]; //zweiter Punkt
        p1r = new Array(2);           //Richtungsvector
        p1r[0] = p12[0] - p11[0];
        p1r[1] = p12[1] - p11[1];

        for (j = i + 1; j < joints.length; j++) {
            p21 = points[joints[j][0]];
            p22 = points[joints[j][1]];
            p2r = new Array(2);
            p2r[0] = p22[0] - p21[0];
            p2r[1] = p22[1] - p21[1];

            div = p1r[0] * p2r[1] - p1r[1] * p2r[0];
            t = -(p11[0] * p2r[1] - p11[1] * p2r[0] - p21[0] * p2r[1] + p21[1] * p2r[0]) / div;
            s = -(p11[0] * p1r[1] - p11[1] * p1r[0] + p1r[0] * p21[1] - p1r[1] * p21[0]) / div;

            if ((t > 0 && s > 0) && (t < 1 && s < 1)) {
                joints[i][2] = true;
                joints[j][2] = true;

                solved = false;
            }
        }
    }

    /*
     ************ NEW JOINT ***********
     */
    if (drawjoint == true && joints.length > 0) {
        p11 = points[newjoint[0]];  //erster Punkt
        p12 = mouse;                  //zweiter Punkt
        p1r = new Array(4);           //Richtungsvector
        p1r[0] = p12[0] - p11[0];
        p1r[1] = p12[1] - p11[1];

        for (i = 0; i < joints.length; i++) {
            p21 = points[joints[i][0]];
            p22 = points[joints[i][1]];
            p2r = new Array(4);
            p2r[0] = p22[0] - p21[0];
            p2r[1] = p22[1] - p21[1];

            div = p1r[0] * p2r[1] - p1r[1] * p2r[0];
            t = -(p11[0] * p2r[1] - p11[1] * p2r[0] - p21[0] * p2r[1] + p21[1] * p2r[0]) / div;
            s = -(p11[0] * p1r[1] - p11[1] * p1r[0] + p1r[0] * p21[1] - p1r[1] * p21[0]) / div;

            if ((t > 0 && s > 0) && (t < 1 && s < 1)) {
                newjoint[2] = true;
                joints[i][2] = true;

                solved = false;
            }
        }
    }

    /*
     ************ PUNKTE ***********
     */
    for (i = 0; i < points.length; i++)
        points[i][2] = false;

    for (i = 0; i < points.length; i++) {
        for (j = i + 1; j < points.length; j++) {
            if ((points[i][0] - points[j][0]) * (points[i][0] - points[j][0]) + (points[i][1] - points[j][1]) * (points[i][1] - points[j][1]) <= (pointradius * 2) * (pointradius * 2)) {
                points[i][2] = true;
                points[j][2] = true;

                solved = false;
            }
        }
    }
}


function calculate_difficulty() {
    if (points.length < 15)
        difficulty = 0;

    else if (points.length < 30)
        difficulty = 1;

    else if (points.length < 50)
        difficulty = 2;

    else
        difficulty = 3;
}

function unconnected_points() {
    points_connected = new Array(points.length);

    for (i = 0; i < points_connected.length; i++)
        points_connected[i] = 0;

    for (i = 0; i < joints.length; i++) {
        points_connected[joints[i][0]]++;
        points_connected[joints[i][1]]++;
    }

    count_unconnected_points = 0;

    for (i = 0; i < points_connected.length; i++) {
        if (points_connected[i] < 2)
            count_unconnected_points++;
    }

    return count_unconnected_points;
}

var menu =
{
    init: function () {
        gui.change_menu("main_menu");
    },
    destroy: function () {
        gui.hide_menus();
    },
    draw: function () {

    },
    update: function () {

    },

    button: {
        start: function () {
            gui.change_menu("choose_difficulty_menu");
        },
        create: function () {
            menu.destroy();
            gamemode = 1;
            game.init();
            state = game;
        },

        easy: function () {
            difficulty = 0;
            gamemode = 0;

            menu.destroy();
            game.init();
            state = game;
        },
        medium: function () {
            difficulty = 1;
            gamemode = 0;

            menu.destroy();
            game.init();
            state = game;
        },
        difficult: function () {
            difficulty = 2;
            gamemode = 0;

            menu.destroy();
            game.init();
            state = game;
        },
        impossible: function () {
            difficulty = 3;
            gamemode = 0;

            menu.destroy();
            game.init();
            state = game;
        },


        about: function () {
            gui.change_menu("about_menu");
        },
        back: function () {
            gui.change_menu("main_menu");
        }
    },

    mousedownhandler: function () {
    },
    mouseuphandler: function () {
    },
    keyPressed: function (keyCode) {
    },
    keyReleased: function (keyCode) {
    }
}

function vector(x, y) {
    this.x = x;
    this.y = y;
}

mouse = new vector();
rightclick = false;
mouseOnCanvas = false;

function mousemovehandler(e) {
    mouse.x = e.pageX - canvas.offsetLeft;
    mouse.y = e.pageY - canvas.offsetTop;

    if (mouse.x < 0 || mouse.x > canvas.width || mouse.y < 0 || mouse.y > canvas.height)
        mouseOnCanvas = false;

    else
        mouseOnCanvas = true;

    if (mouse.x < 0)
        mouse.x = 0;
    if (mouse.x > canvas.width)
        mouse.x = canvas.width;

    if (mouse.y < 0)
        mouse.y = 0;
    if (mouse.y > canvas.height)
        mouse.y = canvas.height;
}

function mousedownhandler(event) {
    if (mouseOnCanvas == true)
        state.mousedownhandler(event);
}

function mouseuphandler() {
    if (mouseOnCanvas == true)
        state.mouseuphandler();
}


document.onkeydown = KeyPressed;
document.onkeyup = KeyReleased;

function KeyPressed(event) {
    state.keyPressed(getKeyCode(event));
}

function KeyReleased(event) {
    state.keyReleased(getKeyCode(event));
}

function getKeyCode(event) {
    if (!event)
        event = window.event;
    if (event.which)
        return event.which;
    else if (event.keyCode)
        return event.keyCode;
}
