var minSize=5;
var maxSize=50;
var newOn=150;
var xueColor="#FFF";
var xue=$("<div style='cursor: pointer;'></div>").css({"position":"absolute","top":"-50px"}).html("❄");
//var xue=$("<div></div>").css({"position":"absolute","top":"-50px"}).html("<img src='img/100.png' style='width:100px;' />");
$(function(){
	var dH=$(document).height();
	var dW=$(document).width();
	setInterval(function(){
		var startLeft=Math.random()*dW;
		var startTM=0.7+Math.random()*0.5;
		var endTop=dH;
		var endLeft=Math.random()*dW;
		var durationFall=4000+Math.random()*3000;
		var sizexue=minSize+Math.random()*maxSize;
		xue.clone().appendTo("body").css({
			"left":startLeft,
			"opacity":startTM,
			"font-size":sizexue,
			"color":xueColor
		}).animate({
			"top":endTop,
			"left":endLeft,
			"opacity":0.5
		},durationFall,function(){$(this).remove();});
	},newOn)
})
