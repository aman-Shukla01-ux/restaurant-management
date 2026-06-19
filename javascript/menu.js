//Menu.html 

// start category list
// select elements first
let user_Identify = localStorage.getItem("userEmail");
const categoryList = document.querySelector("#categoryList");
// start category list
document.getElementById("Category_name").addEventListener("click", async () => {
  const categoryItems = await window.electron.Category_name(user_Identify);
  console.log(categoryItems);
  categoryList.innerHTML = "";

  console.log(categoryItems);

  categoryItems.forEach(item => {
    categoryList.innerHTML += `
      <tr>
        <td>
          <button class="category-name" data-item="${item.category_id}">
            ${item.category_name}
          </button>
        </td>
      </tr>`;
  });

  list = document.getElementById("list");
  list.classList.toggle("active");
});


// click on category
categoryList.addEventListener("click", async (e) => {

  const categoryEl = e.target.closest(".category-name");

  if (!categoryEl) return;

  const varClickedData = categoryEl.dataset.item;

  console.log(varClickedData, user_Identify);

  try {
    const items = await window.electron.Food_item(varClickedData, user_Identify);

    if (!items || !Array.isArray(items)) {
      console.log("No items found");
      return;
    }

    let html = "";

    items.forEach(item => {
      html += `
        <tr>
          <td class="item-name">${item.item}</td>
          <td class="price">${item.price}</td>
          <td>
            <button class="btn_edit">Edit</button>
            <button class="btn_delete" data-item="${item.item}">Delete</button>
          </td>
        </tr>`;
    });

    output.innerHTML = html;
    document.querySelector(".overlay").style.display = "flex";
list.classList.remove("active");
  } catch (error) {
    console.error("Error fetching food items:", error);
  }
});
// // this backend for hide and show popup 
// // which is include add itam and show item  
function Add_item() {
  document.querySelector(".popup-overlay").style.display = "flex";
  // document.querySelector(".overlay").style.display = "flex";
  // document.querySelector(".popup").style.display = "flex";
}
function hide_popup(className,show) {
  if(show ==='show'){
    document.querySelector(className).style.display = "flex";
  }
  else{
  document.querySelector(className).style.display = "none";
  }

  

}
function close_btn() {
  document.querySelector(".overlay").style.display = "none";
}
// function Edit_icon(){
//   document.querySelector(".overlay").style.display = "flex";
// }
function hide_insert_item_successfully_popup() {
    document.querySelector(".table_btn_delete_").style.display = "none";
  document.querySelector(".insert_item_successfully_popup").style.display = "none";
  document.querySelector(".Delete_popup").style.display = "none";
}
function Cancel() {
  document.querySelector(".table_btn_delete_").style.display = "none";
  document.querySelector(".Delete_popup").style.display = "none";
}
// // Data Fetch accourding to category //
// window.addEventListener("DOMContentLoaded", () => {

output = document.getElementById("output");
var old_Food;
output.addEventListener("click", async (e) => {
  const row = e.target.closest("tr");
  if (!row) return;
  const item_name = row.querySelector(".item-name");
  const price = row.querySelector(".price");
  /* DELETE */
  if (e.target.classList.contains("btn_delete")) {
    const itemName = e.target.dataset.item;
    document.querySelector(".Delete_popup").style.display = "flex";
    document.querySelector("#yes").onclick = async () => {
     let result =  await window.electron.Delete(itemName);
     console.log(result);
      row.remove();
      document.querySelector(".Delete_popup").style.display = "none";
    };
  }

  /* EDIT */
  else if (e.target.classList.contains("btn_edit")) {
    let row = e.target.closest("tr");
    item_name.innerHTML = `<input class="new_value1" value="${item_name.textContent}">`;
    price.innerHTML = `<input class="new_value2" value="${price.textContent}">`;

    var Food_item = row.querySelector(".new_value1").value;
    var Food_price = row.querySelector(".new_value2").value;
    old_Food = Food_item;
    e.target.textContent = "Save";
    e.target.classList.replace("btn_edit", "btn_save");
  }

  /* SAVE */
  else if (e.target.classList.contains("btn_save")) {
    var new_Food = row.querySelector(".new_value1").value;
    var Food_price = row.querySelector(".new_value2").value;
    console.log(new_Food, old_Food, Food_price);
    let final = await window.electron.save(new_Food, old_Food, Food_price,user_Identify);
    console.log(final);
    item_name.textContent = new_Food;
    price.textContent = Food_price;
    e.target.textContent = "Edit";
    e.target.classList.replace("btn_save", "btn_edit");
  }

});
// Edit Category Features
window.addEventListener("DOMContentLoaded", () => {

  const btn = document.querySelector("#Edit_Category_btn");

  if (!btn) return;

  btn.addEventListener("click", () => {
    window.location = "Edit_Category.html";
  });

});

// //  using it we +ADD item
window.addEventListener("DOMContentLoaded", async () => {

  const categorySelect = document.getElementById("category_id");
  const itemInput = document.getElementById("Insert_Item");
  const priceInput = document.getElementById("Enter_Price");
  const submitBtn = document.getElementById("submit");

  if (!categorySelect || !itemInput || !priceInput || !submitBtn) {
    console.log("Some elements are missing in HTML");
    return;
  }

  const categories = await window.electron.fetch_cat(user_Identify);

  console.log(categories);

  categorySelect.innerHTML = `<option value="">Select category</option>`;

  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat.category_id;
    option.textContent = cat.category_name;
    categorySelect.appendChild(option);
  });

  submitBtn.addEventListener("click", async () => {

    const item = itemInput.value.trim();
    const price = Number(priceInput.value);
    const categoryId = categorySelect.value;

    if (!item || !price || !categoryId) {
      alert("Please fill all fields");
      return;
    }

    console.log(item, price, categoryId);

    let pk = await window.electron.invoke(
      "insert_menu",
      item,
      price,
      categoryId,
      user_Identify
    );

    console.log(pk);

    document.querySelector(".insert_item_successfully_popup").style.display = "block";

    refresh();

  });

});
function Cancel(ClassName){
  document.querySelector(ClassName).style.display = "none"
  location
}
function refresh() {
  document.getElementById("category_id").value = "";
  document.getElementById("Insert_Item").value = "";
  document.getElementById("Enter_Price").value = "";
  // itemInput.focus();
}

