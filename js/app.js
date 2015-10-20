var password = "test";

$("#step1_check").click(function(){
if($("#password_input").val() == ""){
	return null;
}

if($("#password_input").val() != password) {
notify("error_type","Неверный пароль.");
} else {
$(".status").removeClass("puffIn").addClass("puffOut");


var interval = window.setTimeout(function(){
$(".status").text("ВТОРОЙ УРОВЕНЬ ЗАЩИТЫ").removeClass("puffOut").addClass("puffIn");
},1000);

$(".step1").removeClass("slideLeftRetourn").addClass("vanishOut");


$(".step2").css("display","block");

init();
$(".step1").remove();
}


});




function step3(){
$(".status").removeClass("puffIn").addClass("puffOut");
$(".step2").removeClass("slideLeftRetourn").addClass("vanishOut");

$(".step3").css("display","block").addClass("PuffIn");
$("#canvas").remove();

}

var inter = window.setInterval(function(){
	if(finished == true) {
		step3();
	}
},500);




$(".viewMis").click(function(){

	$(this).css("display","none");
	$(".viewEnd").css("display","block").addClass("pushIn");
});




function notify(type, text){

$(".informer").removeClass("error_type");
$(".informer").removeClass("success_type");
$(".informer").removeClass("vanishOut");
$(".informer").text(textMessage).addClass(type).addClass("slideLeftRetourn");

var interval = window.setTimeout(function(){

	$(".informer").removeClass("slideLeftRetourn");
	$(".informer").addClass("vanishOut");
	window.removeTimeout(intervel);
},2000);

}
