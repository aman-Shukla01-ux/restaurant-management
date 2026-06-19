let itemsData = [];
let orders = [];

let user_Identify = localStorage.getItem("userEmail");

// ===== OPEN POPUP =====
document.addEventListener("click", async (e) => {

  if (e.target.id === "Add_order") {

    document.querySelector(".popup-overlay").style.display = "flex";

    const Table_Status = await window.electron.Table_Status(user_Identify);
    const categoryItems = await window.electron.Category_name(user_Identify);

    const select = document.getElementById("Order");
    const category = document.querySelector(".category_id");
    const itemSelect = document.querySelector(".item_id");

    // Reset
    select.innerHTML = `<option value="">Select table</option>`;
    category.innerHTML = `<option value="">Select category</option>`;
    itemSelect.innerHTML = `<option value="">Select item</option>`;

    // Tables
    Table_Status.forEach(item => {
      const option = document.createElement("option");
      option.value = item.table_id;
      option.textContent = `Table ${item.table_id} (${item.status})`;
      select.appendChild(option);
    });

    // Categories
    categoryItems.forEach(item => {
      const option = document.createElement("option");
      option.value = item.category_id;
      option.textContent = item.category_name;
      category.appendChild(option);
    });

    // Load first category items automatically
    if (e.target.classList.contains("category_id")) {

    const categoryId = e.target.value;

    if (!categoryId) return;

    const items = await window.electron.Food_item(
        categoryId,
        user_Identify
    );

    itemsData = items;

    const itemSelect = document.querySelector(".item_id");

    itemSelect.innerHTML = `<option value="">Select item</option>`;

    items.forEach(item => {

        const option = document.createElement("option");
        option.value = item.menu_id;
        option.textContent = item.item;

        itemSelect.appendChild(option);

    });
}


  }
});


// ===== CATEGORY CHANGE =====
document.addEventListener("change", async (e) => {

  if (e.target.classList.contains("category_id")) {

    const categoryId = e.target.value;

    const items = await window.electron.Food_item(
      categoryId,
      user_Identify
    );
console.log(items);
    itemsData = items;

    const itemSelect = document.querySelector(".item_id");

    itemSelect.innerHTML = `<option value="">Select item</option>`;

    items.forEach(item => {

      const option = document.createElement("option");

      option.value = item.menu_id;
      option.textContent = item.item;

      itemSelect.appendChild(option);

    });

  }



  // ===== ITEM CHANGE =====
 // ===== ITEM CHANGE =====
if (e.target.classList.contains("item_id")) {

    const selectedMenuId = e.target.value;

    console.log("Selected ID:", selectedMenuId);
    console.log("itemsData:", itemsData);

    const foundItem = itemsData.find(item =>
        String(item.menu_id) === String(selectedMenuId)
    );

    console.log("Found Item:", foundItem);

    const row = e.target.closest(".item-row");

    if (!row) return;

    const priceInput = row.querySelector(".price");

    if (foundItem) {

        priceInput.value = foundItem.price;

    } else {

        priceInput.value = "";

        console.log("No matching item found");

    }

}









  // ===== QUANTITY CHANGE =====
  if (e.target.classList.contains("quantity")) {

    const row = e.target.closest(".item-row");

    const qty = parseInt(row.querySelector(".quantity").value) || 0;
    const price = parseFloat(row.querySelector(".price").value) || 0;

    const total = qty * price;

    const totalInput = row.querySelector(".total");

    if (totalInput) {
      totalInput.value = total;
    }
  }
});

// ===== ADD ITEM BUTTON =====
async function addMoreItem(place_item) {

  // ===== SHOW ORDER =====
  if (place_item === "order") {

    document.querySelector(".overlay").style.display = "flex";

    let show_order = await window.electron.show_order(user_Identify);

    console.log("show", show_order);

    output.innerHTML = "";

    show_order.forEach(order => {

  order.order_items.forEach(item => {

    output.innerHTML += `
      <tr data-id="${order.order_id}">

        <td class="table_id">${order.table_id}</td>

        <td class="order_id">${order.order_id}</td>

        <td class="item_">${item.menu?.item}</td>

        <td class="quantity">${item.quantity}</td>

        <td class="price">${item.quantity * item.price}</td>

        <td>
          <button class="edit" onclick="edit(this)">
            Edit
          </button>

          <button 
            class="table_btn_delete" 
            data-id="${order.order_id}">
            Delete
          </button>
        </td>

      </tr>
    `;
  });

});

    return;
  }

  // ===== ROW =====
  const row = document.querySelector(".item-row");

  // ===== ELEMENTS =====
  const tableSelect = document.getElementById("Order");

  const categorySelect = row.querySelector(".category_id");

  const itemSelect = row.querySelector(".item_id");

  const quantityInput = row.querySelector(".quantity");

  const priceInput = row.querySelector(".price");

  const totalInput = row.querySelector(".total");

  // ===== VALUES =====
  const tableIdValue = tableSelect.value;

  const menu_Id = itemSelect.value;

  const itemValue =
    itemSelect.options[itemSelect.selectedIndex]?.text || "";

  const categoryValue =
    categorySelect.options[categorySelect.selectedIndex]?.text || "";

  const quantityValue = quantityInput.value;

  const priceValueFinal = priceInput.value;

  const totalValueFinal =
    totalInput?.value || (quantityValue * priceValueFinal);

  // ===== VALIDATION =====
  if (
    menu_Id === "" ||
    quantityValue === "" ||
    priceValueFinal === ""
  ) {

    alert("Please fill all fields");

    return;
  }

  // ===== STORE ARRAY =====
  orders.push({
    menu_id: menu_Id,
    item: itemValue,
    table_id: tableIdValue,
    qty: quantityValue,
    price: priceValueFinal,
    total: totalValueFinal
  });

  console.log("Orders Array:", orders);

  // ===== UI BOX =====
  const savedBox = document.getElementById("savedBox");

  const box = document.createElement("div");

  box.classList.add("saved-item");

  box.innerHTML = `
    <span>${categoryValue}</span>
    <span>${itemValue}</span>
    <span>Qty: ${quantityValue}</span>
    <span>Total: ${totalValueFinal}</span>
    <button onclick="this.parentElement.remove()">❌</button>
  `;

  savedBox.appendChild(box);

  // ===== RESET =====
  categorySelect.value = "";

  itemSelect.innerHTML =
    `<option value="">Select item</option>`;

  priceInput.value = "";

  quantityInput.value = "";

  if (totalInput) {
    totalInput.value = "";
  }

  // ===== PLACE ORDER =====
 if (place_item === "place_order") {

  let place_Order =
    await window.electron.place_Order_item(
      orders,
      user_Identify
    );

  if (place_Order.success) {

    orders.forEach(item => {
      item.order_id = place_Order.order_id;
    });

    await window.electron.place_Order_history(
      orders,
      user_Identify
    );
  }

  document.querySelector(
    ".insert_item_successfully_popup"
  ).style.display = "flex";
}

}
document.querySelector(".close").addEventListener("click",()=>{
  location.reload();
})
async function edit(btn) {

  const row = btn.closest("tr");

  const table_id = row.querySelector(".table_id");
  const order_id = row.querySelector(".order_id");
  const quantity = row.querySelector(".quantity");
  const price = row.querySelector(".price");

  if (btn.innerText === "Edit") {

    row.dataset.oldOrderId = order_id.innerText.trim();

    table_id.innerHTML =
      `<input type="number" value="${table_id.innerText.trim()}">`;

    quantity.innerHTML =
      `<input type="number" value="${quantity.innerText.trim()}">`;

    btn.innerText = "Save";

  }

  else if (btn.innerText === "Save") {

    const newTable =
      table_id.querySelector("input").value;

    const newQuantity =
      quantity.querySelector("input").value;

    const orderId =
      row.dataset.oldOrderId;

    const result =
      await window.electron.edit_order(
        newTable,
        newQuantity,
        orderId
      );

    if (result.success) {

      table_id.innerText = newTable;
      quantity.innerText = newQuantity;

      // Auto update total price
      price.innerText = result.totalPrice;

      btn.innerText = "Edit";

    } else {

      alert(result.message);

    }
  }
}

document.addEventListener("click", async (e) => {

  if (e.target.classList.contains("table_btn_delete")) {

    const table_id = e.target.dataset.id;
    console.log(table_id);
    const row = e.target.closest("tr");

    document.querySelector(".Delete_popup").style.display = "flex";

    document.querySelector("#yes").onclick = async () => {

      await window.electron.Delete_table(table_id);

      row.remove();

      document.querySelector(".Delete_popup").style.display = "none";
    };
  }
});
function Cancel(ClassName){
  document.querySelector(ClassName).style.display = "none"
}
