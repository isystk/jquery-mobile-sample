
(function($) {
	/*
	 * relevance
	 *
	 * Copyright (c) 2012 iseyoshitaka at teamLab
	 *
	 * Description:
	 * 親子の関連チェック
	 */
	// 親子の関連チェック
	$.relevance = function(options) {

		function CheckRelevance (options) {
			var parent = options.parent, // 親のセレクタ
				children = options.children, // 子のセレクタ
				clazz = options.clazz; // クラス名

			// 親が選択された場合は、子をすべて選択する。
			this.checkChildren = function () {
				if (clazz) {
					if (parent.hasClass(clazz)) {
						children.addClass(clazz);
					}
					else {
						children.removeClass(clazz);
					}
				} else {
					if (parent.is(':checked')) {
						children.attr('checked', 'checked');
					}
					else {
						children.removeAttr('checked');
					}
				}
			};

			// 子がすべて選択された場合は、親を選択する。
			this.checkParent = function () {
				if (clazz) {
					var isAllSelect = _.all(children, function (date) {
						return $(date).hasClass(clazz);
					});

					if (isAllSelect) {
						parent.addClass(clazz);
					}
					else {
						parent.removeClass(clazz);
					}
				} else {
					var isAllSelect = _.all(children, function (date) {
						return $(date).is(':checked');
					});

					if (isAllSelect) {
						parent.attr('checked', 'checked');
					}
					else {
						parent.removeAttr('checked');
					}
				}
			};
		}
		return new CheckRelevance(options);
	};
})(jQuery);


(function($) {
	/*
	 * checkRelevance
	 *
	 * Copyright (c) 2012 iseyoshitaka at teamLab
	 *
	 * Description:
	 * 「すべてにチェック」をクリックした際に、親子関連チェックを行う
	 */
	$.fn.checkRelevance = function(options) {
		// デフォルト値
		var defaults = {
			clazz : null,
			parentCallback: null,
			childCallback: null
		};

		// 引数に値が存在する場合、デフォルト値を上書きする
		var settings = $.extend(defaults, options);

		$(this).each(function() {
			var that = $(this),
				childclass = that.data('childclass'),
				children = $(childclass),
				checkRelevance = $.relevance({parent: that, children: children, clazz: settings.clazz});
			that.click(function(e) {
				e.stopPropagation();
				var self = $(this);
				if (settings.clazz) {
					e.preventDefault();
					if(self.hasClass(settings.clazz)) {
						self.removeClass(settings.clazz);
					} else {
						self.addClass(settings.clazz);
					}
				}
				
				checkRelevance.checkChildren();

				if (settings.parentCallback) {
					settings.parentCallback({parent: that, children: children, self: $(this)});
				}
			});
			children.each(function() {
				$(this).click(function(e) {
					e.stopPropagation();
					var self = $(this);
					if (settings.clazz) {
						e.preventDefault();
						if(self.hasClass(settings.clazz)) {
							self.removeClass(settings.clazz);
						} else {
							self.addClass(settings.clazz);
						}
					}
					
					checkRelevance.checkParent();

					if (settings.childCallback) {
						settings.childCallback({parent: that, children: children, self: $(this)});
					}
				});
			});
			checkRelevance.checkParent();
		});
	};
})(jQuery);

/*!
 * jQuery Cookie Plugin
 * https://github.com/carhartl/jquery-cookie
 *
 * Copyright 2011, Klaus Hartl
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.opensource.org/licenses/GPL-2.0
 */
(function($) {
    $.cookie = function(key, value, options) {

        // key and at least value given, set cookie...
        if (arguments.length > 1 && (!/Object/.test(Object.prototype.toString.call(value)) || value === null || value === undefined)) {
            options = $.extend({}, options);

            if (value === null || value === undefined) {
                options.expires = -1;
            }

            if (typeof options.expires === 'number') {
                var days = options.expires, t = options.expires = new Date();
                t.setDate(t.getDate() + days);
            }

            value = String(value);

            return (document.cookie = [
                encodeURIComponent(key), '=', options.raw ? value : encodeURIComponent(value),
                options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
                options.path    ? '; path=' + options.path : '',
                options.domain  ? '; domain=' + options.domain : '',
                options.secure  ? '; secure' : ''
            ].join(''));
        }

        // key and possibly options given, get cookie...
        options = value || {};
        var decode = options.raw ? function(s) { return s; } : decodeURIComponent;

        var pairs = document.cookie.split('; ');
        for (var i = 0, pair; pair = pairs[i] && pairs[i].split('='); i++) {
            if (decode(pair[0]) === key) return decode(pair[1] || ''); // IE saves cookies with empty string as "c; ", e.g. without "=" as opposed to EOMB, thus pair[1] may be undefined
        }
        return null;
    };
})(jQuery);
(function($){
/*
 * mLightBox
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
 * 　簡易的なLightBox機能を提供します
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
		closecallback: function(){}
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
			opacity: 1,
			left: offset.left + "px", top: offset.top,
			zIndex: (options.zIndex || DEFAULT_ZINDEX) + 1 })
		.show()
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
 * getPageSize()
 *
 */
function ___getPageSize() {
	// スクロール領域を含むwidth
	var pageWidth  = 0;
	if ($.browser && $.browser.safari) {
		pageWidth = document.body.scrollWidth;
	} else {
		pageWidth = document.documentElement.scrollWidth;
	}

	// スクロール領域を含むheight
	var pageHeight = 0;
	if ($.browser && $.browser.safari) {
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
	
	return {
		top: top,
		left: left
	};
}

// ie6 require
var display = [];
function _hideSelectBox() {
	if($.browser && $.browser.msie && $.browser.version == 6){
		$("select").each(function(index, elem){
			display[index] = $(this).css("visibility");
			$(this).css("visibility", "hidden");
		});
	}
}

function _showSelectBox() {
	if($.browser && $.browser.msie && $.browser.version == 6){
		$("select").each(function(index, elem){
			$(this).css("visibility", display[index]);
		});
	}
}

})(jQuery);

(function($) {
/*
 * makeUri
 *
 * Copyright (c) 2012 hisasann at teamLab
 *
 * Description:
 * URLからドメインを除去し、getパラメータを分割します。
 */
$.makeUri = function(href, addParam){
	var url =  $.rejectDomain(href);

	var idx;
	idx = url.indexOf("#");
	url = (idx < 0) ? url : url.substr(0, idx);		// #より前の部分のURLを抽出

	idx = url.indexOf("?");
	var uri = (idx < 0) ? url : url.substr(0, idx);	// ?より前の部分のURLを抽出

	// すでにgetパラメータがあるならそのまま配列に突っ込む
	var param = (idx < 0) ? [] : url.substr(idx + 1).split("&");

	// 追加したいgetパラメータをpushする
	if (addParam) {
		for (var i=0,len=addParam.length; i<len; ++i) {
			param.push(addParam[i]);
		}
	}

	return { uri: uri, param: param }
};

})(jQuery);


(function($) {
/*
 * rejectDomain
 *
 * Copyright (c) 2012 hisasann at teamLab
 *
 * Description:
 * URLからドメイン部分を除去します。
 */
$.rejectDomain = function(url){
	if(!url) return null;

	var idx;

	idx = url.indexOf("/");
	if(idx == 0) return url;

	var baseurl = [location.protocol, "//", location.host].join('');
	idx = url.indexOf(baseurl);

	if(idx != 0) return "";

	return url.substr(baseurl.length);
};

})(jQuery);

(function($) {
/*
 * rejectFragmentId
 *
 * Copyright (c) 2012 hisasann at teamLab
 *
 * Description:
 * URLから#以降、?以降を除去します。
 */
$.rejectFragmentId = function(url){
	if(!url) return null;

	var idx;
	idx = url.indexOf("#");
	url = (idx < 0) ? url : url.substr(0, idx);

	idx = url.indexOf("?");

	return (idx < 0) ? url : url.substr(0, idx);
};

})(jQuery);

(function($) {
/*
 * uriParamJoin
 *
 * Copyright (c) 2012 hisasann at teamLab
 *
 * Description:
 * paramがある場合は?を、paramが複数ある場合は&で繋ぐ
 */
$.uriParamJoin = function(url, param){
	var addParam = $.compact(param);

	return addParam.length > 0 ? [url, addParam.join("&")].join("?") : url;
};

})(jQuery);


(function($){
/*
 * compact
 *
 * Copyright (c) 2012 hisasann at teamLab
 *
 * Description:
 * 配列からnull、undefine、""を除去します。（もっとDeepな感じのほうが便利かな？）
 */

$.compact = function(object) {
	if (object.constructor != Array) { return }

	var ret = new Array();
	for (var i=0,len=object.length; i<len; ++i) {
		if (object[i] !== null && object[i] !== undefined && object[i] !== "") {
			ret.push(object[i]);
		}
	}

	return ret;
}

})(jQuery);



/*
 * mypageMenu
 *
 * Copyright (c) 2012 iseyoshitaka at teamLab
 *
 * Description:
 * マイページメニューを表示します。
 *
 * Sample:
 * 	$('.shoeMenu').mypageMenu();
 *
 */
(function($){

    $.fn.mypageMenu = function(options, callbackfunc) {

    	var menuPanel = null;
    	
        var settings = $.extend({
	            url: null
	        }, options);

        var init = function(obj) {

			var page = $.mobile.activePage || $('body');
			//var topPos = obj.offset().top + obj.height();
			var topPos = 40;

        	menuPanel = $('<div class="mypageMenu"></div>')
							.css('top', topPos + 'px')
							.css('right', '0px')
							.css('width', '98%')
        					.css('position', 'absolute')
        					.css('-webkit-box-shadow', '-2px 2px 2px #aaaaaa')
        					.css('box-shadow', '-2px 2px 2px #aaaaaa')
        					.css('border-bottom', '2px solid #b4b4b4')
        					.css('background', '#ffffff')
        					.css('z-index', '9999')
        					.hide()
        					.appendTo('body');

			replaceHtml(settings.url, function(obj2) {
	    		// コールバック
	    		if (_.isFunction(callbackfunc)) {
	    			callbackfunc(obj2);
	    		}
			});

			// マイページ表示時に背景画面クリック時に閉じる。
			var page = $.mobile.activePage || $('body').find('.page');
			page.bind('vclick', function(e) {
				if ( menuPanel.is(':visible')) {
					e.preventDefault();
					menuPanel.slideUp(100);
					e.stopPropagation();
				}
			});

			// 共通パネル開閉ボタン
			obj.bind('vclick', function(e) {
				e.preventDefault();
				e.stopPropagation();
				if (menuPanel.is(':visible')) {
					menuPanel.slideUp(100);
				} else {
					menuPanel.slideDown(100);
				}
			});

        };
    	
		var replaceHtml = function (url, callback) {

//			// Ajax通信を行う
//			$.ajax({
//				type: 'GET',
//				url : url,
//				cache : false,
//				dataType : 'html',
//				success: function(data){
//					menuPanel.empty().html(data);
//		        	$.mobile.hidePageLoadingMsg();
//				},
//				error: function(XHR, textStatus, errorThrown) {
//				},
//		        complete: function (XHR, textStatus) {
//
//		    		// コールバック
//		    		if (_.isFunction(callback)) {
//		    			callback(menuPanel);
//		    		}
//		    		
//		        }
//			});

			var data = $([
				'<aside class="boxNews" data-clipcount="${totalClipCnt}">',
					'<h3>履歴</h3>',
					'<ul class="listTop04">',
						'<li class="clearfix">',
							'<div class="text">',
								'<p class="name">XXXXXX</p>',
								'<dl class="txtCaption">',
									'<dt>【会場エリア】</dt>',
									'<dd>XXXXXXXXXXXXXXXXXXXXXXX</dd>',
									'<dt>【会場タイプ】</dt>',
									'<dd>XXXXXXXXXXXXXXXXXXXXXXX</dd>',
									'<dt>【ゲスト人数】</dt>',
									'<dd>XXXXXXXXXXXXXXXXXXXXXXX</dd>',
								'</dl>',
							'</div>',
						'</li>',
					'</ul>',
				'</aside>'
				].join(''));
				menuPanel.empty().html(data);

		}

		this.changePage = function(url, callbackfunc2) {
			replaceHtml(url, function(obj2) {
	    		// コールバック
	    		if (_.isFunction(callbackfunc2)) {
	    			callbackfunc2(obj2);
	    		}
			});
		};
		
		this.each(function() {
			init($(this))
		});
		
		return this;
	};

})(jQuery);


(function($) {
	/*
	 * mynavislider *
	 * Copyright (c) 2013 iseyoshitaka
	 *
	 * Description:
	 *  画像スライダー
	 *
	 * Sample:
	 * $('#thumbs').mynavislider({
	 * 	'easing': 'easeInOutCirc'
	 * ,	'duration': 150
	 * ,	'shift':	5
	 * });
	 */
	$.fn.mynavislider = function(options) {

		$.fn.mynavislider.defaults = {
		'separator' : this
		,	'parentKey': 'ul' // 親要素
		,	'childKey': 'li' // 子要素
		,	'shift': 5 // 1度にスライドさせるページ数
		,	'shiftw': null // 1度にスライドさせる幅
		,	'slideSpeed': 300 // スライド速度
		,	'easing': 'easeInOutCirc' // アニメーションの種類
		,	'carousel': false // 回転させるかどうか
		,	'backBtnKey': '#gallery-back' // 次ページボタン
		,	'nextBtnKey': '#gallery-next' // 前ページボタン
		,	'autoSlide': false // 自動スライドさせるどうか
		,	'autoSlideInterval':  5000 // 自動スライドさせる間隔(ミリ秒)
		,	'isMouseDrag': false // スワイプでのページングを可能にするかどうか
		,	'reboundw': 20 // スワイプ時に跳ね返りを行う幅
		,	'slideCallBack': null // スライド後に処理を行うコールバック
		};

		var screen = null // ギャラリー画像表示枠
		,	ul = null // ギャラリー用ULタグ
		,	li = null // ギャラリー用LIタグ
		,	back = null // 前へボタン
		,	next = null // 次へボタン
		,	pos = 0 // ギャラリーポジション
		,	pageNo = 1 // 現在のページ番号
		,	maxPageNo = 1 // 最大のページ番号
		,	liwidth = 0 // 子要素の横幅
		,	shiftw = 0 // ギャラリー移動量
		,	nowLoading = false // スライド処理中かどうか
		,	dragw = 0 // ドラッグした横幅
		,	autoSlider = null;

		var params = $.extend({}, $.fn.mynavislider.defaults, options);

		var ANIMATE_TYPE = {
			NO: 0,
			SLIDE: 1,
			FADE: 2
		};

		// jQueryオブジェクトキャッシュ、移動量の初期設定を行う
		var init = function(obj) {
			screen = $(obj);
			back = $(params.backBtnKey);
			next = $(params.nextBtnKey);
			ul = screen.find(params.parentKey);
			li = ul.find(params.childKey);
			if (params.shiftw) {
				liwidth = Math.ceil(params.shiftw/params.shift);
				shiftw = params.shiftw;
			} else {
				liwidth = li.width();
				shiftw = liwidth * params.shift;
			}
			maxPageNo = Math.ceil(li.size()/params.shift);

			// １画像のみの場合のカルーセルには現状対応していない。
			if (maxPageNo <= 1) {
				params.carousel = false;
			}

			if (params.carousel) {
				// カルーセルの初期設定を行う
				initCarousel();
				pos = li.size()/2;
			} else {
				// ページングボタンの表示制御
				showArrows();
				pos = params.shift;
			}

			// ulタグの横幅を調整する
			ul.css('width', shiftw * li.size() / params.shift)
				.css('position', 'relative');

			// マウスドラッグでのページングを可能にする
			if (params.isMouseDrag) {
				bindMouseDragEvent();
			}

			// マウスクリックでのページングを可能にする
			bindMouseClickEvent();

			// 自動のページングを可能にする。
			if (params.autoSlide) {
				autoSlider = new autoSlide();
				autoSlider.start();
			}

		};

		// 画像ギャラリーをスライドする
		var slide = function(page, animateType) {

			if (!animateType) {
				animateType = ANIMATE_TYPE.NO;
			}

			// 後処理
			var after = function() {
				if (params.carousel) {
					doCarousel();
				}

				nowLoading = false;
				dragw = 0;

				// コールバック
				slideCallBack();
			};

			// 移動するページ量
			var move = page - pageNo;

			if (maxPageNo <= 1) {
				after();
				return;
			}

			// カルーセルがない場合で、次ページが存在しない場合は、処理させない
			if (!params.carousel) {
				if ((move < 0 && pageNo === 1) || (0 < move && pageNo === maxPageNo)) {
					after();
					return;
				}
			}

			nowLoading = true;

			var from = 0;
			if (params.carousel) {
				from = -1 * (pos/params.shift) * shiftw - dragw;
			} else {
				from = -1 * (pos-params.shift)/params.shift * shiftw - dragw;
			}
			var to = from - (shiftw * move) + dragw;

			pos = pos + (params.shift * move);

			// ページ番号
			if (page < 1) {
				pageNo = maxPageNo;
			} else if (maxPageNo < page) {
				pageNo = 1;
			} else {
				pageNo = page;
			}

			// ページングボタンの表示制御
			if (!params.carousel) {
				showArrows();
			}

			if (animateType === ANIMATE_TYPE.NO) {
				// アニメーションを利用しない
				if (1 < maxPageNo && params.carousel) {
					pos = page * params.shift + (li.size()/2) - params.shift;
					ul.css('left', '-' + (pos * liwidth) + 'px');
				} else {
					pos = page * params.shift;
					ul.css('left', '-' + ((pos - params.shift) * liwidth) + 'px');
				}
				after();
			} else if (animateType === ANIMATE_TYPE.SLIDE) {
				if (!params.isMouseDrag) {
					// jQueryを利用したアニメーション
					ul.animate(
						{ left: to}
					,	params.slideSpeed
					,	params.easing
					,	function() {
							after();
						}
					);
				} else {
					// jQueryを利用しないアニメーション(Androidでアニメーションが重いため)
					(function() {
						var self = this;

						var elem = ul[0];
						var begin = +new Date();
						var duration = params.slideSpeed;
						var easing = function(time, duration) {
							return -(time /= duration) * (time - 2);
						};
						var timer = setInterval(function() {
							var time = new Date() - begin;
							var _pos, _now;
							if (time > duration) {
								clearInterval(timer);
								_now = to;

								after();
								return;
							}
							else {
								_pos = easing(time, duration);
								_now = _pos * (to - from) + from;
							}
							elem.style.left = _now + 'px';
						}, 10);
					})();
				}
			} else if (animateType === ANIMATE_TYPE.FADE) {
				ul.animate({'opacity': 0 }, 300, function() {
					// アニメーションを利用しない
					if (1 < maxPageNo && params.carousel) {
						pos = page * params.shift + (li.size()/2) - params.shift;
						ul.css('left', '-' + (pos * liwidth) + 'px').animate({'opacity': 1}, 300);
					} else {
						pos = page * params.shift;
						ul.css('left', '-' + ((pos - params.shift) * liwidth) + 'px').animate({'opacity': 1}, 300);
					}
					after();
				});
			}

		};

		// 次へ、前へボタンの表示・非表示を切り替える
		var showArrows = function() {
			// 1ページしかない場合
			if (maxPageNo <= 1) {
				next.hide();
				back.hide();
			// 左端
			} else if (pageNo === 1) {
				next.show();
				back.hide();
			// 右端
			} else if (pageNo === maxPageNo) {
				back.show();
				next.hide();
			} else {
				back.show();
				next.show();
			}
		};

		// カルーセル用に両端に番兵を作成する
		var initCarousel = function() {

			// 最終ページに空きが出来る場合は空のLIダグを追加する
			var addSize = li.size()%params.shift;
			if (addSize !== 0) {
				for (var i=0, len=params.shift-addSize;i<len;i++) {
					ul.append(ul.find(params.childKey).filter(':first').clone().empty().css('width', liwidth).css('height', li.height()));
				}
				// liを再キャッシュ
				li = ul.find(params.childKey);
			}

			ul
				.append(li.clone().addClass('cloned'))
				.css('left', '-' + (liwidth*(li.size())) + 'px');

			// liを再キャッシュ
			li = ul.find(params.childKey);
		};

		// カルーセル
		var doCarousel = function() {
			// 左端
			if (pos === 0) {
				pos = (li.size()/2);
				ul.css('left', '-' + (liwidth*pos) + 'px');
			// 右端
			} else if (pos === (li.size()-params.shift)) {
				pos = (li.size()/2)-params.shift;
				ul.css('left', '-' + (liwidth*pos) + 'px');
			}
		};

		// マウスクリックでのページングを可能にする
		var bindMouseClickEvent = function() {
			// 左方向へスライドする
			back.click(function(e) {
				e.preventDefault();
				backPage();
			});

			// 右方向へスライドする
			next.click(function(e) {
				e.preventDefault();
				nextPage();
			});
		};

		// マウスドラッグでのページングを可能にする
		var bindMouseDragEvent = function() {
			var isTouch = ('ontouchstart' in window);
			ul.bind({
				// タッチの開始、マウスボタンを押したとき
				'touchstart mousedown': function(e) {

					if (nowLoading) {
						event.preventDefault();
						event.stopPropagation();
						return;
					}
					nowLoading = true;

					// 開始位置を覚えておく
					this.pageX= ((isTouch && event.changedTouches) ? event.changedTouches[0].pageX : e.pageX);
					this.pageY= ((isTouch && event.changedTouches) ? event.changedTouches[0].pageY : e.pageY);
					this.left = $(this).position().left;
					this.startLeft = this.left;

					this.touched = true;
				},
				// タッチしながら移動、マウスのドラッグ
				'touchmove mousemove': function(e) {

					if (!this.touched) {
						return;
					}

					var x = (this.pageX - ((isTouch && event.changedTouches) ? event.changedTouches[0].pageX : e.pageX));
					var y = (this.pageY - ((isTouch && event.changedTouches) ? event.changedTouches[0].pageY : e.pageY));

					if (5 < Math.abs(x)) {
						event.preventDefault();
						event.stopPropagation();
					} else if (5 < Math.abs(y)) {
						return;
					}
					// 移動先の位置を取得する
					this.left = this.left - x;

					// 画像を移動させる
					$(this).css({left:this.left});

					// 位置 X,Y 座標を覚えておく
					this.pageX = ((isTouch && event.changedTouches) ? event.changedTouches[0].pageX : e.pageX);

				},
				// タッチの終了、マウスのドラッグの終了
				'touchend mouseup touchcancel': function(e) {
					if (!this.touched) {
						return;
					}
					this.touched = false;

					// スワイプの移動量
					dragw = this.startLeft - this.left;

					// 一定幅以上スワイプしていない場合は、跳ね返り処理を行う。
					if ((Math.abs(dragw) < params.reboundw) || (!params.carousel && ((pageNo <= 1 && dragw < 0) || (maxPageNo <= pageNo && 0 < dragw)))) {
						ul.animate(
							{ left: '-=' + (-1 * dragw)},
							function() {
								nowLoading = false;
							}
						);
						dragw = 0;
					}

					if (dragw < 0) {
						// 前ページ
						slide(pageNo-1, ANIMATE_TYPE.SLIDE);
					} else if (0 < dragw) {
						// 次ページ
						slide(pageNo+1, ANIMATE_TYPE.SLIDE);
					} else {
						// 何もしない
					}
				}
			});
		};

		// 自動スライド
		var autoSlide = function() {
			var timer = null;
			this.start = function() {
				startTimer();
			};
			this.restart = function() {
				stopTimer();
				startTimer();
			};
			var startTimer = this.startTimer = function() {
				timer = setTimeout(function() {
					clearInterval(timer);
					slide(pageNo+1, ANIMATE_TYPE.SLIDE);
					startTimer();
				} , params.autoSlideInterval);
			};
			var stopTimer = this.stopTimer = function() {
				clearInterval(timer);
				timer = null;
			};
		};

		// コールバック
		var slideCallBack = function() {
			if (params.slideCallBack) {
				var data = {};
				data.pageNo = pageNo;
				data.maxPageNo = maxPageNo;
				if (params.carousel) {
					data.obj = $(li[pos]);
				} else {
					data.obj = $(li[(pos-params.shift)]);
				}
				params.slideCallBack(data);
			}
		};

		/* Public  */

		// 前ページを表示します。
		var backPage = this.backPage = function() {
			if (nowLoading) {
				return;
			}
			// 自動スライドのタイマーをリセットする。
			if (autoSlider) {
				autoSlider.restart();
			}
			slide(pageNo-1, ANIMATE_TYPE.SLIDE);
		}

		// 次ページを表示します。
		var nextPage = this.nextPage = function() {
			if (nowLoading) {
				return;
			}
			// 自動スライドのタイマーをリセットする。
			if (autoSlider) {
				autoSlider.restart();
			}
			slide(pageNo+1, ANIMATE_TYPE.SLIDE);
		}

		// 指定したページを表示します。
		this.changePage = function(page, animateType) {
			var page = parseInt(page) || 1;
			// 自動スライドのタイマーをリセットする。
			if (autoSlider) {
				autoSlider.restart();
			}
			slide(page, animateType);
		}

		// 処理開始
		$(params.separator).each(function() {
			init(this);
		});

		return this;
	};

})(jQuery);

/*
 * slideMenu
 *
 * Copyright (c) 2012 iseyoshitaka at teamLab
 *
 * Description:
 * スライドメニューを表示します。
 *
 * Sample:
 * 	$.slideMenu({target: '.showCommonMenuPanel', dispTarget: '.commonMenuPanel', width: '95%'});
 *
 */
(function($){

	$.slideMenu = function(options) {

		var slideDiv = null,
			menu = null,
			nowLoading = false;

		var settings = $.extend({
				speed: 100,
				easing: 'easeInOutCirc',
				direction: 'left',
				target: null,
				dispTarget: null,
				width: '80%'
			}, options);

		// 初期化
		_init();

		function _init() {

			var page = $.mobile.activePage || $('body');

			if($('body').find('#pageslide').length === 0 ) {
				slideDiv = $('<div />').attr('id', 'pageslide')
										  .css('display', 'none')
										  .css('width', settings.width)
										  .css('top', 0)
										  .css('z-index', 9999)
										  .css('position', 'absolute')
										  .css('background-color', '#ffffff')
										  .appendTo('body');
				menu = $('body').find(settings.dispTarget).css('height', '100%').show();
				slideDiv.empty().append(menu);
			}

			page.bind('vclick', function(e) {
				if ( slideDiv.is(':visible')) {
					e.preventDefault();
					e.stopPropagation();
					close();
				}
			});

			// 画面が回転された場合
			$(window).bind('orientationchange',function(){
				var slideWidth = slideDiv.outerWidth(true);

				if (!slideDiv.is(':visible')) {
					return;
				}

				var page = $.mobile.activePage || $('body');
				page.css('margin-left', '-' + slideWidth + 'px');
			});

		}

		// アイコンクリック時
		$(document).delegate(settings.target, 'vclick', function(e) {
			e.preventDefault();
			e.stopPropagation();

			if ( slideDiv.is(':visible')) {
				close();
			} else {
				open();
			}
		});

		// スライドを開く
		var open = function() {
			var bodyAnimateIn = {},
				slideAnimateIn = {},
				slideWidth = slideDiv.outerWidth(true);


			if( slideDiv.is(':visible') || nowLoading ) {
				return;
			}
			nowLoading = true;

			// アドレスバーを初期非表示にする
			window.scrollTo(0,0);

			switch( settings.direction ) {
				case 'left':
					slideDiv
					  .css('height', $(document).height())
					  .css({ left: 'auto', right: '-' + slideWidth + 'px' });
					bodyAnimateIn['margin-left'] = '-=' + slideWidth;
					slideAnimateIn['right'] = '+=' + slideWidth;
					break;
				default:
					slideDiv.css({ left: '-' + slideWidth + 'px', right: 'auto' });
					bodyAnimateIn['margin-left'] = '+=' + slideWidth;
					slideAnimateIn['left'] = '+=' + slideWidth;
					break;
			}

			var page = $.mobile.activePage || $('body');

			page
				.css('position', 'static')
				.animate(bodyAnimateIn, settings.speed, settings.easing, function() {
					page.css('position', 'fixed');
				});
			slideDiv.css('height', menu.height());
			slideDiv.show()
				.animate(slideAnimateIn, settings.speed, settings.easing, function() {
					nowLoading = false;
				});
		};

		// スライドを閉じる
		var close = function() {
			var bodyAnimateIn = {},
				slideAnimateIn = {},
				slideWidth = slideDiv.outerWidth(true);

			if( slideDiv.is(':hidden') || nowLoading ) {
				return;
			}
			nowLoading = true;

			switch(settings.direction) {
				case 'left':
					bodyAnimateIn['margin-left'] = '+=' + slideWidth;
					slideAnimateIn['right'] = '-=' + slideWidth;
					break;
				default:
					bodyAnimateIn['margin-left'] = '-=' + slideWidth;
					slideAnimateIn['left'] = '-=' + slideWidth;
					break;
			}

			var page = $.mobile.activePage || $('body');
			
			slideDiv.animate(slideAnimateIn, settings.speed, settings.easing);
			page
				.css('position', 'static')
				.animate(bodyAnimateIn, settings.speed, settings.easing, function() {
					slideDiv.hide();
					nowLoading = false;
				});

		}

	};

})(jQuery);

(function($){
	/*
	 * validate
	 *
	 * Copyright (c) 2012 iseyoshitaka at teamLab
	 *
	 * Description:
	 * 入力をチェックする
	 * 
	 * var validate = [
	 *     {type: 'date', value: [$('.SSR002_15_applyStartDate').val()], args: ['適用期間(開始)']},
	 *     {type: 'date', value: [$('.SSR002_15_applyEndDate').val()], args: ['適用期間(終了)']}
	 * ];
	 * var errors = $.validate(validate);
	 * if (0 < errors.length) {
	 *     alert(errors.join('\n'));
	 *     return false;
	 * }
	 *
	 */
	$.validate = function(targets) {
		var messages = [];
		for (var i=0, len=targets.length; i<len; i++) {
			var target = targets[i];

			// 日付チェック
			if (target.type === 'date' && 0 < target.value.length && target.value[0] && target.value[0] !== '' && !checkDate(target.value[0])) {
				messages.push({text: '{0}は日付でなければいけません。', args: target.args});
			}

			// 未来日チェック
			if (target.type === 'dateGeNow' && 0 < target.value.length && target.value[0] !== '' && checkDate(target.value[0])) {
				var now = new Date();
				var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
				if (new Date(target.value[0]).getTime() < today.getTime()) {
					messages.push({text: '{0}は現在日付の以降の日付を入力してください。', args: target.args});
				}
			}

			// 日付範囲チェック
			if (target.type === 'dateRange' && 1 < target.value.length && checkDate(target.value[0]) && checkDate(target.value[1])) {
				if (new Date(target.value[1]).getTime() < new Date(target.value[0]).getTime()) {
					messages.push({text: '{0}は日付の範囲が正しくありません。', args: target.args});
				}
			}

			// 数値範囲チェック
			if (target.type === 'numRange' && 1 < target.value.length && !isNaN(target.value[0]) && !isNaN(target.value[1])) {
				if (Number(target.value[1]) < Number(target.value[0])) {
					messages.push({text: '{0}は数字の範囲が正しくありません。', args: target.args});
				}
			}
			
		}
		return formatMessage(messages);
	};
	
	function checkDate(target) {

		if (!target) {
			return false;
		}

		var ret = false;
	
		// 入力日付のフォーマットチェック yyyy/mm/dd
		var result = target.match(/^([0-9]{4})\/([0-9]{1,2})\/([0-9]{1,2})$/);
	
		if(result){
				// 日付としての妥当性チェック
				var yy = parseInt(result[1],10);
				var mm = parseInt(result[2],10);
				var dd = parseInt(result[3],10);
				
				// 月はゼロ基数なので、1引く
				// ここでは、2009-15-24 など、あり得ない数値を入れても、
				// Date的にはエラーにならず、繰り上がった数値として処理される。
				// そこで、入力値が正しいかどうかを、入力値とDateの結果とを比較し、
				// 繰り上がった＝Invalid な値として処理する。
				var d = new Date(yy,(mm - 1),dd);
				
				if((d.getFullYear() == yy) &&
						(d.getMonth() == (mm - 1)) &&
						(d.getDate() == dd)){
					// 正常な入力
					ret = true;
				}else{
					// 範囲外
				}
		}else{
			// マッチしない
		}
		return ret;
	}
	
	// メッセージを生成する。
	function formatMessage(datas) {
		var messages = [];
		for (var i=0, len=datas.length; i<len; i++) {
			var data = datas[i],
				text = data.text,
				args = data.args;
			var format = function (text, args) {
				for (var i=0, len=args.length; i<len; i++) {
					var reg = new RegExp('\\{' + (i) + '\\}', 'g');
					text = text.replace(reg, args[i]);
				}
				return text;
			};
			messages.push(format(text, args));
		}
		return messages;
	}
	
})(jQuery);


(function($){
	/*
	 * zoomPhotoPanel
	 *
	 * Copyright (c) 2013 iseyoshitaka at teamLab
	 *
	 * Description:
	 * 　マイナビウエディング画像ギャラリーを生成する
	 *
	 * Sample:
	 * $.zoomPhotoPanel($('.gallery'), {}, function() {});
	 */

	$.zoomPhotoPanel = function(obj, options, callback) {

		var params = $.extend({}, $.zoomPhotoPanel.defaults, options);

		var boxList =$([
		    '<div id="mynavigallery" class="window">',
					'<div class="detailTtl">',
						'<div class="photoSlide" >',
							'<div class="photoSlideViewId" style="overflow:hidden;margin 0 auto;">',
								'<div class="parentKey" style="padding-left: 10px; position: relative;">',
								'</div>',
							'</div>',
							'<p class="btnSlideBack"><a href="#"><img src="' + params.imagePath + '/btn_slide_back.png' + '" width="20" alt="back"></a></p>',
							'<p class="btnSlideNext"><a href="#"><img src="' + params.imagePath + '/btn_slide_next.png' + '" width="20" alt="next"></a></p>',
							'<ul class="slideControl">',
							'</ul>',
						'</div>',
					'</div>',
			'</div>'
			].join(''));

		/**
		 * 画像ギャラリーを生成する
		 */
		var init = function() {

			var parent = boxList.find('.parentKey');
			var slideControl = boxList.find('.slideControl');

			/* ギャラリーに設定する画像データ配列を生成する */
			obj.each(function(i) {

				var $this = $(this)
				,	photo = $this.find('img.gallery-photo')
				,	data = {};

				/* ギャラリー画像に設定する値をdataに設定 */
				data.imagePath = photo.attr('src');
				data.caption = photo.attr('alt');

				$([
					'<div class="childKey" style="float: left; margin: 0;">',
						'<p class="photo">',
							'<img src="' + data.imagePath + '" alt="' + data.caption + '" width="289px" class="image" />',
						'</p>',
						'<div style="max-width: 280px;"><p class="caption" style="padding:10px;">'+data.caption+'</p></div>',
					'</div>'
				].join('')).appendTo(parent);

				$('<li class="active pageNo' + (i+1) + '"><span>・</span></li>').appendTo(slideControl);

			});

			// 生成したHTMLをbodyタグにappendする
			$($.mobile.activePage).append(boxList);
		};

		/**
		 * イベントバンドル
		 */
		var bundle = function() {

			var page = $.mobile.activePage || $('body');

			// 画像ギャラリーにスライダーを設定する
			var slider = boxList.mynavislider({
				'parentKey': page.find('.parentKey'),
				'childKey': '.childKey',
				'easing': 'easeInOutCirc',
				'shift' : 1,
				'carousel': params.carousel,
				'backBtnKey': boxList.find('.btnSlideBack'),
				'nextBtnKey': boxList.find('.btnSlideNext'),
				'isMouseDrag': true,
				'slideCallBack': function(data) {
					boxList.find('.slideControl li').removeClass('active');
					boxList.find('.slideControl .pageNo'+data.pageNo).addClass('active');

					// コールバック
					if (_.isFunction(params.opencallback)) params.opencallback(data);

				}
			});

			/* 対象画像クリック時にギャラリーオープンイベントをバインドする */
			obj.each(function(i) {
				var photo = $(this).find('img.gallery-photo')
				,	pos = i+1;
				photo.bind('vclick', function(e) {
					e.preventDefault();
					slider.changePage(pos);
					$.mLightBox({'mLightBoxId': $.mobile.activePage.find('#mynavigallery'), duration: 300});
				});
			});

		};

		(function() {

			// 画像ギャラリーを生成する
			init();

			// イベントバンドル
			bundle();

			// 非表示に設定
			boxList.hide();

			// コールバック
			if (_.isFunction(callback)) callback();

		})();

	};

	$.zoomPhotoPanel.defaults = {
		'carousel':	true,
		'imagePath': '../img',
		'opencallback': undefined
	};

})(jQuery);

