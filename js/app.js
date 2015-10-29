var password = "test";

$("#step1_check").click(function () {
    if ($("#password_input").val() == "") {
        return null;
    }

    if ($("#password_input").val() != password) {
        notify("error_type", "Неверный пароль.");
    } else {
        //$("#status").removeClass("puffIn").addClass("puffOut");


        $("#status").text("ВТОРОЙ УРОВЕНЬ ЗАЩИТЫ");

        $(".step1").hide();


        $(".step2").show();

        init();
//        $(".step1").remove();
    }


});


function step3() {
    $("#status").hide();
    $(".step2").hide();

    $(".step3").show();
    $("#canvas").remove();

}

var inter = window.setInterval(function () {
    if (finished == true) {
        step3();
    }
}, 500);


$(".viewMis").click(function () {

    $(this).css("display", "none");
    $(".viewEnd").css("display", "block").addClass("pushIn");
});


function notify(type, text) {

    var status = $("#status");
    var informer = $("#informer");
    status.hide();
    informer.show();
    informer.text(text);
    window.setTimeout(function () {
        status.show();
        informer.hide();
    }, 2000);

}
