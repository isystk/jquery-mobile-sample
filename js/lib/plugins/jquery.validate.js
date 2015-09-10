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

