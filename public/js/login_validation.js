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






























//  function validate_login(){
//  //create new instance of octavalidate
//     let formVal = new octaValidate('form_login', {successBorder : true, strictMode : true});
//     //attach event listener
//     document.querySelector('#form_login').addEventListener('submit', function (e) {
//         //prevent default action
//         e.preventDefault();

//         //recaptcha validation
//         var response = grecaptcha.getResponse();

//         //invoke the validate method

//         if (formVal.validate() === true) {

//             if (response.length == 0) {
//                 alert("please verify you are humann!");
//                 return false;
//             }

//             //validation successful
//             // alert('You are signed in');
//             return true;
//         } else {
//             //validation failed
//             return false;
//         }

//     });
//  }