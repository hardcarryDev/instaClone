const Forms = function(params) {
    const _this  = this;
    const target = params.target;
    const initDm = Utils.nvl(params.initDm,true);
    const tForm = $(`#${target}`);
    this.defaultData = params.defaultData || {};

    this.vrules = params.vrules||{};

    this.validate = function() {
        return new Validates({target : _this, type : "form", vrules : _this.vrules}).validate();
    }

    //폼데이터 가져오기
    this.getData = function() {
        if (tForm && tForm.length > 0) {
            const frmData = tForm.data("data")||{};
            const data    = $.extend({},frmData,tForm.serializeObject());

            tForm.find("[data-formatter]").each((idx,obj) => {
                const tObj = $(obj);
                const name = tObj.attr("name");
                data[name] = tObj.data("oriVal");
            });

            tForm.find("[data-picker]").each((idx,obj) => {
                const tObj = $(obj);
                const name = tObj.attr("name");

                if(name.indexOf("pickerView") < 0) {
                    data[name] = Utils.nvl(tObj.val()).replace(/[^0-9]/gi,"");
                }else{
                    delete data[name];
                }
            });

            tForm.find(`[data-type=editor]`).each((idx,obj) => {
                const tObj   = $(obj);
                const name   = tObj.attr("name");
                const editor = tObj.data("editor");
                const val    = editor.getVal();
                data[name]   = val;
            });

            return data;
        } else {
            return {};
        }
    };

    //폼 데이터 세팅
    this.setData = function(data, fn) {
        if(data){
            const tObjs = tForm.find(`[name]`);
            tObjs.each(function(){
                const key = $(this).attr("name");
                if(key){
                    _this.setVal(key, Utils.nvl(data[key]));
                }
            });
            data = $.extend({},_this.defaultData,data);
            tForm.data("data",data);
            if (fn && Utils.isFunction(fn)) {
                fn.call(_this,data);
            }
        }
        _this.moveTop();
    };

    this.moveTop = function(){
        if (tForm && tForm.length > 0) {
            const parent = tForm.parent();
            const isScroll = parent[0].scrollHeight > parent[0].clientHeight;
            if(isScroll) {
                parent.scrollTop(0);
            }
        }
    }

    //폼 초기화
    this.clear = function() {
        if (tForm && tForm.length > 0) {
            _this.setData(_this.defaultData||{});
            _this.handler(false);
            _this.moveTop();
        }
    };

    //value 세팅
    this.setVal = function(key, val) {
        const tObj = tForm.find(`[name=${key}],[id=${key}]`);
        if (tObj && tObj.length > 0) {
            const tagNm = tObj.prop("tagName");
            const type  = tObj.prop("type");

            if (tagNm == "INPUT") {
                if(type == "checkbox" || type == "radio") {
                    if(val){
                        let valArr = (Utils.isArray(val)) ? val : val.split(",");
                        if(valArr.length > 0) {
                            tObj.each((idx,obj) => {
                                const objVal = $(obj).val();
                                if(valArr.indexOf(objVal) > -1){
                                    $(obj).prop("checked",true);
                                }
                            });
                        }
                    }else{
                        tObj.prop("checked",false);
                    }
                }else {
                    const formatter = Utils.nvl(tObj.data("formatter"));
                    const picker    = Utils.nvl(tObj.data("picker"));
                    if(formatter != ""){
                        tObj.data("oriVal",val);
                        val = Formatter.format(val,formatter);
                    }
                    if(picker != "") {
                        tObj.val(val).trigger("change");
                    }else{
                        tObj.val(val);
                    }
                }
            }
            //TEXTAREA , SELECT
            else if(tagNm == "SELECT"){
                if(tObj.hasClass("select2-hidden-accessible")) {
                    tObj.val(val)
                    setTimeout(function(){
                        tObj.trigger("change");
                    },100);
                }else{
                    tObj.val(val);
                }
                //tObj.val(val);
            }else if(tagNm == "DIV"){
                const dataType = tObj.data("type");
                if(dataType == "editor") {
                    if(!Utils.isEmpty(val)) {
                        val = Utils.unhtmlSpecialChars(val);
                        const editor = tObj.data("editor");
                        editor.setVal(val);
                    }
                }
            }else{
                tObj.val(val);
            }
        }else{
            const data = tForm.data("data");
            if(data) {
                data[key] = val;
                tForm.data("data",data);
            }
        }
    }



    //value 세팅
    this.getVal = function(key) {
        const data = _this.getData();
        return Utils.nvl(data[key])
    }

    this.getExcelColumns = function (){
        const arr = []
        if (tForm && tForm.length > 0) {
            const frmData = tForm.data("data")||{};
            const data    = $.extend({},frmData,tForm.serializeObject());
            const keys = Object.keys(data)
            if(Utils.isEmpty(keys)) return []
            keys.forEach((key)=> {
                const node = $(tForm).find(`#${key}`)
                const caption = node.parent().prev().text()
                arr.push({
                    ref: key,
                    caption: caption
                })
            })
        }else{
            return []
        }
        return arr
    }

    //폼 초기화
    this.init = function() {

        const tObjs = tForm.find(`input,textarea,select,[data-type=editor]`);

        tObjs.each((idx, tObj) => {

            const frmNm = tForm.attr("name")
            const id    = $(tObj).prop("id").replace(`${frmNm}_`,"");
            let   name  = $(tObj).attr("name");
            const type  = $(tObj).prop("type");
            const title = Utils.nvl($(tObj).prop("title"));
            const tdObj = $(tObj).closest("td");
            const thObj = tdObj.prev();
            const formatter = Utils.nvl($(tObj).data("formatter"));


            if(type == "textarea" || type == "text") {
                const maxlength = Utils.nvl($(tObj).attr("maxlength"));
                if(maxlength == "") {
                    $(tObj).attr("maxlength",50);
                }
                if($(tObj).data("autoHeight")){
                    $(tObj).autoHeight();
                }
            }

            if(formatter != "") {
                $(tObj).on("keyup",function(){
                    $(this).data("oriVal",$(this).val());
                });
            }

            if(title == "") {
                if(thObj.prop("tagName") == "TH"){
                    $(tObj).prop("title",thObj.text().replace(/\*/gi,""));
                }
            }

            if (Utils.isEmpty(name)) {
                name = id;
                $(tObj).prop("name", id);
            }

            if(name in _this.vrules) {
                const objRules  = _this.vrules[name];
                const validType = objRules.type;
                if(validType.indexOf("required") > -1) {
                    if(thObj.find(".f-red").length == 0){
                        thObj.append(` <span class="f-red h3">*</span>`);
                    }
                }
            }

            if($(tObj)){
                const mode = $(tObj).data("mode");
                if(!Utils.isEmpty(mode)) {
                    $(tObj).on("keyup",function(){
                        let val  = $(this).val();
                        try{
                            const mode = $(this).data("mode");
                            const modArr = mode.split("|");
                            val = Utils.strCheck(val,modArr);
                            $(this).val(val);
                        }catch(e){
                            console.error(e);
                        }
                    });
                }
            }
        });
        _this.clear();


        if(params.init) {
            const init = params.init;
            if (init && Utils.isFunction(init)) {
                init.call(_this);
            }
        }
        //_this.handler(false);
    };

    //폼 이벤트 바인딩
    this.event = function(config) {
        for (let key in config) {
            const frmNm = tForm.attr("name")
            let tObjs = [];
            try{
                tObjs = (tForm.find(`${key}`).length > 0) ? tForm.find(`${key}`) : tForm.find(`#${key}`);
            }catch(e){
                console.info(e);
            }
            let tConfs = config[key];

            if(!Utils.isArray(tConfs)) {
                tConfs = [tConfs];
            }

            tConfs.forEach(function(tConf){
                let   evts = Utils.nvl(tConf["evt"], "click");
                const deli = Utils.nvl(tConf["deli"]);
                const fn = tConf["fn"];

                if(!Utils.isArray(evts)) {
                    evts = [evts];
                }
                if (tObjs.length > 0) {
                    tObjs.each((idx, tObj) => {
                        evts.forEach(function(evt){
                            if($(tObj).prop("tagName")  == "SELECT" && (evt == "open" || evt == "close")){
                                evt = `select2:${evt}`;
                            }
                            $(tObj).unbind(evt);
                            $(tObj).on(evt, deli, function(e){
                                e.stopPropagation();
                                if (fn && Utils.isFunction(fn)) {
                                    //fn.call(_this,$(e.currentTarget),e.originalEvent,evt);
                                    fn.call(_this,$(e.currentTarget),e,evt);
                                    let type = $(e.currentTarget).prop("type")
                                    if(e.type == "click") {
                                        $(this).blur();
                                    }
                                }
                            });
                        });
                    });
                }
            });
        }
    };

    //찾기
    this.find = function(sel) {
        return tForm.find(sel);
    }

    // vrules 재정의
    this.setVrule = function (vrules){
        _this.vrules = vrules
        const tObjs = tForm.find(`input,textarea,select,[data-type=editor]`);

        tObjs.each((idx, tObj) => {
            const frmNm = tForm.attr("name")
            const id    = $(tObj).prop("id").replace(`${frmNm}_`,"");
            const tdObj = $(tObj).closest("td");
            const thObj = tdObj.prev();
            thObj.find(".f-red").remove() // 중복되지 않게 기존에 있던것 모두 지워줌.
            if(id in _this.vrules) {
                const objRules  = _this.vrules[id];
                const validType = objRules.type;
                if(validType.indexOf("required") > -1) {
                    thObj.append(` <span class="f-red h3">*</span>`)
                }
            }
        })


    }


    this.focus = function(sel) {
        _this.find(sel).focus();
    }

    this.getFormData = function(fileInfo){

        const formData = new FormData(); //formData 생성
        const data     = _this.getData();

        for(var key in data){
            var val = data[key];
            if(Utils.isArray(val) || Utils.isObject(val)){
                val = JSON.stringify(val);
            }
            formData.append(key, val);
        }

        const fileObjs = tForm.find("input[type=file]");
        let i=0;
        if(fileObjs.length > 0) {
            fileObjs.each(function(){
                let fileObj = this;
                let files   = fileObj.files;
                let fileNm  = $(fileObj).attr("name");
                if(files.length > 0) {
                    for(i=0;i<files.length;i++){
                        formData.append(`${fileNm}_${i}`, files[i]);
                    }
                }
            });
        }

        if(fileInfo) {
            const fileNm = fileInfo.name || "file";
            const files = fileInfo.files || [];
            if(files.length > 0){
                files.forEach(function(){
                    formData.append(`${fileNm}_${i}`, files[i]);
                    i++;
                });
            }
        }


        return formData;
    }

    this.handler = function(editable,...args) {

        tForm.find(`[data-edit]`).each(function(idx,Obj){
            const edit = Utils.nvl($(this).data("edit"),"Y");
            //editor 는 div 라.. 문제 생겨서.. 따로 호출하면 먹음..
            if(edit == "Y") {
                $(Obj).prop("disabled",!editable);
            }else{
                if(editable) {
                    $(Obj).prop("disabled",true);
                }
            }

        });
        //tForm.find(`[data-type=editor]`).prop("disabled",!editable);

        if(params.handler) {
            const handler = params.handler;
            if (handler && Utils.isFunction(handler)) {
                handler.call(_this,editable,...args);
            }
        }
    }

    //디폴트 데이터 세팅
    if (!Utils.isEmptyObject(this.defaultData)) {
        this.setData(this.defaultData);
    }
    if ("event" in params) {
        const event = params.event || {};
        if (!Utils.isEmptyObject(event)) {
            this.event(event);
        }
    }

    this.target = tForm;

    Promise.resolve().then(() => this.init());

    if (params.resize && Utils.isFunction(params.resize)) {
        const resizer = new ResizeObserver(entries => {
            const resize = params.resize;
            const targetHeight = entries[0].contentRect.height;
            if (targetHeight !== _this._lastHeight) {
                _this._lastHeight = targetHeight; // 마지막 크기 업데이트
                // setTimeout을 사용하여 리사이즈 처리를 지연시켜 무한 루프 방지
                setTimeout(() => {
                    resize.call(_this, targetHeight);
                }, 0);
            }
        });
        resizer.observe(_this.target.parent()[0]);
    }
    return this;
}



