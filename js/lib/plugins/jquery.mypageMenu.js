
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

