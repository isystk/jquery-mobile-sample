
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

