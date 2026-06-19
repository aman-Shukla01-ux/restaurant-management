let user_Identify = localStorage.getItem("userEmail");
document.addEventListener("click", async (e) => {
  if (e.target.id === "Edit_Category") {
    const categoryItems = await window.electron.Category_name(user_Identify);
    console.log(categoryItems);
    output.innerHTML = "";
    categoryItems.forEach(item => {
      output.innerHTML += `
        <tr>
        <td class="item-category" data-name="${item.category_name}">
        ${item.category_name}
        </td>
        <td>
            <button class="btn_edit">Edit</button>
            <button class="btn_delete" data-id="${item.category_id}">Delete</button>
          </td>
        </tr>`;
    });

    document.querySelector(".overlay").style.display = "flex";
  }
  else if (e.target.id == "Submit") {
    let category = document.getElementById("Insert_Item").value;
    console.log(category);
    const insert_category = await window.electron.insert_category(category,user_Identify);
    
    document.querySelector(".insert_item_successfully_popup").style.display = "block";
      category.value ="";
  }
  else if (e.target.classList.contains("btn_edit")) {
    console.log("inside of if");
    let row = e.target.closest("tr");
    var Category_name = row.querySelector(".item-category");
    let currentValue = Category_name.innerText.trim();
    Category_name.innerHTML = `<input class="new_value1" value="${currentValue}">`;
    e.target.textContent = "Save";
    e.target.classList.replace("btn_edit", "btn_save");
  }
  else if (e.target.classList.contains("btn_save")) {
    let row = e.target.closest("tr");
    let Category_name = row.querySelector(".item-category");
    let old_category = Category_name.dataset.name;
    let new_category = row.querySelector(".new_value1").value;
    const categoryItems = await window.electron.Update_Category(new_category, old_category,user_Identify);
    Category_name.innerHTML = new_category;
    Category_name.dataset.name = new_category;
  e.target.textContent = "Edit";
  e.target.classList.replace("btn_save", "btn_edit");

  }
  else if (e.target.classList.contains("btn_delete")) {

    const Category_name = e.target.dataset.item;
    let Category_id = e.target.dataset.id;
    // ✅ FIX: get the row
    const row = e.target.closest("tr");

    console.log(Category_id);

    document.querySelector(".Delete_popup").style.display = "flex";
    document.querySelector("#Delete").onclick = async () => {
      document.querySelector("#Delete_show").innerText = "Are you sure want to delete this item";
      console.log("btn clicked");
      let value = await window.electron.DeleteCategory(Category_id);
      if(value.success){
            document.querySelector(".Delete_popup").style.display = "none";
      }
      console.log(value);
      if (value.message !== "Category has items, delete them first") {
        row.remove();
      }
      else {
        document.querySelector("#Delete_show").innerText = value.message;
        document.querySelector("#Delete_show").style.color = "red";
      }

    };
  }
  else if(e.target.id === "Add_Category"){
    console.log("work now");
    document.querySelector(".popup-overlay").style.display ="flex";
  }
});
// //  using it we +ADD item
function Cancel(ClassName){
  document.querySelector(ClassName).style.display = "none"
}
function refresh() {
  document.getElementById("category_id").value = "";
  document.getElementById("Insert_Item").value = "";
  document.getElementById("Enter_Price").value = "";
  // itemInput.focus();
}
