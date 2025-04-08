String.prototype.format = function() {
    var args = arguments;
    if(args && args.length >  0){
	    return this.replace(/{(\d+)}/g, function(match, number) {
	        return typeof args[number] != 'undefined'
	            ? args[number]
	            : match
	        ;
	    });
    }else{
		return this
	}
};

String.prototype.padLeft = function(len,padStr) {
    const reStr = Utils.nvl(this);
    return reStr.padStart(len, padStr);
};

String.prototype.padRight = function(len,padStr) {
	let reStr = Utils.nvl(this);    
    return reStr.split('').reverse().join('').padStart(len, padStr).split('').reverse().join('');
};

String.prototype.camelCase = function() {
	let reStr = Utils.nvl(this);
	return reStr.toLowerCase().replace(/_([a-z])/g, (match, p1) => p1.toUpperCase()).replace(/_/g, '');
	//return reStr.toLowerCase().replace(/_([a-z])/g, (match, p1) => p1.toUpperCase());    
    //return reStr.replace(/([-_]\w)/g, (match) => match[1].toUpperCase()).replace(/^./, (match) => match.toLowerCase());  
};

String.prototype.snakeCase = function() {
	let reStr = Utils.nvl(this);    
    return reStr.replace(/([A-Z])/g, '_$1').toLowerCase();   
};

String.prototype.isCamelCase = function() {
	let reStr = Utils.nvl(this);    
    return reStr.match(/([a-z]+[A-Z]+\\w+)+/);   
};    

String.prototype.decodeHTML = function(){
	return $('<textarea/>').html(Utils.nvl(this)).text();
};

if (!String.prototype.includes) {
    String.prototype.includes = function (search, start) {
        if (typeof start !== 'number') {
            start = 0;
        }
        if (start + search.length > this.length) {
            return false;
        }
        return this.indexOf(search, start) !== -1;
    };
}

if (!Array.prototype.some) {
    Array.prototype.some = function (callback, thisArg) {
        if (this == null) throw new TypeError('Array.prototype.some called on null or undefined');
        if (typeof callback !== 'function') throw new TypeError(callback + ' is not a function');
        const array = Object(this);
        const length = array.length >>> 0; // 배열 길이 보장
        for (let i = 0; i < length; i++) {
            if (i in array && callback.call(thisArg, array[i], i, array)) {
                return true;
            }
        }
        return false;
    };
}

if (!Element.prototype.closest) {
    Element.prototype.closest = function (selector) {
        let element = this; // 현재 요소부터 시작

        while (element) {
            if (element.matches(selector)) { // 선택자와 일치하는지 확인
                return element; // 일치하는 요소 반환
            }
            element = element.parentElement || element.parentNode; // 상위 요소로 이동
        }
        return null; // 일치하는 요소가 없으면 null 반환
    };
}



(function($) {
    $.fn.serializeObject = function() {
        const data = {};
        const chkArr = [];
        this.find(':input').each(function() {
            var name = $(this).attr('name');
            //picker , summernote 용 파라미터 제거
            if (name 
                && name.indexOf("pickerView") < 0
                && name.indexOf("foreColorPicker") < 0
                && name.indexOf("backColorPicker") < 0
                && name.indexOf("note-dialog") < 0) {
				
                var type = $(this).prop('type');
                if (type === 'checkbox') {
                    if (!data[name]) {
                        data[name] = [];
                    }
                    if ($(this).is(':checked')) {
                        data[name].push($(this).val());
                    }
                    if(chkArr.indexOf(name) < 0) chkArr.push(name);
                } else if (type === 'radio') {
                    /*if (!data[name]) {
                        data[name] = [];
                    }*/
                    if ($(this).is(':checked')) {
                        data[name] = $(this).val();
                    }
                } else if (type === 'select-multiple') {
					//select2 에서 '' 이것도 값으로 인식해서.. 
					let valArr = $(this).val();
					valArr = valArr.filter(function(val){
						return !Utils.isEmpty(val);
					});
                    data[name] = valArr;
                } else {
                    data[name] = $(this).val();
                }
            }
            
        });
        //chk 데이터 str 로 변경 
        chkArr.forEach(function(name){
			let val = data[name];
			if(val && Utils.isArray(val)) {
				data[name] = val.join(",");
			}
		});
        return data;
    };
    
    $.fn.rebuild = function(list,keys, optionList){
		const obj = $(this);
		const tagName = obj.prop("tagName");
		if(tagName === "SELECT") {
			obj.find("option[value!='']").remove();
			if(optionList){ // 옵션 커스텀을 위해 따로 받은 경우
				optionList.forEach((opt)=>{
					obj.append(opt)
				})
			}
			else if(list) {	// 1 value, 1 label 사용
				keys      = keys||obj.data("keys")||{value : "code",label : "name"};
				list.forEach(function(info){
					const value = info[keys.value];
					const label = info[keys.label];
					const optObj = $(`<option value='${value}'>${label}</option>`);
					optObj.data("info",info);
					obj.append(optObj);
				});
			}
		}
	};


	const oriPropFn = $.fn.prop;	
	// 새로운 attr 메서드 정의
    $.fn.prop = function(attr, value) {
        // 'disabled' 속성에 대한 재정의
        const dataType = this.data("type");
			
        if(dataType == "editor") {
			//console.info(this,attr);
	        if (attr === "disabled" && typeof value !== 'undefined') {
				const editor = this.data("editor");
				editor.disabled(value);
	        }
        }
        return oriPropFn.apply(this, arguments);
    };


	const oriFocus = jQuery.fn.focus;
	$.fn.focus = function() {
      // 새로운 기능: 예를 들어 콘솔에 포커스된 요소의 정보를 출력
	  const selectId = $(this).data("select2Id");
	  if(Utils.isEmpty(selectId)) {
		// 원래의 .focus() 기능 실행
	  	return oriFocus.apply(this, arguments);  
	  }else{
		return $(this).select2("open");
	  }
	};
	
	$.fn.setVal = function() {
	  const obj = $(this);
	  if(arguments) {
		  obj.val(arguments);		  
		  if(obj.hasClass("select2-hidden-accessible")) {
			 setTimeout(function(){
				obj.trigger("change");	  
			 },100);
		  }
	  }
	};
})(jQuery);