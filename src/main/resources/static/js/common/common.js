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
            progPh: Utils.getProgPath(),
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
};
