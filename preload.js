
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electron", {
  //Sign_up
  sign_up: (emailValue, passwordValue) =>
    ipcRenderer.invoke("sign_up", emailValue, passwordValue),
  //forget password//
  forget:(email) => ipcRenderer.invoke("forget",email),
  //forget passsword //
  forget_password:(emailValue,passwordInput)=> ipcRenderer.invoke("forget_password",emailValue,passwordInput),
//login //
login: (email1, password_1) =>
    ipcRenderer.invoke("login", email1, password_1),
  // OTP
  sendOTP: (email) => ipcRenderer.invoke("send-otp", email),
  verifyOTP: (email, otp) => ipcRenderer.invoke("verifyOTP", email, otp),
  // CATEGORY
  fetch_cat: (user_Identify) => ipcRenderer.invoke("fetch_cat",user_Identify),
  insert_category: (category_name, category_id) =>
    ipcRenderer.invoke("insert_category", category_name, category_id),
  delete_category: () => ipcRenderer.invoke("delete_category"),
  category_Delete: (select) =>
    ipcRenderer.invoke("category_Delete", select),
  update_category_name: (item_value, updated_name) =>
    ipcRenderer.invoke("update_category_name", item_value, updated_name),
//Delete Category name
DeleteCategory: (Category_id) =>
    ipcRenderer.invoke("DeleteCategory",Category_id),
//Update Category_name
Update_Category: (new_category,old_category,user_Identify) =>
    ipcRenderer.invoke("Update_Category",new_category,old_category,user_Identify),

//insert Category
insert_menu:(item,price,categoryId,user_Identify)=>
  ipcRenderer.invoke("insert_menu",item,price,categoryId,user_Identify),
//insert item//
insert_category:(category,user_Identify)=>
  ipcRenderer.invoke("insert_category",category,user_Identify),
  // MENU TYPES
  Category_name: (user_Identify)=> ipcRenderer.invoke("Category_name",user_Identify),
  // ITEMS
  fetch_all_items: () => ipcRenderer.invoke("fetch_all_items"),
  delete_item: (id) => ipcRenderer.invoke("delete_item", id),
  update_menu_item: (id, item, price) =>
    ipcRenderer.invoke("update_menu_item", id, item, price),
  
  Delete: (Item) => ipcRenderer.invoke("Delete", Item),
  Update_Item: () => ipcRenderer.invoke("Update_Item"),
  update: (item_value, updated_name, updated_price) =>
    ipcRenderer.invoke("update", item_value, updated_name, updated_price),
  save: (new_Food,old_Food,Food_price,user_Identify) =>
    ipcRenderer.invoke("save",new_Food,old_Food,Food_price,user_Identify),
  //fetch food data //
    Food_item: (varClickedData,user_Identify) => ipcRenderer.invoke("Food_item",varClickedData,user_Identify),
    //Insert-item
//fetch item ////
Item :(user_Identify,catId) => ipcRenderer.invoke("Item",user_Identify,catId),
   /////////////////////////////////////////////////////////////////
                   //index.html->page//
Table_Status:(user_Identify)=>ipcRenderer.invoke("Table_Status",user_Identify),
total_tables:(user_Identify)=>ipcRenderer.invoke("total_tables",user_Identify),
Active_order:(user_Identify)=>ipcRenderer.invoke("Active_order",user_Identify),
staff_count: (user_Identify) => ipcRenderer.invoke("staff_count", user_Identify),
Today_Sales:(user_Identify)=>ipcRenderer.invoke("Today_Sales",user_Identify),
orderID:(user_Identify)=>ipcRenderer.invoke("orderID",user_Identify),
topItems:(user_Identify)=>ipcRenderer.invoke("topItems",user_Identify),
deleteTable: (tableId, user_Identify) =>
  ipcRenderer.invoke("deleteTable", tableId, user_Identify),
update_Table_Status: (new_table_id, newStatus, old_table_id) =>
  ipcRenderer.invoke(
    "update_Table_Status",
    new_table_id,
    newStatus,
    old_table_id
  ),

Delete_table:(table_id)=>ipcRenderer.invoke("Delete_table",table_id),

insert_table: (table_id, status,user_Identify) => ipcRenderer.invoke("insert_table", table_id, status,user_Identify),
//////////Staff/////////////////
delete_Staff:(deleteData) => ipcRenderer.invoke("delete_Staff",deleteData),
saveEmployee: (data,user_Identify) => ipcRenderer.invoke("saveEmployee", data,user_Identify),
/////////////////////////////////////////////////////////////////
                   //orders.html->page
place_Order_item: (orders,user_Identify) => ipcRenderer.invoke("place_Order_item", orders,user_Identify),  
place_Order_history: (orders,user_Identify) => ipcRenderer.invoke("place_Order_history", orders,user_Identify),   
show_order: (user_Identify) => ipcRenderer.invoke("show_order",user_Identify),
Order_history : (user_Identify) => ipcRenderer.invoke("Order_history",user_Identify),
Order_history_delete : (orderId,user_Identify) => ipcRenderer.invoke("Order_history_delete",orderId,user_Identify),
Role : () => ipcRenderer.invoke("Role"),
Staff_information : (varClickedData,user_Identify)  => ipcRenderer.invoke("Staff_information",varClickedData,user_Identify),
update_Staff: (data) =>
    ipcRenderer.invoke("update_Staff", data),
edit_order: (
  newTable,
  newQuantity,
  orderId
) =>
  ipcRenderer.invoke(
    "edit_order",
    newTable,
    newQuantity,
    orderId
  ),
  // OPTIONAL GENERIC
  invoke: (channel, ...args) =>
    ipcRenderer.invoke(channel, ...args)
});
contextBridge.exposeInMainWorld("electron", {
  invoke: (channel, ...args) => ipcRenderer.invoke(channel, ...args)
});

