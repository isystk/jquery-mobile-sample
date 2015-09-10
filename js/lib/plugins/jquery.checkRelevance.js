
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

