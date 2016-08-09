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
		time: 120
	}
	var selectedAnswer = 0;
	var selectedScore = 0;
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
	var selectedBox = null;


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
		["q1",'طول القطعه المستقيمة <span class="eng">BC</span> لاقرب مزلتين عشريتين هي:',"img/q1.png",["<span class='eng'>5.88cm</span>","<span class='eng'>6.50cm</span>","<span class='eng'>7.25cm</span>","<span class='eng'>6.02cm</span>"],3],
		["q2",'مساحة متوازي الاضلاع <span class="eng">ABCD</span> لاقرب منزلتين عشريتين',"img/q4.png",["<span class='eng'>138.56</span>","<span class='eng'>137.61</span>","<span class='eng'>142.36</span>","<span class='eng'>69.28</span>"],0],
		["q3",'اذا كانت مساحة مثلث <span class="eng">DAB</span> هي <span class="eng"> AD.AB.sinx ½</span> فإن مساحة متوازي الاضلاع <span class="eng">DABC</span> هي:',"img/q9.png",["<span class='eng'>DB.AB.sinx</span>","<span class='eng'>AD.AB.sinx</span>","<span class='eng'>AD.AB.cosx</span>","<span class='eng'>AD.BC.sinx</span>"],1],
		["q4",'تطلق محطة المذياع امواجها من برج ارتفاعه <span class="eng">30</span>م ، فتبدوا الامواج الصوتية هكذا، ما هو الاقتران الممثل لهذا المنحنى:',"img/q13.png",["<span class='eng'>1.5 sinx</span>","<span class='eng'>1.5 cosx</span>","<span class='eng'>1.5 sinx + 1</span>","<span class='eng'>sinx + 1.5</span>"],0],
		["q5",'التمثيل التالي  حيث x تمثل قيمة الزاوية y نمثل قيمة  الاقتران ( الدالة) هو:',"img/q2.png",["<span class='eng'>2sinx</span>","<span class='eng'>cosx</span>","<span class='eng'>sinx</span>","<span class='eng'>sinx + 1</span>"],2],
		["q6",'اذا قطع ضلع انتهاء الزاوية   <span class="eng">x</span>  دائرة الوحدة في النقطة <img src="img/q6_s1.png"/><span class="eng">(x,y)</span> فإن الزاوية منفرجة:',"",["نعم","لا"],0],		
		["q7",'اذاكانت <span class="eng">θ = 30<sup>o</sup></span> فإن <span class="eng">cos<sup>2</sup>θ + sin<sup>2</sup>θ = 1</span>',"",["نعم","لا"],0],
		["q8",'من الرسمة بين قيمة <span class="eng">x</span> التي  يلتق عندها المنحنى <span class="eng">cosx</span> و منحنى <span class="eng">sinx</span>',"img/q14.png",["<span class='eng'>0.6</span>","<span class='eng'>0.8</span>","<span class='eng'>0.2</span>","<span class='eng'>1.4</span>"],1],
        ["q9","<span class='eng'>sin 45<sup>o</sup>=</span>","img/q3.png",["<span class='eng'>2</span>","<span class='eng'>&radic;<span style='text-decoration: overline'>2</span></span>","<span class='eng'>1/&radic;<span style='text-decoration: overline'>2</span></span>","<span class='eng'>1/(1+&radic;<span style='text-decoration: overline'>2</span>)</span>"],2],
		["q10"," أبحرت سفينة من شاطئ ما  بعرض البحر بزاوية <span class='eng'>40<sup>o</sup></span> بالاتجاه الشمالي الشرقي ، استمرت في الابحار حتى وصلت نقطة ما ، مسقطها العمودي يبعد  <span class='eng'>10</span> ميل بحري على يمين نقطة  بدء الابحار. ما هي المسافة <span class='eng'>d</span>   التي سارتها السفينة لاقرب منزلتين عشريتين ؟","img/q7.png",["<span class='eng'>13.05 nm</span>","<span class='eng'>14.66 nm</span>","<span class='eng'>10.25 nm</span>","<span class='eng'>11.17 nm</span>"],0],
		["q11","ما قيمة <span class='eng'>x</span>","img/q11.png",["<span class='eng'>343.2 m</span>","<span class='eng'>502.9 m</span>","<span class='eng'>686.6 m</span>","<span class='eng'>556.7 m</span>"],2],
		["q12","تقف طائرة هيلوكبتر على ارتفاع <span class='eng'>250</span>م فوق شارع سريع، رصدت احدى ادوات قياسها شاحنة تسيربسرعه عالية ،  بزاوية ميلها <span class='eng'>20</span> درجة، بعد <span class='eng'>25</span> ثانية كانت زاوية ميلانه <span class='eng'>65</span> درجة ؟ فما تقدير ك لسرعة الشاحنة؟ ( لاقرب كم/ الساعة)","img/q15.png",["<span class='eng'>15 m/s</span>","<span class='eng'>45 k/h</span>","<span class='eng'>108 k/h</span>","<span class='eng'>82 k/h</span>"],3],
		["q13","هل ممكن ان تكون الثلاثية  (<span class='eng'>4,6,8</span>) أطوال اضلاع مثلث قائم الزاوية؟","",["نعم","لا"],1],
		["q14"," لاقرب واحد صحيح ما طول الضلع القائم؟","img/q8.png",["<span class='eng'>11</span>","<span class='eng'>9.5</span>","<span class='eng'>9</span>","<span class='eng'>10</span>"],0],		
		["q15","جد المجهول لاقرب منزلة عشرية:","img/q12.png",["<span class='eng'>14.1</span>","<span class='eng'>15.6</span>","<span class='eng'>14.7</span>","<span class='eng'>11.3</span>"],3],
		["q16","رتب القطع ( العدد مع الحرف الذي سيحل مكانه ) لتبرهن نظرية فيتاغورس: هكذا مثلا: 1=d","img/q16.png",["<span class='eng'>[ 1=c , 2=a , 4=d , 3=b , 5=e ]</span>","<span class='eng'>[ 1=d , 2=a , 4=c , 3=e , 5=b ]</span>","<span class='eng'>[ 1=d , 2=a , 4=c , 3=b , 5=e ]</span>","<span class='eng'>[ 1=d , 2=e , 4=c , 3=b , 5=a ]</span>"],2]
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
						  autoLoad: false
						});
				    },

				    ontimeout: function() {
				      alert("Uh-oh. No HTML5 support, SWF missing, Flash blocked or other issue");
				    }

			});

		
	buildCounter();
	$("#backBtn").on("click", function(){
			$("#counter").stop();
	    	$("#counter").hide(); 	
	    	//setTimeout(function(){
	    		$("#qArea").fadeOut(500);
						$(".grid").show();
					$(".grid .row").each(function(n){
						$(this).fadeIn((n * 50) + 50);
					});
	    	//}, 1500);
	});
	var startGame = function(){
		checkPortrait();
		$("#counter").hide();
		$( ".startScreen" ).show();
		$( ".startScreen" ).css("left",0);
		$( ".startScreen" ).css("top",0);
		$( ".endScreen" ).hide();
		$( "#backBtn" ).hide();
		$(".finalAnswerArea").hide();
		$(".ans").removeClass("selected");
		$(".ans").removeClass("correct");
		$(".ans").removeClass("wrong");
		$(".statusNum").removeClass("active");
		$("#sn1").addClass("active");
		$("#qArea").addClass("scroll");
		$(".solve").removeClass("disableLink");
		gameMover = null;
		score = 0;
		$("#qArea").fadeOut(500);
						$(".grid").show();
					$(".grid .row").each(function(n){
						$(this).fadeIn((n * 50) + 50);
					});
		//qCounter = 0;	
		//_qs = shuffle(_qs);	

		if($( ".startScreen" ).height() < $( ".startScreen" ).width()){		
			$( ".startScreen" ).remove();
		}else{
			$( ".startScreen" ).animate({
			  left:-$(this).width()
			}, 500, "linear", function() {
			  $( ".startScreen" ).remove();
			 // counter.start();
			});
		}

		//loopSound(bg_sound);
		//buildItem();

		//gameMover = setInterval(gameRun, config.intervalSpeed);
		
	}
	
	var nextQ = function(){

	}

	var buildItem = function(id){
		// ["q3","","",["","","",""],3]
		for(i in _qs){
			if(_qs[i][0] == id){
				qCounter = i;
			}
		}
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
			$("#remove2Answer").show();
		}else{
			$("#remove2Answer").hide();
		}

		$("#ans1 .txt").html(_qs[qCounter][3][0]);
		$("#ans2 .txt").html(_qs[qCounter][3][1]);
		if(_qs[qCounter][3][2]){
			$("#ans3").show();
			$("#ans3 .txt").html(_qs[qCounter][3][2]);
		}else{
			$("#ans3").hide();
		}
		if(_qs[qCounter][3][3]){
			$("#ans4").show();
			$("#ans4 .txt").html(_qs[qCounter][3][3]);
		}else{
			$("#ans4").hide();
		}

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
		/*if(score != 0){
			$(".endScreen #result").html($(".statusNum.active").html());
		}else if(score == (_qs.length - 1)){
			$(".endScreen #result").html("15000");
		}else{
			$(".endScreen #result").html("0");
		}*/
		$(".endScreen #result").html(score + "/1600");
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
		  	$( "#backBtn" ).hide();
		  	wrongSound.play();
		  	endGame();		  	
		  }
		});
	}

	var checkAnswer = function(){
		$(".finalAnswerArea").hide();
		var _selecId = "ans" + (selectedAnswer + 1);
		counter.pause();
		$(".ans").removeClass("selected");
		$(this).addClass("selected");
		//$(".ans").removeClass("disableLink");
		if(selectedAnswer == _qs[qCounter][4])	{			
	    	rightSound.play();
	    	selectedBox.addClass("disableLink");
	    	$("#"+_selecId).addClass("correct");
	    	$("#counter").stop();
	    	$("#counter").hide();
	    	$( "#backBtn" ).hide();
	    	score += selectedScore;	  	
		   // }
	    	setTimeout(function(){
	    		if(qCounter == (_qs.length)){
					endGame();
				}else{
					$("#qArea").fadeOut(500);
						$(".grid").show();
					$(".grid .row").each(function(n){
						$(this).fadeIn((n * 50) + 50);
					});
			    }
	    	}, 1500);
	    }else{
	    	wrongSound.play();
	    	$( "#backBtn" ).hide();
	    	$("#"+_selecId).addClass("wrong");
	    	setTimeout(function(){endGame()}, 1500);			
	    }
	    
	}

	$("#howToPlay").on("click",function(){
		$("#hwToPlay").show();
		$("#closeHwToPlay2").hide();
		$("#closeHwToPlay").show();
		return false;
	});
	$("#closeHwToPlay").on("click",function(){
		$("#hwToPlay").hide();
		startGame();
		return false;
	});
	$("#closeHwToPlay2").on("click",function(){
		$("#hwToPlay").hide();
		$(this).hide();
		$("#closeHwToPlay").show();
		return false;
	});
	$(document).on("click","#helpBtn", function(){
		$("#hwToPlay").show();
		$("#closeHwToPlay").hide();
		$("#closeHwToPlay2").show();
		return false;
	});

	$("#help").on("click", function(){

		$("#closeHwToPlay2").hide();
		$("#closeHwToPlay").show();
		return false;
	});


	$(".pause, .continue").on("click",function(){		
		pauseGame();
		return false;
	});

	$(".ans").on("click",function(){
		$(".ans").removeClass("selected");
		$(this).addClass("selected");		
		selectedAnswer = parseInt($(this).attr("code"));	
		$("#qArea").scrollTop(0);
		//$(".finalAnswerArea").fadeIn("fast");
		checkAnswer();
		$("#qArea").removeClass("scroll");
		return false;
	});

	$(".finalAnswerArea").on("click",function(){	    	
		$(this).hide();
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

	$("#qArea").hide();
	$(".grid a.solve").on("click", function(){
		$(".grid .row").each(function(n){
			$(this).fadeOut((n * 50) + 50);
		});
		$("#backBtn").show();
		var _this = $(this);
		setTimeout(function(){
			$("#qArea").fadeIn(500);
			$(".grid").hide();
			$("#counter").show();
			//_this.addClass("disableLink");
			selectedBox = _this;
			counter.resetart();
		},1500);

		//selectedScore = parseInt($(this).attr("score"));
		selectedScore = 100;
		buildItem($(this).attr("id"));
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