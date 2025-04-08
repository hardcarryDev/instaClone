let loginForm = null;

$(document).ready(()=>{
    loginForm = new Forms({
        target: 'loginForm',
        event: {
            btnLogin: {
                evt: 'click',
                fn: () => login()
            }
        }
    })
})

// 로그인
const login = () => {
    const data = loginForm.getData()

    Utils.ajax({
        url: "/user/login",
        type: "POST",
        contentType: 'application/x-www-form-urlencoded; charset=utf-8',
        data: data,
        success: function (res){
            console.log(res)
            if(res.code == 'SUCCESS'){
                console.log("res.data.redirect: ", res.data.redirect)
                window.location.href = res.data.redirect
            }
        }
    });
}