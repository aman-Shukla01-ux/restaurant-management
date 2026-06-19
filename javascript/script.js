


//////////////////////////////////////////////
//index.html->page
//////////////////////////////////////////////
// SINGLE CLICK LISTENER (VERY IMPORTANT)
//////////////////////////////////////////////

let user_Identify = localStorage.getItem("userEmail");
if (!user_Identify) {
    window.location.href = "login.html";
}

const logoutBtn = document.getElementById("logoutBtn");
logoutBtn.onclick = () => {
    localStorage.removeItem("userEmail");
    window.location.href = "login.html";
};

document.addEventListener("click", async (e) => {
  // ================= TABLE OPEN =================
  if (e.target.id === "Tables") {
    document.querySelector(".overlay").style.display = "flex";
    
    const Table_Status = await window.electron.Table_Status(user_Identify);

    output.innerHTML = "";

    Table_Status.forEach(item => {
      output.innerHTML += `
        <tr data-id="${item.table_id}">
          <td class="table_id">${item.table_id}</td>
          <td class="table_Status">${item.status}</td>
          <td>
            <button class="bt_edit">Edit</button>
            <button class="table_btn_delete__" data-id="${item.table_id}">Delete</button>
          </td>
        </tr>`;
    });
     list.classList.remove("active");
  }

  // ================= EDIT TABLE =================
 // ================= EDIT TABLE =================
else if (e.target.classList.contains("bt_edit")) {
  const btn = e.target;
  const row = btn.closest("tr");

  const table_ = row.querySelector(".table_id");
  const table_status = row.querySelector(".table_Status");

  // Store old table id for later use
  const old_table_id = table_.textContent.trim();
  row.dataset.oldTableId = old_table_id;

  const currentValue = table_status.textContent.trim();
  const table1 = table_.textContent.trim();

  table_status.innerHTML = `
    <select class="new_value2">
      <option value="AV" ${currentValue === "AV" ? "selected" : ""}>AV</option>
      <option value="NA" ${currentValue === "NA" ? "selected" : ""}>NA</option>
    </select>
  `;

  table_.innerHTML = `
    <input type="number" class="new_table_id" value="${table1}">
  `;

  btn.textContent = "Save";
  btn.classList.replace("bt_edit", "bt_save");
}

// ================= SAVE TABLE =================
else if (e.target.classList.contains("bt_save")) {
  const btn = e.target;
  const row = btn.closest("tr");

  const old_table_id = row.dataset.oldTableId;
  const new_table_id = row.querySelector(".new_table_id").value;
  const newStatus = row.querySelector(".new_value2").value;

  // Update database
  await window.electron.update_Table_Status(
    new_table_id,
    newStatus,
    old_table_id
  );

  // Update UI
  row.querySelector(".table_id").textContent = new_table_id;
  row.querySelector(".table_Status").textContent = newStatus;

  // Update dataset id if you use it elsewhere
  row.dataset.id = new_table_id;

  btn.textContent = "Edit";
  btn.classList.replace("bt_save", "bt_edit");
}

  // ================= DELETE TABLE =================
  else if (e.target.classList.contains("table_btn_delete")) {
    const table_id = e.target.dataset.id;
    const row = e.target.closest("tr");

    document.querySelector(".table_btn_delete_").style.display = "flex";

    document.querySelector("#yes_").onclick = async () => {
      await window.electron.Delete_table(table_id);
      row.remove();
      document.querySelector(".table_btn_delete_").style.display = "none";
    };
  }

  // ================= INSERT TABLE =================
  else if (e.target.id === "submit__") {
    
  const table_id = document.getElementById("table_id").value;
  const status = document.getElementById("table_Availbility").value;

  if (!table_id || !status) {
    alert("Please fill all fields");
    return;
  }
  console.log(user_Identify,status,table_id);
  await window.electron.insert_table(table_id, status,user_Identify);


  document.querySelector(".insert_item_successfully_popup").style.display = "block";
}
  // =============== CHECK ORDER HISTORY===============
  else if (e.target.id === "Order_history") {
  let response = await window.electron.Order_history(user_Identify);
   
  console.log("order_history:", response);

  Orders.innerHTML = "";

  if (response.success) {

    response.data.forEach(order => {

      let formattedDate = new Date(order.order_time)
        .toLocaleString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true
        });

     Orders.innerHTML += `
<tr data-id="${order.history_id}">
  <td class="order_id">${order.order_id}</td>
  <td class="table_id">${order.table_id}</td>
  <td class="order_time">${formattedDate}</td>

  <td class="item_name">${order.item_name}</td>
  <td class="category">${order.item_category}</td>
  <td class="quantity">${order.quantity}</td>

  <td class="price">₹${order.total_price}</td>

  <td>
    <button class="btn_delete__" data-id="${order.history_id}">
      Delete
    </button>
  </td>
</tr>
`;

    });
  }
  document.querySelector(".order_").style.display = "flex";
     list.classList.remove("active");
}


  // ================= CATEGORY OPEN =================
  else if (e.target.id === "Edit_Category") {
    const categoryItems = await window.electron.Category_name();

    output.innerHTML = "";

    categoryItems.forEach(item => {
      output.innerHTML += `
        <tr>
          <td class="item-category" data-name="${item.Category_Name}">
            ${item.Category_Name}
          </td>
          <td>
            <button class="btn_edit">Edit</button>
            <button class="btn_delete" data-id="${item.Category_id}">Delete</button>
          </td>
        </tr>`;
    });

    document.querySelector(".overlay").style.display = "flex";
  }

  // ================= EDIT CATEGORY =================
  else if (e.target.classList.contains("btn_edit")) {
    const row = e.target.closest("tr");
    const categoryCell = row.querySelector(".item-category");

    categoryCell.innerHTML = `
      <input class="new_value1" value="${categoryCell.textContent.trim()}">
    `;

    e.target.textContent = "Save";
    e.target.classList.replace("btn_edit", "btn_save");
  }

  // ================= SAVE CATEGORY =================
  else if (e.target.classList.contains("btn_save")) {
    const row = e.target.closest("tr");
    const categoryCell = row.querySelector(".item-category");

    const old_category = categoryCell.dataset.name;
    const new_category = row.querySelector(".new_value1").value;

    await window.electron.Update_Category(new_category, old_category);

    categoryCell.textContent = new_category;

    e.target.textContent = "Edit";
    e.target.classList.replace("btn_save", "btn_edit");
  }

  // ================= DELETE CATEGORY =================
  else if (e.target.classList.contains("btn_delete")) {
    const Category_id = e.target.dataset.id;
    const row = e.target.closest("tr");

    document.querySelector(".Delete_popup").style.display = "flex";

    document.querySelector("#Delete").onclick = async () => {
      const value = await window.electron.DeleteCategory(Category_id);

      if (value.message !== "Category has items, delete them first") {
        row.remove();
      } else {
        document.querySelector("#Delete_show").innerText = value.message;
        document.querySelector("#Delete_show").style.color = "red";
      }
    };
  }
  else if(e.target.id ==='Add_table_1'){
    document.querySelector(".popup-overlay").style.display = "flex";
     list.classList.remove("active");
  }
});

  
document.addEventListener("DOMContentLoaded", () => {

  const search = document.querySelector("#search");

  if (!search) return;

  search.addEventListener("input", () => {

    let value = search.value.toLowerCase();

    let rows = document.querySelectorAll("tbody tr");

    rows.forEach((row) => {

      let text = row.textContent.toLowerCase();

      row.style.display = text.includes(value) ? "" : "none";

    });

  });

});
let selectedOrderId = null;

// STEP 1: OPEN POPUP
document.addEventListener("click", (e) => {

  if (e.target.classList.contains("btn_delete__")) {

    selectedOrderId = e.target.dataset.id;

    console.log("Selected History ID:", selectedOrderId);

    document.querySelector("#message").innerText =
      "Delete this history ?";

    document.querySelector(".Delete_popup").style.display =
      "flex";
  }
});


// STEP 2: CONFIRM DELETE
document.querySelector("#Delete").addEventListener("click", async () => {

  if (!selectedOrderId) return;

  const result = await window.electron.Order_history_delete(
    selectedOrderId,
    user_Identify
  );

  if (result.success) {

    // close popup
    document.querySelector(".Delete_popup").style.display = "none";

    // optional: remove from UI instead of reload
    location.reload();

  } else {
    console.error(result.message);
  }
});


// STEP 3: CANCEL BUTTON (optional but important)
// document.querySelector("#Cancel").addEventListener("click", () => {

//   document.querySelector(".Delete_popup").style.display = "none";
//   selectedOrderId = null;
// });

function table_btn_delete_(){
  document.querySelector(".table_btn_delete_").style.display="none";
}

  // If button is SAVE
  // else {
  //   console.log(table_id,table_status);
  //   let new_id = row.querySelector(".new_value1").value;
  //   let new_status = row.querySelector(".new_value2").value;

  //   // Update UI
  //   table_id.textContent = new_id;
  //   table_status.textContent = new_status;

  //   console.log("Updated:", new_id, new_status);

  //   // Change button back
  //   btn.textContent = "Edit";
  //   btn.classList.replace("bt_save", "bt_edit");

  // // 👉 Here you can call backend (Electron/MySQL)
  // window.electron.updateTable(new_id, new_status);





// function Add_Table(){
//   document.querySelector(".popup").style.display="block";
// }
///////////////////////////////////////////////////////////////

// javascript for login page //

// async function sendOTP() {

//   const sendOTPbtn = document.getElementById("sendOTPbtn");
//   let email = document.getElementById("email");
//   let emailValue = email.value;
//   let errorbox = document.getElementById("alert");
//   let enterOTP = document.getElementById("enterOTP");
//   const verifyOTP = document.getElementById("verifyOTPbtn");
//   const Loader = document.getElementById("Loader1");
//   const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
//   if (!emailRegex.test(emailValue)) {
//     errorbox.style.display = "block";
//     errorbox.innerText = "Enter your correct email";
//     errorbox.style.color = "red";
//   }
//   if (emailValue.length == 0) {
//     errorbox.style.display = "block";
//     errorbox.style.color = "red";
//     errorbox.innerText = "This filled is required";
//   }
//   if (emailRegex.test(emailValue) && emailValue.length != 0) {
//     const email = document.getElementById("email");
//     const emailValue = email.value.trim();
//     const signup = await window.electron.forget(emailValue);
//   if(!signup.success){
//     Loader.style.display = "block";
//     const response = await window.electron.sendOTP(emailValue);
//     document.getElementById("result").innerText = response.message;
//     email.disabled = true;
//     document.getElementById("result").style.color = "green";
//     Loader.style.display = "none";
//     enterOTP.style.display = "block";
//     verifyOTP.style.display = "block";
//     sendOTPbtn.style.display = "none";
//     errorbox.style.display = "none";
//     email.disabled = true;
//   }
//   if (signup.success) {
//     errorbox.style.display = "block";
//     errorbox.style.color = "red";
//     errorbox.innerText = "This email is already used";
//     return;
//   }
//   }
// }
// async function verifyOTP() {
//   const otp = document.getElementById("enterOTP").value;
//   const createpassword = document.getElementById("create-password");
//   const enterOTP = document.getElementById("enterOTP");
//   const result = document.getElementById("result");
//   const verifyOTPbtn = document.getElementById("verifyOTPbtn");
//   const passwordInput = document.getElementById("password");
//   const error1 = document.getElementById("error1");
//   const error2 = document.getElementById("error2");
//   const error3 = document.getElementById("error3");
//   const error4 = document.getElementById("error4");
//   const password_matching = document.getElementById("password-matching");
//   const confirmPasswordInput = document.getElementById("confirm-password");
//   const confirmPassword = document.getElementById("create-password");
//   let emailValue = document.getElementById("email").value;
//   const response = await window.electron.verifyOTP(emailValue, otp);
//   document.getElementById("result").innerText = response.message;
//   let answer = document.getElementById("result");

//   answer.innerText = response.message;

//   if (response.message === "Invalid OTP") {
//     answer.style.color = "red";
//   }
//   const password_alert = document.getElementById("password-alert");
//   if (response.success) {

//     enterOTP.style.display = "none";
//     verifyOTPbtn.style.display = "none";
//     result.style.display = "none";
//     sendOTPbtn.style.display = "none";

//     password_alert.style.display = "block";
//     passwordInput.style.display = "block";
//     confirmPasswordInput.style.display = "block";
//     createpassword.style.display = "block";

//     // LIVE PASSWORD CHECK
//     passwordInput.addEventListener("input", () => {

//       if (passwordInput.value.length >= 8 && passwordInput.value.length <= 15) {
//         error1.style.color = "green";
//       } else {
//         error1.style.color = "red";
//       }

//       const CapSmalRegX = /^(?=.*[a-z])(?=.*[A-Z]).+$/;
//       if (CapSmalRegX.test(passwordInput.value)) {
//         error2.style.color = "green";
//       } else {
//         error2.style.color = "red";
//       }

//       const numRegX = /^(?=.*[0-9]).+$/;
//       if (numRegX.test(passwordInput.value)) {
//         error3.style.color = "green";
//       } else {
//         error3.style.color = "red";
//       }

//       const charRegX = /^(?=.*[!@#$%^&*()_+]).+$/;
//       if (charRegX.test(passwordInput.value)) {
//         error4.style.color = "green";
//       } else {
//         error4.style.color = "red";
//       }

//       if (confirmPasswordInput.value != "") {
//         if (confirmPasswordInput.value == passwordInput.value) {
//           confirmPasswordInput.style.borderColor = "green";
//           password_matching.style.display = "block";
//           password_matching.innerText = "Password is match";
//           password_matching.style.color = "green";

//         } else {
//           confirmPasswordInput.style.borderColor = "red";
//           password_matching.style.display = "block";
//           password_matching.innerText = "Password is not match";
//           password_matching.style.color = "red";
//         }
//       }

//       if (confirmPasswordInput.value == "" && passwordInput.value == "") {
//         password_matching.style.display = "none";
//       }
//     });
//   }

//   confirmPasswordInput.addEventListener("input", () => {
//     if (confirmPasswordInput.value == passwordInput.value) {

//       password_matching.style.display = "block";
//       confirmPasswordInput.style.borderColor = "green";
//       password_matching.innerText = "Password is match";
//       password_matching.style.color = "green";
//     } else {
//       confirmPasswordInput.style.borderColor = "red";
//       password_matching.style.display = "block";
//       password_matching.innerText = "Password is not match";
//       password_matching.style.color = "red";
//     }

//     if (confirmPasswordInput.value == "" && passwordInput.value == "") {
//       password_matching.style.display = "none";
//     }
//   });
// }
// //popup for sign_up//
// document.addEventListener("DOMContentLoaded", () => {
// let createpassword_ = document.querySelector("#create-password");
// // Error part
// createpassword_.addEventListener("click", async() => {

//     let emailValue = document.getElementById("email").value;
//     let passwordInput = document.getElementById("password");
//     let confirmPasswordInput = document.getElementById("confirm-password");

//     if (
//         passwordInput.value === confirmPasswordInput.value &&
//         error1.style.color === "green" &&
//         error2.style.color === "green" &&
//         error3.style.color === "green" &&
//         error4.style.color === "green"
//     ) {

//       let result =  await window.electron.sign_up(emailValue, passwordInput.value);
//          if (result.success) {
//             document.querySelector(".insert_item_successfully_popup").style.display = "flex";
//         }
//     }

// });
// });
// /////////////// Login.html //////////////////
// document.addEventListener("DOMContentLoaded", () => {
//   const loginBtn = document.querySelector("#user-login");

//   if (loginBtn) {
//     loginBtn.addEventListener("click", async () => {
//       let email1 = document.querySelector("#email_1").value;
//       let password_1 = document.querySelector("#password_1").value;

//       const result = await window.electron.login(email1, password_1);

//       if (result.success) {
//          document.querySelector(".insert_item_successfully_popup").style.display ="flex";
//       }

//       const closeBtn = document.querySelector(".close");
// closeBtn.addEventListener("click", () => {
//   window.location.href = "index1.html";
// });

//       console.log(result);
//     });
//   }
// });
///////////// Forget password ///////////////
// document.querySelector("#forget").addEventListener("click", async () => {
//   let email = document.querySelector("#email").value;
//   let errorbox = document.getElementById("alert");

//   const emailRegex =
//     /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

//   if (email.length === 0) {
//     errorbox.style.display = "block";
//     errorbox.style.color = "red";
//     errorbox.innerText = "This field is required";
//     return;
//   }

//   if (!emailRegex.test(email)) {
//     errorbox.style.display = "block";
//     errorbox.style.color = "red";
//     errorbox.innerText = "Enter your correct email";
//     return;
//   }

//   const result = await window.electron.forget(email);

//   if (!result.success) {
//     errorbox.style.display = "block";
//     errorbox.style.color = "red";
//     errorbox.innerText = "Email not found";
//     return;
//   }

//   // Email exists → send OTP
//   const response = await window.electron.sendOTP(email);

//   document.getElementById("result").innerText = response.message;
//   document.getElementById("result").style.color = "green";
// });




















function closePopup() {
  document.getElementById("sign_up").style.display = "none";
}
//Home page
function manubar() {
  let list = document.getElementById("list");
  list.classList.toggle("active");
}
function Cancel(ClassName){
  document.querySelector(ClassName).style.display = "none";
  location.reload();
}
window.addEventListener("DOMContentLoaded", async () => {
  if (!user_Identify) {
    window.location.href = "login.html";
}
  try {
    console.log("User:", user_Identify);

    const [
      tableResponse,
      orderResponse,
      staffResponse,
      result,
      orderID,
      topItems,
    ] = await Promise.all([
      window.electron.total_tables(user_Identify),
      window.electron.Active_order(user_Identify),
      window.electron.staff_count(user_Identify),
      window.electron.Today_Sales(user_Identify),
      window.electron.orderID(user_Identify),
      window.electron.topItems(user_Identify),
    ]);

    // =========================
    // TODAY SALES
    // =========================
    if (result?.success) {
      document.querySelector("#today_sales").innerText = `₹${result.totalSales}`;
      document.querySelector("#sales_progress").innerText = result.totalSales;
    }

    // =========================
    // STAFF COUNT
    // =========================
    if (staffResponse?.success) {
      document.querySelector("#staff_count").innerText =
        staffResponse.total_staff;
    }

    // =========================
    // TOTAL TABLES
    // =========================
    if (tableResponse?.success) {
      document.querySelector("#total_tables").innerText =
        tableResponse.total_tables;
    }

    // =========================
    // ACTIVE ORDERS
    // =========================
    if (orderResponse?.success) {
      document.querySelector("#active_orders").innerText =
        orderResponse.total_orders;
    }

    // =========================
    // RECENT ORDERS (TOP 3)
    // =========================
    if (orderID?.success && orderID.data?.length > 0) {
      document.querySelector("#ordersTable").innerHTML =
        orderID.data
          .slice(0, 3)
          .map((order) => {
            return `
              <tr>
                <td>#${order.order_id}</td>
                <td>${order.table_id ?? "N/A"}</td>
              </tr>
            `;
          })
          .join("");
    } else {
      document.querySelector("#ordersTable").innerHTML =
        `<tr><td colspan="2">No Orders Found</td></tr>`;
    }

    // =========================
    // TOP DISHES (TOP 5 ITEMS)
    // =========================
    if (topItems?.success && topItems.data?.length > 0) {
  document.querySelector(".dish_list").innerHTML =
    topItems.data
      .map((item) => {
        return `
        <li>
   ${item.item}
  <span>
    ₹${item.price}
  </span>
</li>
        `;
      })
      .join("");
} else {
  document.querySelector(".dish_list").innerHTML =
    `<li>No Data Found</li>`;
}

  } catch (error) {
    console.error("Dashboard error:", error);
  }
  const sales = Number(document.getElementById("sales_progress").textContent);


const maxSales = 5000;

const percentage = Math.min((sales / maxSales) * 100, 100);

document.querySelector(".progress_fill").style.width = `${percentage}%`;
});


document.addEventListener("click", async (e) => {
  if (e.target.classList.contains("table_btn_delete__")) {

    const tableId = e.target.dataset.id;

    const result = await window.electron.deleteTable(
      tableId,
      user_Identify
    );

    if (result.success) {
      e.target.closest("tr").remove();
    } else {
      alert(result.message);
    }
  }
});
