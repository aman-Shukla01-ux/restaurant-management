const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const nodemailer = require("nodemailer");
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  "https://hcgdgqxtshpodzognicg.supabase.co",
  "sb_publishable_LrpzIi2d9ba4vGircxsCAQ_O97pwOER"
);

let mainWindow;

async function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  mainWindow.loadFile("Html/login.html");
}

app.whenReady().then(() => {
  console.log("Supabase connected");
  createWindow();
});



const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "amanshuklashukla567@gmail.com",
    pass: "vodxpzfyeguqcjvu",
  },
});

// 🔐 SEND OTP TO GMAIL
const otpStore = new Map(); // email -> otp

ipcMain.handle("send-otp", async (event, email) => {
  try {
    if (!email) {
      return { success: false, message: "Email is required" };
    }

    const otp = Math.floor(100000 + Math.random() * 900000);
    otpStore.set(email, otp);

    await transporter.sendMail({
      from: "amanshuklashukla567@gmail.com",
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP is ${otp}. Sign up for app`
    });

    return { success: true, message: "OTP sent successfully" };

  } catch (error) {
    console.error("OTP ERROR:", error);
    return { success: false, message: error.message };
  }
});
ipcMain.handle("verifyOTP", async (event, email, otp) => {
  const storedOtp = otpStore.get(email);

  if (!storedOtp) {
    return { success: false, message: "OTP expired or not found" };
  }

  if (Number(otp) === storedOtp) {
    otpStore.delete(email); // cleanup after success
    return { success: true, message: "OTP verified successfully" };
  }

  return { success: false, message: "Invalid OTP" };
});
// +add item 
ipcMain.handle("insert_menu", async (event, item, price, category_Id, user_Identify) => {
  try {
    console.log("Received:", item, price, category_Id);

    if (!item || !price || !category_Id) {
      return { success: false, error: "Empty item or price" };
    }

    const { data, error } = await supabase
      .from("menu")
      .insert([
        {
          item: item,
          price: price,
          category_id: category_Id,
          email: user_Identify
        }
      ])
      .select();

    if (error) {
      throw error;
    }

    return { success: true, data };

  } catch (err) {
    console.error("INSERT ERROR:", err);
    return { success: false, error: err.message };
  }
});

// update Vategory_name
ipcMain.handle("fetch_cat", async (event, user_Identify) => {
  const { data, error } = await supabase
    .from("category")
    .select("category_name, category_id")
    .eq("email", user_Identify);

  if (error) {
    console.error(error);
    return [];
  }

  console.log(data);
  return data;
});
// fetch data for all category
ipcMain.handle("Category_name", async (event, user_Identify) => {
  const { data, error } = await supabase
    .from("category")
    .select("*")
    .eq("email", user_Identify);

  if (error) {
    console.error(error);
    return [];
  }

  return data;
});



ipcMain.handle("paneer", async () => {
  const [item] = await db.execute("SELECT * FROM menu where Category_id=2");
  return item;
});
ipcMain.handle("Roti", async () => {
  const [item] = await db.execute("SELECT * FROM menu where Category_id=3");
  return item;
});
ipcMain.handle("Soups", async () => {
  const [item] = await db.execute("SELECT * FROM menu where Category_id=4");
  return item;
});
ipcMain.handle("Sween", async () => {
  const [item] = await db.execute("SELECT * FROM menu where Category_id=5");
  return item;
});
ipcMain.handle("Rice", async () => {
  const [item] = await db.execute("SELECT * FROM menu where Category_id=6");
  return item;
});

ipcMain.handle("Starter", async (event, varClickedData) => {
  const [item] = await db.execute("SELECT * FROM menu where Category_id=?", [varClickedData]);
  console.log("data fetch from databse");
  return item;
});
ipcMain.handle("Delete", async (event, Item) => {
  try {
    // First get menu_id
    const { data: menuData, error: menuError } = await supabase
      .from("menu")
      .select("menu_id")
      .eq("item", Item);

    if (menuError) throw menuError;

    const menuIds = menuData.map(row => row.menu_id);

    if (menuIds.length > 0) {
      const { error: deleteOrderError } = await supabase
        .from("menu")
        .delete()
        .in("menu_id", menuIds);

      if (deleteOrderError) throw deleteOrderError;
    }

    return { success: true };

  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: error.message
    };
  }
});

//Update Category_name

ipcMain.handle("Update_Category", async (event, new_category, old_category, user_Identify) => {
  console.log("handler call");

  const { data, error } = await supabase
    .from("category")
    .update({
      category_name: new_category
    })
    .eq("category_name", old_category)
    .eq("email", user_Identify)
    .select();

  if (error) {
    console.error(error);
    return {
      success: false,
      message: error.message
    };
  }

  return {
    success: true,
    data
  };
});
// insert Category_name
ipcMain.handle("insert_category", async (event, category, user_Identify) => {
  const { data, error } = await supabase
    .from("category")
    .insert([
      {
        category_name: category,
        email: user_Identify
      }
    ]);

  if (error) {
    console.error(error);
    return { success: false, error: error.message };
  }

  return { success: true, data };
});

//Delete category
ipcMain.handle("DeleteCategory", async (event, Category_id) => {
  try {
    // Check if any menu item exists in this category
    const { data: menuItems, error: menuError } = await supabase
      .from("menu")
      .select("menu_id")
      .eq("category_id", Category_id);

    if (menuError) throw menuError;

    if (menuItems.length > 0) {
      return {
        success: false,
        message: "Category has items, delete them first"
      };
    }

    // Delete category
    const { error: deleteError } = await supabase
      .from("category")
      .delete()
      .eq("category_id", Category_id);

    if (deleteError) throw deleteError;

    return {
      success: true,
      message: "Category deleted successfully"
    };

  } catch (error) {
    console.error(error);

    return {
      success: false,
      message: error.message
    };
  }
});






//save food after edit
ipcMain.handle("save", async (event, new_Food, old_Food, Food_price, user_Identify) => {
  const { data, error } = await supabase
    .from("menu")
    .update({
      price: Food_price,
      item: new_Food
    })
    .eq("item", old_Food)
    .eq("email", user_Identify)
    .select();

  if (error) {
    console.error(error);
    return { success: false, message: error.message };
  }

  return { success: true, data };
});

// Sign_up //
ipcMain.handle("sign_up", async (event, emailValue, passwordValue) => {
  const { data, error } = await supabase
    .from("users")
    .insert([
      {
        email: emailValue,
        password: passwordValue
      }
    ]);

  if (error) {
    console.error("Signup Error:", error);

    return {
      success: false,
      message: error.message
    };
  }

  return {
    success: true,
    data
  };
});

//login ///
ipcMain.handle("login", async (event, email1, password_1) => {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email1)
      .eq("password", password_1);

    if (error) throw error;

    if (data.length > 0) {
      return {
        success: true,
        user: data[0]
      };
    }

    return {
      success: false,
      message: "Email or password is incorrect"
    };

  } catch (error) {
    console.error(error);

    return {
      success: false,
      message: error.message
    };
  }
});
//forget password ////
ipcMain.handle("forget", async (event, email) => {
  const { data, error } = await supabase
    .from("users")
    .select("email")
    .eq("email", email)
    .limit(1);

  if (error) {
    console.error(error);
    return { success: false };
  }

  return {
    success: data.length > 0
  };
});

// forget _paasowrd ///
ipcMain.handle("forget_password", async (event, email, newPassword) => {
  try {
    if (!email || !newPassword) {
      return {
        success: false,
        message: "Email and password required"
      };
    }

    email = email.trim().toLowerCase();

    const { data, error } = await supabase
      .from("users")
      .update({ password: newPassword })
      .eq("email", email)
      .select();

    if (error) {
      console.error("Supabase Error:", error);
      return {
        success: false,
        message: error.message
      };
    }

    if (data && data.length > 0) {
      return {
        success: true,
        message: "Password updated successfully"
      };
    }

    return {
      success: false,
      message: "Email not found"
    };

  } catch (error) {
    console.error("Server Error:", error);
    return {
      success: false,
      message: "Server error"
    };
  }
});

//Fetch Food_item //
ipcMain.handle("Food_item", async (event, varClickedData, user_Identify) => {
  console.log("Category:", varClickedData);
  console.log("Email:", user_Identify);

  const { data, error } = await supabase
    .from("menu")
    .select("*")
    .eq("category_id", varClickedData)
    .eq("email", user_Identify);

  if (error) {
    console.error(error);
    return [];
  }

  console.log("data fetch from database");

  return data;
});

///////////////////////////////////////////////////////////////////
//index.html->page//
ipcMain.handle("deleteTable", async (event, tableId, user_Identify) => {
  try {
    const { error } = await supabase
      .from("tables")
      .delete()
      .eq("table_id", tableId)
      .eq("email", user_Identify);

    if (error) throw error;

    return {
      success: true
    };

  } catch (error) {
    console.error(error);

    return {
      success: false,
      message: error.message
    };
  }
});
ipcMain.handle("Today_Sales", async (event, user_Identify) => {
  try {

    const last24Hours = new Date(
      Date.now() - 24 * 60 * 60 * 1000
    ).toISOString();

    const { data, error } = await supabase
      .from("orders")
      .select(`
        order_time,
        order_items (
          quantity,
          price
        )
      `)
      .eq("email", user_Identify)
      .gte("order_time", last24Hours);

    if (error) throw error;

    let totalSales = 0;

    data.forEach(order => {
      order.order_items.forEach(item => {
        totalSales += Number(item.price) * Number(item.quantity);
      });
    });

    return {
      success: true,
      totalSales
    };

  } catch (error) {

    return {
      success: false,
      message: error.message
    };
  }
});
// ORDER ID based on email
ipcMain.handle("orderID", async (event, user_Identify) => {
  try {
    const { data, error } = await supabase
      .from("orders")
      .select("order_id,table_id")
      .eq("email", user_Identify);   // ✅ only email filter

    if (error) throw error;

    return { success: true, data };
  } catch (err) {
    console.error("orderID error:", err.message);
    return { success: false, error: err.message };
  }
});
ipcMain.handle("topItems", async (event, user_Identify) => {
  try {
    const { data, error } = await supabase
      .from("menu")
      .select("item, price")
      .eq("email", user_Identify);

    if (error) throw error;

    // 🔥 group items
    const map = {};

    data.forEach((row) => {
      if (!map[row.item]) {
        map[row.item] = {
          item: row.item,
          price: row.price,
          count: 0
        };
      }

      map[row.item].count += 1;
    });

    // 🔥 sort by most ordered + take top 5
    const topDishes = Object.values(map)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
      .map(({ item, price }) => ({
        item,
        price
      }));

    return {
      success: true,
      data: topDishes
    };

  } catch (err) {
    console.error("topItems error:", err.message);
    return {
      success: false,
      error: err.message
    };
  }
});

// TABLE ID based on email
// ipcMain.handle("tableID", async (event, user_Identify) => {
//   try {
//     const { data, error } = await supabase
//       .from("orders")
//       .select("table_id")
//       .eq("email", user_Identify);

//     if (error) throw error;

//     return { success: true, data };
//   } catch (err) {
//     console.error("TableID error:", err.message);
//     return { success: false, error: err.message };
//   }
// }); 


ipcMain.handle("total_tables", async (event, user_Identify) => {
  try {
    const { count, error } = await supabase
      .from("tables")
      .select("id", { count: "exact", head: true })
      .eq("email", user_Identify);

    if (error) throw error;

    return {
      success: true,
      total_tables: count
    };

  } catch (error) {
    console.error("Error fetching total tables:", error);

    return {
      success: false,
      message: error.message
    };
  }
});
ipcMain.handle("Active_order", async (event, user_Identify) => {
  try {
    const { count, error } = await supabase
      .from("order_items")
      .select("order_id", { count: "exact", head: true })
      .eq("email", user_Identify);

    if (error) throw error;

    return {
      success: true,
      total_orders: count
    };

  } catch (error) {
    console.error("Error fetching orders:", error);

    return {
      success: false,
      message: error.message
    };
  }
});
ipcMain.handle("staff_count", async (event, user_Identify) => {
  try {
    console.log("Email:", user_Identify);

    const { count, error } = await supabase
      .from("staff")
      .select("*", { count: "exact", head: true })
      .eq("email", user_Identify);

    console.log("Count:", count);
    console.log("Error:", error);

    if (error) throw error;

    return {
      success: true,
      total_staff: count
    };
  } catch (error) {
    console.error("Full error:", error);

    return {
      success: false,
      message: error.message
    };
  }
});
ipcMain.handle("insert_table", async (event, table_id, status, user_Identify) => {
  try {
    const { data, error } = await supabase
      .from("tables")
      .insert([
        {
          table_id: table_id,
          status: status,
          email: user_Identify
        }
      ]);

    if (error) {
      throw error;
    }

    return {
      success: true,
      data,
      message: "Table inserted successfully"
    };

  } catch (error) {
    console.error("Insert Table Error:", error);

    return {
      success: false,
      message: error.message
    };
  }
});

ipcMain.handle("Table_Status", async (event, user_Identify) => {
  try {

    const { data, error } = await supabase
      .from("tables")
      .select("*")
      .eq("email", user_Identify);

    if (error) throw error;

    return data;

  } catch (error) {
    console.error(error);
    return [];
  }
});

ipcMain.handle(
  "update_Table_Status",
  async (event, new_table_id, newStatus, old_table_id) => {
    const { data, error } = await supabase
      .from("tables")
      .update({
        table_id: new_table_id,
        status: newStatus
      })
      .eq("table_id", old_table_id)
      .select();

    if (error) {
      console.error(error);
      return { success: false, message: error.message };
    }

    return { success: true, data };
  }
);

ipcMain.handle("Delete_table", async (event, table_id) => {
  try {

    const { error } = await supabase
      .from("order_items")
      .delete()
      .eq("order_id", table_id);

    if (error) throw error;

    return { success: true };

  } catch (error) {
    console.log(error);

    return {
      success: false,
      message: error.message
    };
  }
});

// main.js
ipcMain.handle("place_Order", async (event, orders, user_Identify) => {

  try {

    // Insert order
    const [result] = await db.execute(
      `
      INSERT INTO orders (table_id, email)
      VALUES (?, ?)
      `,
      [orders[0].tableId, user_Identify]
    );

    const order_id = result.insertId;

    // Insert order items
    for (let item of orders) {

      await db.execute(
        `
        INSERT INTO order_items
        (order_id, menu_id, quantity, price, email)
        VALUES (?, ?, ?, ?, ?)
        `,
        [
          order_id,
          item.menu_id,
          item.qty,
          item.price,
          user_Identify
        ]
      );

    }

    return {
      success: true,
      order_id
    };

  } catch (error) {

    console.error(error);

    return {
      success: false,
      message: error.message
    };

  }

});
ipcMain.handle("place_Order_history", async (event, orders, user_Identify) => {
  try {

    const historyData = [];

    for (const item of orders) {

      const { data: menuData, error: menuError } = await supabase
        .from("menu")
        .select(`
          item,
          category_id
        `)
        .eq("menu_id", item.menu_id)
        .single();

      if (menuError) throw menuError;

      const { data: categoryData, error: categoryError } = await supabase
        .from("category")
        .select("category_name")
        .eq("category_id", menuData.category_id)
        .single();

      if (categoryError) throw categoryError;

     historyData.push({
  order_id: item.order_id,
  table_id: item.table_id,
  order_time: new Date().toLocaleString("sv-SE", {
    timeZone: "Asia/Kolkata"
  }).replace(" ", "T"),
  item_category: categoryData.category_name,
  item_name: menuData.item,
  quantity: item.qty,
  total_price: item.total,
  email: user_Identify
});
    }

    const { error } = await supabase
      .from("order_history")
      .insert(historyData);

    if (error) throw error;

    return {
      success: true
    };

  } catch (error) {

    console.log("History Error:", error);

    return {
      success: false,
      message: error.message
    };
  }
});

/////////////////////////////////////////////////////////////////
//orders.html->page
ipcMain.handle("place_Order_item", async (event, orders, user_Identify) => {
  try {

    const { data: orderData, error: orderError } = await supabase
      .from("orders")
      .insert([
        {
          table_id: orders[0].table_id,
          email: user_Identify
        }
      ])
      .select("order_id");

    if (orderError) throw orderError;

    const order_id = orderData[0].order_id;

    const orderItems = orders.map(item => ({
      order_id,
      menu_id: item.menu_id,
      quantity: item.qty,
      price: item.price,
      email: user_Identify
    }));

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItems);

    if (itemsError) throw itemsError;

    return {
      success: true,
      order_id
    };

  } catch (error) {

    console.log(error);

    return {
      success: false,
      message: error.message
    };
  }
});
/// fetch item form menu table ////
ipcMain.handle("Item", async (event, user_Identify, catId) => {
  try {

    const [items] = await db.execute(
      "SELECT * FROM menu WHERE email = ? AND Category_id = ?",
      [user_Identify, catId]
    );

    return {
      success: true,
      data: items
    };

  } catch (error) {

    return {
      success: false,
      message: error.message
    };

  }
});


ipcMain.handle("show_order", async (event, user_Identify) => {
  try {

    const { data, error } = await supabase
      .from("orders")
      .select(`
        order_id,
        table_id,
        email,
        order_time,
        order_items (
          quantity,
          price,
          menu (
            menu_id,
            item
          )
        )
      `)
      .eq("email", user_Identify);

    if (error) throw error;

    return data;

  } catch (error) {
    console.log(error);
    return [];
  }
});


ipcMain.handle(
  "edit_order",
  async (
    event,
    newTable,
    newQuantity,
    oldOrderId
  ) => {
    try {

      const orderId = oldOrderId;

      // Get current item
      const { data: item, error: fetchError } = await supabase
        .from("order_items")
        .select("price")
        .eq("order_id", orderId)
        .single();

      if (fetchError) throw fetchError;

      // price column stores unit price
      const unitPrice = item.price;

      const { error: itemError } = await supabase
        .from("order_items")
        .update({
          quantity: newQuantity
        })
        .eq("order_id", orderId);

      if (itemError) throw itemError;

      const { error: orderError } = await supabase
        .from("orders")
        .update({
          table_id: newTable
        })
        .eq("order_id", orderId);

      if (orderError) throw orderError;

      return {
        success: true,
        totalPrice: unitPrice * newQuantity
      };

    } catch (error) {

      return {
        success: false,
        message: error.message
      };

    }
  }
);

ipcMain.handle("Order_history", async (event, user_Identify) => {
  try {

    if (!user_Identify) {
      return {
        success: false,
        message: "user_Identify is required"
      };
    }

    const { data, error } = await supabase
      .from("order_history")
      .select(`
        history_id,
        order_id,
        table_id,
        order_time,
        item_category,
        item_name,
        quantity,
        total_price,
        email
      `)
      .eq("email", user_Identify)
      .order("history_id", { ascending: false });

    if (error) throw error;

    return {
      success: true,
      data: data || []
    };

  } catch (error) {

    console.log(error);

    return {
      success: false,
      message: error.message
    };
  }
});




ipcMain.handle("Order_history_delete", async (event, historyId, user_Identify) => {
  try {

    const { error } = await supabase
      .from("order_history")
      .delete()
      .eq("history_id", historyId)
      .eq("email", user_Identify);

    if (error) throw error;

    return {
      success: true,
      message: "History deleted successfully"
    };

  } catch (error) {

    console.error(error);

    return {
      success: false,
      message: error.message
    };
  }
});




ipcMain.handle("Role", async (event, user_Identify) => {
  try {

    const { data, error } = await supabase
      .from("role")
      .select("role_id, role_name");

    if (error) throw error;

    return data;

  } catch (error) {
    console.error(error);
    return [];
  }
});
// Staff.html
ipcMain.handle("Staff_information", async (event, roleId, user_Identify) => {
  try {

    const { data, error } = await supabase
      .from("staff")
      .select("*")
      .eq("role_id", roleId)
      .eq("email", user_Identify);

    if (error) throw error;

    return data;

  } catch (error) {
    console.error(error);
    return [];
  }
});


ipcMain.handle("delete_Staff", async (event, employeeName) => {
  try {

    const { data, error } = await supabase
      .from("staff")
      .delete()
      .eq("employee_name", employeeName);

    if (error) throw error;

    console.log("Deleted staff related to Employee_Name");

    return data;

  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: error.message
    };
  }
});


ipcMain.handle("update_Staff", async (event, data) => {
  try {

    const { id, name, salary, shift } = data;

    const { data: result, error } = await supabase
      .from("staff")
      .update({
        employee_name: name,
        salary: salary,
        shift: shift
      })
      .eq("employee_id", id);

    if (error) throw error;

    return result;

  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: error.message
    };
  }
});

ipcMain.handle("saveEmployee", async (event, data, user_Identify) => {
  try {

    const { error } = await supabase
      .from("staff")
      .insert([
        {
          
          role_id: data.role_id,
          employee_name: data.employee_name,
          salary: data.salary,
          shift: data.shift,
          email: user_Identify
        }
      ]);

    if (error) throw error;

    return { success: true };

  } catch (error) {
    console.log(error);

    return {
      success: false,
      message: error.message
    };
  }
});