
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
			opacity: 0.4,
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
			.animate({opacity: options.opacity}, {
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
	 * var slide1 = $('#slide1 .screen').mynavislider({
	 * 	'carousel': false,
	 * 	'backBtnKey': '#slide1 #gallery-back',
	 * 	'nextBtnKey': '#slide1 #gallery-next',
	 * 	'slideCallBack': function(data) {
	 * 		$('#slide1 .pageNo').text(data.pageNo + '/' + data.maxPageNo);
	 * 	}
	 * });
	 * $('#slide1 .changePage').click(function(e) {
	 * 	e.preventDefault();
	 * 	slide1.changePage($(this).data('pageno'), $.fn.mynavislider.ANIMATE_TYPE.SLIDE);
	 * });
	 * 
	 */
	$.fn.mynavislider = function(options) {

		var screen = null // 処理対象エリア
			,	ul = null // 親要素
			,	li = null // 子要素
			,	back = null // 前ページボタン
			,	next = null // 次ページボタン
			,	pos = 0 // 画像のポジション
			,	pageNo = 1 // 現在のページ番号
			,	maxPageNo = 1 // 最大のページ番号
			,	liwidth = 0 // 子要素の横幅
			,	nowLoading = false // 処理中かどうか
			,	dragw = 0 // スワイプした横幅
			,	childKey = null
			,	shift = null
			,	margin = 0
			,	dispCount = 0
			,	shiftw = 0
			,	animateType = null
			,	slideSpeed = null
			,	carousel = null
			,	slideCallBackFunc = null
			,	resizeCallBackFunc = null
			,	isAutoSlide = null
			,	autoSlideInterval = null
			,	hoverPause = null
			,	isMouseDrag = null
			,	reboundw = null
			,	isFullScreen = false
			,	heightMaxScreen = false
			,	isSlideCallBack = null;

		var params = $.extend({}, $.fn.mynavislider.defaults, options);

		// jQueryオブジェクトキャッシュ、初期設定を行う
		var init = function(obj) {
			screen = $(obj);
			ul = screen.find(params.parentKey);
			li = ul.find(params.childKey);
			back = $(params.backBtnKey);
			next = $(params.nextBtnKey);
			dispCount = params.dispCount || params.shift;
			childKey = params.childKey;
			animateType = params.animateType;
			isAutoSlide = params.autoSlide;
			autoSlideInterval = params.autoSlideInterval;
			hoverPause = params.hoverPause;
			isMouseDrag = params.isMouseDrag;
			reboundw = params.reboundw;
			slideSpeed = params.slideSpeed;
			shift = params.shift;
			margin = params.margin;
			carousel = params.carousel;
			isFullScreen = params.isFullScreen;
			heightMaxScreen = params.heightMaxScreen;
			slideCallBackFunc = params.slideCallBack;
			resizeCallBackFunc = params.resizeCallBack;

			if (heightMaxScreen) {
				// 画像縦幅を端末サイズに合わせる為オリジナル画像サイズが必要になる。画像を事前にロードしておく。
				var photos = ul.find(childKey).find('img');
				var photoLength = photos.length;
				photos.each(function() {
					var photo = $(this),
						imagePath = photo.attr('src') || '';
					var img = $('<img>');
					img
						.load(function() {
							photo.attr('owidth', img[0].width);
							photo.attr('oheight', img[0].height);
							if (photoLength !== 1) {
								photoLength--;
								return;
							}
							photos.unbind('load');
							// 画像のロードが完了したらスタート
							exec();
						});
					img.attr('src', imagePath);
				});
			} else {
				exec();
			}
			
		};
		
		var exec = function() {
			if (isFullScreen) {
				fullScreen();
			} else if (params.shiftw) {
				liwidth = Math.ceil(params.shiftw/shift);
				shiftw = params.shiftw;
			} else {
				liwidth = li.width();
				shiftw = liwidth * shift;
			}
			maxPageNo = Math.ceil(li.size()/shift);

			// １ページの場合はスライド不要の為、カルーセルは強制OFFとする。
			if (maxPageNo <= 1) {
				carousel = false;
				isMouseDrag = false;
			}

			bindEvent();
			
			// スライダーを設定したよっていうマークを付ける。
			screen.addClass('slider-set-end');
		};
		
		var bindEvent = function() {

			if (carousel) {
				// カルーセルの初期設定を行う
				initCarousel();
				pos = li.size()/2;
			} else {
				// ページングボタンの表示制御
				showArrows();
				pos = shift;
			}

			// ulタグの横幅を調整する
			ul.css('width', shiftw * li.size() / shift)
				.css('position', 'relative');

			li.css('float', 'left');

			// スワイプでのページングを可能にする
			if (isMouseDrag) {
				bindMouseDragEvent();
			}

			// ページングを可能にする
			bindPagingEvent();

			// 自動のページングを可能にする。
			if (isAutoSlide) {
				autoSlide.init();
			}

		}

		// 指定したページに移動する
		var slide = function(page, animateType) {

			if (!animateType) {
				animateType = ANIMATE_TYPE.NO;
			}

			// 後処理
			var after = function() {
				if (carousel) {
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
			if (!carousel) {
				if ((move < 0 && pageNo === 1) || (0 < move && pageNo === maxPageNo)) {
					after();
					return;
				}
			}

			nowLoading = true;

			var from = 0;
			if (carousel) {
				from = -1 * (pos/shift) * shiftw - dragw;
			} else {
				from = -1 * (pos-shift)/shift * shiftw - dragw;
			}
			var to = from - (shiftw * move) + dragw;

			pos = pos + (shift * move);

			// ページ番号
			if (page < 1) {
				pageNo = maxPageNo;
			} else if (maxPageNo < page) {
				pageNo = 1;
			} else {
				pageNo = page;
			}

			// ページングボタンの表示制御
			if (!carousel) {
				showArrows();
			}

			if (animateType === ANIMATE_TYPE.NO) {
				// アニメーションを利用しない
				if (1 < maxPageNo && carousel) {
					ul.css('left', '-' + (pos * liwidth) + 'px');
				} else {
					ul.css('left', '-' + ((pos - shift) * liwidth) + 'px');
				}
				after();
			} else if (animateType === ANIMATE_TYPE.SLIDE) {
				// jQueryを利用しないアニメーション(Androidでアニメーションが重いため)
				(function() {
					var self = this;

					var elem = ul[0];
					var begin = +new Date();
					var duration = slideSpeed;
					var easing = function(time, duration) {
						return -(time /= duration) * (time - 2);
					};
					var timer = setInterval(function() {
						var time = new Date() - begin;
						var _pos, _now;
						if (time > duration) {
							clearInterval(timer);
							_now = to;
							elem.style.left = _now + 'px';

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
			} else if (animateType === ANIMATE_TYPE.FADE) {
				ul.animate({'opacity': 0 }, 300, function() {
					if (1 < maxPageNo && carousel) {
						ul.css('left', '-' + (pos * liwidth) + 'px').animate({'opacity': 1}, 300);
					} else {
						ul.css('left', '-' + ((pos - shift) * liwidth) + 'px').animate({'opacity': 1}, 300);
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
			var addSize = li.size()%shift;
			if (addSize !== 0) {
				for (var i=0, len=shift-addSize;i<len;i++) {
					ul.append(ul.find(childKey).filter(':first').clone().empty().css('width', liwidth).css('height', li.height()));
				}
				// liを再キャッシュ
				li = ul.find(childKey);
			}

			ul
				.append(li.clone().addClass('cloned'))
				.css('left', '-' + (liwidth*(li.size())) + 'px');

			// liを再キャッシュ
			li = ul.find(childKey);
		};

		// カルーセル
		var doCarousel = function() {
			// 左端
			if (pos === 0) {
				pos = (li.size()/2);
				ul.css('left', '-' + (liwidth*pos) + 'px');
			// 右端
			} else if ((li.size()-shift - (dispCount - shift)) <= pos) {
				var range = pos - (li.size()-shift - (dispCount - shift));
				pos = (li.size()/2)-shift - (dispCount - shift) + range;
				ul.css('left', '-' + (liwidth*pos) + 'px');
			}
		};

		// ページングを可能にする
		var bindPagingEvent = function() {
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

		// スワイプでのページングを可能にする
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

					// 自動スライドのタイマーをリセットする。
					if (autoSlide.on) {
						autoSlide.restart();
					}

					// 開始位置を覚えておく
					this.pageX= ((isTouch && event.changedTouches) ? event.changedTouches[0].pageX : e.pageX);
					this.pageY= ((isTouch && event.changedTouches) ? event.changedTouches[0].pageY : e.pageY);
					this.left = parseInt($(this).css('left'));
					if(isNaN(this.left)) {
						this.left = $(this).position().left;
					}
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

					if (Math.abs(x) < 5 || 200 < Math.abs(y)) {
						// スワイプさせない
						return;
					} else {
						// スワイプさせる
						event.preventDefault();
						event.stopPropagation();
					}
					
					if (!carousel) {
						// １ページ目は右にスワイプさせない。
						if (0 < (this.left - x)) {
							return;
						}
						// 最後のページは左にスワイプさせない
						if ((this.left - x) <= -1 * ((maxPageNo-1) * shiftw)) {
							return;
						}
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

					// スワイプした場合は、その他のイベントを停止する。
					if (dragw !== 0) {
						event.stopImmediatePropagation();
					}

					// リバウンド処理
					var rebound = function(self) {
						var from = self.startLeft - dragw;
						var to = self.startLeft;
						
						var elem = ul[0];
						var begin = +new Date();
						var duration = slideSpeed;
						var easing = function(time, duration) {
							return -(time /= duration) * (time - 2);
						};
						var timer = setInterval(function() {
							var time = new Date() - begin;
							var _pos, _now;
							if (time > duration) {
								clearInterval(timer);
								_now = to;
								elem.style.left = _now + 'px';

								nowLoading = false;
								dragw = 0;
							}
							else {
								_pos = easing(time, duration);
								_now = _pos * (to - from) + from;
							}
							elem.style.left = _now + 'px';
						}, 10);

					}

					if (dragw < 0) {
						// 一定幅以上スワイプしていない場合は、跳ね返り処理を行う。
						if ((Math.abs(dragw) < reboundw) || (!carousel && ((pageNo <= 1 && dragw < 0) || (maxPageNo <= pageNo && 0 < dragw)))) {
							rebound(this);
						} else {
							var p = pageNo - Math.ceil(Math.abs(dragw)/shiftw);
							if (!carousel && p <= 1) {
								p = 1;
							}
							// 前ページ
							slide(p, ANIMATE_TYPE.SLIDE);
						}
					} else if (0 < dragw) {
						// 一定幅以上スワイプしていない場合は、跳ね返り処理を行う。
						if ((Math.abs(dragw) < reboundw) || (!carousel && ((pageNo <= 1 && dragw < 0) || (maxPageNo <= pageNo && 0 < dragw)))) {
							rebound(this);
						} else {
							var p = pageNo + Math.ceil(Math.abs(dragw)/shiftw);
							if (!carousel && maxPageNo <= p) {
								p = maxPageNo;
							}
							// 次ページ
							slide(p, ANIMATE_TYPE.SLIDE);
						}
					} else {
						// 何もしない
						nowLoading = false;
					}
				}
			});
		};

		// 自動スライド
		var autoSlide = this.autoSlide = new (function() {
			var timer = null;
			this.on = false;
			this.init = function() {
				start();
				if (hoverPause) {
					$(ul).hover(function() {
						stopTimer();
					}, function() {
						startTimer();
					});
				}
			};
			this.restart = function() {
				stopTimer();
				startTimer();
			};
			var start = this.start = function() {
				autoSlide.on = true;
				startTimer();
			};
			function startTimer() {
				if (!autoSlide.on) {
					return;
				}
				timer = setTimeout(function() {
					clearInterval(timer);
					slide(pageNo+1, animateType);
					startTimer();
				} , autoSlideInterval);
			}
			var stop = this.stop = function() {
				stopTimer();
				autoSlide.on = false;
			};
			function stopTimer() {
				if (!autoSlide.on) {
					return;
				}
				clearInterval(timer);
				timer = null;
			}
		})();

		// 子要素をフルスクリーンで表示します。
		var fullScreen = function() {
			// スライダーで設定した変更を元に戻します。
			var unbindSlider = function() {
				// オートスライドのマイマーをリセット
				if (autoSlide) {
					autoSlide.stop();
				}
				// クリック時のバインドをリセット
				back.unbind();
				next.unbind();
				// スワイプのイベントをリセット
				ul.unbind();
				// ローテート用の番兵を削除
				ul.find(childKey + '.cloned').remove();
				// liを再キャッシュ
				li = ul.find(childKey);
			};
			// スライダーを生成し直します。
			var createSlider = function() {
				
				// 子要素の横幅を端末のwidthに設定
				ul.find(childKey).width(Math.ceil($(window).width() /dispCount) - Math.ceil(margin/dispCount));
				
				if (heightMaxScreen) {
					ul.find(childKey).height($(window).height());
					ul.find(childKey).each(function() {
						var li = $(this),
							img = li.find('img');

						var x = Math.floor(img.attr('oheight') * $(window).width() / img.attr('owidth'));
						var margin = Math.floor(($(window).height() - x) / 2);
						if (0 <= margin) {
							img.height('').width('100%');
						} else {
							img.height('100%').width('');
						}
						
					});
				}
				
				liwidth = ul.find(childKey).width();
				shiftw = (liwidth + margin) * shift;

			};
			var resizeCallBack = function() {
				if (resizeCallBackFunc) {
					var data = {};
					data.pageNo = pageNo;
					data.maxPageNo = maxPageNo;
					if (carousel) {
						data.obj = $(li[pos]);
					} else {
						data.obj = $(li[(pos-shift)]);
					}
					resizeCallBackFunc(data);
				}
			};
			// 画面が回転された場合
			$(this).on('orientationchange',function(){
				unbindSlider();
				createSlider();
				bindEvent();

				// リサイズ時は、コールバックは呼ばない。
				var workPageNo = pageNo;
				var workSlideCallBackFunc = slideCallBackFunc;
				slideCallBackFunc = null;
				pageNo = 1;
				changePage(workPageNo);
				slideCallBackFunc = workSlideCallBackFunc;

				resizeCallBack();
			});
			// 画面がリサイズされた場合
			$(this).resize(function() {
				unbindSlider();
				createSlider();
				bindEvent();

				// リサイズ時は、コールバックは呼ばない。
				var workPageNo = pageNo;
				var workSlideCallBackFunc = slideCallBackFunc;
				slideCallBackFunc = null;
				pageNo = 1;
				changePage(workPageNo);
				slideCallBackFunc = workSlideCallBackFunc;

				resizeCallBack();
			});
			createSlider();
		};

		// コールバック
		var slideCallBack = function() {
			if (slideCallBackFunc) {
				var data = {};
				data.pageNo = pageNo;
				data.maxPageNo = maxPageNo;
				if (carousel) {
					data.obj = $(li[pos]);
				} else {
					data.obj = $(li[(pos-shift)]);
				}
				slideCallBackFunc(data);
			}
		};

		/* Public  */

		// 前ページを表示します。
		var backPage = this.backPage = function() {
			if (nowLoading) {
				return;
			}
			// 自動スライドのタイマーをリセットする。
			if (autoSlide.on) {
				autoSlide.restart();
			}
			slide(pageNo-1, animateType);
		}

		// 次ページを表示します。
		var nextPage = this.nextPage = function() {
			if (nowLoading) {
				return;
			}
			// 自動スライドのタイマーをリセットする。
			if (autoSlide.on) {
				autoSlide.restart();
			}
			slide(pageNo+1, animateType);
		}

		// 指定したページを表示します。
		var changePage = this.changePage = function(page, animateType) {
			var page = parseInt(page) || 1;
			if (maxPageNo < page) {
				return;
			}
			// 自動スライドのタイマーをリセットする。
			if (autoSlide.on) {
				autoSlide.restart();
			}
			slide(page, animateType);
		}

		// スライドコールバックで次ページ要素をAjax取得してLIに追加した場合などに、最大ページなどの情報をリフレッシュする。
		var refresh = this.refresh = function () {
			li = ul.find(params.childKey);
			maxPageNo = Math.ceil(li.size()/shift);
			showArrows();
		};

		// 処理開始
		$(this).each(function() {
			init(this);
		});

		return this;
	};

	// アニメーションの種類
	var ANIMATE_TYPE = $.fn.mynavislider.ANIMATE_TYPE = {
		NO: 0,
		SLIDE: 1,
		FADE: 2
	};

	// デフォルト値
	$.fn.mynavislider.defaults = {
			'parentKey': 'ul' // 親要素
		,	'childKey': 'li' // 子要素
		,	'shift': 5 // １ページでスライドさせる画像数
		,	'margin': 0 // 子要素間のマージン
		,	'dispCount': null // １ページに表示する子要素の件数(shiftで指定した値と１ページに表示する子要素の数が異なる場合にのみ指定する)
		,	'shiftw': null // １ページでにスライドさせる幅(子要素にmarginなどの余白が指定されている場合に、自動で幅が算出できないためこれを指定する。)
		,	'animateType': ANIMATE_TYPE.SLIDE // アニメーションの種類
		,	'slideSpeed': 300 // スライド速度
		,	'carousel': false // ローテートさせるかどうか
		,	'backBtnKey': '#gallery-back' // 次ページボタン
		,	'nextBtnKey': '#gallery-next' // 前ページボタン
		,	'autoSlide': false // 自動スライドさせるどうか
		,	'autoSlideInterval':  5000 // 自動スライドさせる間隔(ミリ秒)
		,	'hoverPause':  false // 子要素にマウスオーバーすると自動スライドを一時停止する。
		,	'isMouseDrag': false // スワイプでのページングを可能にするかどうか
		,	'reboundw': 50 // スワイプ時に跳ね返りを行う幅
		,	'isFullScreen': false // 端末の画面横幅いっぱいに画像を表示する
		,	'heightMaxScreen': false // 画像縦幅が端末縦幅よりも大きい場合は端末縦幅いっぱいに表示する（isFullScreen がtrueの場合のみ有効）
		,	'slideCallBack': null // スライド後に処理を行うコールバック(本プラグインで想定していない処理はここでカスタマイズする)
		,	'resizeCallBack': null // 画面リサイズ後に処理を行うコールバック
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
	 * Copyright (c) 2014 iseyoshitaka at teamLab
	 *
	 * Description:
	 * マイナビウエディング拡大写真パネルを生成する
	 *
	 * Sample:
	 * $('.js-zoomPhotoPanel').zoomPhotoPanel({}, function() {});
	 */

	$.fn.zoomPhotoPanel = function(options) {

		var params = $.extend({}, $.fn.zoomPhotoPanel.defaults, options);

		var panel = null,
			screen = null,
			targetClass = null,
			animateType = null,
			originalSize = null,
			imageUrl = null,
			slideSpeed = null,
			easing = null,
			carousel = null,
			autoSlide = null,
			autoSlideInterval = null,
			hoverPause = null,
			slideCallBack = null,
			openCallBack = null,
			closeCallBack = null,
			isFullScreen = null,
			showClip = false;

		var className = "zoomPhotoPanel";
		
		// 初期設定
		var init = function(obj) {

			var panel = null,
				screen = $(obj),
				targetClass = params.targetClass,
				animateType = params.animateType,
				originalSize = params.originalSize,
				imageUrl = params.imageUrl,
				slideSpeed = params.slideSpeed,
				easing = params.easing,
				carousel = params.carousel,
				autoSlide = params.autoSlide;
				autoSlideInterval = params.autoSlideInterval,
				hoverPause = params.hoverPause,
				slideCallBack = params.slideCallBack,
				openCallBack = params.openCallBack,
				closeCallBack = params.closeCallBack,
				isFullScreen = params.isFullScreen,
				showClip = params.showClip,
				galabel = params.galabel;

			var mynavigallery = $('.' + className);
			
			var index = 1;
			if (mynavigallery) {
				index = mynavigallery.length + 1;
			}

			var slider = null;
				
			var make = function (index) {

				var photos = [];

				/* ギャラリーに設定する画像データ配列を生成する */
				screen.find(targetClass).each(function(i) {

					var target = $(this),
						image = target.find('img'),
						imageId = target.data('imageid') || '',
						imagePath = image.attr('osrc') || image.attr('src') || '',
						caption = image.attr('alt') || '';

					var data = {
						imageId : imageId,
						imagePath : imagePath,
						caption : caption
					};

					// テンプレートに渡すため配列に格納
					photos.push(data);

				});

				var maxPageNo = photos.length;

				/* デザインテンプレート */
				var template = '';
				if (isFullScreen) {
					template = [
									'<div class="photo_enlargeArea portfolio display-none" style="position:absolute;background-color:transparent;">',
										'<div class="js-photoSlider">',
											'<div class="parentKey photo_enlarge_imageArea">',
											'<% _.each(photos, function(data, i) { %> ',
												'<div class="childKey" style="text-align: center;">',
														'<img src="<%=data.imagePath%>" itemprop="image" alt="<%=data.caption%>" data-imageid="<%=data.imageId%>" width="100%">',
												'</div>',
											'<% }); %>',
											'</div>',
										'</div>',
										'<div class="photo_enlarge_partsArea transitionArea" style="">',
											'<ul class="transitionList clearfix" style="position: fixed;">',
												'<li class="item prev js-backBtn"><a href="#" class="trigger"></a></li>',
												'<li class="item next js-nextBtn"><a href="#" class="trigger"></a></li>',
											'</ul>',
											'<div class="closeArea">',
												'<p class="closeBtn" style="position: fixed;"><a href="#" class="layerclose"><img src="' + imageUrl + '/btn_delete.png" alt="削除" width="20" height="20"></a></p>',
											'</div>',
											'<div class="commentArea" style="position: fixed;">',
												'<p class="comment"><span></span><a href="#" class="btnClip display-none">この画像を<br>クリップする</a></p>',
												'<p class="count"></p>',
											'</div>',
										'</div>',
									'</div>'].join('');
				} else {
					template = [
									'<div class="window display-none">',
										'<p class="layerclose" style="position:absolute;top:-5px;right:-2px;z-index:9999;"><a href="#"><img src="' + imageUrl + '/btn_delete.png" alt="閉じる" width="20" height="20"></a></p>',
										'<div class="detailTtl">',
											'<div class="photoSlide js-photoSlider" >',
												'<div class="photoSlideViewId" style="overflow:hidden;margin 0 auto;">',
													'<div class="parentKey use-gpu" style="padding-left: 10px; position: relative;">',
														'<% _.each(photos, function(data, i) { %> ',
															'<div class="childKey imagePath<%=(i+1)%>" style="float: left; margin: 0;">',
																'<p class="photo">',
																	'<img src="<%=data.imagePath%>" alt="<%=data.caption%>" width="289px" class="image imagePath" />',
																'</p>',
															'</div>',
														'<% }); %>',
													'</div>',
												'</div>',
												'<p class="btnSlideBack js-backBtn"><a href="#"><img src="' + imageUrl + '/btn_slide_back.png' + '" width="20" alt="back"></a></p>',
												'<p class="btnSlideNext js-nextBtn"><a href="#"><img src="' + imageUrl + '/btn_slide_next.png' + '" width="20" alt="next"></a></p>',
												'<ul class="slideControl">',
													'<% _.each(photos, function(data, i) { %> ',
														'<li class="active pageNo<%=(i+1)%>"><span>・</span></li>',
													'<% }); %>',
												'</ul>',
											'</div>',
										'</div>',
									'</div>'].join('');
				}


				// 拡大写真パネルを生成する
				panel = $(_.template(template, {maxPageNo: maxPageNo, photos: photos}));

				panel.attr('id', 'zoomPhotoPanel'+ index); 
				panel.addClass(className);
				
				$('body').append(panel);
			}

			// イベントバンドル
			var bundle = function(index) {

				var sliderAnimateType = '';
				if (animateType === ANIMATE_TYPE.NO) {
					sliderAnimateType = $.fn.mynavislider.ANIMATE_TYPE.NO;
				} else if (animateType === ANIMATE_TYPE.FADE) {
					sliderAnimateType = $.fn.mynavislider.ANIMATE_TYPE.FADE;
				} else if (animateType === ANIMATE_TYPE.SLIDE) {
					sliderAnimateType = $.fn.mynavislider.ANIMATE_TYPE.SLIDE;
				} else if (animateType === ANIMATE_TYPE.ORIGINAL) {
					sliderAnimateType = $.fn.mynavislider.ANIMATE_TYPE.FADE;
				}

				if (isFullScreen) {

					if (showClip) {
						panel.find('.btnClip').bind('click', function(event) {
							event.preventDefault();
							event.stopPropagation();
							// クリップ画像
							$.mynaviClipImage($(this).data('imageid'), galabel);
						}).show();
					}

					// 画像スライダーを設定する
					slider = panel.find('.js-photoSlider').mynavislider({
						'parentKey': '.parentKey'
						, 'childKey': '.childKey'
						, 'shift': 1
						,'isMouseDrag': true
						,'isFullScreen': true
						, 'backBtnKey': panel.find('.js-backBtn')
						, 'nextBtnKey': panel.find('.js-nextBtn')
						, 'animateType': sliderAnimateType
						, 'slideSpeed': slideSpeed
						, 'easing': easing
						, 'carousel': carousel
						, 'autoSlide': autoSlide
						, 'autoSlideInterval': autoSlideInterval
						, 'hoverPause': hoverPause
						, 'slideCallBack': function(data) {
							
							var targetImage = data.obj.find('img');

							panel.find('.commentArea .comment>span').text(targetImage.attr('alt') || '');
							panel.find('.commentArea .count').text(data.pageNo + '枚目／' + data.maxPageNo + '枚中');
							panel.find('.btnClip')
								.data('imageid', targetImage.data('imageid'));
							
							if (slideCallBack) {
								slideCallBack(data);
							}
						}, 'resizeCallBack': imagePosition
					});

					function imagePosition() {
						var photos = slider.find('.childKey img');

						var replacePhotoArea = function(img, photo) {

							var x = Math.floor(img[0].height * $(window).width() / img[0].width);
							var margin = Math.floor(($(window).height() - x) / 2);
							if (0 < margin) {
								photo.closest('.childKey').css('margin-top', margin + 'px');
							} else {
								photo.closest('.childKey').css('margin-top', '0px');
							}

						}
				
						photos.each(function() {
							var photo = $(this);
							
							var loadImage = new (function() {
								// オリジナル画像に変換する。
								var imagePath = photo.attr('src');
								if (0 <= imagePath.indexOf('_')) {
									imagePath = imagePath.split("_")[0] + '.jpg';
								}
								photo.attr('src', imagePath);
								
								var img = $('<img>');
								img
									.load(function() {
										replacePhotoArea(img, photo);
									});
								this.exec = function() {
									img.attr('src', imagePath);
								}
							})();
							
							loadImage.exec();
								
						});
						
					}
					imagePosition();
					
				} else {
					// 画像スライダーを設定する
					slider = panel.find('.js-photoSlider').mynavislider({
						'parentKey': '.parentKey'
						, 'childKey': '.childKey'
						, 'shift': 1
						, 'shiftw': 290
						, 'backBtnKey': panel.find('.js-backBtn')
						, 'nextBtnKey': panel.find('.js-nextBtn')
						, 'animateType': sliderAnimateType
						, 'slideSpeed': slideSpeed
						, 'easing': easing
						, 'carousel': carousel
						, 'autoSlide': autoSlide
						, 'autoSlideInterval': autoSlideInterval
						, 'hoverPause': hoverPause
						, 'slideCallBack': function(data) {

							slider.find('.slideControl li').removeClass('active');
							slider.find('.slideControl .pageNo'+data.pageNo).addClass('active');

							var photo = data.obj.find('img.imagePath');

							var replacePhotoArea = function() {

								if (animateType === ANIMATE_TYPE.ORIGINAL) {
									// 表示する画像の幅を算出する。
									var height = Math.ceil(280 * img.height / img.width);
									photo.css('max-height', height);
									panel.find('.photoSlideViewId').css('height', height + 20);
									
									$.mLightBox.changeLayer();
								}

								if (slideCallBack) {
									slideCallBack(data);
								}
							};

							var img = new Image();
							img.src = photo.attr('src');
							if (0 < img.width) {
								replacePhotoArea();
							} else {
								img.load = function() {
									replacePhotoArea();
								};
							}

							}
					});
				}


				// 対象画像クリック時に拡大写真パネルを表示する
				screen.find(targetClass).each(function(i) {
					var target = $(this),
						pageNo = i+1;

					target.unbind('click');
					target.bind('click', function(e) {
						e.preventDefault();
						showPage(pageNo);
					});
				});

				panel.find('.layerclose').click(function(e) {
					e.preventDefault();
					$.mLightBox.close();
					if (closeCallBack) {
						closeCallBack();
					}
				});
			};

			// 指定したページを表示します。
			var showPage = obj.showPage = function(pageNo) {
				var pageNo = pageNo || 1;
				slider.changePage(pageNo);
				$.mLightBox({'mLightBoxId': '#zoomPhotoPanel' + index, duration: 300,
					opacity: 1,
					callback: function() {
						var page = $('.page');

						// フッタを一旦消す
						page.find('.footerNavBar').hide();
						
						if (openCallBack) {
							openCallBack();
						}
					},
					closecallback: function() {
						if (closeCallBack) {
							closeCallBack();
						}
					}
				});
			};

			make(index);
			
			bundle(index);

		};

		// 処理開始
		$(this).each(function() {
			init(this);
		});

		return this;
	};

	// アニメーションの種類
	var ANIMATE_TYPE = $.fn.zoomPhotoPanel.ANIMATE_TYPE = {
		NO: 0,
		SLIDE: 1,
		FADE: 2,
		ORIGINAL: 3
	};

	// デフォルト値
	$.fn.zoomPhotoPanel.defaults = {
		'targetClass': '.js-zoomPhoto' // 拡大する画像要素
		, 'animateType': ANIMATE_TYPE.SLIDE // アニメーションの種類
		, 'imageUrl': '/sp/img' // 画像パス
		, 'slideSpeed': 300 // スライド速度
		, 'easing': 'easeInOutCirc' // スライドアニメーションの種類
		, 'carousel': false // ローテートさせるかどうか
		, 'autoSlide': false // 自動スライドさせるどうか
		, 'autoSlideInterval':  5000 // 自動スライドさせる間隔(ミリ秒)
		, 'hoverPause':  false // 子要素にマウスオーバーすると自動スライドを一時停止する。
		, 'slideCallBack': null // スライド後に処理を行うコールバック(本プラグインで想定していない処理はここでカスタマイズする)
		, 'openCallBack': null // 拡大表示後のコールバック
		, 'closeCallBack': null // 拡大パネルを閉じた時のコールバック
		, 'isFullScreen': false // フルスクリーンで表示する
		, 'showClip': false // 画像クリップ機能を表示する
		, 'galabel': '' // 画像クリップ時のGAイベントラベル値
	};

})(jQuery);

