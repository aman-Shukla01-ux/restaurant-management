const user = localStorage.getItem("userEmail");
if (user) {
    window.location.href = "index1.html";
}

document.addEventListener("DOMContentLoaded", () => {
  const loginBtn = document.querySelector("#user-login");

  if (loginBtn) {
    loginBtn.addEventListener("click", async () => {
      let email1 = document.querySelector("#email_1").value.trim();
      let password_1 = document.querySelector("#password_1").value.trim();

      const errorbox = document.getElementById("loginAlert");
      const emailRegex =
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

      if (email1.length === 0) {
        errorbox.style.display = "block";
        errorbox.style.color = "red";
        errorbox.innerText = "Email is required";
        return;
      }

      if (!emailRegex.test(email1)) {
        errorbox.style.display = "block";
        errorbox.style.color = "red";
        errorbox.innerText = "Enter a valid email";
        return;
      }

      if (password_1.length === 0) {
        errorbox.style.display = "block";
        errorbox.style.color = "red";
        errorbox.innerText = "Password is required";
        return;
      }

      errorbox.style.display = "none";

      const result = await window.electron.login(email1, password_1);

      if (result.success) {
        document.querySelector(".insert_item_successfully_popup").style.display = "flex";

        const closeBtn = document.querySelector(".close");

      } else {
        errorbox.style.display = "block";
        errorbox.style.color = "red";
        errorbox.innerText = result.message || "Invalid email or password";
      }
    });
  }
});
function Cancel(ClassName){
let user_Identify = document.querySelector("#email_1").value.trim();
localStorage.setItem("userEmail", user_Identify);
window.location.href = "index1.html";
}