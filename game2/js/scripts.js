$(document).ready(function(){
	

	 

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
	 	$( ".startScreen" ).show();
	 $(".loading").fadeOut("fast");

	//Globals
	var _step = 10;
	var _mCenterX = 0;
	var _mCenterY = 0;

	var _xCenter = 0;
	var _yCenter = 0;
	var _cSlope = 0;
	var score = 0;

	var origin = [0,0];
	var _eqNum = 0;
	var randomExplrs = [
		[[["ex1",1,5],["ex2",7,5],["ex3",-2,5],["ex4",-10,5],["ex5",2,6],["ex6",9,-6],["ex7",-7,9]],["y",0,0,5]],
		[[["ex1",-2,-8],["ex2",-2,-1],["ex3",-2,0],["ex4",-2,10],["ex5",0,6],["ex6",3,-1],["ex7",4,-2]],["x",Math.PI/2,-2,0]],
		[[["ex1",5,5],["ex2",8,8],["ex3",-2,-2],["ex4",-4,-4],["ex5",4,3],["ex6",5,-6],["ex7",-7,3]],["y",1,0,0]],
		[[["ex1",0,5],["ex2",5,8],["ex3",-6,-2],["ex4",10,-4],["ex5",4,7],["ex6",2,-6],["ex7",-7,-2],["ex8",10,5]],["y",-0.32492,0,3]],
		[[["ex1",0,5],["ex2",-1,8],["ex3",1,-2],["ex4",-3,-4],["ex5",1,5],["ex6",2,-2],["ex7",-7,0]],["y",-3.07771,0,-4]],
		[[["ex1",3,-8],["ex2",7,-8],["ex3",-2,-8],["ex4",-10,-8],["ex5",8,6],["ex6",9,-1],["ex7",-7,-9]],["y",0,0,-8]],
		[[["ex1",-10,5],["ex2",-6,8],["ex3",0,-2],["ex4",8,-4],["ex5",4,3],["ex6",-5,-6],["ex7",-9,-1]],["y",0.72654,0,2]],
		[[["ex1",-2,5],["ex2",1,8],["ex3",4,-2],["ex4",6,-4],["ex5",4,3],["ex6",4,10],["ex7",-8,-3]],["y",1.96262,0,-6]],
		[[["ex1",0,5],["ex2",0.5,8],["ex3",0.3,-2],["ex4",-2,-4],["ex5",4,3],["ex6",5,-6],["ex7",-9,3]],["y",6.31389,0,5]],
		[[["ex1",1.7,5],["ex2",2.2,8],["ex3",3.4,-2],["ex4",4,-4],["ex5",4,9],["ex6",10,-2],["ex7",-10,3]],["y",-6.31389,3,2]],
		[[["ex1",-4,5],["ex2",-2,8],["ex3",0,-2],["ex4",2,-4],["ex5",4,3],["ex6",5,-6],["ex7",-7,3]],["y",-1.37639,-1,2]],
		[[["ex1",-1,5],["ex2",1,8],["ex3",-4,-2],["ex4",-10,-4],["ex5",4,3],["ex6",5,-6],["ex7",-7,3]],["y",1.37639,0,10]],
		[[["ex1",-1,5],["ex2",-2,8],["ex3",0,-2],["ex4",-4,-4],["ex5",4,3],["ex6",5,-6],["ex7",-7,3]],["y",-3.07771,-1,-4]],
	];

	// set y values
	for(var k in randomExplrs){
		if(randomExplrs[k][1][0] == "y"){
			for(var kk =0 ;kk<4; ++kk){
				randomExplrs[k][0][kk][2] = (randomExplrs[k][1][1] * (randomExplrs[k][0][kk][1]-randomExplrs[k][1][2])) + randomExplrs[k][1][3];
			}
		}
	}

	console.log(randomExplrs);
	 var _curve = null;

	 function createLineElement(x, y, length, angle, _c) {
	   // var line = document.createElement("div");
	    if(_c!=null){
	    	_c.remove();
	    	_c = null;
	    }
	    var styles = 'border: 1px solid green; '
	               + 'width: ' + length + 'px; '
	               + 'height: 0px; '
	               + '-moz-transform: rotate(' + angle + 'rad); '
	               + '-webkit-transform: rotate(' + angle + 'rad); '
	               + '-o-transform: rotate(' + angle + 'rad); '  
	               + '-ms-transform: rotate(' + angle + 'rad); '  
	               + 'position: absolute; '
	               + 'top: ' + y + 'px; '
	               + 'left: ' + x + 'px; ';

	               var line = $("<div style='z-index:500;"+styles+"'></div>");
	               _c = line;

	    //line.setAttribute('style', styles);  
	    return line;
	}
//alert(Math.PI/20);
	function changeLine(x, y, length, angle, _c){
				   _c.css('width',length);
	               _c.css('height',0);
	               _c.css('-moz-transform','rotate(' + angle + 'rad'); 
	               _c.css('-webkit-transform','rotate(' + angle + 'rad'); 
	               _c.css('-o-transform','rotate(' + angle + 'rad');   
	               _c.css('-ms-transform','rotate(' + angle + 'rad');
	               _c.css('top', y );
	               _c.css('left', x );
	}

	function createLine(x1, y1, x2, y2) {
	    var a = x1 - x2,
	        b = y1 - y2,
	        c = Math.sqrt(a * a + b * b);

	    var sx = (x1 + x2) / 2,
	        sy = (y1 + y2) / 2;

	    var x = sx - c / 2,
	        y = sy;

	    var alpha = Math.PI - Math.atan2(-b, a);
	    console.log(x, y, c, alpha);
	    return createLineElement(x, y, c, alpha);
	}

	function addExp(index){
		if(randomExplrs[_eqNum][1][2] == 0){
			$( "#xAxis" ).slider( "disable" );
		}
		if(randomExplrs[_eqNum][1][3] == 0){
			$( "#yAxis" ).slider( "disable" );
		}
		$(".explr").remove();
		for(var i in randomExplrs[index][0]){
			var _exp = "<div class='explr' id='"+randomExplrs[index][0][i][0]+"' style='";
			_exp += " left:" + getDecartPos(_step * randomExplrs[index][0][i][1],_step * randomExplrs[index][0][i][2])[0] + "px;";	
			_exp += " top:" + getDecartPos(_step * randomExplrs[index][0][i][1],_step * randomExplrs[index][0][i][2])[1] + "px;'>";
			_exp += "<img src='img/hat.png'/></div>";	
			$(".grid").append(_exp);
		}
	}

	$(".rescue").on("click",function(){
		console.log(_xCenter , randomExplrs[_eqNum][1][2] , _yCenter , randomExplrs[_eqNum][1][3] ,(Math.round(Math.tan(_cSlope)*100000)/100000) , randomExplrs[_eqNum][1][1]);
		if(randomExplrs[_eqNum][1][0]=="y"){
			if(_xCenter == randomExplrs[_eqNum][1][2] && _yCenter == randomExplrs[_eqNum][1][3] && (Math.round(Math.tan(_cSlope)*100000)/100000) == randomExplrs[_eqNum][1][1]){
				//alert("yes");
				$("#curve").addClass("greenGlow");
				$("#curve").removeClass("redGlow");
				score++;
			}else{
				$("#curve").addClass("redGlow");
				$("#curve").removeClass("greenGlow");
			}
		}else{
			if(_xCenter == randomExplrs[_eqNum][1][2] && _yCenter == randomExplrs[_eqNum][1][3] && ((Math.abs(_cSlope) == 1.5708) || (Math.abs(_cSlope) == (Math.PI/2)))){
				//alert("yes");
				$("#curve").addClass("greenGlow");
				$("#curve").removeClass("redGlow");
				score++;
			}else{
				$("#curve").addClass("redGlow");
				$("#curve").removeClass("greenGlow");
			}
		}

		$( "#xAxis" ).slider( "disable" );
		$( "#yAxis" ).slider( "disable" );
		$( "#slope" ).slider( "disable" );
		$(".score span").html(score);
		$(".rescue").hide();
		$(".next").show();

		return false;
	});

	$(".next, .endgame").on("click",function(){
		if(_eqNum == -1){
			$(".score span").html(score);	
		}
		if(_eqNum < (randomExplrs.length-1)){
			$(".endScreen").hide();	
			$(".rescue").show();
			$(".next").hide();			
			$( "#xAxis" ).slider( "enable" );
			$( "#yAxis" ).slider( "enable" );
			$( "#slope" ).slider( "enable" );
			$( "#xAxis" ).slider( "value", 0 );
			$( "#yAxis" ).slider( "value", 0  );
			$( "#slope" ).slider( "value", 0  );

			_xCenter = 0;
			_yCenter = 0;
			_cSlope = 0;

			$("#curve").removeClass("greenGlow");
			$("#curve").removeClass("redGlow");
			updateGraph();
			addExp(++_eqNum);			
		}else if(_eqNum == (randomExplrs.length-1)){
			//$(".next").html("إعادة اللعب");
			$(".endScreen").show();
			$("#result").html(score);
			_eqNum = -1;	
			score = 0;				
		}
		return false;
	});


	function changeLindByPoints(x1, y1, x2, y2, _c) {
		//alert(_step);
		x1 = x1 * _step;
		y1 = y1 * _step;
		x2 = x2 * _step;
		y2 = y2 * _step;
	    
		x1 = (origin[0] + x1 - 1.5);
		x2 = (origin[0] + x2);
		y1 = (origin[1] - y1- 1.5);
		y2 = (origin[1] - y2);

	    var a = x1 - x2,
	        b = y1 - y2,
	        c = Math.sqrt(a * a + b * b);

	    var sx = (x1 + x2) / 2,
	        sy = (y1 + y2) / 2;

	    var x = sx - c / 2,
	        y = sy;
	       // console.log(x,y);
	       // x = position_start.left - x;
	       // y = position_start.top - y;
	        //console.log(x,y);

	    var alpha = Math.PI - Math.atan2(-b, a);

	    changeLine(x, y, c, alpha, _c);
	}




	

	// Grid
	function createGrid() {
		//console.log($(window).width());
		$(".grid").empty();
		$(".grid").append('<div id="curve"></div>');
		$(".grid").append('<div id="hCircle" class="hCircle"><div class="hCircleIn"></div></div>');
		var _W = $(".playArea").width();
		var _H = $(".playArea").height();
		//alert(_H);
		var size = 50;

		/*if(_W <= 500 || _H <= 500){
			 if(_W <= _H){
			 	size = Math.floor(_W / 12);
			 }else{

			 }
		}*/
		if(_W <= (_H+150)){
				/*_H = _W;
			 	size = Math.floor(_W / 24);
			 	$(".grid").addClass("margin0-auto");
			 	$(".controls").css("width","calc(100% - 40px)");
			 	$(".controls").css("height",$(".playArea").height() - _H);
			 	$(".controls").addClass("padding-20-margin-0");*/
			 	$(".noPortrait").show();
			 	return;
		}else{
				_W = _H;
			 	size = Math.floor(_H / 24);	
			 	var ratioW = ratioH = Math.floor(_H/size);

	        	if(ratioW != 24 ){
	        		//size = 12;
	        		ratioW = ratioH = 24;
			 	    //ratioW = ratioH = Math.floor(_H/size);
			 	   // alert(size);
	        	}
			 	var _size = size;
			 	if(size < 12){
			 		_size = 15;
			 		/*size = 15;*/
			 	}
			 	_step = size;
			 	$(".grid").css("margin-left", size);			 	
			 	$(".grid").removeClass("margin0-auto");
			 	$(".controls").css("height","100%");
			 	$(".controls").css("width",$(".playArea").width() - _W - (3*_size));
			 	$(".controls").css("margin-right", _size);
			 	$(".noPortrait").hide();			 	
		}

		//size = Math.floor(_W / 12);
	    /*var ratioW = Math.floor(_W/size),
	        ratioH = Math.floor(_H/size);*/

	        //alert(ratioW + " --- " + ratioH);
	    
	    var parent = $('.grid')
	        parent.css("width", ratioW  * size);
	        parent.css("height", ratioH  * size);

	    var _zero = 0;
	    for (var i = 0; i < ratioH; i++) {
	        for(var p = 0; p < ratioW; p++){
	        	if(i == 11){
		        	if(p == 11){
			            $('<div />', {
			            	class: "cord-y cord-x font-size-fit",
			                width: size - 2, 
			                height: size - 2
			            }).appendTo(parent).html(p - 11).addClass("z" + _zero++);
			        }else if(p == 12){
			            $('<div />', {
			            	class: "cord-y2 cord-x  font-size-fit",
			                width: size - 2, 
			                height: size - 2
			            }).appendTo(parent).addClass("z" + _zero++);
			        }else{			        	
			        	$('<div />', {
			        		class: "cord-x font-size-fit",
			                width: size - 1, 
			                height: size - 2
			            }).appendTo(parent).html(((p>12)?(p - 12):(p - 11))).addClass("z" + _zero++);
			        }
			    }else if(i == 12){
		        	if(p == 11){
			            $('<div />', {
			            	class: "cord-y cord-x2 font-size-fit",
			                width: size - 2, 
			                height: size - 2
			            }).appendTo(parent).addClass("z" + _zero++);
			        }else if(p == 12){
			            $('<div />', {
			            	class: "cord-y2 cord-x2",
			                width: size - 2, 
			                height: size - 2
			            }).appendTo(parent).addClass("z" + _zero++);
			        }else{
			        	$('<div />', {
			        		class: "cord-x2 font-size-fit",
			                width: size - 1, 
			                height: size - 2
			            }).appendTo(parent).addClass("z" + _zero++);
			        }
			    }else{
			    	if(p == 11){
			            $('<div />', {
			            	class: "cord-y font-size-fit",
			                width: size - 2, 
			                height: size - 1
			            }).appendTo(parent).html(((i>12)?(12-i):(11-i))).addClass("z" + _zero++);
			        }else if(p == 12){
			            $('<div />', {
			            	class: "cord-y2",
			                width: size - 2, 
			                height: size - 1
			            }).appendTo(parent).addClass("z" + _zero++);
			        }else{
			        	$('<div />', {
			                width: size - 1, 
			                height: size - 1
			            }).appendTo(parent).addClass("z" + _zero++);
			        }
			    }
	        }
	        //_zero++;

	    }

	   // $("#grid").append(createLine(0,0,326,301,_curve));
	   
	   var position_start = $(".z300").position();
		   origin[0] = position_start.left;
		   origin[1] = position_start.top;
		   $("#hCircle").css("left",origin[0]);
		   $("#hCircle").css("top",origin[1]);


		   _mCenterX = origin[0];
		   _mCenterY = origin[1];
		   
		  //changeLindByPoints(-10, 0, 10, 0, $("#curve"));
		 // changeLine(origin[0]-1500, origin[1], 3000, 0, $("#curve"));
			updateGraph();

			
		

	}

	createGrid();

	$("#xAxis").slider({
		value:0,
        min: -10,
        max: 10,
        step: 1,
		slide: function(event, ui){
			_xCenter = ui.value;
			updateGraph(event);
		}
	});

	$("#yAxis").slider({
		value:0,
        min: -10,
        max: 10,
        step: 1,
		slide: function(event, ui){
			_yCenter = ui.value;
			updateGraph(event);
		}
	});
	$("#slope").slider({
		value:0,
        min: -Math.PI/2,
        max: Math.PI/2,
        step: 0.15707963267948966,
		slide: function(event, ui){
			_cSlope = ui.value;
			updateGraph(event);
		}
	});

	

	function updateGraph(event){
		//console.log(_step getDecartPos(_xCenter,_yCenter)[0],_step * getDecartPos(_xCenter,_yCenter)[1]);

		origin[0] = getDecartPos(_step * _xCenter,_step * _yCenter)[0];
	    origin[1] = getDecartPos(_step * _xCenter,_step * _yCenter)[1];
	    
	    console.log("Origin: ", origin);

		$("#hCircle").css("left",  origin[0]);
		$("#hCircle").css("top", origin[1]);
		
		//changeLindByPoints(-30, -30, 30, 30, $("#curve"));
		changeLine(origin[0]-1500, origin[1], 3000, -1*_cSlope, $("#curve"));

		_rSlope = Math.round(100000 * Math.tan(_cSlope)) / 100000;
		var xPart = "";
		var yPart = "";
		var bPart = "0";
		var __xCenter = (_xCenter>0)?("- "+_xCenter):("+ "+Math.abs(_xCenter));
		if(Math.abs(_cSlope) != (Math.PI/2) && Math.abs(_cSlope) != 1.5708){
			if(Math.tan(_cSlope) == 0){
				xPart = "";
			}else {
				if(_yCenter == 0){
					if(_xCenter<0){
						if(_rSlope>0){
							xPart = ((Math.abs(_rSlope) == 1)?"":_rSlope) + "(x " + __xCenter + ")";
						}else{
							xPart = ((Math.abs(_rSlope) == 1)?"-":_rSlope) + "(x " + __xCenter + ")";
						}
						bPart = "0";
					}else if(_xCenter>0){
						if(_rSlope>0){
							xPart = ((Math.abs(_rSlope) == 1)?"":_rSlope) + "(x " + __xCenter + ")";
						}else{
							xPart = ((Math.abs(_rSlope) == 1)?"-":_rSlope) + "(x " + __xCenter + ")";
						}
						bPart = "0";
					}else{
						if(_rSlope>0){
							xPart = ((Math.abs(_rSlope) == 1)?"":_rSlope) + "x";
						}else{
							xPart = ((Math.abs(_rSlope) == 1)?"-":_rSlope) + "x";
						}
						bPart = "0";
					}
					
				}else{
					if(_xCenter<0){
						if(_yCenter<0){					
							if(_rSlope>0){
								xPart = ((Math.abs(_rSlope) == 1)?"":_rSlope) + "(x " + __xCenter + ") - ";
							}else{
								xPart = ((Math.abs(_rSlope) == 1)?"-":_rSlope) + "(x " + __xCenter + ") - ";
							}
						}else{
							if(_rSlope>0){
								xPart = ((Math.abs(_rSlope) == 1)?"":_rSlope) + "(x " + __xCenter + ") + ";
							}else{
								xPart = ((Math.abs(_rSlope) == 1)?"-":_rSlope) + "(x " + __xCenter + ") + ";
							}
						}
					}else if(_xCenter>0){
						if(_yCenter<0){					
							if(_rSlope>0){
								xPart = ((Math.abs(_rSlope) == 1)?"":_rSlope) + "(x " + __xCenter + ") - ";
							}else{
								xPart = ((Math.abs(_rSlope) == 1)?"-":_rSlope) + "(x " + __xCenter + ") - ";
							}
						}else{
							if(_rSlope>0){
								xPart = ((Math.abs(_rSlope) == 1)?"":_rSlope) + "(x " + __xCenter + ") + ";
							}else{
								xPart = ((Math.abs(_rSlope) == 1)?"-":_rSlope) +  "(x " + __xCenter + ") + ";
							}
						}
					}else{
						if(_yCenter<0){					
							if(_rSlope>0){
								xPart = ((Math.abs(_rSlope) == 1)?"":_rSlope) + "x - ";
							}else{
								xPart = ((Math.abs(_rSlope) == 1)?"-":_rSlope) + "x - ";
							}
						}else{
							if(_rSlope>0){
								xPart = ((Math.abs(_rSlope) == 1)?"":_rSlope) + "x + ";
							}else{
								xPart = ((Math.abs(_rSlope) == 1)?"-":_rSlope) + "x + ";
							}
						}
					}
					
					
				}
			}
			if(_yCenter != 0){
				if(Math.tan(_cSlope) == 0){
					bPart = _yCenter;
				}else{
					bPart = Math.abs(_yCenter);
				}			
			}else{
				if(Math.tan(_cSlope) == 0){
					bPart = "0";
				}else{
					bPart = "";
				}
				
			}
			$("#equation").html("y = " + xPart + bPart);
		}else{
			yPart = _xCenter;
			$("#equation").html("x = " + yPart);
		}
		
		

		console.log(_xCenter,_yCenter,_cSlope);
	}

	function getDecartPos(x,y){
		var position_start = $(".z300").position();
		x = position_start.left + x;
		y = position_start.top - y;
		return [x,y];
	}

	 
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

	

	

	var maxScore = 10;


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

			

			


		
	//buildCounter();
	var startGame = function(){
		$( ".startScreen" ).hide();
		$( ".startScreen" ).css("left",0);
		$( ".startScreen" ).css("top",0);
		//$( ".endScreen" ).hide();
		//$( ".pauseScreen" ).hide();	

		//loopSound(bg_sound);
		addExp(_eqNum);
		
	}
	$(document).on("mousedown",".dragNum",function(){
		if(!isMobile){
			soundManager.play("dragSound");
		}
	})
	var gameRun = function(){
		
		

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
			loopSound(bg_sound);
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
		}else{
			$(".sound-icon").addClass("fa-volume-up");
			$(".sound-icon").removeClass("fa-volume-off");
			if(iOS){
				loopSound(bg_sound);
			}else{
				soundManager.setVolume(100);
			}
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
		return;
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

	/*$(".grid div").on("click",function(){
		var position = $(this).position();
		//alert( "left: " + position.left + ", top: " + position.top + $(this).index());
		changeLindByPoints(Math.random()*-500,Math.random()*-500,Math.random()*500,Math.random()*500,$("#curve"));
	})*/

	$( window ).resize(function() {
		createGrid();
		if(currentNumObj!=null){
			var _randomY = Math.round(Math.random() * ($(".playArea").height() - currentNumObj.height() - 100));
			currentNumObj.css("top", _randomY);	
		}
		arrangePoints(_eqNum);
	});


	function arrangePoints(index){
		for(var i in randomExplrs[index][0]){
			var _exp = "<div class='explr' id='"+randomExplrs[index][0][i][0]+"' style='";
			_exp += " left:" + getDecartPos(_step * randomExplrs[index][0][i][1],_step * randomExplrs[index][0][i][2])[0] + "px;";	
			_exp += " top:" + getDecartPos(_step * randomExplrs[index][0][i][1],_step * randomExplrs[index][0][i][2])[1] + "px;'>";
			_exp += "<img src='img/hat.png'/></div>";	
			$(".grid").append(_exp);
		}
	}


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