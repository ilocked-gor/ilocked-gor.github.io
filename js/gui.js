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
    //document.getElementById("gui").style.left = canvas.offsetLeft + "px";

};
