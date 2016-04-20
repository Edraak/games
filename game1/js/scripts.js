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
	     {id:"drag", src: 'sounds/drag.mp3'},
		 {id:"drop", src: 'sounds/drop.mp3'}	 
	 ]);
	 function handleComplete() {
	 $(".loading").fadeOut("fast");
	 
	var config = {
		time: 120,
		speed: 1,
		intervalSpeed: 10
	}
	var gamePaused = false;
	var gameMover = null;
	var addNum = true;
	var numCounter = 0;
	var currentNumObj = null;
	var _speed = config.speed;
	var score = 0;	
	var iOS = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);
	var isMobile = false; //initiate as false
	var bg_sound = null;
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

	var _nums = [
		["n1",1,120,'$$\\frac{2}{3}$$'],
		["n2",1,150,'$$1$$'],
		["n3",1,120,'$$22\\frac{5}{9}$$'],
		["n4",1,120,'$$-13\\frac{10000}{300000}$$'],
		["n5",1,150,'$$1020$$'],
		["n6",1,120,'$$\\frac{0}{-1}$$'],
		["n7",1,120,'$$14\\frac{14}{14}$$'],
		["n8",1,150,'$$-4$$'],
		["n9",1,120,'$$\\frac{-21}{17}$$'],
		["n10",1,120,'$$\\sqrt{\\sqrt{81}}$$'],
		["n11",1,120,'$$\\frac{17}{53}$$'],
		["n12",1,150,'$$0$$'],
		["n13",1,120,'$$\\frac{77}{-71}$$'],
		["n14",1,120,'$$\\sqrt[3]{27}$$'],
		["n15",1,120,'$$\\frac{\\sqrt 9}{\\sqrt{25}}$$'],
		["n16",1,120,'$$-\\sqrt{16}$$'],
		["n17",1,120,'$$\\frac{\\sqrt 0}{3}$$'],
		["n18",1,120,'$$-100000$$'],
		["n19",1,120,'$$\\sqrt[4]{81}$$'],
		["n20",1,150,'$$-3.5$$'],
		["n21",1,130,'$$-\\sqrt 0$$'],
		["n22",1,120,'$$\\frac{0.98}{1.7}$$'],
		["n23",1,150,'$$10%$$'],
		["n24",1,120,'$$-0.0007$$'],
		["n25",1,120,'$$\\frac{15}{0.05}$$'],
		["n26",1,120,'$$\\frac{-\\sqrt 9}{0.013}$$'],
		["n27",1,120,'$$\\frac{27\\sqrt{81}}{0.05}$$'],
		["n28",0,120,'$$\\frac{15}{0.05}$$'],
		["n29",0,120,'$$-\\sqrt{1000}$$'],
		["n30",0,120,'$$\\sqrt{\\frac{2}{3}}$$'],
		["n31",0,150,'$$\\pi$$'],
		["n32",0,120,'$$\\sqrt[4]{27}$$'],
		["n33",0,120,'$$\\sqrt{101}$$'],
		["n34",0,120,'$$-\\sqrt{\\sqrt 3}$$'],
		["n35",0,120,'العدد النيبيري'],
		["n36",0,180,'ط'],
		["n37",0,130,'$$\\sqrt{171}$$'],
		["n38",0,130,'$$\\sqrt[5]{3}$$'],
		["n39",0,130,'$$-\\sqrt[3]{5}$$'],
		["n40",0,130,'$$\\frac{1}{0}$$']
	];

	

	var maxScore = _nums.length;


	var _currentSound = null;
	var counter = null;
	// device detection
	if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) 
    || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) isMobile = true;

	if ( self !== top && isMobile) {
	  $(".isMobile").show();
	}
	
	MathJax.Hub.Config({
	  tex2jax: {inlineMath: [['$','$'], ['\\(','\\)']]},
	  showProcessingMessages: false	  
	});

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
				      soundManager.createSound({
						 id: 'dragSound',
						 url: 'sounds/drag.mp3',
						 autoLoad: true
						});
				      soundManager.createSound({
						 id: 'dropSound',
						 url: 'sounds/drop.mp3',
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
		$( ".startScreen" ).show();
		$( ".startScreen" ).css("left",0);
		$( ".startScreen" ).css("top",0);
		$( ".endScreen" ).hide();
		$( ".pauseScreen" ).hide();
		_speed = config.speed;
		gamePaused = false;
		gameMover = null;
		addNum = true;
		numCounter = 0;
		if(currentNumObj != null){
			currentNumObj.remove();
			currentNumObj = null;
		}
		
		score = 0;
		counter.resetart();		
		_nums = shuffle(_nums);	
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

		gameMover = setInterval(gameRun, config.intervalSpeed);
		//$(".maxscore").html(maxScore);
				
		// Drop Target
		$( ".dropTarget" ).droppable({
	      drop: function( event, ui ) {	      	
	        if((ui.draggable.attr("type") == 1 && $(this).attr("id") == "real") || (ui.draggable.attr("type") == 0 && $(this).attr("id") == "notreal")){
	        	score++;
	        }
	        ui.draggable.remove();
	        addNum = true;
	        $(this).removeClass("dt-over");

	        if(!isMobile){
				soundManager.play("dropSound");
			}
	      },
	      over: function( event, ui ) {
	      	$(this).addClass("dt-over");
	      },
	      out: function( event, ui ) {
	      	$(this).removeClass("dt-over");
	      }
	    });
	}
	$(document).on("mousedown",".dragNum",function(){
		if(!isMobile){
			soundManager.play("dragSound");
		}
	})
	var gameRun = function(){
		
		if(addNum){
			numCounter++;
			if(numCounter % 15 == 0){
				_speed+=0.5;
			}
			if(numCounter == (_nums.length+1)){
				endGame();
				return;
			}
			//console.log("go", numCounter);
			$('.playArea').append('<div class="dragNum" type="'+_nums[numCounter-1][1]+'" id="n'+numCounter+'">'+_nums[numCounter-1][3]+'</div>');
			$( "#n"+numCounter ).draggable({
				start: function(event, ui) {
					$(this).css("z-index", 1000);
					$(this).addClass("onDrag");					
				},
				stop: function(event, ui) {
					$(this).removeClass("onDrag");
				},
				containment: $(".playArea")
			});
			$( "#n"+numCounter ).css("left", -150);	
			var _randomY = Math.round(Math.random() * ($(".playArea").height() - $( "#n"+numCounter ).height() - 100));
			$( "#n"+numCounter ).css("top", _randomY);	
			MathJax.Hub.Queue(["Typeset", MathJax.Hub, "'n"+numCounter+"'"]);
			MathJax.Hub.Queue(function(){
				$("#n" + numCounter + " .mjx-chtml").css("font-size",_nums[numCounter-1][2] + "%");
			}); 
			currentNumObj = $( "#n" + numCounter );

			$(".myscore").html(score);
			addNum = false;
			
		}

		var position = currentNumObj.position();

		if(position.left > ($('.playArea').width()+150)){
			currentNumObj.remove();
			currentNumObj  = null;
			addNum = true;
		}else{
			currentNumObj.css("left", (position.left + _speed));
		}
		

	}

	var buildItem = function(id){

	}

	var moveItem = function(id){
		
	}



	var pauseGame = function(){
		if(gamePaused){
			gameMover = setInterval(gameRun, config.intervalSpeed);
			gamePaused = false;
			$(".pauseScreen").hide();
			if(!is_mute){
				loopSound(bg_sound);
			}
		}else{
			$(".pauseScreen").show();
			clearInterval(gameMover); 
			gamePaused = true;
			bg_sound.stop();
		}
		counter.pause();
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
		if(currentNumObj){
			currentNumObj.remove();
			currentNumObj  = null;
		}
		clearInterval(gameMover);
		counter.stop();
		$(".endScreen #result").html(score +" / "+ maxScore);
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
		  radius      : 25,
		  seconds     : config.time,
		  strokeWidth : 5,
		  fillStyle   : '#dddddd',
		  strokeStyle : '#1ca3a6',
		  fontSize    : 16,
		  fontColor   : '#e10043',
		  autostart: false,
		  label: "",
		  onComplete  : function () { endGame(); }
		});
	}

	
	$(".pause, .continue").on("click",function(){		
		pauseGame();
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
	$(".theme").on("click", function(){
		if($("body").hasClass('light')){
			$("body").removeClass("light");
		}else{
			$("body").addClass("light");
		}
		return false;
	});

	$(".sound").on("click", function(){
		stopSounds();
		return false;
	});

	$( window ).resize(function() {
		if(currentNumObj!=null){
			var _randomY = Math.round(Math.random() * ($(".playArea").height() - currentNumObj.height() - 100));
			currentNumObj.css("top", _randomY);	
		}
	});


// Clock (Extra)
	function updateTime() {
	    var dateInfo = new Date();

	    /* time */
	    var hr,
	    _min = (dateInfo.getMinutes() < 10) ? "0" + dateInfo.getMinutes() : dateInfo.getMinutes(),
	        sec = (dateInfo.getSeconds() < 10) ? "0" + dateInfo.getSeconds() : dateInfo.getSeconds(),
	        ampm = (dateInfo.getHours() >= 12) ? "مساءً" : "صباحاً";

	    // replace 0 with 12 at midnight, subtract 12 from hour if 13–23
	    if (dateInfo.getHours() == 0) {
	        hr = 12;
	    } else if (dateInfo.getHours() > 12) {
	        hr = dateInfo.getHours() - 12;
	    } else {
	        hr = dateInfo.getHours();
	    }

	    var currentTime = hr + ":" + _min + ":" + sec;

	    // print time
	    document.getElementsByClassName("hms")[0].innerHTML = currentTime;
	    document.getElementsByClassName("ampm")[0].innerHTML = ampm;

	    /* date */
	    var dow = [
	        "الاحد",
	        "الاثنين",
	        "الثلاثاء",
	        "الأربعاء",
	        "الخميس",
	        "الجمعة",
	        "السبت"
	    ],
	        month = [
	            "1",
	            "2",
	            "3",
	            "4",
	            "5",
	            "6",
	            "7",
	            "8",
	            "9",
	            "10",
	            "11",
	            "12"
	        ],
	        day = dateInfo.getDate();

	    // store date
	    var currentDate = "<span class='day'>" + dow[dateInfo.getMonth()] + "</span>، " + day + " / " + month[dateInfo.getMonth()];

	    document.getElementsByClassName("date")[0].innerHTML = currentDate;
	};

	// print time and date once, then update them every second
	updateTime();
	setInterval(function () {
	    updateTime()
	}, 1000);
	// End Clock
}
});