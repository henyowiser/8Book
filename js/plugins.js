/* Copyright (c) 2006 Brandon Aaron (http://brandonaaron.net)
 * Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) 
 * and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
 *
 * $LastChangedDate: 2007-06-20 03:23:36 +0200 (Mi, 20 Jun 2007) $
 * $Rev: 2110 $
 *
 * Version 2.1
 */

(function($){$.fn.bgIframe=$.fn.bgiframe=function(s){if($.browser.msie&&parseInt($.browser.version)<=6){s=$.extend({top:'auto',left:'auto',width:'auto',height:'auto',opacity:true,src:'javascript:false;'},s||{});var a=function(n){return n&&n.constructor==Number?n+'px':n},html='<iframe class="bgiframe"frameborder="0"tabindex="-1"src="'+s.src+'"'+'style="display:block;position:absolute;z-index:-1;'+(s.opacity!==false?'filter:Alpha(Opacity=\'0\');':'')+'top:'+(s.top=='auto'?'expression(((parseInt(this.parentNode.currentStyle.borderTopWidth)||0)*-1)+\'px\')':a(s.top))+';'+'left:'+(s.left=='auto'?'expression(((parseInt(this.parentNode.currentStyle.borderLeftWidth)||0)*-1)+\'px\')':a(s.left))+';'+'width:'+(s.width=='auto'?'expression(this.parentNode.offsetWidth+\'px\')':a(s.width))+';'+'height:'+(s.height=='auto'?'expression(this.parentNode.offsetHeight+\'px\')':a(s.height))+';'+'"/>';return this.each(function(){if($('> iframe.bgiframe',this).length==0)this.insertBefore(document.createElement(html),this.firstChild)})}return this};if(!$.browser.version)$.browser.version=navigator.userAgent.toLowerCase().match(/.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/)[1]})(jQuery);

/* Copyright (c) 2007 Paul Bakaus (paul.bakaus@googlemail.com) and Brandon Aaron (brandon.aaron@gmail.com || http://brandonaaron.net)
 * Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
 * and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
 *
 * $LastChangedDate: 2007-06-22 04:38:37 +0200 (Fr, 22 Jun 2007) $
 * $Rev: 2141 $
 *
 * Version: 1.0b2
 */

(function($){var e=$.fn.height,width=$.fn.width;$.fn.extend({height:function(){if(this[0]==window)return self.innerHeight||$.boxModel&&document.documentElement.clientHeight||document.body.clientHeight;if(this[0]==document)return Math.max(document.body.scrollHeight,document.body.offsetHeight);return e.apply(this,arguments)},width:function(){if(this[0]==window)return self.innerWidth||$.boxModel&&document.documentElement.clientWidth||document.body.clientWidth;if(this[0]==document)return Math.max(document.body.scrollWidth,document.body.offsetWidth);return width.apply(this,arguments)},innerHeight:function(){return this[0]==window||this[0]==document?this.height():this.is(':visible')?this[0].offsetHeight-f(this,'borderTopWidth')-f(this,'borderBottomWidth'):this.height()+f(this,'paddingTop')+f(this,'paddingBottom')},innerWidth:function(){return this[0]==window||this[0]==document?this.width():this.is(':visible')?this[0].offsetWidth-f(this,'borderLeftWidth')-f(this,'borderRightWidth'):this.width()+f(this,'paddingLeft')+f(this,'paddingRight')},outerHeight:function(){return this[0]==window||this[0]==document?this.height():this.is(':visible')?this[0].offsetHeight:this.height()+f(this,'borderTopWidth')+f(this,'borderBottomWidth')+f(this,'paddingTop')+f(this,'paddingBottom')},outerWidth:function(){return this[0]==window||this[0]==document?this.width():this.is(':visible')?this[0].offsetWidth:this.width()+f(this,'borderLeftWidth')+f(this,'borderRightWidth')+f(this,'paddingLeft')+f(this,'paddingRight')},scrollLeft:function(a){if(a!=undefined)return this.each(function(){if(this==window||this==document)window.scrollTo(a,$(window).scrollTop());else this.scrollLeft=a});if(this[0]==window||this[0]==document)return self.pageXOffset||$.boxModel&&document.documentElement.scrollLeft||document.body.scrollLeft;return this[0].scrollLeft},scrollTop:function(a){if(a!=undefined)return this.each(function(){if(this==window||this==document)window.scrollTo($(window).scrollLeft(),a);else this.scrollTop=a});if(this[0]==window||this[0]==document)return self.pageYOffset||$.boxModel&&document.documentElement.scrollTop||document.body.scrollTop;return this[0].scrollTop},position:function(a,b){var c=this[0],parent=c.parentNode,op=c.offsetParent,a=$.extend({margin:false,border:false,padding:false,scroll:false},a||{}),x=c.offsetLeft,y=c.offsetTop,sl=c.scrollLeft,st=c.scrollTop;if($.browser.mozilla||$.browser.msie){x+=f(c,'borderLeftWidth');y+=f(c,'borderTopWidth')}if($.browser.mozilla){do{if($.browser.mozilla&&parent!=c&&$.css(parent,'overflow')!='visible'){x+=f(parent,'borderLeftWidth');y+=f(parent,'borderTopWidth')}if(parent==op)break}while((parent=parent.parentNode)&&(parent.tagName.toLowerCase()!='body'||parent.tagName.toLowerCase()!='html'))}var d=g(c,a,x,y,sl,st);if(b){$.extend(b,d);return this}else{return d}},offset:function(a,b){var x=0,y=0,sl=0,st=0,elem=this[0],parent=this[0],op,parPos,elemPos=$.css(elem,'position'),mo=$.browser.mozilla,ie=$.browser.msie,sf=$.browser.safari,oa=$.browser.opera,absparent=false,relparent=false,a=$.extend({margin:true,border:false,padding:false,scroll:true,lite:false},a||{});if(a.lite)return this.offsetLite(a,b);if(elem.tagName.toLowerCase()=='body'){x=elem.offsetLeft;y=elem.offsetTop;if(mo){x+=f(elem,'marginLeft')+(f(elem,'borderLeftWidth')*2);y+=f(elem,'marginTop')+(f(elem,'borderTopWidth')*2)}else if(oa){x+=f(elem,'marginLeft');y+=f(elem,'marginTop')}else if(ie&&jQuery.boxModel){x+=f(elem,'borderLeftWidth');y+=f(elem,'borderTopWidth')}}else{do{parPos=$.css(parent,'position');x+=parent.offsetLeft;y+=parent.offsetTop;if(mo||ie){x+=f(parent,'borderLeftWidth');y+=f(parent,'borderTopWidth');if(mo&&parPos=='absolute')absparent=true;if(ie&&parPos=='relative')relparent=true}op=parent.offsetParent;if(a.scroll||mo){do{if(a.scroll){sl+=parent.scrollLeft;st+=parent.scrollTop}if(mo&&parent!=elem&&$.css(parent,'overflow')!='visible'){x+=f(parent,'borderLeftWidth');y+=f(parent,'borderTopWidth')}parent=parent.parentNode}while(parent!=op)}parent=op;if(parent.tagName.toLowerCase()=='body'||parent.tagName.toLowerCase()=='html'){if((sf||(ie&&$.boxModel))&&elemPos!='absolute'&&elemPos!='fixed'){x+=f(parent,'marginLeft');y+=f(parent,'marginTop')}if((mo&&!absparent&&elemPos!='fixed')||(ie&&elemPos=='static'&&!relparent)){x+=f(parent,'borderLeftWidth');y+=f(parent,'borderTopWidth')}break}}while(parent)}var c=g(elem,a,x,y,sl,st);if(b){$.extend(b,c);return this}else{return c}},offsetLite:function(a,b){var x=0,y=0,sl=0,st=0,parent=this[0],op,a=$.extend({margin:true,border:false,padding:false,scroll:true},a||{});do{x+=parent.offsetLeft;y+=parent.offsetTop;op=parent.offsetParent;if(a.scroll){do{sl+=parent.scrollLeft;st+=parent.scrollTop;parent=parent.parentNode}while(parent!=op)}parent=op}while(parent&&parent.tagName.toLowerCase()!='body'&&parent.tagName.toLowerCase()!='html');var c=g(this[0],a,x,y,sl,st);if(b){$.extend(b,c);return this}else{return c}}});var f=function(a,b){return parseInt($.css(a.jquery?a[0]:a,b))||0};var g=function(a,b,x,y,c,d){if(!b.margin){x-=f(a,'marginLeft');y-=f(a,'marginTop')}if(b.border&&($.browser.safari||$.browser.opera)){x+=f(a,'borderLeftWidth');y+=f(a,'borderTopWidth')}else if(!b.border&&!($.browser.safari||$.browser.opera)){x-=f(a,'borderLeftWidth');y-=f(a,'borderTopWidth')}if(b.padding){x+=f(a,'paddingLeft');y+=f(a,'paddingTop')}if(b.scroll){c-=a.scrollLeft;d-=a.scrollTop}return b.scroll?{top:y-d,left:x-c,scrollTop:d,scrollLeft:c}:{top:y,left:x}}})(jQuery);

/*
 * jQuery delegate plug-in v1.0
 *
 * Copyright (c) 2007 JÃƒÂ¶rn Zaefferer
 *
 * $Id: jquery.delegate.js 4786 2008-02-19 20:02:34Z joern.zaefferer $
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 */

// provides cross-browser focusin and focusout events
// IE has native support, in other browsers, use event caputuring (neither bubbles)

// provides delegate(type: String, delegate: Selector, handler: Callback) plugin for easier event delegation
// handler is only called when $(event.target).is(delegate), in the scope of the jQuery-object for event.target 

// provides triggerEvent(type: String, target: Element) to trigger delegated events
;(function($){$.each({focus:'focusin',blur:'focusout'},function(a,b){$.event.special[b]={setup:function(){if($.browser.msie)return false;this.addEventListener(a,$.event.special[b].handler,true)},teardown:function(){if($.browser.msie)return false;this.removeEventListener(a,$.event.special[b].handler,true)},handler:function(e){arguments[0]=$.event.fix(e);arguments[0].type=b;return $.event.handle.apply(this,arguments)}}});$.extend($.fn,{delegate:function(c,d,e){return this.bind(c,function(a){var b=$(a.target);if(b.is(d)){return e.apply(b,arguments)}})},triggerEvent:function(a,b){return this.triggerHandler(a,[jQuery.event.fix({type:a,target:b})])}})})(jQuery);

/*
 * jQuery Easing v1.3 - http://gsgd.co.uk/sandbox/jquery/easing/
 *
 * Uses the built in easing capabilities added In jQuery 1.1
 * to offer multiple easing options
 *
 * TERMS OF USE - jQuery Easing
 * 
 * Open source under the BSD License. 
 * 
 * Copyright Ã‚Â© 2008 George McGinley Smith
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without modification, 
 * are permitted provided that the following conditions are met:
 * 
 * Redistributions of source code must retain the above copyright notice, this list of 
 * conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice, this list 
 * of conditions and the following disclaimer in the documentation and/or other materials 
 * provided with the distribution.
 * 
 * Neither the name of the author nor the names of contributors may be used to endorse 
 * or promote products derived from this software without specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY 
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
 *  COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 *  EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
 *  GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED 
 * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 *  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED 
 * OF THE POSSIBILITY OF SUCH DAMAGE. 
 *
*/

jQuery.easing['jswing']=jQuery.easing['swing'];jQuery.extend(jQuery.easing,{def:'easeOutQuad',swing:function(x,t,b,c,d){return jQuery.easing[jQuery.easing.def](x,t,b,c,d)},easeInQuad:function(x,t,b,c,d){return c*(t/=d)*t+b},easeOutQuad:function(x,t,b,c,d){return-c*(t/=d)*(t-2)+b},easeInOutQuad:function(x,t,b,c,d){if((t/=d/2)<1)return c/2*t*t+b;return-c/2*((--t)*(t-2)-1)+b},easeInCubic:function(x,t,b,c,d){return c*(t/=d)*t*t+b},easeOutCubic:function(x,t,b,c,d){return c*((t=t/d-1)*t*t+1)+b},easeInOutCubic:function(x,t,b,c,d){if((t/=d/2)<1)return c/2*t*t*t+b;return c/2*((t-=2)*t*t+2)+b},easeInQuart:function(x,t,b,c,d){return c*(t/=d)*t*t*t+b},easeOutQuart:function(x,t,b,c,d){return-c*((t=t/d-1)*t*t*t-1)+b},easeInOutQuart:function(x,t,b,c,d){if((t/=d/2)<1)return c/2*t*t*t*t+b;return-c/2*((t-=2)*t*t*t-2)+b},easeInQuint:function(x,t,b,c,d){return c*(t/=d)*t*t*t*t+b},easeOutQuint:function(x,t,b,c,d){return c*((t=t/d-1)*t*t*t*t+1)+b},easeInOutQuint:function(x,t,b,c,d){if((t/=d/2)<1)return c/2*t*t*t*t*t+b;return c/2*((t-=2)*t*t*t*t+2)+b},easeInSine:function(x,t,b,c,d){return-c*Math.cos(t/d*(Math.PI/2))+c+b},easeOutSine:function(x,t,b,c,d){return c*Math.sin(t/d*(Math.PI/2))+b},easeInOutSine:function(x,t,b,c,d){return-c/2*(Math.cos(Math.PI*t/d)-1)+b},easeInExpo:function(x,t,b,c,d){return(t==0)?b:c*Math.pow(2,10*(t/d-1))+b},easeOutExpo:function(x,t,b,c,d){return(t==d)?b+c:c*(-Math.pow(2,-10*t/d)+1)+b},easeInOutExpo:function(x,t,b,c,d){if(t==0)return b;if(t==d)return b+c;if((t/=d/2)<1)return c/2*Math.pow(2,10*(t-1))+b;return c/2*(-Math.pow(2,-10*--t)+2)+b},easeInCirc:function(x,t,b,c,d){return-c*(Math.sqrt(1-(t/=d)*t)-1)+b},easeOutCirc:function(x,t,b,c,d){return c*Math.sqrt(1-(t=t/d-1)*t)+b},easeInOutCirc:function(x,t,b,c,d){if((t/=d/2)<1)return-c/2*(Math.sqrt(1-t*t)-1)+b;return c/2*(Math.sqrt(1-(t-=2)*t)+1)+b},easeInElastic:function(x,t,b,c,d){var s=1.70158;var p=0;var a=c;if(t==0)return b;if((t/=d)==1)return b+c;if(!p)p=d*.3;if(a<Math.abs(c)){a=c;var s=p/4}else var s=p/(2*Math.PI)*Math.asin(c/a);return-(a*Math.pow(2,10*(t-=1))*Math.sin((t*d-s)*(2*Math.PI)/p))+b},easeOutElastic:function(x,t,b,c,d){var s=1.70158;var p=0;var a=c;if(t==0)return b;if((t/=d)==1)return b+c;if(!p)p=d*.3;if(a<Math.abs(c)){a=c;var s=p/4}else var s=p/(2*Math.PI)*Math.asin(c/a);return a*Math.pow(2,-10*t)*Math.sin((t*d-s)*(2*Math.PI)/p)+c+b},easeInOutElastic:function(x,t,b,c,d){var s=1.70158;var p=0;var a=c;if(t==0)return b;if((t/=d/2)==2)return b+c;if(!p)p=d*(.3*1.5);if(a<Math.abs(c)){a=c;var s=p/4}else var s=p/(2*Math.PI)*Math.asin(c/a);if(t<1)return-.5*(a*Math.pow(2,10*(t-=1))*Math.sin((t*d-s)*(2*Math.PI)/p))+b;return a*Math.pow(2,-10*(t-=1))*Math.sin((t*d-s)*(2*Math.PI)/p)*.5+c+b},easeInBack:function(x,t,b,c,d,s){if(s==undefined)s=1.70158;return c*(t/=d)*t*((s+1)*t-s)+b},easeOutBack:function(x,t,b,c,d,s){if(s==undefined)s=1.70158;return c*((t=t/d-1)*t*((s+1)*t+s)+1)+b},easeInOutBack:function(x,t,b,c,d,s){if(s==undefined)s=1.70158;if((t/=d/2)<1)return c/2*(t*t*(((s*=(1.525))+1)*t-s))+b;return c/2*((t-=2)*t*(((s*=(1.525))+1)*t+s)+2)+b},easeInBounce:function(x,t,b,c,d){return c-jQuery.easing.easeOutBounce(x,d-t,0,c,d)+b},easeOutBounce:function(x,t,b,c,d){if((t/=d)<(1/2.75)){return c*(7.5625*t*t)+b}else if(t<(2/2.75)){return c*(7.5625*(t-=(1.5/2.75))*t+.75)+b}else if(t<(2.5/2.75)){return c*(7.5625*(t-=(2.25/2.75))*t+.9375)+b}else{return c*(7.5625*(t-=(2.625/2.75))*t+.984375)+b}},easeInOutBounce:function(x,t,b,c,d){if(t<d/2)return jQuery.easing.easeInBounce(x,t*2,0,c,d)*.5+b;return jQuery.easing.easeOutBounce(x,t*2-d,0,c,d)*.5+c*.5+b}});
