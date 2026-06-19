async function sendOTP() {

  const sendOTPbtn = document.getElementById("sendOTPbtn");
  let email = document.getElementById("email");
  let emailValue = email.value;
  let errorbox = document.getElementById("alert");
  let enterOTP = document.getElementById("enterOTP");
  const verifyOTP = document.getElementById("verifyOTPbtn");
  const Loader = document.getElementById("Loader1");
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(emailValue)) {
    errorbox.style.display = "block";
    errorbox.innerText = "Enter your correct email";
    errorbox.style.color = "red";
  }
  if (emailValue.length == 0) {
    errorbox.style.display = "block";
    errorbox.style.color = "red";
    errorbox.innerText = "This filled is required";
  }
  if (emailRegex.test(emailValue) && emailValue.length != 0) {
    const email = document.getElementById("email");
    const emailValue = email.value.trim();
    const signup = await window.electron.forget(emailValue);
  if(!signup.success){
    Loader.style.display = "block";
    const response = await window.electron.sendOTP(emailValue);
    document.getElementById("result").innerText = response.message;
    email.disabled = true;
    document.getElementById("result").style.color = "green";
    Loader.style.display = "none";
    enterOTP.style.display = "block";
    verifyOTP.style.display = "block";
    sendOTPbtn.style.display = "none";
    errorbox.style.display = "none";
    email.disabled = true;
  }
  if (signup.success) {
    errorbox.style.display = "block";
    errorbox.style.color = "red";
    errorbox.innerText = "This email is already used";
    return;
  }
  }
}
async function verifyOTP() {
  const otp = document.getElementById("enterOTP").value;
  const createpassword = document.getElementById("create-password");
  const enterOTP = document.getElementById("enterOTP");
  const result = document.getElementById("result");
  const verifyOTPbtn = document.getElementById("verifyOTPbtn");
  const passwordInput = document.getElementById("password");
  const error1 = document.getElementById("error1");
  const error2 = document.getElementById("error2");
  const error3 = document.getElementById("error3");
  const error4 = document.getElementById("error4");
  const password_matching = document.getElementById("password-matching");
  const confirmPasswordInput = document.getElementById("confirm-password");
  const confirmPassword = document.getElementById("create-password");
  let emailValue = document.getElementById("email").value;
  const response = await window.electron.verifyOTP(emailValue, otp);
  document.getElementById("result").innerText = response.message;
  let answer = document.getElementById("result");

  answer.innerText = response.message;

  if (response.message === "Invalid OTP") {
    answer.style.color = "red";
  }
  const password_alert = document.getElementById("password-alert");
  if (response.success) {

    enterOTP.style.display = "none";
    verifyOTPbtn.style.display = "none";
    result.style.display = "none";
    sendOTPbtn.style.display = "none";

    password_alert.style.display = "block";
    passwordInput.style.display = "block";
    confirmPasswordInput.style.display = "block";
    createpassword.style.display = "block";

    // LIVE PASSWORD CHECK
    passwordInput.addEventListener("input", () => {

      if (passwordInput.value.length >= 8 && passwordInput.value.length <= 15) {
        error1.style.color = "green";
      } else {
        error1.style.color = "red";
      }

      const CapSmalRegX = /^(?=.*[a-z])(?=.*[A-Z]).+$/;
      if (CapSmalRegX.test(passwordInput.value)) {
        error2.style.color = "green";
      } else {
        error2.style.color = "red";
      }

      const numRegX = /^(?=.*[0-9]).+$/;
      if (numRegX.test(passwordInput.value)) {
        error3.style.color = "green";
      } else {
        error3.style.color = "red";
      }

      const charRegX = /^(?=.*[!@#$%^&*()_+]).+$/;
      if (charRegX.test(passwordInput.value)) {
        error4.style.color = "green";
      } else {
        error4.style.color = "red";
      }

      if (confirmPasswordInput.value != "") {
        if (confirmPasswordInput.value == passwordInput.value) {
          confirmPasswordInput.style.borderColor = "green";
          password_matching.style.display = "block";
          password_matching.innerText = "Password is match";
          password_matching.style.color = "green";

        } else {
          confirmPasswordInput.style.borderColor = "red";
          password_matching.style.display = "block";
          password_matching.innerText = "Password is not match";
          password_matching.style.color = "red";
        }
      }

      if (confirmPasswordInput.value == "" && passwordInput.value == "") {
        password_matching.style.display = "none";
      }
    });
  }

  confirmPasswordInput.addEventListener("input", () => {
    if (confirmPasswordInput.value == passwordInput.value) {

      password_matching.style.display = "block";
      confirmPasswordInput.style.borderColor = "green";
      password_matching.innerText = "Password is match";
      password_matching.style.color = "green";
    } else {
      confirmPasswordInput.style.borderColor = "red";
      password_matching.style.display = "block";
      password_matching.innerText = "Password is not match";
      password_matching.style.color = "red";
    }

    if (confirmPasswordInput.value == "" && passwordInput.value == "") {
      password_matching.style.display = "none";
    }
  });
}
//popup for sign_up//
document.addEventListener("DOMContentLoaded", () => {
let createpassword_ = document.querySelector("#create-password");
// Error part
createpassword_.addEventListener("click", async() => {

    let emailValue = document.getElementById("email").value;
    let passwordInput = document.getElementById("password");
    let confirmPasswordInput = document.getElementById("confirm-password");

    if (
        passwordInput.value === confirmPasswordInput.value &&
        error1.style.color === "green" &&
        error2.style.color === "green" &&
        error3.style.color === "green" &&
        error4.style.color === "green"
    ) {

      let result =  await window.electron.sign_up(emailValue, passwordInput.value);
      console.log(result);
            document.querySelector(".insert_item_successfully_popup").style.display = "flex";
        
    }


});
});
document.querySelector(".close").addEventListener("click",()=>{
      let user_Identify = document.querySelector("#email").value.trim();
       localStorage.setItem("userEmail", user_Identify);
         window.location.href = "index1.html";
     })