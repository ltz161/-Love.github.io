$(document).ready(function(){
		$(".bt").click(function(){
			if($("#authentication").val()=="520胡雪梅"){
				window.location.href="../index1.html";
			}
			else{
				alert("验证信息错误！");
				window.location.href="../index.html";
			}
		})
		
	})
