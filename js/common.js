(function($){

	// アプリ内の名前空間
	var App = {};

	/*
	 * consoleLog
	 */
	App.consoleLog = function() {
		if (('console' in window)) {
			if (0 < arguments.length) {
				console.log(arguments);
			}
	    }
	};

	window.App = App;

	// DOMReady
	$(function() {

		// 戻るボタン
		$(document).delegate(".reverse", "vclick", function(event) {
			event.preventDefault();
			event.stopPropagation();

			window.history.back();
		});

		// 閉じるボタン
		$(document).delegate(".close", "vclick", function(event) {
			event.preventDefault();
			event.stopPropagation();

			window.close();
		});

		// ページトップボタン
		$(document).delegate(".silentScroll", "vclick", function(event) {
			event.preventDefault();
			event.stopPropagation();

			//$.mobile.silentScroll(1);

			//スクロールしてトップ
			$('body,html').animate({
				scrollTop: 0
			}, 500);
			return false;
		});

	});

})(jQuery);
