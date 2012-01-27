/*
 * jQuery viewbook Plugin
 * Copyright (c) 2009 W. Grauvogel
 *
 * Originally based on the work of:
 *	1) Charles Mangin (http://clickheredammit.com/pageflip/)
 */
;(function($) {
		   
var ver = '1.2';
var recentHash = '', recentItemHash = '', dialogOpen = false, animating = false;

$.fn.viewbook = function(options) {
	return this.each(function() {
		//get viewbook container, set .viewbook class
		var $cont = $(this).addClass('viewbook');
		//setup arrays and variables
		var $slides = new Array();
		var $titles = new Array();
		var $types = new Array();
		var $blank = '<div class="page-blank"></div>';
		var loaded = false;
		
		//initialize options
		var opts = $.extend({}, $.fn.viewbook.defaults, options);
		//setup slides
		setupSlides($slides, $titles, $types, $blank, opts);
		//build structure
		var $struct = buildBook($cont);
		if ($struct === false)
			return;
		//build options	
		buildOptions($cont, $slides.length, $titles, $types, opts);
		setupBook($struct, opts, true);		
		var hash = setupHash($struct, opts);
		resetSlides($struct, $slides, opts);

		//click controls
		$struct.previous.click(function(){$.fn.viewbook.prev($struct, $slides, opts);});
		$struct.next.click(function(){$.fn.viewbook.next($struct, $slides, opts);});
		
		//keyboard controls
		$(document).unbind('keyup').keyup(function(event){
			if(event.keyCode == 37){$.fn.viewbook.prev($struct, $slides, opts)}
			else if(event.keyCode == 39){$.fn.viewbook.next($struct, $slides, opts)}
		});
		
		//hash controls
		clearInterval();
		setInterval(function(){pollHash($cont, $struct, $slides, opts)}, 250);
	});
}

//get page number from hash tag, last element
function getHashNum(){
	var hash = window.location.hash.split('/');
	if(hash.length > 1)
		return parseInt(hash[2])-1;
	else
		return '';
}

//get hash item by /placement/
function getHash(x){
	var x = x || 0;
	var hash = window.location.hash.split('/');
	if(hash.length > 0)
		return hash[x];
	else
		return '';
}

//setup hash - get current page number and set as current page in options
function setupHash($struct, opts){
	var hash = getHashNum();
	var gotoend = getHash(0);
	
	if(gotoend == '#end'){
		opts.curr = opts.sTotal-2;
		updatePager($struct, opts);
		hash = opts.sTotal-1;
		updateHash(hash);
	}else if(!isNaN(hash) && hash <= opts.sTotal-1 && hash >= 0 && hash != ''){
		if((hash % 2) != 0){
			hash--;
		}
		opts.curr = hash;
		updatePager($struct, opts);
	}
	return hash;
}

//poll hash tag on interval for page + book changes
function pollHash($cont, $struct, $slides, opts) {
	var hash = getHashNum();
	//check page num
	if(!isNaN(hash) && hash <= opts.sTotal-1 && hash >= 0){
		if(hash != opts.curr && hash.toString()!=recentHash){
			if((hash % 2) != 0) hash--;
			
			var bookTitle = opts.name + " - ";
			document.title = bookTitle + "Visions of Discovery - Discovery Park - Page "+ (hash+1);
			
			if(animating == false){
				$.fn.viewbook.gotoPage($struct, $slides, opts, hash);
				recentHash = hash;
			}
		}
	}
	//check if page is gallerypage, update to current item in gallery
	if(opts.types[opts.curr] == "gallerypage"){
		var itemhash = parseInt(getHash(4));
		var $gallerycount = $struct.p1.find('.gallery > a').size();
		if(!isNaN(itemhash) && itemhash >= 1 && itemhash <= $gallerycount && itemhash != recentItemHash){
			var $gallery = $struct.p1.find('.gallery');
			var $galleryitems = $struct.p2.find('.galleryitems');
			$galleryitems.find('div').hide().removeClass('current');
			$galleryitems.find('.item'+itemhash).fadeIn("fast").addClass('current');
			recentItemHash = itemhash;
		}
	}
}

//set the hash
function updateHash(hash){
	window.location.hash = "/page/" + hash;
}

//setup slides - load slide content and titles into arrays
function setupSlides($slides, $titles, $types, $blank, opts){
	$('#load #load-'+opts.index).children().each(function(i){
		if($(this).children().length > 0){						   
			$slides[i] = $(this).html();
		}else{
			$slides[i] = $(this);
		}
		$titles[i] = $(this).attr('title');
		$types[i] = $(this).attr('class');
		//$(this).remove();
	});
	//fix for odd number
	if(($slides.length % 2) != 0){
		$slides[$slides.length] = $blank;
		$titles[$slides.length] = '';
		$types[$slides.length] = '';
	}
}

//setup of the viewbook structure
function buildBook($cont){
	$cont.prepend('<div class="pN"><div class="p-wrap-left"></div></div><div class="p1"><div class="p-wrap-left"></div></div><div class="p4"><div class="p-wrap-left"></div></div><div class="p2"><div class="p-wrap-left"></div></div><div class="p3"><div class="p-wrap-left"></div><div class="shadow-f"></div></div><div class="p0"><div class="p-wrap-right"></div><div class="shadow-b"></div></div><div class="previous"><div class="tab">Previous</div><div class="arrow">Previous</div></div><div class="next"><div class="tab">Next</div><div class="arrow">Next</div></div>');
	var $struct = {};
	$struct.pN = $cont.find('.pN');
	$struct.p0 = $cont.find('.p0');
	$struct.p1 = $cont.find('.p1');
	$struct.p2 = $cont.find('.p2');
	$struct.p3 = $cont.find('.p3');
	$struct.p4 = $cont.find('.p4');
	$struct.sF = $cont.find('.shadow-f');
	$struct.sB = $cont.find('.shadow-b');
	$struct.previous       = $cont.find('.previous');
	$struct.previous.tab   = $cont.find('.previous .tab');
	$struct.previous.arrow = $cont.find('.previous .arrow');
	$struct.next       = $cont.find('.next');
	$struct.next.tab   = $cont.find('.next .tab');
	$struct.next.arrow = $cont.find('.next .arrow');
	$struct.arrows  = $cont.find('.arrow');
	$struct.slides  = $cont.find('.pN, .p0, .p1, .p2, .p3, .p4');
	$struct.wraps   = $cont.find('.p-wrap-left, .p-wrap-right');
	$struct.pN.wrap = $cont.find('.pN .p-wrap-left');
	$struct.p0.wrap = $cont.find('.p0 .p-wrap-right');
	$struct.p1.wrap = $cont.find('.p1 .p-wrap-left');
	$struct.p2.wrap = $cont.find('.p2 .p-wrap-left');
	$struct.p3.wrap = $cont.find('.p3 .p-wrap-left');
	$struct.p4.wrap = $cont.find('.p4 .p-wrap-left');
	$struct.toc = $('#toc').attr('style','');
	return $struct;
}

//build options with user inputs
function buildOptions($cont, slideCount, titles, types, opts, reloading){
	opts.titles  = titles;
	opts.types   = types;
	opts.sWidth  = $cont.width()/2;
	opts.sWidthN = '-'+($cont.width()/2)+'px';
	opts.sWidthH = $cont.width()/4;
	opts.sHeight = $cont.height();
	opts.topShadowForward.width = '-'+opts.topShadowForward.width+'px';
	opts.topShadowBack.width = '-'+opts.topShadowBack.width+'px';
	opts.sTotal = slideCount;
	opts.tocHeight = $('#toc').height();
	opts.curr = 0;
	
	if(opts.books.length == 0 || opts.index > opts.books.length || opts.index < 0){
		opts.index = 0;
		opts.name = '';
	}else{
		opts.name = opts.books[opts.index];
	}
}

//setup general elements
function setupBook($struct, opts){
	//dropdown selectors for books, pages
	$('.selector').each(function(){
		var selectlist = $(this).find('ul').empty().css('height','auto');
		
		if($(this).hasClass('selector-page')){
			for(i=0; i < opts.sTotal; i+=2){
				selectlist.append('<li><a href="#/page/'+ (i+1) +'"><span class="text">'+ opts.titles[i] +'</span><span class="num">'+ (i+1) +' - '+ (i+2) +'</span></a></li>');
			}
		}else if($(this).hasClass('selector-book')){
			$(this).find('.current').html(opts.name);
			for(i=0; i < opts.books.length; i+=1){
				selectlist.append('<li><a href="/discoverypark/viewbook/'+ opts.books[i].toLowerCase() +'/"><span class="text">'+ opts.books[i] +'</span><span class="num">'+ (i+1) +'</span></a></li>');
			}
		}
		
		var selectheight = selectlist.height();
		selectlist.css({'height':0, 'padding-bottom':0});
		
		$(this).unbind('hover').hover(function(){
			selectlist.stop().animate({height:selectheight, paddingBottom:10}, 500);
		},function(){
			selectlist.stop().animate({height:0, paddingBottom:0}, 500);
		});
	});
	
	$("a#print").fancybox({
		'titleShow'     : false	  
	});
	$("#printform .book").each(function(){
		if($(this).val() == opts.index)
			$(this).attr('checked','checked');
	});
	$("#printform .book").change(function(){
		if($(this).is(":checked")){
			if($(this).val() == 0)
				$("#load-0").load("/dp/viewbook/books/overview.php");
			else if($(this).val() == 1)
				$("#load-1").load("/dp/viewbook/books/discovery.php");
			else if($(this).val() == 2)
				$("#load-2").load("/dp/viewbook/books/delivery.php");
			else if($(this).val() == 3)
				$("#load-3").load("/dp/viewbook/books/engagement.php");
			else if($(this).val() == 4)
				$("#load-4").load("/dp/viewbook/books/partnerships.php");
		}else{
			if($(this).val() == 0)
				$("#load-0").empty();
			else if($(this).val() == 1)
				$("#load-1").empty();
			else if($(this).val() == 2)
				$("#load-2").empty();
			else if($(this).val() == 3)
				$("#load-3").empty();
			else if($(this).val() == 4)
				$("#load-4").empty();
		}
	});
	
	$("#printform").submit(function(){
		var check_books = false;							
		$("#printform .book").each(function(){
			if($(this).is(":checked")){
				check_books = true;
			}
		});
		
		if(check_books){
			$.fancybox.close();
			window.print();
		}

		return false;
	});
	
	//table of contents
	$struct.toc.height(40);
	$('#toc h2').toggle(function(){
			$struct.toc.animate({height:opts.tocHeight}, 250, 'easeInOutQuad').addClass('open').removeClass('closed');
			tocOpen = true;
		},function(){
			$struct.toc.animate({height:40}, 250, 'easeInOutQuad').addClass('closed').removeClass('open');
			tocOpen = false;
	});
	
	//tabs, arrows		
	if($.support.opacity){
		$struct.previous.unbind('hover').hover(
			function(){$struct.previous.arrow.fadeIn('fast');},
			function(){$struct.previous.arrow.fadeOut('fast');					
		});
		$struct.next.unbind('hover').hover(
			function(){$struct.next.arrow.fadeIn('fast');},
			function(){$struct.next.arrow.fadeOut('fast');					
		});
	}else{
		$struct.previous.unbind('hover').hover(
			function(){$struct.previous.arrow.show();},
			function(){$struct.previous.arrow.hide();					
		});
		$struct.next.unbind('hover').hover(
			function(){$struct.next.arrow.show();},
			function(){$struct.next.arrow.hide();					
		});
	}
}

function updatePager($struct, opts){
	$('.selector-page .current').html(opts.titles[opts.curr+1]+' '+(opts.curr+1) + ' - ' + (opts.curr+2));
}

//setup custom slide elements - galleries, map, contact tips
function setupCustomSlides(){
	$("a.iframe").fancybox({
		'width'				: 1020,
		'height'			: '80%',
		'autoScale'			: false,
		'transitionIn'		: 'none',
		'transitionOut'		: 'none',
		'type'				: 'iframe'
	});
	
	$('.qtip').remove();
		
	$('.gallery').each(function(){
		var gNum = $(this).attr('id').replace('gallery','');
		var gItems = $('#galleryitems'+gNum);
		
		$(this).find('a').each(function(){
			var itemNum = '.item' + $(this).attr('class').replace('thumb','');
			$(this).attr('href','#/page/'+(getHashNum()+1)+'/item/'+$(this).attr('class').replace('thumb',''));
			$(this).qtip({
				content:  {text: gItems.find(itemNum+' h3').text()},
				position: {target: $(this), corner: {target:'topRight', tooltip:'bottomLeft'}, adjust:{x: -10, y: 10}},
				style:    {name: 'dark', tip: {corner:'bottomLeft', size: { x: 5, y: 5 }}, 'text-align':'center', 'padding':'10px 15px'}
			});
		});
		
	});
	$('.email a, .phone span, .web a').qtip({
			position: { corner: {target:'topMiddle', tooltip:'bottomLeft'}},
			style:    {tip:     {corner:'bottomLeft', size: { x: 5, y: 5 }}}
	});
	$('.viewbook .p2 .map-overlay').each(function(){
		$(this).hide().appendTo('.viewbook').fadeIn('slow').addClass('map-overlay-moved');
	});
	$('.map-overlay').mouseenter(function(){
		$(this).css({'z-index':'120', 'background-position':'0px -216px'});										  
		if(dialogOpen == false){										  
			dialogOpen = true;
			var $dialog = $('#'+$(this).attr('id')+'-dialog');
			if($.support.opacity){
				$dialog.fadeIn("fast");
			}else{
				$dialog.show();
			}
		}
	}).mouseleave(function(){
		$(this).css({'z-index':'50', 'background-position':'0px 0px'});										  
		if(dialogOpen == true){										  
			dialogOpen = false;
			var $dialog = $('#'+$(this).attr('id')+'-dialog');
			if($.support.opacity){
				$dialog.fadeOut("fast");
			}else{
				$dialog.hide();
			}
		}
	});
	$('#research-popup, #research-popup-line').hide();
	$('.viewbook').append($('#research-popup-line'));
	$('.viewbook').append($('#research-popup'));
	$('.research-list li').mouseenter(function(){
		$('#research-popup-line').stop().hide().css('width','0px').show();
		$('#research-popup').stop().hide().css('height','0px').html($(this).find('div').html());
		
		$('#research-popup-line').animate({top:($(this).position().top + 32)});
		
		$('#research-popup').animate({top:($(this).position().top - 120)});
		$('#research-popup-line').animate({width:100}, 'easeInOutQuad', function(){
			$('#research-popup').show().animate({height:300});
		});
		
	});
}
function updateTabs($struct, opts){
	//update cursors
	if(opts.curr < opts.sTotal-2 || (opts.books.length > 0 && (opts.index+1) < opts.books.length)){
		$struct.next.fadeIn('fast').css('cursor',opts.cursor);
	}else if(opts.curr < opts.sTotal-2 || (opts.books.length > 0 && (opts.index+1) == opts.books.length)){
		$struct.next.fadeIn('fast').css('cursor',opts.cursor);
	}else{
		$struct.next.fadeOut('fast').css('cursor','default'); 
		$struct.next.arrow.hide();
	}
	
	if(opts.curr >= 2 || (opts.books.length > 0 && (opts.index-1) > 0)){           
		$struct.previous.fadeIn('fast').css('cursor',opts.cursor);
	}else if(opts.curr < opts.sTotal-2 && (opts.books.length > 0 && (opts.index+1) == opts.books.length)){
		$struct.previous.fadeIn('fast').css('cursor',opts.cursor);
	}else{
		$struct.previous.fadeOut('fast').css('cursor','default'); 
		$struct.previous.arrow.hide();
	}
}
function updateMap(){
	$('.map-overlay-moved').empty().remove();
	$('#research-popup, #research-popup-line').hide();	
}

$.fn.viewbook.next = function($struct, $slides, opts){
	//check for end of content array					   
	if(opts.curr+2 < opts.sTotal && animating == false){
		animating = true;
		//inc counter
		opts.curr+=2;
		updateHash(opts.curr+1);
		updatePager($struct, opts);
		updateTabs($struct, opts);
		updateMap();
		
		//hide p2 as p3 moves across it
		$struct.p2.animate({width:0}, opts.duration/2, opts.easeIn);
		//check for opacity support -> animate shadow overlay on moving slide
		if($.support.opacity){
			$struct.sF.animate({opacity:1}, opts.duration/2, opts.easeIn)
					  .animate({opacity:0}, opts.duration/2, opts.easeOut);
		}else{
			$struct.sF.animate({right:opts.topShadowForward.width}, opts.duration, opts.easeIn);
		}
		//animate p3 from right to left (left: movement, width: reveal slide, paddingLeft: shadow underneath)
		//call setupSlides at end of animation to reset slides
		$struct.p3.animate({left:opts.sWidthH, width:opts.sWidthH, paddingLeft: opts.bottomShadow.width}, opts.duration/2, opts.easeIn)
				  .animate({left:0, width:opts.sWidth, paddingLeft:0}, opts.duration/2);
		$struct.p3.wrap.animate({left:opts.bottomShadow.width}, opts.duration/2, opts.easeIn)
					   .animate({left:0}, opts.duration/2, opts.easeOut, function(){resetSlides($struct, $slides, opts);});
	}else if((opts.books.length > 0 && (opts.index+1) < opts.books.length) && animating == false){
		if(opts.books[opts.index+1] == "Engagement"){
			window.location = '../engagement/';
		}else{
			window.location = '../' + opts.books[opts.index+1].toLowerCase() + '/';
		}
	}else if((opts.books.length > 0 && (opts.index+1) == opts.books.length) && animating == false){
		window.location = '../';
	}
}
$.fn.viewbook.prev = function($struct, $slides, opts){
	//check for end of content array					   
	if(opts.curr-2 >= 0 && animating == false){
		animating = true;
		//dec counter
		opts.curr-=2;
		updateHash(opts.curr+1);
		updatePager($struct, opts);
		updateTabs($struct, opts);
		updateMap();

		//reveal pN1
		$struct.pN.show();
		//hide p1 as p0 moves across it
		$struct.p1.animate({left:opts.sWidth, width:0}, opts.duration, opts.easing);
		$struct.p1.wrap.animate({left:opts.sWidthN}, opts.duration, opts.easing);
		//check for opacity support -> animate shadow overlay on moving slide
		if($.support.opacity){
			$struct.sB.animate({opacity:1}, opts.duration/2, opts.easeIn)
					  .animate({opacity:0}, opts.duration/2, opts.easeOut);
		}else{
			$struct.sB.animate({left:opts.topShadowBack.width}, opts.duration, opts.easeIn);
		}
		//animate p0 from left to right (left: movement, width: reveal slide (half, full))
		$struct.p0.animate({left:opts.sWidthH, width:opts.sWidthH}, opts.duration/2, opts.easeIn)
				  .animate({left:opts.sWidth, width:opts.sWidth}, opts.duration/2, opts.easeOut);
		//animate .wrapper content with p0 to keep content right aligned throughout
		//call setupSlides at end of animation to reset slides
		$struct.p0.wrap.animate({right:opts.bottomShadow.width}, opts.duration/2, opts.easeIn)
					   .animate({right:0}, opts.duration/2, opts.easeOut, function(){resetSlides($struct, $slides, opts);});
	}else if((opts.books.length > 0 && (opts.index-1) >= 0) && animating == false){
		if(opts.books[opts.index-1] == "Engagement"){
			window.location = '../engagement/#end';
		}else{
			window.location = '../' + opts.books[opts.index-1].toLowerCase() + '/#end';
		}
	}
}
$.fn.viewbook.gotoPage = function($struct, $slides, opts, num){
	if(num > opts.curr && num < opts.sTotal && num >= 0 && animating == false){
		animating = true;
		//inc counter
		opts.curr = num;
		updatePager($struct, opts);
		updateTabs($struct, opts);
		updateMap();
		
		$struct.p3.wrap.html($slides[opts.curr]+'<div class="counter">'+(opts.curr+1)+'</div>');
		$struct.p4.wrap.html($slides[opts.curr+1]+'<div class="counter">'+(opts.curr+2)+'</div>');
		
		//hide p2 as p3 moves across it
		$struct.p2.animate({width:0}, opts.duration/2, opts.easeIn);
		//check for opacity support -> animate shadow overlay on moving slide
		if($.support.opacity){
			$struct.sF.animate({opacity:1}, opts.duration/2, opts.easeIn)
					  .animate({opacity:0}, opts.duration/2, opts.easeOut);
		}else{
			$struct.sF.animate({right:opts.topShadowForward.width}, opts.duration, opts.easeIn);
		}
		//animate p3 from right to left (left: movement, width: reveal slide, paddingLeft: shadow underneath)
		//call setupSlides at end of animation to reset slides
		$struct.p3.animate({left:opts.sWidthH, width:opts.sWidthH, paddingLeft: opts.bottomShadow.width}, opts.duration/2, opts.easeIn)
				  .animate({left:0, width:opts.sWidth, paddingLeft:0}, opts.duration/2);
		$struct.p3.wrap.animate({left:opts.bottomShadow.width}, opts.duration/2, opts.easeIn)
					   .animate({left:0}, opts.duration/2, opts.easeOut, function(){resetSlides($struct, $slides, opts);});
	}else if(num < opts.curr && num < opts.sTotal && num >= 0 && animating == false){
		animating = true;
		//dec counter
		opts.curr = num;
		updateTabs($struct, opts);
		updatePager($struct, opts);
		updateMap();
		
		$struct.pN.wrap.html($slides[opts.curr]+'<div class="counter">'+(opts.curr+1)+'</div>');
		$struct.p0.wrap.html($slides[opts.curr+1]+'<div class="counter">'+(opts.curr+2)+'</div>');
		
		//reveal pN
		$struct.pN.show();
		//hide p1 as p0 moves across it
		$struct.p1.animate({left:opts.sWidth, width:0}, opts.duration, opts.easing);
		$struct.p1.wrap.animate({left:opts.sWidthN}, opts.duration, opts.easing);
		//check for opacity support -> animate shadow overlay on moving slide
		if($.support.opacity){
			$struct.sB.animate({opacity:1}, opts.duration/2, opts.easeIn)
					  .animate({opacity:0}, opts.duration/2, opts.easeOut);
		}else{
			$struct.sB.animate({left:opts.topShadowBack.width}, opts.duration, opts.easeIn);
		}
		//animate p0 from left to right (right: movement, width: reveal slide, paddingLeft: shadow underneath)
		$struct.p0.animate({left:opts.sWidthH, width:opts.sWidthH}, opts.duration/2, opts.easeIn)
				  .animate({left:opts.sWidth, width:opts.sWidth}, opts.duration/2, opts.easeOut);
		//animate .wrapper content with p0 to keep content right aligned throughout
		//call setupSlides at end of animation to reset slides
		$struct.p0.wrap.animate({right:opts.bottomShadow.width}, opts.duration/2, opts.easeIn)
					   .animate({right:0}, opts.duration/2, opts.easeOut, function(){resetSlides($struct, $slides, opts);});
	}
}

//resetSlides - reset all slides' CSS and update content to NEXT or PREV content	
function resetSlides($struct, $slides, opts){
	$struct.wraps.css({'width':opts.sWidth-20, 'height':opts.sHeight});
	//reset topShadows to original positions
	$struct.sF.css({'right':0,'width':opts.sWidth, 'height':opts.sHeight, 'background-image':'url('+opts.topShadowForward.image+')', 'background-repeat':opts.topShadowForward.repeat, 'background-position':'100% 0'});
	$struct.sB.css({'left':0,'width':opts.sWidth, 'height':opts.sHeight, 'background-image':'url('+opts.topShadowBack.image+')', 'background-repeat':opts.topShadowBack.repeat, 'background-position':'0 0'});
	//p1
	$struct.p1.css({'left':0,'width':opts.sWidth, 'height':opts.sHeight});
	$struct.p1.wrap.html($slides[opts.curr]+'<div class="counter">'+(opts.curr+1)+'</div>').css({'left':0, 'opacity':1});
	//p2
	$struct.p2.css({'left':opts.sWidth, 'width':opts.sWidth, 'opacity':1, 'height':opts.sHeight});
	$struct.p2.wrap.html($slides[opts.curr+1]+'<div class="counter">'+(opts.curr+2)+'</div>');
	//pN1
	$struct.pN.css({'left':0, 'width':opts.sWidth, 'height':opts.sHeight}).hide();
	$struct.pN.wrap.html($slides[opts.curr-2]+'<div class="counter">'+(opts.curr-1)+'</div>');
	//p0
	$struct.p0.wrap.html($slides[opts.curr-1]+'<div class="counter">'+(opts.curr)+'</div>');
	$struct.p0.css({'left':0, 'width':0, 'height':opts.sHeight, 'background-image':'url('+opts.bottomShadow.image+')', 'background-repeat':opts.bottomShadow.repeat, 'background-position':'right 10px'}).hide();
	//p3
	$struct.p3.wrap.html($slides[opts.curr+2]+'<div class="counter">'+(opts.curr+3)+'</div>');
	$struct.p3.css({'left':opts.sWidth*2, 'width':0, 'height':opts.sHeight, 'background-image':'url('+opts.bottomShadow.image+')', 'background-repeat':opts.bottomShadow.repeat, 'background-position':'left 10px'});
	//p4
	$struct.p4.wrap.html($slides[opts.curr+3]+'<div class="counter">'+(opts.curr+4)+'</div>');
	$struct.p4.css({'left':opts.sWidth, 'width':opts.sWidth, 'height':opts.sHeight});
	
	setupCustomSlides();
	updateTabs($struct, opts);
	updatePager($struct, opts);
	animating = false;
}

$.fn.viewbook.defaults = {
	books: [],
	index: 0,
	duration: 1000,
	topShadowForward: {
		width: 166,
		image: '../images/shadow-top-forward.png',
		repeat: 'repeat-y'
	},
	topShadowBack: {
		width: 166,
		image: '../images/shadow-top-back.png',
		repeat: 'repeat-y'
	},
	bottomShadow: {
		width: 50,
		image: '../images/shadow.png',
		repeat: 'no-repeat'
	},
	easing:  'easeInOutQuad',
	easeIn:  'easeInQuad',
	easeOut: 'easeOutQuad',
	cursor:  'pointer'
}
	
})(jQuery);
