this.Utils = {
    ajax: (params) => {
        let url = Utils.getUrl(params.url);
        if (!url) return;

        const mask = Utils.nvl(params.mask, true);
        const type = Utils.nvl(params.type, "POST");
        const dataType = Utils.nvl(params.dataType, "json");
        const contentType = Utils.nvl(params.contentType, "application/json");
        const async = Utils.nvl(params.async, true);

        const defaultData = {

        };

        let maskObj = mask ? new Utils.loadMask() : null;
        if (maskObj) maskObj.open();

        let data = params.data;
        let isFormData = data instanceof FormData;

        if (isFormData) {
            for (let key in defaultData) {
                data.append(key, defaultData[key]);
            }
        } else if (Utils.isObject(data)) {
            data = $.extend({}, defaultData, data);
            if (contentType.includes("json")) {
                data = JSON.stringify(data);
            }
        }

        const config = {
            url,
            type,
            dataType,
            contentType,
            async,
            data,
            processData: !isFormData,
            contentType: isFormData ? false : contentType,
            complete: () => {
                if (maskObj) maskObj.close();
            },
            success: (res) => {
                if (params.success && Utils.isFunction(params.success)) {
                    params.success(res);
                }
            },
            error: (xhr) => {
                if (maskObj) maskObj.close();

                let resData = xhr.responseJSON || xhr.responseText || {};
                if (typeof resData === "string") {
                    try {
                        resData = JSON.parse(resData);
                    } catch (e) {
                        resData = {};
                    }
                }

                if (params.error && Utils.isFunction(params.error)) {
                    return params.error(resData);
                }

                const message = Utils.nvl(resData.message, "오류가 발생하였습니다.\n관리자에게 문의해주세요.");
                if (message === "SESSION_EXPIRED") {
                    Utils.sessionExpired(true);
                } else {
                    alert(message);
                }
            }
        };

        return $.ajax(config);
    },

    loadMask : function (id) {
        const _this = this;
        _this.id = id||Utils.getUUID();
        _this.open = async function(){
            const html =
            `<div class="spinner-bg" id='${_this.id}'>
                <div class="spinner-border" role="status"></div>
                <span class="spinner-text">Loading...</span>
              </div>
            `;
            $("body").append($(html));
            //$(`#${_this.id}`).fadeIn();
            $(`#${_this.id}`).show();
            _this.isOpen = true;
            //10초후에도 돌고있으면..
            _this.intId = setTimeout(function(){
                if(_this.isOpen) {
                    _this.close();
                }
            },20000);
            return true;
        }
        _this.close = function(){
            /*$(`#${_this.id}`).fadeOut(1000,function(){
                $(`#${_this.id}`).remove();
                _this.isOpen = false;
            });*/
            $(`#${_this.id}`).remove();
            _this.isOpen = false;
        }
        return _this;
    },
    getUUID : () => {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0,
                v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    },
    nvl : (val,repVal) => {
        if(Utils.isEmpty(val)) {
            if(!repVal) {
                return "";
            }else{
                return repVal;
            }
        }else{
            return val;
        }
    },
    isEmpty : (val) => {
        //const _this = this;
        if ( typeof val === "undefined" ||
            val === null ||
            val === "" ||
            val === "undefined" ||
            val === "null"
        ){
            return true
        }
        else if(val instanceof Date){
            return isNaN(val.getTime())
        }
        else if(typeof val === "object"){
            return Utils.isEmptyObject(val);
        }else{
            return false;
        }
    },
    isEmptyObject : (data) =>{
        return $.isEmptyObject(data);
    },
    isFunction : (fn) => {
        return $.isFunction(fn);
    },
    isArray : (arr) => {
        return $.isArray(arr);
    },
    isNumber : (val) => {
        return !isNaN(parseFloat(val)) && isFinite(val);
    },
    isObject : (obj) => {
        return obj !== null && typeof obj === 'object' && obj.constructor === Object;
    },
    getUrl : (url) => {
        return CONTEXT_PATH + url;
    },
    sessionExpired  : function(alertFlag){
        const fn = function(){
            parent.location.href = Utils.getUrl('/login');
        }
        if(alertFlag){
            alert("세션이 만료되었습니다.\n다시로그인 해주시기 바랍니다.",() => {
                fn();
            });
        }else{
            fn();
        }
    }
};
