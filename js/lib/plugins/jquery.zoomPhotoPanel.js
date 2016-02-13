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
						, 'moment': true
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

