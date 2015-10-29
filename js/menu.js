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
};
