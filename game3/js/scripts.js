$(document).ready(function(){
	//Globals
	
	var queue = new createjs.LoadQueue();
	 queue.on("complete", handleComplete, this);
	 queue.loadManifest([
	     {id:"jquery", src: 'bower_components/jquery/dist/jquery.js'},
	     {id:"jquery_ui", src: 'bower_components/jquery-ui/jquery-ui.js'},
		 {id:"jquery_touch", src: 'bower_components/jquery.ui.touch-punch.min/index.js'},
		 {id:"kinetic", src: 'bower_components/KineticJS/kinetic.js'},
		 {id:"soundmanager2", src: 'bower_components/SoundManager2/script/soundmanager2.js'},
		 {id:"countdown360", src: 'bower_components/countdown360/dist/jquery.countdown360.js'},	 
		 {id:"logo", src: 'img/logo.png'},
		 {id:"bg_sound", src: 'sounds/bg_music.mp3'},
	     {id:"drag", src: 'sounds/right.mp3'},
		 {id:"drop", src: 'sounds/wrong.mp3'}	 
	 ]);
	 function handleComplete() {
	 $(".loading").fadeOut("fast");
	 
	var config = {
		time: 40
	}
	var selectedAnswer = 0;
	var gameMover = null;
	var addNum = true;
	var qCounter = 0;
	var score = 0;	
	var iOS = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);
	var isMobile = false; //initiate as false
	var bg_sound = null;
	var wrongSound = null;
	var rightSound = null;
	var is_mute = false;



	var shuffle = function (a) {
	    var j, x, i;
	    for (i = a.length; i; i -= 1) {
	        j = Math.floor(Math.random() * i);
	        x = a[i - 1];
	        a[i - 1] = a[j];
	        a[j] = x;
	    }
	    return a;
	}

	var _qs = [
		["q1","الشكل التالي","img/q1.png",["منحنى محدب مغلق","منحنى بسيط مغلق","منحنى بسيط مقعر","منحنى غير بسيط"],3,"الاول",[0,2]],
		["q2","له بعد واحد  ، غير منحني  ، ويمتد من الاتجاهين بلا توقف","",["النقطة","الخط المستقيم","القطعة المستقيمة","المستوى"],1,"الثالث",[0,3]],
		["q3","خطان مستقيمان متعامدان يصنعان زاوية:","",["حادة","منفرجة","مستقيمة","قائمة"],3,"الثاني",[0,2]],
		["q4","عدد الخطوط المتوازية في المستوى","",["لا يوجد","<span class='eng'>2</span>","<span class='eng'>∞</span>","<span class='eng'>100</span>"],2,"الثالث",[0,3]],
		["q5","الشكل التالي","img/q5.png",["محو ر تماثل افقي","محور تماثل عمودي","حول نقطة بداخله","لايوجد للشكل محورتماثل"],3,"السادس",[0,2]],
		["q6","عدد محاور   التماثل في  الشكل","img/q6.png",["<span class='eng'>4</span>","<span class='eng'>2</span>","<span class='eng'>3</span>","<span class='eng'>∞</span>"],3,"السادس",[1,2]],
		["q7","ما قياس مكملة الزاوية التالية؟","img/q7.png",["<span class='eng'>25<sup>o</sup></span>","<span class='eng'>135<sup>o</sup></span>","<span class='eng'>65<sup>o</sup></span>","<span class='eng'>165<sup>o</sup></span>"],0,"الثالث",[1,2]],
		["q8","من الشكل التالي","img/q8.png",["الزاوية <span class='eng'>4 =</span> الزاوية <span class='eng'>2</span>","الزاوية <span class='eng'>3 =</span> الزاوية <span class='eng'>5</span>","الزاوية <span class='eng'>1 +</span> الزاوية <span class='eng'>8</span> <span class='eng'>= 180<sup>o</sup></span>","كل ما ذكر"],3,"الثالث",[0,1]],
		["q9","دائرة نصف قطرها   <span class='eng'>2</span> فإن","",["محيطها يساوي <span class='eng'>4π</span>","مساحتها <span class='eng'>4π</span>","قطرها <span class='eng'>4</span>","كل ما ذكر"],3,"الخامس",[0,2]],
		["q10","قطر الدائرة     <span class='eng'>8</span> سم  مساحتها تساوي :","",["<span class='eng'>5.242</span> سم<sup>2</sup> ","<span class='eng'>50.27</span> سم<sup>2</sup>","<span class='eng'>3.14</span> سم<sup>2</sup>","<span class='eng'>50.24</span> سم<sup>2</sup>"],1,"الخامس",[0,3]],
		["q11","هو وتر وليس قطر","img/q11.png",["<span class='eng ol'>DE</span>","<span class='eng ol'>DB</span>","<span class='eng ol'>BG</span>","<span class='eng ol'>AC</span>"],0,"الرابع",[2,3]],
		["q12","واحد من الاشكال التالية لا يحقق خاصية كل زاويتين متتاليتين    مجموعهما <span class='eng'>180<sup>o</sup></span>","",["المعين","المربع","المستطيل","شبه المنحرف"],3,"الرابع",[0,1]],
		["q13","اذا كان لدينا مضلع منتظم يتكون من <span class='eng'>11</span> ضلعا فإن مجموع قياسات المثلث الداخلية","",["<span class='eng'>180<sup>o</sup> x 9 = 1620<sup>o</sup></span>","<span class='eng'>720</span>","<span class='eng'>549</span>","لاشيء مما ذكر"],0,"الرابع",[1,2]],
		["q14","قيمة <span class='eng'>Y</span>","img/q14.png",["<span class='eng'>18</span>","<span class='eng'>36</span>","<span class='eng'>72</span>","<span class='eng'>144</span>"],2,"الثاني",[0,1]],
		["q15","محيط المستطيل <span class='eng'>abcd</span> تساوي <span class='eng'>24</span>سم ومساحة الدائرة التي قطرها <span class='eng'>cd</span> تساوي <span class='eng'>4π</span>سم<sup>2</sup>، ما محيط المنطقة غير المظللة؟","img/q15.png",["<span class='eng'>4π - 20</span>","<span class='eng'>4π + 16</span>","<span class='eng'>2π</span>","<span class='eng'>2π + 20</span>"],3,"الخامس",[0,2]]
	];

	

	var maxScore = _qs.length;


	var _currentSound = null;
	var counter = null;
	// device detection
	if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) 
    || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) isMobile = true;

	if ( self !== top && isMobile) {
	  $(".isMobile").show();
	}
	
	

	// Sound Manager Setup

			function loopSound(sound) {
			  sound.play({
			    onfinish: function() {
			      loopSound(sound);
			    }
			  });
			}
	
			soundManager.setup({

				    // where to find the SWF files, if needed
				    url: '/SoundManager2/swf/',
				    debugMode: false,
				    onready: function() {
				      rightSound = soundManager.createSound({
						 id: 'rightSound',
						 url: 'sounds/right.mp3',
						 autoLoad: true
						});
				      wrongSound = soundManager.createSound({
						 id: 'wrongSound',
						 url: 'sounds/wrong.mp3',
						 autoLoad: true
						});

				      bg_sound = soundManager.createSound({
						  id: 'bg_sound',
						  url: 'sounds/bg_music.mp3',
						  loops:10000,
						  autoLoad: true
						});
				    },

				    ontimeout: function() {
				      alert("Uh-oh. No HTML5 support, SWF missing, Flash blocked or other issue");
				    }

			});

		
	buildCounter();
	var startGame = function(){
		checkPortrait();
		$( ".startScreen" ).show();
		$( ".startScreen" ).css("left",0);
		$( ".startScreen" ).css("top",0);
		$( ".endScreen" ).hide();
		$(".finalAnswerArea").hide();
		$(".ans").removeClass("selected");
		$(".ans").removeClass("correct");
		$(".ans").removeClass("wrong");
		$(".statusNum").removeClass("active");
		$("#sn1").addClass("active");
		$("#qArea").addClass("scroll");
		gameMover = null;
		score = 0;
		qCounter = 0;	
		_qs = shuffle(_qs);	

		if($( ".startScreen" ).height() < $( ".startScreen" ).width()){		
			$( ".startScreen" ).animate({
			  top:-$(this).height()
			}, 1000, "linear", function() {
			  $( ".startScreen" ).remove();
			 // counter.start();
			});
		}else{
			$( ".startScreen" ).animate({
			  left:-$(this).width()
			}, 500, "linear", function() {
			  $( ".startScreen" ).remove();
			 // counter.start();
			});
		}

		loopSound(bg_sound);
		buildItem();

		//gameMover = setInterval(gameRun, config.intervalSpeed);
		
	}
	
	var nextQ = function(){

	}

	var buildItem = function(){
		// ["q3","","",["","","",""],3]
		counter.resetart();
		$("#qArea").addClass("scroll");
		$(".ans").removeClass("correct");
		$(".ans").removeClass("wrong");
		$(".ans").removeClass("selected");
		$("#qArea .qTxt").html(_qs[qCounter][1]);
		$(".ans").removeClass("disableLink");
		if(_qs[qCounter][2] != ""){
			$("#qArea .qImg").html("<img src='" + _qs[qCounter][2] + "'/>");
		}else{
			$("#qArea .qImg").html("");
		}
		
		if(_qs[qCounter][6] != undefined){
		//if(qCounter == 4)
			$("#remove2Answer").show();
		}else{
			$("#remove2Answer").hide();
		}

		$("#ans1 .txt").html(_qs[qCounter][3][0]);
		$("#ans2 .txt").html(_qs[qCounter][3][1]);
		$("#ans3 .txt").html(_qs[qCounter][3][2]);
		$("#ans4 .txt").html(_qs[qCounter][3][3]);

		$(".statusNum").removeClass("active");
		$("#sn"+(qCounter+1)).addClass("active");
		
		
	}

	var removeAns = function(obj){
		obj.addClass("disableLink");
	}






	var stopSounds = function(){
		if($(".sound-icon").hasClass("fa-volume-up")){
			$(".sound-icon").removeClass("fa-volume-up");
			$(".sound-icon").addClass("fa-volume-off");
			if(iOS){
				bg_sound.stop();
			}else{
				soundManager.setVolume(0);
			}
			is_mute = true;			
		}else{
			$(".sound-icon").addClass("fa-volume-up");
			$(".sound-icon").removeClass("fa-volume-off");
			if(iOS){
				loopSound(bg_sound);
			}else{
				loopSound(bg_sound);
				soundManager.setVolume(100);
			}
			is_mute = false;
		}
		
	}

	var endGame = function(){	
		clearInterval(gameMover);
		counter.stop();
		if(score != 0){
			$(".endScreen #result").html($(".statusNum.active").html());
		}else if(score == (_qs.length - 1)){
			$(".endScreen #result").html("15000");
		}else{
			$(".endScreen #result").html("0");
		}
		
		$(".endScreen").show();
		bg_sound.stop();
	}

	

	// Play Sound Function
	var playSound = function(s){
		_currentSound = soundManager.createSound({
			url: s
		});
		_currentSound.play();
	}

	// Counter Setup
	function buildCounter(){
		$(".stage").append('<div id="counter" class="counter"></div>');
		counter = $("#counter").countdown360({
		  radius      : 12,
		  seconds     : config.time,
		  strokeWidth : 2,
		  fillStyle   : '#333333',
		  strokeStyle : '#1ca3a6',
		  fontSize    : 14,
		  fontColor   : '#e10043',
		  autostart: false,
		  label: "",
		  onComplete  : function () {
		  	if(!iOS && !is_mute){
		  		wrongSound.play();
		  	}
		  	endGame();		  	
		  }
		});
	}

	var checkAnswer = function(){
		$(".finalAnswerArea").hide();
		var _selecId = "ans" + (selectedAnswer + 1);
		counter.pause();
		$(".ans").removeClass("selected");
		//$(".ans").removeClass("disableLink");
		if(selectedAnswer == _qs[qCounter][4])	{	
			if(!iOS && !is_mute){		
	    		rightSound.play();
	    	}
	    	$("#"+_selecId).addClass("correct");
	    	score++;	    	
		   // }
	    	setTimeout(function(){
	    		if(qCounter == (_qs.length)){
					endGame();
				}else{
		    		buildItem();
		    	}
	    	}
	    		, 1500);
	    }else{
	    	if(!iOS && !is_mute){	
	    		wrongSound.play();
	    	}
	    	//alert();
	    	$("#"+_selecId).addClass("wrong");
	    	$("#ans"+(_qs[qCounter][4]+1)).addClass("correct");
	    	setTimeout(function(){endGame()}, 1500);			
	    }
	    qCounter++;
	    
	}

	
	$(".pause, .continue").on("click",function(){		
		pauseGame();
		return false;
	});

	$(".ans").on("click",function(){
		$(".ans").removeClass("selected");
		$(this).addClass("selected");		
		selectedAnswer = parseInt($(this).attr("code"));
		$("#qArea").scrollTop(0);
		$(".finalAnswerArea").fadeIn("fast");
		$("#qArea").removeClass("scroll");
		return false;
	});
	
	$("#finalAnswer").on("click",function(){	    	
		checkAnswer();
		return false;
	});

	$(".endgame").on("click",function(){
		startGame();
		return false;
	});

	$("#startBtn").on("click", function(){
		startGame();
		return false;
	});
	

	$(".sound").on("click", function(){
		stopSounds();
		return false;
	});

	$(".info").on("click", function(){
		alert("راجع الدرس " + _qs[qCounter][5]);
		return false;
	});

	$("#remove2Answer").on("click", function(){
		for(var i =0;i<2;++i){
			removeAns($("#ans" + (_qs[qCounter][6][i] + 1)));
			$(this).hide();
		}		
		return false;
	});

	$( window ).resize(function() {
		checkPortrait();
	});

	var checkPortrait = function(){
		var _W = $(".playArea").width();
		var _H = $(".playArea").height();
		if(_W <= (_H+150)){
			 $(".noPortrait").show();
		}else{
			$(".noPortrait").hide();
		}
	}
	checkPortrait();

}
});