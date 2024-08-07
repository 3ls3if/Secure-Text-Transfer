
//password verification for similarity
var password = document.getElementById("password")
    , password_confirm = document.getElementById("password_confirm")
    , captcha = document.getElementById("captcha");

function validatePassword() {
    if (password.value != password_confirm.value) {
        password_confirm.setCustomValidity("Passwords Don't Match");
    } else {
        password_confirm.setCustomValidity('');
    }
}

password.onchange = validatePassword;
password_confirm.onkeyup = validatePassword;




// Captcha verification function
var recaptcha_response = '';
function submitUserForm() {
    if(recaptcha_response.length == 0) {
        document.getElementById('g-recaptcha-error').innerHTML = '<span style="color:red;">This field is required.</span>';
        return false;
    }
    return true;
}
 
function verifyCaptcha(token) {
    recaptcha_response = token;
    document.getElementById('g-recaptcha-error').innerHTML = '';
}






































//octa validate 

// function validate_signup() {
//     //create new instance of octavalidate
//     let formVal2 = new octaValidate('form_register', { successBorder: true, strictMode: true });
//     //attach event listener
//     document.querySelector('#form_register').addEventListener('submit', function (e) {
//         //prevent default action
//         e.preventDefault();

//         //recaptcha validation
//         var response2 = grecaptcha.getResponse();

//         //invoke the validate method

//         if (formVal2.validate() == true) {


//             if (response2.length == 0) {
//                 alert("please verify you are human!");
//                 return false;
//             }
//             //validation successful
//             return true;

//         } else {
//             //validation failed
//             return false;
//         }
//     });
// }

