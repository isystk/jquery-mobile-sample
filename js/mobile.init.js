$(document).bind('mobileinit', function(){

	// 以下二つのプロパティはtrueにするとXSSが発生してしまうため、trueにしないこと！
	$.support.cors = false;
	$.mobile.allowCrossDomainPages = false;

	// コントロールの強化を勝手にされないようにするおまじない
	$.mobile.ignoreContentEnabled = true;

	// 日本語化
	$.mobile.loadingMessage = '読込み中';
	$.mobile.loadingMessageTextVisible = true;
	$.mobile.pageLoadErrorMessage = '読込みに失敗しました';
	$.mobile.page.prototype.options.backBtnText = '戻る';
	$.mobile.dialog.prototype.options.closeBtnText = '閉じる';
	$.mobile.selectmenu.prototype.options.closeText= '閉じる';
	$.mobile.listview.prototype.options.filterPlaceholder = '検索文字列...';

	// 戻るボタンの自動表示
	//$.mobile.page.prototype.options.addBackBtn = true;

	// ページ移動にAjaxを使わないようにする 
	$.mobile.ajaxEnabled = false;

	//  画面遷移後にhistory.back()して、再度画面遷移すると、P01-D(Android)の端末でのみ、画面遷移前の画面に戻ってしまう現象の暫定対応
	$.mobile.pushStateEnabled = false;

	// クロスドメインの読み込みを可能にする
	//$.mobile.allowCrossDomainPages = true;

	// コントロールの装飾をしないためのセレクター
	$.mobile.page.prototype.options.keepNative = ".data-role-none";
	$.mobile.nativeSelectMenu = true;

	// トランジション
	$.mobile.defaultPageTransition = "fade";
	$.mobile.defaultDialogTransition = "pop";

	// $.mobileの拡張
	$.extend($.mobile , {
		// ajaxページ遷移
		changeAjaxPage: function(url) {
			var urimap = $.makeUri(url);
			
			$.mobile.changePage(urimap.uri, {
				type: "get",
				data: _.compact(urimap.param).join("&"),
				transition: "fade",
				changeHash: true,
				fromHashChange: false
			});
		},
		// POSTでajaxページ遷移(検索条件をすべて選択するとGETパラメータの最大2063byteを超えるため)
		changeAjaxPagePost: function(url) {
			var urimap = $.makeUri(url);
			
			// このcurrentUrlは、次ページのdata-url要素に利用している。
			// これを利用することでPOSTで遷移してもURLにクエリーが表示されるようになり、リロードしても問題ないようにしている。
			urimap.param.push('currentUrl=' + encodeURIComponent(url));

			// iOS6だとAjaxのPOSTがキャッシュされてしまう問題に対応
			var uri = [urimap.uri, 'time=' + new Date().getTime()].join('?');
			
			$.mobile.changePage(uri, {
				type: "post",
				data: _.compact(urimap.param).join("&"),
				transition: "fade",
				changeHash: true,
				fromHashChange: false
			});
		}
	});

	// jQuery Mobileイベント
	$(document)
		.delegate('[data-role=page]', 'pagebeforeshow', function(event, ui){
		})
		.delegate('[data-role=page]', 'pagebeforehide',function(event, ui){
		})
		.delegate('[data-role=page]', 'pageshow',function(event, ui){
			if ($(this).attr('id') !== 'top') {
				// 共通メニュー
				$([
					'<div class="display-none commonMenuPanel">',
						'<article>',
							'<h1 class="pagettl">検索</h1>',
							'<h3>フリーワードで探す</h3>',
							'<form action="./" class="searchTop01">',
								'<input type="search" name="freeword" id="SST001_freeword" placeholder="フリーワードから探す" maxlength="" /><input type="submit" value="検索" />',
							'</form>',
							'<h3>メニュー</h3>',
							'<div class="searchBox">',
								'<nav class="listNav">',
									'<ul>',
										'<li><h3><a href="./">トップページ</a></h3></li>',
										'<li><h3><a href="./">トップページ</a></h3></li>',
										'<li><h3><a href="./">トップページ</a></h3></li>',
										'<li><h3><a href="./">トップページ</a></h3></li>',
										'<li><h3><a href="./">トップページ</a></h3></li>',
										'<li><h3><a href="./">トップページ</a></h3></li>',
										'<li><h3><a href="./">トップページ</a></h3></li>',
										'<li><h3><a href="./">トップページ</a></h3></li>',
										'<li><h3><a href="./">トップページ</a></h3></li>',
										'<li><h3><a href="./">トップページ</a></h3></li>',
										'<li><h3><a href="./">トップページ</a></h3></li>',
										'<li><h3><a href="./">トップページ</a></h3></li>',
										'<li><h3><a href="./">トップページ</a></h3></li>',
										'<li><h3><a href="./">トップページ</a></h3></li>',
										'<li><h3><a href="./">トップページ</a></h3></li>',
										'<li><h3><a href="./">トップページ</a></h3></li>',
									'</ul>',
								'</nav>',
							'</div>',
						'</article>',
					'</div>'
				].join('')).hide().appendTo($.mobile.activePage);
				$.slideMenu({target: '.showCommonMenuPanel', dispTarget: '.commonMenuPanel', width: '85%'});

				// マイページメニュー
				var mypageMenuWedding = $('.showHistoryPanel').mypageMenu({}, function(obj) {
				});

			}
		})
		.delegate('[data-role=page]', 'pagehide',function(event, ui){
		})
		.delegate('[data-role=page]', 'pagebeforecreate',function(event, ui){
		})
		.delegate('[data-role=page]', 'pagecreate',function(event, ui){
		});

});

