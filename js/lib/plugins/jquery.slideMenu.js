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

