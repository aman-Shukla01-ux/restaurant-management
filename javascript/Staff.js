
// ================= GLOBAL VARIABLE =================
let lastClickedRoleId = null;
let user_Identify = localStorage.getItem("userEmail");


// ================= LOAD STAFF FUNCTION =================
async function loadStaffByRole(roleId) {

  const output = document.querySelector("#output");

  const items = await window.electron.Staff_information(roleId,user_Identify);

  console.log(items);

  output.innerHTML = "";

  items.forEach(item => {

    output.innerHTML += `
      <tr>

        <td class="item-name">
          ${item.employee_id}
        </td>

        <td class="price">
          ${item.employee_name}
        </td>

        <td class="item-name">
          ${item.salary}
        </td>

        <td class="item-name">
          ${item.shift}
        </td>

        <td>
          click here
        </td>

        <td>

          <button class="btn_edit1">
            Edit
          </button>

          <button 
            class="btn_delete1"
            data-item="${item.employee_name}">

            Delete

          </button>

        </td>

      </tr>
    `;

  });

  document.querySelector(".overlay").style.display = "flex";

}



// ================= ROLE BUTTON CLICK =================
document.getElementById("Role").addEventListener("click", async () => {

  const categoryItems = await window.electron.Role();

  console.log(categoryItems);

  const categoryList = document.querySelector("#categoryList");

  categoryList.innerHTML = "";

  categoryItems.forEach(item => {

    categoryList.innerHTML += `
      <tr>

        <td>

          <button 
            class="category-name"
            data-item="${item.role_id}">

            ${item.role_name}

          </button>

        </td>
      </tr>      
    `;

  });
  document.getElementById("list1").classList.toggle("active");

});



// ================= CATEGORY CLICK =================
const categoryList1 = document.querySelector("#categoryList");

categoryList1.addEventListener("click", async (e) => {

  const categoryButton = e.target.closest(".category-name");

  if (!categoryButton) return;

  const varClickedData = categoryButton.dataset.item;

  console.log("Clicked Role Id:", varClickedData);

  // save selected role
  lastClickedRoleId = varClickedData;

  // load staff
  loadStaffByRole(varClickedData);

});



// ================= ALL BUTTON EVENTS =================
document.addEventListener("click", async (e) => {

  // =====================================================
  // ================= DELETE STAFF ======================
  // =====================================================
  const deleteButton = e.target.closest(".btn_delete1");

  if (deleteButton) {

    const deleteData = deleteButton.dataset.item;

    await window.electron.delete_Staff(deleteData);

    console.log("Deleted Successfully");

    // auto refresh
    if (lastClickedRoleId) {
      loadStaffByRole(lastClickedRoleId);
    }


    return;
  }



  // =====================================================
  // ================= EDIT MODE =========================
  // =====================================================
  const editButton = e.target.closest(".btn_edit1");

  if (editButton) {

    const row = editButton.closest("tr");

    const cells = row.querySelectorAll("td");

    const name = cells[1].innerText;

    const salary = cells[2].innerText;

    const shift = cells[3].innerText;

    // convert text into input
    cells[1].innerHTML = `
      <input class="edit_name" value="${name}">
    `;

    cells[2].innerHTML = `
      <input class="edit_salary" value="${salary}">
    `;

    cells[3].innerHTML = `
      <input class="edit_shift" value="${shift}">
    `;

    // button change
    editButton.innerText = "Save";

    editButton.classList.remove("btn_edit1");

    editButton.classList.add("btn_save");

    return;
  }



  // =====================================================
  // ================= SAVE UPDATE =======================
  // =====================================================
  const saveButton = e.target.closest(".btn_save");

  if (saveButton) {

    const row = saveButton.closest("tr");

    const id = row.querySelector("td").innerText;

    const name = row.querySelector(".edit_name").value;

    const salary = row.querySelector(".edit_salary").value;

    const shift = row.querySelector(".edit_shift").value;

    await window.electron.update_Staff({
      id,
      name,
      salary,
      shift
    });

    console.log("Updated successfully");

    // auto refresh
    if (lastClickedRoleId) {
      loadStaffByRole(lastClickedRoleId);
    }

    return;
  }
  else if(e.target.id === "Add_Staff"){
    document.querySelector(".popup-overlay").style.display = "flex";
     const categoryItems = await window.electron.Role();
     console.log(categoryItems);
     let select = document.querySelector("#category_id");
     select.innerHTML = "";
categoryItems.forEach(item => {

  // table buttons
  select.innerHTML += `
    <tr>
      <td>
        <button 
          class="category-name"
          data-item="${item.role_id}">
          ${item.role_name}
        </button>
      </td>
    </tr>
  `;

  // dropdown options
  select.innerHTML += `
    <option value="${item.role_id}">
      ${item.role_name}
    </option>
  `;
});

  }

});
 document.querySelector("#submit").addEventListener("click", async () => {
  let data = {
    role_id: document.querySelector("#category_id").value,
    employee_name: document.querySelector("#Enter_Employee").value,
    salary: document.querySelector("#Enter_Salary").value,
    shift: document.querySelector("#Enter_Shift").value
  };

  let result = await window.electron.saveEmployee(data,user_Identify);
console.log(result);
  if(result.success){
    document.querySelector(".insert_item_successfully_popup").style.display="block";
  }

});
function Cancel(ClassName){
  document.querySelector(ClassName).style.display = "none"
}