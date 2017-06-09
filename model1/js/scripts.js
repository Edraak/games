$(document).ready(function(){
	//Globals
	var blocksArray = new Array();

	blocksArray["L00"] = ["L00","L01","L02","L03","L04","L10","L20","L30","L40","L50","L60"];
	blocksArray["L01"] = ["L01","L02","L03","L04","L11","L21","L31","L41","L51","L61"];
	blocksArray["L02"] = ["L02","L03","L04","L12","L22","L32","L42","L52","L62"];
	blocksArray["L03"] = ["L03","L04","L13","L23","L33","L43","L53","L63"];
	blocksArray["L04"] = ["L00","L01","L02","L03","L04"];

	blocksArray["L10"] = ["L11","L12","L13","L14","L10","L20","L30","L40","L50","L60"];
	blocksArray["L11"] = ["L12","L13","L14","L11","L21","L31","L41","L51","L61"];
	blocksArray["L12"] = ["L13","L14","L12","L22","L32","L42","L52","L62"];
	blocksArray["L13"] = ["L13","L14","L23","L33","L43","L53","L63"];
	blocksArray["L14"] = ["L10","L11","L12","L13","L14"];

	blocksArray["L20"] = ["L21","L22","L23","L24","L20","L30","L40","L50","L60"];
	blocksArray["L21"] = ["L22","L23","L24","L21","L31","L41","L51","L61"];
	blocksArray["L22"] = ["L23","L24","L22","L32","L42","L52","L62"];
	blocksArray["L23"] = ["L23","L24","L33","L43","L53","L63"];	
	blocksArray["L24"] = ["L20","L21","L22","L23","L24"];
	
	blocksArray["L30"] = ["L31","L32","L33","L34","L30","L40","L50","L60"];
	blocksArray["L31"] = ["L32","L33","L34","L31","L41","L51","L61"];
	blocksArray["L32"] = ["L33","L34","L32","L42","L52","L62"];
	blocksArray["L33"] = ["L33","L34","L43","L53","L63"];
	blocksArray["L34"] = ["L30","L31","L32","L33","L34"];
	
	blocksArray["L40"] = ["L41","L42","L43","L44","L40","L50","L60"];
	blocksArray["L41"] = ["L42","L43","L44","L41","L51","L61"];
	blocksArray["L42"] = ["L43","L44","L42","L52","L62"];
	blocksArray["L43"] = ["L43","L44","L53","L63"];
	blocksArray["L44"] = ["L40","L41","L42","L43","L44"];
	
	blocksArray["L50"] = ["L51","L52","L53","L54","L50","L60"];
	blocksArray["L51"] = ["L52","L53","L54","L51","L61"];
	blocksArray["L52"] = ["L53","L54","L52","L62"];
	blocksArray["L53"] = ["L53","L54","L63"];
	blocksArray["L54"] = ["L50","L51","L52","L53","L54"];
	
	blocksArray["L60"] = ["L60","L00","L10","L20","L30","L40","L50","L60"];
	blocksArray["L61"] = ["L61","L01","L11","L21","L31","L41","L51","L61"];
	blocksArray["L62"] = ["L62","L02","L12","L22","L32","L42","L52","L62"];
	blocksArray["L63"] = ["L63","L03","L13","L23","L33","L43","L53","L63"];
	
	
	
	
	
	
	

	$("g.g-block").hide();
	$("g.g-block").each(function(n){
		$(this).delay( n * 50 ).show(400);
	});
	
	$("#info-window").hide();
	
	$(".g-block").on("mouseover",function(){
		var _id = $(this).attr("id");
		/*if( _id == "L62" || _id == "L63" || _id == "L52" || _id == "L53" || _id == "L43" || _id == "L54" || _id == "L44"){
			$("#info-window").css("top",0);
			$("#info-window").css("bottom","auto");
		}else{
			$("#info-window").css("bottom",0);
			$("#info-window").css("top","auto");
		}*/
		$("g.g-block").show();
		var block_id = $(this).attr("id");
		$(".g-block").css("opacity",0.15);
		$("#info-window p").html($("." + _id).html());
		$("#info-window").show();
		for(var i in blocksArray[block_id]){
			$("#" + blocksArray[block_id][i]).css("opacity",1);
		}		
	});
	$(".g-block").on("mouseout",function(){
		$(".g-block").css("opacity",1);
		$("#info-window").hide();
		//$(this).css("opacity",1);
	});
});