this.Utils = {
    ajax : (params) => {
        let url   = params.url;
        if(url) {
            url = Utils.getUrl(url);
            const mask     = Utils.nvl(params.mask,true);
            const type     = Utils.nvl(params.type    ,"POST");
            const dataType = Utils.nvl(params.dataType,"json");
            const contentType = Utils.nvl(params.contentType,"application/json");
            const async    = Utils.nvl(params.async   ,true);
            const global = (!async && mask) ? true : false;
            const defaultData = {
                progPh: Utils.getProgPath()
            };

            const titleObj = $(".main-title,.modal-title");
            if(titleObj.length > 0) {
                defaultData.actNm = titleObj.text();
            }

            let maskObj = (mask) ? new Utils.loadMask() : null;
            (mask) ? maskObj.open() : false;

            let data = params.data;
            let isFormData = false;
            if(data){
                if(data instanceof FormData){
                    for(let key in defaultData){
                        data.append(key,defaultData[key]);
                    }
                    isFormData = true;
                }else{
                    if(Utils.isObject(params.data)){
                        data = $.extend({},defaultData, params.data||{});
                    }else{
                        data = $.extend({},defaultData, JSON.parse(params.data||{}));
                        data = JSON.stringify(data);
                    }
                }
            }
            /*if(!Utils.isEmptyObject(data)){
                if(sendType === "json") {
                    //data = JSON.stringify(data);
                }
            }*/

            let config  = {
                url,
                type,
                dataType,
                contentType,
                async,
                //global,
                data,
                error : (xhr, status, error) => {
                    if(mask) maskObj.close();
                    //에러 핸들링 은 수정할꺼임..
                    let resData  = xhr.responseJSON||xhr.responseText||{};
                    if(!Utils.isEmptyObject(resData)){
                        if(typeof resData == "string"){
                            resData = JSON.parse(resData);
                        }
                        const message = Utils.nvl(resData.message,"오류가 발생하였습니다.\n관리자에게 문의해주세요.");
                        if(message === "SESSION_EXPIRED"){
                            Utils.sessionExpired(true);
                        }else{
                            alert(message);
                        }
                    }else{
                        alert("오류가 발생하였습니다.\n관리자에게 문의해주세요.");
                    }
                },
                /*beforeSend: function(xhr) {
                    //if(mask && maskObj)	maskObj.open();
                },*/
                complete: function () {
                    if(mask && maskObj)	maskObj.close();
                }
            }

            if(params.success && Utils.isFunction(params.success)) {
                config.success = function(res){
                    if(mask && maskObj) maskObj.close();
                    params.success(res);
                }
            }
            if(params.error && Utils.isFunction(params.error)) {
                config.error = (xhr, status, error) => {
                    if(mask && maskObj) maskObj.close();
                    let resData  = xhr.responseJSON||xhr.responseText||{};
                    if(typeof resData == "string"){
                        resData = JSON.parse(resData);
                    }
                    params.error(resData);
                }
            }

            if(isFormData) {
                config.contentType = false;
                config.processData = false;
            }

            /*if(!async) {
                 const res = await new Promise((resolve, reject) => {
                    $.ajax({
                        ...config,
                        success: resolve,
                        error: (xhr) => {
                            let resData = xhr.responseJSON || xhr.responseText || {};
                            if (typeof resData === "string") {
                                resData = JSON.parse(resData);
                            }
                            reject(resData);
                        }
                    });
                });
                if(params.success && Utils.isFunction(params.success)) {
                    if(mask && maskObj) maskObj.close();
                    params.success(res);
                }
                return res;
            }else{
                return $.ajax(config);
            }*/

            let res = {};
            if(!async) {
                if(mask){
                    setTimeout(function(){
                        res = $.ajax(config);
                    },100);

                }else{
                    res = $.ajax(config);
                    let resData = {};
                    if(!async) {
                        resData = res.responseJSON;
                    }
                    return resData;
                }
            }else{
                res = $.ajax(config);
            }

        }
    },
}