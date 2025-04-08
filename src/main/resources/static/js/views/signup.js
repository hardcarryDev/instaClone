let signForm = null

$(document).ready(()=>{

    signForm = new Forms({
        target: 'signForm',
        event: {
            btnSignup: {
                evt: 'click',
                fn: () => fnSignup()
            }
        }
    })
})

/** 회원가입 */
const fnSignup = () => {
    const data = signForm.getData()

    Utils.ajax({
        url: "/user/signup",
        type: "POST",
        data: JSON.stringify(data),
        success: function (res) {
            alert("회원가입이 완료되었습니다!");
            // location.href = "/login";
        },
    });
}