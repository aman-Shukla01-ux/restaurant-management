//index.html->page
//////////////////////////////////////////////
// SINGLE CLICK LISTENER (VERY IMPORTANT)
//////////////////////////////////////////////

document.addEventListener("click", async (e) => {

  // ================= TABLE OPEN =================
  if (e.target.id === "Tables") {
    document.querySelector(".overlay").style.display = "flex";

    const Table_Status = await window.electron.Table_Status();

    output.innerHTML = "";

    Table_Status.forEach(item => {
      output.innerHTML += `
        <tr data-id="${item.table_id}">
          <td class="table_id">${item.table_id}</td>
          <td class="table_Status">${item.status}</td>
          <td>
            <button class="bt_edit">Edit</button>
            <button class="table_btn_delete" data-id="${item.table_id}">Delete</button>
          </td>
        </tr>`;
    });
  }

  // ================= EDIT TABLE =================
  else if (e.target.classList.contains("bt_edit")) {
    const btn = e.target;
    const row = btn.closest("tr");

    const table_status = row.querySelector(".table_Status");
    const currentValue = table_status.textContent.trim();

    // dropdown instead of input (better for ENUM)
    table_status.innerHTML = `
      <select class="new_value2">
        <option value="AV" ${currentValue === "AV" ? "selected" : ""}>AV</option>
        <option value="NA" ${currentValue === "NA" ? "selected" : ""}>NA</option>
      </select>
    `;

    btn.textContent = "Save";
    btn.classList.replace("bt_edit", "bt_save");
  }

  // ================= SAVE TABLE =================
  else if (e.target.classList.contains("bt_save")) {
    const btn = e.target;
    const row = btn.closest("tr");

    const table_id = row.dataset.id;
    const newStatus = row.querySelector(".new_value2").value;

    // update DB
    await window.electron.update_Table_Status(table_id, newStatus);

    // update UI
    const statusCell = row.querySelector(".table_Status");
    statusCell.textContent = newStatus;

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
    let status = document.getElementById("table_Availbility").value;

    await window.electron.insert_table(status);

    document.querySelector(".insert_item_successfully_popup").style.display = "block";
  }
  // =============== CHECK ORDER HISTORY===============
   else if (e.target.id === "Order_history") {

  let response = await window.electron.Order_history();

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
        <tr>
          <td class="order_id">${order.order_id}</td>

          <td class="table_id">${order.table_id}</td>

          <td class="order_time">${formattedDate}</td>

          <td class="item_name">${order.item_name}</td>

          <td class="category">${order.Category_Name}</td>

          <td class="quantity">${order.quantity}</td>

          <td class="price">₹${order.item_total * order.quantity} </td>
        </tr>
      `;

    });
  } else {

    Orders.innerHTML = `
      <tr>
        <td colspan="7">
          ${response.message}
        </td>
      </tr>
    `;

  }
  document.querySelector(".order_").style.display = "flex";
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