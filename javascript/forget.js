document.getElementById("sendOTPbtn").addEventListener("click", async () => {

  const email = document.getElementById("email");
  const errorbox = document.getElementById("alert");
  const Loader = document.getElementById("Loader1");
  const enterOTP = document.getElementById("enterOTP");
  const verifyOTPbtn = document.getElementById("verifyOTPbtn");
  const sendOTPbtn = document.getElementById("sendOTPbtn");

  const emailValue = email.value.trim();

  const emailRegex =
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (emailValue.length === 0) {
    errorbox.style.display = "block";
    errorbox.style.color = "red";
    errorbox.innerText = "This field is required";
    return;
  }

  if (!emailRegex.test(emailValue)) {
    errorbox.style.display = "block";
    errorbox.style.color = "red";
    errorbox.innerText = "Enter your correct email";
    return;
  }

  const result = await window.electron.forget(emailValue);

  if (!result.success) {
    errorbox.style.display = "block";
    errorbox.style.color = "red";
    errorbox.innerText = "Email not found";
    return;
  }

  Loader.style.display = "block";

  const response = await window.electron.sendOTP(emailValue);

  Loader.style.display = "none";

  document.getElementById("result").innerText =
    response.message;

  document.getElementById("result").style.color = "green";

  email.disabled = true;
  enterOTP.style.display = "block";
  verifyOTPbtn.style.display = "block";
  sendOTPbtn.style.display = "none";
  errorbox.style.display = "none";
});
document.getElementById("verifyOTPbtn").addEventListener("click", async () => {

  const otp = document.getElementById("enterOTP").value;
  const emailValue = document.getElementById("email").value;

  const response =
    await window.electron.verifyOTP(emailValue, otp);

  const answer = document.getElementById("result");

  answer.innerText = response.message;

  if (!response.success) {
    answer.style.color = "red";
    return;
  }

  answer.style.color = "green";

  document.getElementById("enterOTP").style.display = "none";
  document.getElementById("verifyOTPbtn").style.display = "none";
  document.getElementById("result").style.display = "none";

  document.getElementById("password-alert").style.display = "block";
  document.getElementById("password").style.display = "block";
  document.getElementById("confirm-password").style.display = "block";
  document.getElementById("create-password").style.display = "block";
});
const passwordInput = document.getElementById("password");
const confirmPasswordInput =
  document.getElementById("confirm-password");
const password_matching =
  document.getElementById("password-matching");

passwordInput.addEventListener("input", checkPassword);
confirmPasswordInput.addEventListener("input", checkPassword);

function checkPassword() {

  const error1 = document.getElementById("error1");
  const error2 = document.getElementById("error2");
  const error3 = document.getElementById("error3");
  const error4 = document.getElementById("error4");

  error1.style.color =
    passwordInput.value.length >= 8 &&
    passwordInput.value.length <= 15
      ? "green"
      : "red";

  error2.style.color =
    /^(?=.*[a-z])(?=.*[A-Z]).+$/.test(passwordInput.value)
      ? "green"
      : "red";

  error3.style.color =
    /^(?=.*[0-9]).+$/.test(passwordInput.value)
      ? "green"
      : "red";

  error4.style.color =
    /^(?=.*[!@#$%^&*()_+]).+$/.test(passwordInput.value)
      ? "green"
      : "red";

  if (confirmPasswordInput.value === "") {
    password_matching.style.display = "none";
    return;
  }

  password_matching.style.display = "block";

  if (passwordInput.value === confirmPasswordInput.value) {
    confirmPasswordInput.style.borderColor = "green";
    password_matching.innerText = "Password is match";
    password_matching.style.color = "green";

  } else {
    confirmPasswordInput.style.borderColor = "red";
    password_matching.innerText = "Password is not match";
    password_matching.style.color = "red";
  }
}

document.addEventListener("DOMContentLoaded", () => {
let createpassword = document.getElementById("create-password");
// Error part
createpassword.addEventListener("click",  async(e) => {

    let emailValue = document.getElementById("email").value;
    let passwordInput = document.getElementById("password").value;
    let confirmPasswordInput = document.getElementById("confirm-password").value;

    if (
        passwordInput === confirmPasswordInput &&
        error1.style.color === "green" &&
        error2.style.color === "green" &&
        error3.style.color === "green" &&
        error4.style.color === "green"
    ) {
      
      let result = await window.electron.forget_password(
  emailValue,
  passwordInput
);
console.log(result);
document.querySelector(".insert_item_successfully_popup").style.display ="flex";
}

});
});
function Cancel(ClassName){
  document.querySelector(ClassName).style.display = "none";
  location.reload();
}