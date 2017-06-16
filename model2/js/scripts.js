$(document).ready(function(){
	//Globals

	var blocksArr = new Array();

	blocksArr["dot1"] = ["blk1","cont1","anim1"];
	blocksArr["dot2"] = ["blk2","cont2","anim2"];
	blocksArr["dot3"] = ["blk3","cont3","anim3"];

	//$(".content").hide();
	$(".content").css("opacity",0);
	$(".anim").hide();

	// Tooltip only Text
        $('.tip').hover(function(){
                // Hover over code
                var title = $(this).attr('title');
                $(this).data('tipText', title).removeAttr('title');
                $('<p class="tooltip"></p>')
                .html('<svg  x="0px" y="0px" width="10.666px" height="9.238px" viewBox="0 0 10.666 9.238" enable-background="new 0 0 10.666 9.238" xml:space="preserve" id="arrow"><polygon fill="#161616" points="0,9.238 5.333,0 10.666,9.238 "/></svg>' + title)
                .appendTo('body')
                .fadeIn('slow');
                

        }, function() {
                // Hover out code
                $(this).attr('title', $(this).data('tipText'));
                $('.tooltip').remove();
        }).mousemove(function(e) {
                var mousex = e.pageX - ($('.tooltip').outerWidth()/2); //Get X coordinates
                var mousey = e.pageY + 10; //Get Y coordinates
                $('.tooltip')
                .css({ top: mousey, left: mousex })
        });


      // circle click action

      $(".tip").on("click", function(){
      		$(".block").css("opacity",0.3);
      		$(".content").css("opacity",0);
      		$(".anim").hide();
      		$(".note").css("opacity",0);
            $("#" + blocksArr[$(this).attr("id")][0]).css("opacity",1);
            $("." + blocksArr[$(this).attr("id")][1]).css("opacity",1);
            $("." + blocksArr[$(this).attr("id")][2]).show();
            return false;
      });
});