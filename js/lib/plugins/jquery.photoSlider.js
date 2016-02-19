
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
			,	moment = false
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
			moment = params.moment;
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
			if (pos <= 0) {
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

			var momentObject = (moment) ? new MomentObject(ul[0]) : null;
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
					this.top = parseInt($(this).css('top'));
					if(isNaN(this.top)) {
						this.top = $(this).position().top;
					}
					this.startLeft = this.left;
					
					this.touched = true;

					// 慣性を利用してスワイプする。
					if (moment) {
						momentObject._position = momentObject.positionize();
						momentObject.dragStart(event);
					}

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

					// 慣性を利用する場合は、移動速度を計算する
					if (moment) {
						momentObject.dragMove(event);
					}

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

					var self = this;
					
					// 残りの移動処理
					var restMove = function (movew) {

						// スワイプ中（touchmove mousemove）で移動したページ量
						var movePage = Math.floor(Math.abs(movew)/shiftw);
						if (movePage != 0) {
							if (movew < 0) {
								movePage = movePage * -1;
							}
							// ページ番号
							pageNo = pageNo + movePage;
							if (pageNo < 1) {
								pageNo = pageNo + maxPageNo;
							} else if (maxPageNo < pageNo) {
								pageNo = pageNo - maxPageNo;
							}
							pos = pos + (shift * movePage);
							if (carousel) {
								// 左端
								if (pos <= 0) {
									pos = (li.size()/2);
									ul.css('left', '-' + (liwidth*pos) + 'px');
									pageNo = 1;
									slide(pageNo, ANIMATE_TYPE.NO);
									return;
								// 右端
								} else if ((li.size()-shift - (dispCount - shift)) <= pos) {
									var range = pos - (li.size()-shift - (dispCount - shift));
									pos = (li.size()/2)-shift - (dispCount - shift) + range;
									ul.css('left', '-' + (liwidth*pos) + 'px');
									pageNo = maxPageNo;
									slide(pageNo, ANIMATE_TYPE.NO);
									return;
								}
							}
						}

						var restw = Math.abs(movew) % shiftw;
						if (movew < 0) {
							// 一定幅以上スワイプしていない場合は、跳ね返り処理を行う。
							if ((restw < reboundw) || (!carousel && ((pageNo <= 1 && movew < 0) || (maxPageNo <= pageNo && 0 < dragw)))) {
								var from = self.startLeft - movew;
								var to = self.startLeft - (shiftw * movePage);
								rebound(from, to);
							} else {
								var p = pageNo - 1;
								if (!carousel && p <= 1) {
									p = 1;
								}
								// 前ページ
								dragw = movew - (shiftw * movePage);
								slide(p, ANIMATE_TYPE.SLIDE);
							}
						} else if (0 < movew) {
							// 一定幅以上スワイプしていない場合は、跳ね返り処理を行う。
							if ((restw < reboundw) || (!carousel && ((pageNo <= 1 && movew < 0) || (maxPageNo <= pageNo && 0 < dragw)))) {
								var from = self.startLeft - movew;
								var to = self.startLeft - (shiftw * movePage);
								rebound(from, to);
							} else {
								var p = pageNo + 1;
								if (!carousel && maxPageNo <= p) {
									p = maxPageNo;
								}
								// 次ページ
								dragw = movew - (shiftw * movePage);
								slide(p, ANIMATE_TYPE.SLIDE);
							}
						} else {
							// 何もしない
							nowLoading = false;
						}
					}

					// リバウンド処理
					var rebound = function(from, to) {
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

								slide(pageNo, ANIMATE_TYPE.NO);
							}
							else {
								_pos = easing(time, duration);
								_now = _pos * (to - from) + from;
							}
							elem.style.left = _now + 'px';
						}, 10);
					}

					if (moment) {
						momentObject.dragEnd(event);
						momentObject.onstop = function (obj) {
					    	// 慣性で動いた分を加算する
							var movew = self.startLeft - self.left + obj.momentw;
							restMove(movew);
					    }
					} else {
						var movew = self.startLeft - self.left;
						restMove(movew);
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
		

		// 慣性を利用してスライドする
		var MomentObject = function (element) {
			this.element = element;
			this._position = this.positionize();
			this.reset();
		}
		MomentObject.prototype = {
			constructor: MomentObject,
			damping : 15,
			_isDragging: false,
			__position : Vector2.zero,
			_velocity : Vector2.zero,
			_prevTime : 0,
			_prevPosition: Vector2.zero,
			_prevVelocity: Vector2.zero,
			_loopTimer: null,

			positionize: function () {
				var rect = this.element.getBoundingClientRect();
				var x = rect.left;
				var y = rect.top;
				return new Vector2(x, y);
			},

			positionizeByEvent: function (e) {
				var isTouch = ('ontouchstart' in window);
				var x = (isTouch && event.changedTouches) ? event.changedTouches[0].pageX : e.pageX;
				var y = (isTouch && event.changedTouches) ? event.changedTouches[0].pageY : e.pageY;
				return new Vector2(x, y);
			},
			dragStart: function (evt) {
				this.reset();
				this._prevTime	 = Date.now();
				this._prevPosition = this.positionizeByEvent(evt);
				this._isDragging   = true;
			},
			dragMove: function (evt) {
				if (!this._isDragging) {
					return;
				}

				var now = Date.now();
				var deltaTime = now - this._prevTime;
				var eventPos = this.positionizeByEvent(evt);
				var deltaPosition = Vector2.sub(eventPos, this._prevPosition);
				var velocity = Vector2.divisionScalar(deltaPosition, (deltaTime || (deltaTime = 1)));
				var deltaVelocity = Vector2.sub(velocity, this._prevVelocity);

				this._velocity.add(deltaVelocity);
				this._position = Vector2.add(this._position, deltaPosition);

				this._prevTime = now;
				this._prevPosition = eventPos;
				this._prevVelocity = velocity;
			},
			dragEnd: function (evt) {
				this._isDragging = false;
				this.dragRelease();
			},
			dragRelease: function () {
				var _this = this;
				var zero = Vector2.zero;
				var past = Date.now();
				
				var startLeft = _this._position.x;
				
				(function loop() {
					_this.dampingVelocity();
					var now   = Date.now();
					var delta = now - past;
					_this._position = Vector2.add(_this._position, Vector2.multiplyScalar(_this._velocity, delta));
					
					// 画像を移動させる
					$(_this.element).css({left:_this._position.x});

					var isFirst = false;
					if (0 <= _this._position.x) {
						isFirst = true;
					}
					var isLast = false;
					if (_this._position.x <= (-1 * (maxPageNo * (carousel ? 2 : 1) * shiftw) + shiftw)) {
						isLast = true;
					}
					// 先頭に到達、最後に到達、慣性での動作が停止 の何れかの場合
					if (isFirst || isLast || _this._velocity.equal(zero)) {
						_this.reset();

						// 慣性の移動量
						var obj = {
								momentw : startLeft - _this._position.x
						};
						
						_this.stop(obj);
						return;
					}

					past = now;
					_this._loopTimer = setTimeout(loop, 16);
				}());
			},
			dampingVelocity: function () {
				var damping = Vector2.divisionScalar(this._velocity, this.damping);
				this._velocity.sub(damping);
				if (this._velocity.lessThen(0.05)) {
					this._velocity = Vector2.zero;
				}
			},
			reset: function () {
				clearTimeout(this._loopTimer);
				this._velocity = Vector2.zero;
				this._prevVelocity = Vector2.zero;
				this._prevPosition = Vector2.zero;
			},
			
			stop: function (obj) {
				this.onstop && this.onstop(obj);
			}
		};

		/**
		 * Vector2
		 *
		 * @param {number} x
		 * @param {number} y
		 */
		function Vector2(x, y) {
			this.x = x;
			this.y = y;
		}
		Object.defineProperties(Vector2, {
			'zero': {
				enumerable: true,
				set: function (val) {},
				get: function () { return new Vector2(0, 0); }
			}
		});
		Vector2.prototype = {
			constructor: Vector2,

			add: function (vec) {
				this.x += vec.x;
				this.y += vec.y;
				return this;
			},
			sub: function (vec) {
				this.x -= vec.x;
				this.y -= vec.y;
				return this;
			},
			multiplyScalar: function (val) {
				this.x *= val;
				this.y *= val;
				return this;
			},
			divisionScalar: function (val) {
				this.x /= val;
				this.y /= val;
				return this;
			},
			length: function () {
				return Math.sqrt((this.x * this.x) + (this.y * this.y));
			},
			lessThen: function (val) {
				return (this.length() <= val);
			},
			equal: function (vec) {
				return (this.x === vec.x && this.y === vec.y);
			},
			copy: function () {
				return new Vector2(this.x, this.y);
			}
		};
		Vector2.add = function (vec1, vec2) {
			var x = vec1.x + vec2.x;
			var y = vec1.y + vec2.y;
			return new Vector2(x, y);
		};
		Vector2.sub = function (vec1, vec2) {
			var x = vec1.x - vec2.x;
			var y = vec1.y - vec2.y;
			return new Vector2(x, y);
		};
		Vector2.multiplyScalar = function (vec, val) {
			var x = vec.x * val;
			var y = vec.y * val;
			return new Vector2(x, y);
		};
		Vector2.divisionScalar = function (vec, val) {
			var x = vec.x / val;
			var y = vec.y / val;
			return new Vector2(x, y);
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
		,	'moment': false // スワイプ時に慣性を利用するかどうか
		,	'isFullScreen': false // 端末の画面横幅いっぱいに画像を表示する
		,	'heightMaxScreen': false // 画像縦幅が端末縦幅よりも大きい場合は端末縦幅いっぱいに表示する（isFullScreen がtrueの場合のみ有効）
		,	'slideCallBack': null // スライド後に処理を行うコールバック(本プラグインで想定していない処理はここでカスタマイズする)
		,	'resizeCallBack': null // 画面リサイズ後に処理を行うコールバック
	};

})(jQuery);

