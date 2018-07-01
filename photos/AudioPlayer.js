(function($){
	document.getElementById('img').click(function(){
		
	})
	jQuery.fn.extend({
		"initAudio" : function(){
			var myAudio = $("audio",this)[0];
			
			/*添加播放器UI组件*/
			/*this.append(
				'<div class="controls">\
					<div class="play_controls">\
						<a class="btn_play">c</a>\
					</div>\
				</div>'
			);onclick="timeout ? stopAnim() : startAnim()"
			*/
			
			$("#img").click(function(){
				
				if (myAudio.paused&&!timeout) {
					myAudio.play();
					 startAnim();
				} else {
					myAudio.pause();
					
					stopAnim();
				}
			});
			
		}
	});
})(jQuery)
