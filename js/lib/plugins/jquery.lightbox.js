(function($){
/*
 * mLightBox
 *
 * Copyright (c) 2010 hisasann at teamLab
 *
 * Require Library:
 * 　jquery.js 1.3.2
 *
 * Options:
 * 　mLightBoxId - LightBoxとして表示させたい要素ID
 * 　duration - LightBoxの表示速度
 * 　easing - LightBoxのeasingタイプ
 * 　zIndex - LightBoxのz-index値
 * 　callback - コールバック関数を指定してください、型はfunctionです
 * 　
 * Description:
 * 　マイナビバイト用の簡易的なLightBox機能を提供します
 * 　
 * Browser:
 *  Windows - IE6.0, IE7.0, IE8.0, Firefox3.5, Safari3.1, Opera9.6
 *  Mac - Firefox3.5, Safari5, Opera9.6
 *
 */

var options = {
		mLightBoxId: null,
		duration: null,
		easing: null,
		zIndex: null,
		callback: function(){},
		resizebeforeback: function(){},
		closecallback: function(){},
		inBoxOpacity: 1,
		inBoxEffect: function(){this.show();}
	},

	// default z-index
	DEFAULT_ZINDEX = 1000,

	// default duration
	DEFAULT_DURATION = 100,

	// default easing type
	DEFAULT_EASING = "swing",

	// overlay element id
	overlayId = "jquery-mLightBox-overlay"

	;

$.mLightBox = function(opts){
	$.extend(options, opts);
	$.ui.mLightBox(this, options);
}

$.ui = $.ui || {};

$.ui.mLightBox = function(container, options){
	_hideSelectBox();

	var winDimension = ___getPageSize();

	// overlay
	var overlay = $("<div>")
		.attr("id", overlayId)
		.css({
			position: "absolute", top: "0px", left: "0px",
			backgroundColor: "#000000", opacity: "0",
			width: winDimension.pageWidth + "px", height: winDimension.pageHeight + "px",
			zIndex: options.zIndex || DEFAULT_ZINDEX
		})
		.click(function(){
			close(options.closecallback);
		})
		.appendTo("body")
		.animate({opacity: 0.4}, {
			duration: options.duration || DEFAULT_DURATION,
			easing: options.easing || DEFAULT_EASING
		});

	// mLightBox
	var mLightBox = $(options.mLightBoxId);

	animation(mLightBox, __elemOffset(mLightBox));

	__winResize(overlay, mLightBox);
}

$.mLightBox.changeLayer = function(opts){
	$(options.mLightBoxId).hide();
	$.extend(options, opts);

	// mLightBox
	var mLightBox = $(options.mLightBoxId);

	animation(mLightBox, __elemOffset(mLightBox));

	__winResize($(overlayId), mLightBox);
}

$.mLightBox.close = function(fn) {
	close(fn);
}

function close(fn){
	// overlay
	$("#" + overlayId)
		.animate({
			opacity: 0
		}, {
			duration: options.duration || DEFAULT_DURATION,
			easing: options.easing || DEFAULT_EASING,
			complete: function(){
				_showSelectBox();
				$(this).remove();
		}
	});

	// mLightBox
	$(options.mLightBoxId)
		.animate({ opacity: 0 }, {
			duration: options.duration || DEFAULT_DURATION,
			easing: options.easing || DEFAULT_EASING,
			complete: function(){
				$(this).hide();
				(fn || function(){}).apply(this, arguments);
		}
	});
}

function __winResize(overlay, mLightBox) {
	$(window).resize(function(){
		options.resizebeforeback();

		// overlay
		var winDimension = ___getPageSize();
		overlay.css({width: winDimension.pageWidth + "px", height: winDimension.pageHeight + "px"});

		// mLightBox
		var offset = __elemOffset(mLightBox);
		mLightBox.css({top: offset.top, left: offset.left});
	});
}

// LigithBox animate!!
function animation(element, offset) {
	element
		.css({
			opacity: options.inBoxOpacity,
			left: offset.left + "px", top: offset.top,
			zIndex: (options.zIndex || DEFAULT_ZINDEX) + 1 });
	options.inBoxEffect.apply(element, arguments);
	element
		.animate({ opacity: 1}, {
			duration: options.duration || DEFAULT_DURATION,
			easing: options.easing || DEFAULT_EASING,
			complete: function(){
				options.callback.apply(this, arguments);
				$(this).find("input:first").focus();
			}
		});
}

/**
 * getPageSize() by hisasann.com
 *
 */
function ___getPageSize() {
	// スクロール領域を含むwidth
	var pageWidth  = 0;
	if ($.browser.safari) {
		pageWidth = document.body.scrollWidth;
	} else {
		pageWidth = document.documentElement.scrollWidth;
	}

	// スクロール領域を含むheight
	var pageHeight = 0;
	if ($.browser.safari) {
		pageHeight = document.body.scrollHeight;
	} else {
		pageHeight = document.documentElement.scrollHeight;
	}

	// 画面に表示されている領域のwidth
	var windowWidth = window.innerWidth || (document.documentElement && document.documentElement.clientWidth) || document.body.clientWidth;

	// 画面に表示されている領域のheight
	var windowHeight = window.innerHeight || (document.documentElement && document.documentElement.clientHeight) || document.body.clientHeight;

	return {
		pageWidth: pageWidth, pageHeight: pageHeight,
		winWidth: windowWidth, winHeight: windowHeight
	};
}

function __elemOffset(element) {

	var top = Math.floor($(window).scrollTop() + ($(window).height() - $(element).height()) / 2);
	if ($(window).height() < $(element).height()) {
		top = Math.floor($(window).scrollTop());
	}
	var left = Math.floor($(window).scrollLeft() + ($(window).width() - $(element).width()) / 2);
	if ($(window).width() < $(element).width()) {
		left = Math.floor($(window).scrollLeft());
	}
	
	return {
		top: top,
		left: left
	};
}

// ie6 require
var display = [];
function _hideSelectBox() {
	if($.browser.msie && $.browser.version == 6){
		$("select").each(function(index, elem){
			display[index] = $(this).css("visibility");
			$(this).css("visibility", "hidden");
		});
	}
}

function _showSelectBox() {
	if($.browser.msie && $.browser.version == 6){
		$("select").each(function(index, elem){
			$(this).css("visibility", display[index]);
		});
	}
}

})(jQuery);

