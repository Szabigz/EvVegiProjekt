function userRegister(){
    const request = new XMLHttpRequest()
    request.open("POST","/userReg")
    request.setRequestHeader("Content-type","Application/json")
    request.send(JSON.stringify({
        name: nameInput.value,
        email: emailInput.value,
        password: passwordInput.value,
        phoneNum: phoneNumInput.value
    }))
    request.onreadystatechange=()=>{
        if (request.readyState==XMLHttpRequest.DONE) {
            const response=JSON.parse(request.response)
            alert(response.message)
        }
    }
}

function userLogin(){
    const request = new XMLHttpRequest()
    request.open("POST","/userLogin")
    request.setRequestHeader("Content-type","Application/json")
    request.send(JSON.stringify({
        name: nameInput.value,
        email: emailInput.value,
        password: passwordInput.value
    }))
    request.onreadystatechange=()=>{
        if (request.readyState==XMLHttpRequest.DONE) {
            const response=JSON.parse(request.response)
            alert(response.message)
            sessionStorage.setItem('token', response.token)
        }
    }
}