const express = require("express");
const cors = require("cors");
const mysql = require("mysql");
const multer = require('multer');
const fs = require('fs');

const app = express();

app.use(cors());
app.use(express.json());

const today = new Date();
const month = String(today.getMonth() + 1).padStart(2, '0'); // Pad month to 2 digits
const date = String(today.getDate()).padStart(2, '0'); // Pad day to 2 digits
const year = today.getFullYear();
const currentDate = `${year}-${month}-${date}`;

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "unicoredb"
});

// Configure multer for handling e-signature file uploads
const storage = multer.memoryStorage(); // Store file in memory
const signUpload = multer({
  storage: storage,
  limits: {
    fileSize: 2 * 1024 * 1024 // 2MB limit
  },
  fileFilter: (req, file, cb) => {
    // Check file type
    if (file.mimetype === "image/png" || 
        file.mimetype === "image/jpg" || 
        file.mimetype === "image/jpeg") {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error('Only .png, .jpg and .jpeg formats are allowed!'));
    }
  }
});

// Configure multer to store file in memory instead of disk
const proofUpload = multer({
  limits: {
    fileSize: 15 * 1024 * 1024 // 15MB limit
  },
  fileFilter: function (req, file, cb) {
    // Accept only image files
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed!'));
    }
    cb(null, true);
  }
}).single('rq_service_proof');

//login
app.post("/login", (req, res) => {
  const sql = "SELECT * FROM tbuseraccounts WHERE `user_idnum` = ?  AND `user_password` = ?";
  db.query(sql, [req.body.user_idnum, req.body.user_password], (err, result) => {
    if (err) return res.json({ Message: "Error inside server" });
    else return res.json(result);
  });
});

//get users
app.get("/users", (req, res) => {
  const sql = "SELECT *, tbdepartments.dept_name FROM tbuseraccounts INNER JOIN tbdepartments ON tbuseraccounts.dept_id=tbdepartments.dept_id WHERE `user_id` != 1";
  db.query(sql, (err, result) => {
    if (err) return res.json({ Message: "Error inside server" });
    else return res.json(result);
  });
});

//get users except admin
app.get("/users/non_admin", (req, res) => {
  const sql = "SELECT *, tbdepartments.dept_name FROM tbuseraccounts INNER JOIN tbdepartments ON tbuseraccounts.dept_id=tbdepartments.dept_id WHERE `user_position` != 'Administrator'";
  db.query(sql, (err, result) => {
    if (err) return res.json({ Message: "Error inside server" });
    else return res.json(result);
  });
});

//get service staff by department
app.get("/users/servicestaff/:id", (req, res) => {
  const dept_id = req.params.id
  const sql = "SELECT *, tbdepartments.dept_name FROM tbuseraccounts INNER JOIN tbdepartments ON tbuseraccounts.dept_id=tbdepartments.dept_id WHERE `user_position` = 'Service Staff' AND tbuseraccounts.dept_id = ?";
  db.query(sql, dept_id, (err, result) => {
    if (err) return res.json({ Message: "Error inside server" });
    else return res.json(result);
  });
});

//get user
app.get("/users/:id", (req, res) => {
  const user_id = req.params.id
  const sql = "SELECT *, tbdepartments.dept_name FROM tbuseraccounts INNER JOIN tbdepartments ON tbuseraccounts.dept_id=tbdepartments.dept_id WHERE `user_id` = ?";
  db.query(sql, user_id, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

//get user id
app.get("/users/user_id/:id", (req, res) => {
  const user_id = req.params.id
  const sql = "SELECT user_id FROM tbuseraccounts WHERE `user_id` = ?";
  db.query(sql, user_id, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

//get user type
app.get("/users/user_type/:id", (req, res) => {
  const user_idnum = req.params.id
  const sql = "SELECT user_type FROM tbuseraccounts WHERE `user_idnum` = ?";
  db.query(sql, user_idnum, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

//get user dept
app.get("/users/user_dept/:id", (req, res) => {
  const user_id = req.params.id
  const sql = "SELECT dept_id FROM tbuseraccounts WHERE `user_id` = ?";
  db.query(sql, user_id, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

//get users by dept_id
app.get("/users/dept/:id", (req, res) => {
  const dept_id = req.params.id;
  const sql = "SELECT *, tbdepartments.dept_name FROM tbuseraccounts INNER JOIN tbdepartments ON tbuseraccounts.dept_id=tbdepartments.dept_id WHERE tbuseraccounts.dept_id = ? AND tbuseraccounts.user_id != 1";
  
  db.query(sql, dept_id, (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: "Database query failed" });
    } else {
      res.json(result);
    }
  });
});

//get users by user_position "Working Student"
app.get("/users/position/working", (req, res) => {
  const user_position = "Working Student";
  const sql = "SELECT *, tbdepartments.dept_name FROM tbuseraccounts INNER JOIN tbdepartments ON tbuseraccounts.dept_id=tbdepartments.dept_id WHERE tbuseraccounts.user_position = ? AND tbuseraccounts.user_id != 1";
  
  db.query(sql, user_position, (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: "Database query failed" });
    } else {
      res.json(result);
    }
  });
});

//add user
app.post("/users/add", (req, res) => {
  const user_idnum = req.body.user_idnum;
  const user_password = req.body.user_password;
  const user_fname = req.body.user_fname;
  const user_lname = req.body.user_lname;
  const user_email = req.body.user_email;
  const user_contact = req.body.user_contact;
  const user_type = req.body.user_type;
  const user_position = req.body.user_position;
  const dept_id = req.body.dept_id;
  const user_status = req.body.user_status;

  const sql = "INSERT INTO tbuseraccounts (user_idnum, user_password, user_fname, user_lname, user_email, user_contact, user_type, user_position, dept_id, user_status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

  db.query(sql, [user_idnum, user_password, user_fname, user_lname, user_email, user_contact, user_type, user_position, dept_id, user_status],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error adding user");
      } else {
        res.send("User added successfully!");
      }
    }
  );
});

//edit user
app.put("/users/edit/:id", (req, res) => {
  const userId = req.params.id;
  const sql = "UPDATE tbuseraccounts SET `user_idnum`= ?, `user_password`= ?, `user_fname`= ?, `user_lname`= ?, `user_email`= ?, `user_contact`= ?, `user_type`= ?, `user_position`= ?, `dept_id`= ?, `user_status`= ? WHERE `user_id` = ?";

  const values = [
    req.body.user_idnum,
    req.body.user_password,
    req.body.user_fname,
    req.body.user_lname,
    req.body.user_email,
    req.body.user_contact,
    req.body.user_type,
    req.body.user_position,
    req.body.dept_id,
    req.body.user_status
  ];

  db.query(sql, [...values, userId], (err, data) => {
    if (err) {
      console.log(err);
      return res.status(500).send(err);
    }
    return res.json(data);
  });
});

//change user password
app.put("/users/password/:id", (req, res) => {
  const userId = req.params.id;
  const sql = "UPDATE tbuseraccounts SET `user_password`= ? WHERE `user_id` = ?";

  const values = [
    req.body.user_password,
  ];

  db.query(sql, [...values, userId], (err, data) => {
    if (err) {
      console.log(err);
      return res.status(500).send(err);
    }
    return res.json(data);
  });
});

//upload e-signature
app.put("/users/signature/:id", signUpload.single('user_sign'), (req, res) => {
  const userId = req.params.id;
  
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  // Convert file buffer to base64
  const base64Image = req.file.buffer.toString('base64');
  
  const sql = "UPDATE tbuseraccounts SET `user_sign`= ? WHERE `user_id` = ?";

  db.query(sql, [base64Image, userId], (err, data) => {
    if (err) {
      console.log(err);
      return res.status(500).send(err);
    }
    return res.json(data);
  });
});

//deactivate user
app.put("/users/deactivate/:id", (req, res) => {
  const userId = req.params.id;
  const sql = "UPDATE tbuseraccounts SET `user_status`= ? WHERE `user_id` = ?";

  const values = [
    "Deactivated",
  ];

  db.query(sql, [...values, userId], (err, data) => {
    if (err) {
      console.log(err);
      return res.status(500).send(err);
    }
    return res.json(data);
  });
});


//items
app.get("/items", (req, res) => {
  const sql = "SELECT *, tbdepartments.dept_name FROM tbitems INNER JOIN tbdepartments ON tbitems.dept_id=tbdepartments.dept_id";
  db.query(sql, (err, result) => {
    if (err) return res.json({ Message: "Error inside server" });
    else return res.json(result);
  });
});

//items/:id
app.get("/items/:id", (req, res) => {
  const item_id = req.params.id;
  const sql = "SELECT *, tbdepartments.dept_name FROM tbitems INNER JOIN tbdepartments ON tbitems.dept_id=tbdepartments.dept_id WHERE tbitems.item_id = ?";
  db.query(sql, item_id, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

//items/deptID/:id
app.get("/items/deptID/:id", (req, res) => {
  const dept_id = req.params.id;
  const sql = "SELECT *, tbdepartments.dept_name FROM tbitems INNER JOIN tbdepartments ON tbitems.dept_id=tbdepartments.dept_id WHERE tbitems.dept_id = ?";
  
  db.query(sql, dept_id, (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: "Database query failed" });
    } else {
      res.json(result);
    }
  });
});

//items/category/:category
app.get("/items/category/:category", (req, res) => {
  const item_category = req.params.category;
  const sql = "SELECT *, tbdepartments.dept_name FROM tbitems INNER JOIN tbdepartments ON tbitems.dept_id=tbdepartments.dept_id WHERE tbitems.item_category = ?";
  
  db.query(sql, item_category, (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: "Database query failed" });
    } else {
      res.json(result);
    }
  });
});

//items/add
app.post("/items/add", (req, res) => {
  const item_category = req.body.item_category;
  const item_control = req.body.item_control;
  const item_quantity = req.body.item_quantity;
  const item_measure = req.body.item_measure;
  const item_name = req.body.item_name;
  const item_desc = req.body.item_desc;
  const item_buy_date = req.body.item_buy_date;
  const item_buy_cost = req.body.item_buy_cost;
  const item_total = item_quantity * item_buy_cost;
  const item_remarks = req.body.item_remarks;
  const item_status = req.body.item_status;
  const dept_id = req.body.dept_id;
  const item_reserved = req.body.item_reserved;
  const item_serviced = req.body.item_serviced;

  const sql = "INSERT INTO tbitems (item_category, item_control, item_quantity, item_measure, item_name, item_desc, item_buy_date, item_buy_cost, item_total, item_remarks, item_status, dept_id, item_reserved, item_serviced) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

  db.query(sql, [item_category, item_control, item_quantity, item_measure, item_name, item_desc, item_buy_date, item_buy_cost, item_total, item_remarks, item_status, dept_id, item_reserved, item_serviced],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send("Item Saved!");
      }
    }
  );
});

//items/edit
app.put("/items/:id", (req, res) => {
  const itemId = req.params.id;
  const sql = "UPDATE tbitems SET `item_category`= ?, `item_control`= ?, `item_quantity`= ?, `item_measure`= ?, `item_name`= ?, `item_desc`= ?, `item_buy_date`= ?, `item_buy_cost`= ?, `item_total`= ?, `item_remarks`= ?, `item_status`= ?, `dept_id`= ? WHERE `item_id` = ?";

  const values = [
    req.body.item_category,
    req.body.item_control,
    req.body.item_quantity,
    req.body.item_measure,
    req.body.item_name,
    req.body.item_desc,
    req.body.item_buy_date,
    req.body.item_buy_cost,
    (req.body.item_quantity * req.body.item_buy_cost),
    req.body.item_remarks,
    req.body.item_status,
    req.body.dept_id
  ];

  db.query(sql, [...values, itemId], (err, data) => {
    if (err) return res.send(err);
    return res.json(data);
  });
});

//items/quantity_reserved/:id
app.put("/items/quantity_reserved/:id", (req, res) => {
  const itemId = req.params.id;
  const sql = "UPDATE tbitems SET `item_quantity` = ?,  `item_reserved` = ? WHERE `item_id` = ?";

  const values = [
    req.body.item_quantity,
    req.body.item_reserved
  ]

  db.query(sql, [...values, itemId], (err, data) => {
    if (err) return res.send(err);
    return res.json(data);
  });
});

//items/quantity_serviced/:id
app.put("/items/quantity_serviced/:id", (req, res) => {
  const itemId = req.params.id;
  const sql = "UPDATE tbitems SET `item_quantity` = ?,  `item_serviced` = ? WHERE `item_id` = ?";

  const values = [
    req.body.item_quantity,
    req.body.item_serviced
  ]

  db.query(sql, [...values, itemId], (err, data) => {
    if (err) return res.send(err);
    return res.json(data);
  });
});

//items/status/:id
app.put("/items/status/:id", (req, res) => {
  const itemId = req.params.id;
  const sql = "UPDATE tbitems SET `item_status` = ? WHERE `item_id` = ?";

  const values = [
    req.body.item_status,
  ]

  db.query(sql, [...values, itemId], (err, data) => {
    if (err) return res.send(err);
    return res.json(data);
  });
});

//items/delete
app.delete("/items/:id", (req, res) => {
  const itemId = req.params.id;
  const sql = " DELETE FROM tbitems WHERE `item_id` = ? ";

  db.query(sql, [itemId], (err, data) => {
    if (err) return res.send(err);
    return res.json(data);
  });
});

//rooms
app.get('/rooms', (req, res) => {
  const sql = "SELECT *, tbdepartments.dept_name FROM tbrooms INNER JOIN tbdepartments ON tbrooms.dept_id=tbdepartments.dept_id";
  db.query(sql, (err, result) => {
    if (err) return res.json({ Message: "Error inside server" });
    else return res.json(result);
  });
});

//rooms/:id
app.get("/rooms/:id", (req, res) => {
  const room_id = req.params.id;
  const sql = "SELECT *, tbdepartments.dept_name FROM tbrooms INNER JOIN tbdepartments ON tbrooms.dept_id=tbdepartments.dept_id WHERE tbrooms.room_id = ?";
  db.query(sql, room_id, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

//rooms/deptID/:id
app.get("/rooms/deptID/:id", (req, res) => {
  const dept_id = req.params.id;
  const sql = "SELECT *, tbdepartments.dept_name FROM tbrooms INNER JOIN tbdepartments ON tbrooms.dept_id=tbdepartments.dept_id WHERE tbrooms.dept_id = ?";
  
  db.query(sql, dept_id, (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: "Database query failed" });
    } else {
      res.json(result);
    }
  });
});

//rooms/add
app.post("/rooms/add", (req, res) => {
  const room_bldg = req.body.room_bldg;
  const room_floor = req.body.room_floor;
  const room_type = req.body.room_type;
  const room_name = req.body.room_name;
  const room_desc = req.body.room_desc;
  const room_status = req.body.room_status;
  const dept_id = req.body.dept_id;

  const sql = "INSERT INTO tbrooms (room_bldg, room_floor, room_type, room_name, room_desc, room_status, dept_id) VALUES (?, ?, ?, ?, ?, ?, ?)";

  db.query(sql, [room_bldg, room_floor, room_type, room_name, room_desc, room_status, dept_id],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send("Room Saved!");
      }
    }
  );
});

//rooms/edit
app.put("/rooms/:id", (req, res) => {
  const roomId = req.params.id;
  const sql = "UPDATE tbrooms SET `room_bldg`= ?, `room_floor`= ?, `room_type` = ? `room_name`= ?, `room_desc`= ?, `dept_id`= ? WHERE `room_id` = ?";

  const values = [
    req.body.room_bldg,
    req.body.room_floor,
    req.body.room_type,
    req.body.room_name,
    req.body.room_desc,
    req.body.dept_id
  ];

  db.query(sql, [...values, roomId], (err, data) => {
    if (err) return res.send(err);
    return res.json(data);
  });
});

//rooms/status/:id
app.put("/rooms/status/:id", (req, res) => {
  const roomId = req.params.id;
  const sql = "UPDATE tbrooms SET `room_status` = ?, `room_status_start_date` = ?, `room_status_end_date` = ?, `room_status_start_time` = ?, `room_status_end_time` = ? WHERE `room_id` = ?";

  const values = [
    req.body.room_status,
    req.body.room_status_start_date,
    req.body.room_status_end_date,
    req.body.room_status_start_time,
    req.body.room_status_end_time
  ]

  db.query(sql, [...values, roomId], (err, data) => {
    if (err) return res.send(err);
    return res.json(data);
  });
});

//rooms/delete
app.delete("/rooms/:id", (req, res) => {
  const itemId = req.params.id;
  const sql = " DELETE FROM tbrooms WHERE `room_id` = ? ";

  db.query(sql, [itemId], (err, data) => {
    if (err) return res.send(err);
    return res.json(data);
  });
});

//requests
app.get('/requests', (req, res) => {
  const sql = "SELECT * from tbrequests";
  db.query(sql, (err, result) => {
    if (err) return res.json({ Message: "Error inside server" });
    else return res.json(result);
  });
});

//requests/queue/:id
app.get('/requests/queue/:id', (req, res) => {
  const dept_id = req.params.id;
  const sql = `
    SELECT *, 
      user1.user_id AS rq_create_user_id, 
      user1.user_fname AS rq_create_user_fname, 
      user1.user_lname AS rq_create_user_lname,
      tbitems.item_name,
      tbrooms.room_name
    FROM tbrequests 
    INNER JOIN tbuseraccounts user1 ON tbrequests.rq_create_user_id = user1.user_id 
    LEFT JOIN tbitems ON tbrequests.item_id = tbitems.item_id
    LEFT JOIN tbrooms ON tbrequests.room_id = tbrooms.room_id
    WHERE tbrequests.dept_id = ? 
    AND tbrequests.rq_status = 'Request Submitted' 
    ORDER BY CASE rq_prio_level 
      WHEN 'Urgent' THEN 1 
      WHEN 'Moderate' THEN 2 
    END, rq_create_date DESC , rq_start_date DESC, rq_start_time DESC`;
  db.query(sql, dept_id, (err, result) => {
    if (err) return res.json({ Message: "Error inside server" });
    else return res.json(result);
  });
});

//requests/accepted/:id
app.get('/requests/accepted/:id', (req, res) => {
  const user_id = req.params.id;
  const sql = `
    SELECT *, 
      user1.user_id AS rq_create_user_id, 
      user1.user_fname AS rq_create_user_fname, 
      user1.user_lname AS rq_create_user_lname,
      tbitems.item_name,
      tbrooms.room_name
    FROM tbrequests 
    INNER JOIN tbuseraccounts user1 ON tbrequests.rq_create_user_id = user1.user_id 
    LEFT JOIN tbitems ON tbrequests.item_id = tbitems.item_id
    LEFT JOIN tbrooms ON tbrequests.room_id = tbrooms.room_id
    WHERE tbrequests.rq_accept_user_id = ? 
    ORDER BY CASE rq_prio_level 
      WHEN 'Urgent' THEN 1 
      WHEN 'Moderate' THEN 2 
    END, rq_create_date DESC , rq_start_date DESC, rq_start_time DESC`;
  db.query(sql, user_id, (err, result) => {
    if (err) return res.json({ Message: "Error inside server" });
    else return res.json(result);
  });
});

//requests/submitted/:id
app.get('/requests/submitted/:id', (req, res) => {
  const user_id = req.params.id;
  const sql = `
    SELECT *, 
    tbdepartments.dept_name, 
    tbitems.item_name, 
    tbrooms.room_name 
    FROM tbrequests 
    INNER JOIN tbdepartments ON tbrequests.dept_id = tbdepartments.dept_id 
    LEFT JOIN tbitems ON tbrequests.item_id = tbitems.item_id 
    LEFT JOIN tbrooms ON tbrequests.room_id = tbrooms.room_id 
    WHERE tbrequests.rq_create_user_id = ? 
    ORDER BY rq_create_date DESC, rq_start_date DESC, rq_start_time DESC`;
  db.query(sql, user_id, (err, result) => {
    if (err) return res.json({ Message: "Error inside server" });
    else return res.json(result);
  });
});

//requests/assigned/:id
app.get('/requests/assigned/:id', (req, res) => {
  const user_id = req.params.id;
  const sql = `
    SELECT *, 
    user1.user_id AS rq_accept_user_id, 
    user1.user_fname AS rq_accept_user_fname, 
    user1.user_lname AS rq_accept_user_lname, 
    tbdepartments.dept_name, 
    tbitems.item_name, 
    tbrooms.room_name 
    FROM tbrequests 
    INNER JOIN tbuseraccounts user1 ON tbrequests.rq_accept_user_id = user1.user_id 
    INNER JOIN tbdepartments ON tbrequests.dept_id = tbdepartments.dept_id 
    LEFT JOIN tbitems ON tbrequests.item_id = tbitems.item_id 
    LEFT JOIN tbrooms ON tbrequests.room_id = tbrooms.room_id 
    WHERE tbrequests.rq_service_user_id = ? 
    ORDER BY rq_create_date DESC, rq_start_date DESC, rq_start_time DESC`;
  db.query(sql, user_id, (err, result) => {
    if (err) return res.json({ Message: "Error inside server" });
    else return res.json(result);
  });
});

//requests/reserve_item
app.get('/requests/reserve_item', (req, res) => {
  const sql = "SELECT *, tbdepartments.dept_name, tbitems.item_name, user1.user_id AS rq_create_user_id, user1.user_fname AS rq_create_user_fname, user1.user_lname AS rq_create_user_lname, user2.user_id AS rq_accept_user_id, user2.user_fname AS rq_accept_user_fname, user2.user_lname AS rq_accept_user_lname FROM tbrequests INNER JOIN tbdepartments ON tbrequests.dept_id=tbdepartments.dept_id INNER JOIN tbitems ON tbrequests.item_id=tbitems.item_id INNER JOIN tbuseraccounts user1 ON tbrequests.rq_create_user_id=user1.user_id LEFT JOIN tbuseraccounts user2 ON tbrequests.rq_accept_user_id=user2.user_id WHERE `rq_type` = 'Reserve Item'";
  db.query(sql, (err, result) => {
    if (err) return res.json({ Message: "Error inside server" });
    else return res.json(result);
  });
});

//requests/reserve_room
app.get('/requests/reserve_room', (req, res) => {
  const sql = "SELECT *, tbdepartments.dept_name, tbrooms.room_name, user1.user_id AS rq_create_user_id, user1.user_fname AS rq_create_user_fname, user1.user_lname AS rq_create_user_lname, user2.user_id AS rq_accept_user_id, user2.user_fname AS rq_accept_user_fname, user2.user_lname AS rq_accept_user_lname FROM tbrequests INNER JOIN tbdepartments ON tbrequests.dept_id=tbdepartments.dept_id INNER JOIN tbrooms ON tbrequests.room_id=tbrooms.room_id INNER JOIN tbuseraccounts user1 ON tbrequests.rq_create_user_id=user1.user_id LEFT JOIN tbuseraccounts user2 ON tbrequests.rq_accept_user_id=user2.user_id WHERE `rq_type` = 'Reserve Facility'";
  db.query(sql, (err, result) => {
    if (err) return res.json({ Message: "Error inside server" });
    else return res.json(result);
  });
});

//requests/service_item
app.get('/requests/service_item', (req, res) => {
  const sql = "SELECT *, tbdepartments.dept_name, tbitems.item_name, user1.user_id AS rq_create_user_id, user1.user_fname AS rq_create_user_fname, user1.user_lname AS rq_create_user_lname, user2.user_id AS rq_accept_user_id, user2.user_fname AS rq_accept_user_fname, user2.user_lname AS rq_accept_user_lname, user3.user_id AS rq_service_user_id, user3.user_fname AS rq_service_user_fname, user3.user_lname AS rq_service_user_lname FROM tbrequests INNER JOIN tbdepartments ON tbrequests.dept_id=tbdepartments.dept_id INNER JOIN tbitems ON tbrequests.item_id=tbitems.item_id INNER JOIN tbuseraccounts user1 ON tbrequests.rq_create_user_id=user1.user_id LEFT JOIN tbuseraccounts user2 ON tbrequests.rq_accept_user_id=user2.user_id LEFT JOIN tbuseraccounts user3 ON tbrequests.rq_service_user_id=user3.user_id WHERE `rq_type` = 'Service for Item'";
  db.query(sql, (err, result) => {
    if (err) return res.json({ Message: "Error inside server" });
    else return res.json(result);
  });
});

//requests/service_room
app.get('/requests/service_room', (req, res) => {
  const sql = "SELECT *, tbdepartments.dept_name, tbrooms.room_name, user1.user_id AS rq_create_user_id, user1.user_fname AS rq_create_user_fname, user1.user_lname AS rq_create_user_lname, user2.user_id AS rq_accept_user_id, user2.user_fname AS rq_accept_user_fname, user2.user_lname AS rq_accept_user_lname, user3.user_id AS rq_service_user_id, user3.user_fname AS rq_service_user_fname, user3.user_lname AS rq_service_user_lname FROM tbrequests INNER JOIN tbdepartments ON tbrequests.dept_id=tbdepartments.dept_id INNER JOIN tbrooms ON tbrequests.room_id=tbrooms.room_id INNER JOIN tbuseraccounts user1 ON tbrequests.rq_create_user_id=user1.user_id LEFT JOIN tbuseraccounts user2 ON tbrequests.rq_accept_user_id=user2.user_id LEFT JOIN tbuseraccounts user3 ON tbrequests.rq_service_user_id=user3.user_id WHERE `rq_type` = 'Service for Facility'";
  db.query(sql, (err, result) => {
    if (err) return res.json({ Message: "Error inside server" });
    else return res.json(result);
  });
});

//requests/reserve_item/:id
app.get("/requests/reserve_item/:id", (req, res) => {
  const item_id = req.params.id;
  const sql = `
    SELECT 
      tbrequests.*, 
      tbrequests.dept_id AS dept_id,
      tbdepartments.dept_name, 
      tbitems.item_name,
      user1.user_id AS rq_create_user_id, 
      user1.user_fname AS rq_create_user_fname, 
      user1.user_lname AS rq_create_user_lname,
      user2.user_id AS rq_accept_user_id, 
      user2.user_fname AS rq_accept_user_fname, 
      user2.user_lname AS rq_accept_user_lname 
    FROM tbrequests 
    INNER JOIN tbdepartments ON tbrequests.dept_id=tbdepartments.dept_id 
    INNER JOIN tbitems ON tbrequests.item_id=tbitems.item_id 
    INNER JOIN tbuseraccounts user1 ON tbrequests.rq_create_user_id=user1.user_id 
    LEFT JOIN tbuseraccounts user2 ON tbrequests.rq_accept_user_id=user2.user_id 
    WHERE rq_id = ? AND rq_type = 'Reserve Item'`;
  db.query(sql, item_id, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

//requests/reserve_room/:id
app.get("/requests/reserve_room/:id", (req, res) => {
  const item_id = req.params.id;
  const sql = `
    SELECT 
      tbrequests.*, 
      tbrequests.dept_id AS dept_id,
      tbdepartments.dept_name, 
      tbrooms.room_name,
      user1.user_id AS rq_create_user_id, 
      user1.user_fname AS rq_create_user_fname, 
      user1.user_lname AS rq_create_user_lname,
      user2.user_id AS rq_accept_user_id, 
      user2.user_fname AS rq_accept_user_fname, 
      user2.user_lname AS rq_accept_user_lname 
    FROM tbrequests 
    INNER JOIN tbdepartments ON tbrequests.dept_id=tbdepartments.dept_id 
    INNER JOIN tbrooms ON tbrequests.room_id=tbrooms.room_id 
    INNER JOIN tbuseraccounts user1 ON tbrequests.rq_create_user_id=user1.user_id 
    LEFT JOIN tbuseraccounts user2 ON tbrequests.rq_accept_user_id=user2.user_id 
    WHERE rq_id = ? AND rq_type = 'Reserve Facility'`;
  db.query(sql, item_id, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

//requests/service_item/:id
app.get("/requests/service_item/:id", (req, res) => {
  const item_id = req.params.id;
  const sql = `
    SELECT 
      tbrequests.*, 
      tbrequests.dept_id AS dept_id,
      tbdepartments.dept_name, 
      tbitems.item_name,
      user1.user_id AS rq_create_user_id, 
      user1.user_fname AS rq_create_user_fname, 
      user1.user_lname AS rq_create_user_lname,
      user2.user_id AS rq_accept_user_id, 
      user2.user_fname AS rq_accept_user_fname, 
      user2.user_lname AS rq_accept_user_lname,
      user3.user_id AS rq_service_user_id, 
      user3.user_fname AS rq_service_user_fname, 
      user3.user_lname AS rq_service_user_lname 
    FROM tbrequests 
    INNER JOIN tbdepartments ON tbrequests.dept_id=tbdepartments.dept_id 
    INNER JOIN tbitems ON tbrequests.item_id=tbitems.item_id 
    INNER JOIN tbuseraccounts user1 ON tbrequests.rq_create_user_id=user1.user_id 
    LEFT JOIN tbuseraccounts user2 ON tbrequests.rq_accept_user_id=user2.user_id 
    LEFT JOIN tbuseraccounts user3 ON tbrequests.rq_service_user_id=user3.user_id 
    WHERE rq_id = ? AND rq_type = 'Service for Item'`;
  db.query(sql, item_id, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

//requests/service_room/:id
app.get("/requests/service_room/:id", (req, res) => {
  const room_id = req.params.id;
  const sql = `
    SELECT 
      tbrequests.*, 
      tbrequests.dept_id AS dept_id,
      tbdepartments.dept_name, 
      tbrooms.room_name,
      user1.user_id AS rq_create_user_id, 
      user1.user_fname AS rq_create_user_fname, 
      user1.user_lname AS rq_create_user_lname,
      user2.user_id AS rq_accept_user_id, 
      user2.user_fname AS rq_accept_user_fname, 
      user2.user_lname AS rq_accept_user_lname,
      user3.user_id AS rq_service_user_id, 
      user3.user_fname AS rq_service_user_fname, 
      user3.user_lname AS rq_service_user_lname 
    FROM tbrequests 
    INNER JOIN tbdepartments ON tbrequests.dept_id=tbdepartments.dept_id 
    INNER JOIN tbrooms ON tbrequests.room_id=tbrooms.room_id 
    INNER JOIN tbuseraccounts user1 ON tbrequests.rq_create_user_id=user1.user_id 
    LEFT JOIN tbuseraccounts user2 ON tbrequests.rq_accept_user_id=user2.user_id 
    LEFT JOIN tbuseraccounts user3 ON tbrequests.rq_service_user_id=user3.user_id 
    WHERE rq_id = ? AND rq_type = 'Service for Facility'`;
    
  db.query(sql, room_id, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

//requests/relate_item/:id
app.get("/requests/relate_item/:id", (req, res) => {
  const item_id = req.params.id;
  const sql = "SELECT *, tbdepartments.dept_name, tbitems.item_name, user1.user_id AS rq_create_user_id, user1.user_fname AS rq_create_user_fname, user1.user_lname AS rq_create_user_lname, user2.user_id AS rq_accept_user_id, user2.user_fname AS rq_accept_user_fname, user2.user_lname AS rq_accept_user_lname FROM tbrequests INNER JOIN tbdepartments ON tbrequests.dept_id=tbdepartments.dept_id INNER JOIN tbitems ON tbrequests.item_id=tbitems.item_id INNER JOIN tbuseraccounts user1 ON tbrequests.rq_create_user_id=user1.user_id LEFT JOIN tbuseraccounts user2 ON tbrequests.rq_accept_user_id=user2.user_id WHERE tbrequests.item_id = ? ORDER BY rq_create_date DESC";
  db.query(sql, item_id, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

//requests/relate_room/:id
app.get("/requests/relate_room/:id", (req, res) => {
  const room_id = req.params.id;
  const sql = "SELECT *, tbdepartments.dept_name, tbrooms.room_name, user1.user_id AS rq_create_user_id, user1.user_fname AS rq_create_user_fname, user1.user_lname AS rq_create_user_lname, user2.user_id AS rq_accept_user_id, user2.user_fname AS rq_accept_user_fname, user2.user_lname AS rq_accept_user_lname FROM tbrequests INNER JOIN tbdepartments ON tbrequests.dept_id=tbdepartments.dept_id INNER JOIN tbrooms ON tbrequests.room_id=tbrooms.room_id INNER JOIN tbuseraccounts user1 ON tbrequests.rq_create_user_id=user1.user_id LEFT JOIN tbuseraccounts user2 ON tbrequests.rq_accept_user_id=user2.user_id WHERE tbrequests.room_id = ? ORDER BY rq_create_date DESC";
  db.query(sql, room_id, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

//requests/created/recent
app.get("/requests/created/recent", (req, res) => {
  const sql = `
      SELECT * FROM tbrequests
      WHERE rq_status != 'Completed'
      ORDER BY rq_create_date DESC
      LIMIT 3
  `;

  db.query(sql, (err, result) => {
      if (err) {
          console.error('Error fetching recent requests:', err);
          return res.status(500).json({ error: "Database query failed" });
      }
      return res.json(result);
  });
});

//requests/completed/recent
app.get("/requests/completed/recent", (req, res) => {
  const sql = `
      SELECT * FROM tbrequests
      WHERE rq_status = 'Completed'
      ORDER BY rq_complete_date DESC
      LIMIT 3
  `;

  db.query(sql, (err, result) => {
      if (err) {
          console.error('Error fetching recent requests:', err);
          return res.status(500).json({ error: "Database query failed" });
      }
      return res.json(result);
  });
});

//requests/department/:id dept_id
app.get('/requests/department/:id', (req, res) => {
  const dept_id = req.params.id;
  const sql = `
    SELECT r.*, 
           d.dept_name,
           COALESCE(i.item_name, rm.room_name) as resource_name,
           u1.user_fname AS rq_create_user_fname,
           u1.user_lname AS rq_create_user_lname,
           u2.user_fname AS rq_accept_user_fname,
           u2.user_lname AS rq_accept_user_lname,
           u3.user_fname AS rq_service_user_fname,
           u3.user_lname AS rq_service_user_lname
    FROM tbrequests r
    INNER JOIN tbdepartments d ON r.dept_id = d.dept_id
    LEFT JOIN tbitems i ON r.item_id = i.item_id
    LEFT JOIN tbrooms rm ON r.room_id = rm.room_id
    INNER JOIN tbuseraccounts u1 ON r.rq_create_user_id = u1.user_id
    LEFT JOIN tbuseraccounts u2 ON r.rq_accept_user_id = u2.user_id
    LEFT JOIN tbuseraccounts u3 ON r.rq_service_user_id = u3.user_id
    WHERE r.dept_id = ?
    ORDER BY r.rq_create_date DESC, r.rq_start_date DESC, r.rq_start_time DESC`;

  db.query(sql, dept_id, (err, result) => {
    if (err) {
      console.error('Error fetching department requests:', err);
      return res.status(500).json({ Message: "Error inside server" });
    }
    return res.json(result);
  });
});

//requests/created_date/:startDate/:endDate
app.get('/requests/created_date/:startDate/:endDate', (req, res) => {
  const { startDate, endDate } = req.params;
  const sql = `
    SELECT r.*, 
           d.dept_name, 
           u.user_fname, 
           u.user_lname,
           i.item_name,
           rm.room_name,
           CONCAT(u2.user_fname, ' ', u2.user_lname) as respondent_name,
           CONCAT(u3.user_fname, ' ', u3.user_lname) as service_staff_name
    FROM tbrequests r
    INNER JOIN tbdepartments d ON r.dept_id = d.dept_id
    INNER JOIN tbuseraccounts u ON r.rq_create_user_id = u.user_id
    LEFT JOIN tbitems i ON r.item_id = i.item_id
    LEFT JOIN tbrooms rm ON r.room_id = rm.room_id
    LEFT JOIN tbuseraccounts u2 ON r.rq_accept_user_id = u2.user_id
    LEFT JOIN tbuseraccounts u3 ON r.rq_service_user_id = u3.user_id
    WHERE r.rq_create_date BETWEEN ? AND ?
    ORDER BY r.rq_create_date DESC
`;

  db.query(sql, [startDate, endDate], (err, result) => {
      if (err) {
          console.error(err);
          return res.status(500).json({ Message: "Error inside server" });
      }
      return res.json(result);
  });
});

//requests/completed_date/:startDate/:endDate
app.get('/requests/completed_date/:startDate/:endDate', (req, res) => {
  const { startDate, endDate } = req.params;
  const sql = `
    SELECT r.*, 
           d.dept_name, 
           u.user_fname, 
           u.user_lname,
           i.item_name,
           rm.room_name,
           CONCAT(u2.user_fname, ' ', u2.user_lname) as respondent_name,
           CONCAT(u3.user_fname, ' ', u3.user_lname) as service_staff_name
    FROM tbrequests r
    INNER JOIN tbdepartments d ON r.dept_id = d.dept_id
    INNER JOIN tbuseraccounts u ON r.rq_create_user_id = u.user_id
    LEFT JOIN tbitems i ON r.item_id = i.item_id
    LEFT JOIN tbrooms rm ON r.room_id = rm.room_id
    LEFT JOIN tbuseraccounts u2 ON r.rq_accept_user_id = u2.user_id
    LEFT JOIN tbuseraccounts u3 ON r.rq_service_user_id = u3.user_id
    WHERE r.rq_complete_date BETWEEN ? AND ?
    ORDER BY r.rq_complete_date DESC
`;

  db.query(sql, [startDate, endDate], (err, result) => {
      if (err) {
          console.error(err);
          return res.status(500).json({ Message: "Error inside server" });
      }
      return res.json(result);
  });
});

//requests/accepted/overdue/:id rq_accept_user_id
app.get("/requests/accepted/overdue/:id", (req, res) => {
  const userId = req.params.id;
  const sql = `
    SELECT r.*, 
           d.dept_name,
           COALESCE(i.item_name, rm.room_name) as resource_name,
           u1.user_fname AS rq_create_user_fname,
           u1.user_lname AS rq_create_user_lname,
           u2.user_fname AS rq_accept_user_fname,
           u2.user_lname AS rq_accept_user_lname
    FROM tbrequests r
    INNER JOIN tbdepartments d ON r.dept_id = d.dept_id
    LEFT JOIN tbitems i ON r.item_id = i.item_id
    LEFT JOIN tbrooms rm ON r.room_id = rm.room_id
    INNER JOIN tbuseraccounts u1 ON r.rq_create_user_id = u1.user_id
    INNER JOIN tbuseraccounts u2 ON r.rq_accept_user_id = u2.user_id
    WHERE r.rq_accept_user_id = ?
    AND r.rq_status != 'Completed'
    AND (
      (r.rq_end_date < CURDATE()) 
      OR (r.rq_end_date = CURDATE() AND r.rq_end_time < CURTIME())
    )
    ORDER BY r.rq_end_date DESC, r.rq_end_time DESC`;

  db.query(sql, userId, (err, result) => {
    if (err) {
      console.error('Error fetching overdue requests:', err);
      return res.status(500).json({ Message: "Error inside server" });
    }
    return res.json(result);
  });
});

// requests/service/overdue/:id rq_service_user_id
app.get("/requests/service/overdue/:id", (req, res) => {
  const userId = req.params.id;
  
  const sql = `
    SELECT r.*, 
           d.dept_name,
           COALESCE(i.item_name, rm.room_name) as resource_name,
           u1.user_fname AS rq_create_user_fname,
           u1.user_lname AS rq_create_user_lname,
           u2.user_fname AS rq_service_user_fname,
           u2.user_lname AS rq_service_user_lname
    FROM tbrequests r
    INNER JOIN tbdepartments d ON r.dept_id = d.dept_id
    LEFT JOIN tbitems i ON r.item_id = i.item_id
    LEFT JOIN tbrooms rm ON r.room_id = rm.room_id
    INNER JOIN tbuseraccounts u1 ON r.rq_create_user_id = u1.user_id
    INNER JOIN tbuseraccounts u2 ON r.rq_service_user_id = u2.user_id
    WHERE r.rq_service_user_id = ?
    AND r.rq_service_status != 'Completed'
    AND (
      (r.rq_end_date < CURDATE()) 
      OR (r.rq_end_date = CURDATE() AND r.rq_end_time < CURTIME())
    )
    ORDER BY r.rq_end_date DESC, r.rq_end_time DESC`;

  db.query(sql, userId, (err, result) => {
    if (err) {
      console.error('Error fetching overdue service requests:', err);
      return res.status(500).json({ Message: "Error inside server" });
    }
    return res.json(result);
  });
});

//requests/reserve_item/add
app.post("/requests/reserve_item/add", (req, res) => {
  const rq_type = req.body.rq_type;
  const dept_id = req.body.dept_id;
  const item_id = req.body.item_id;
  const rq_quantity = req.body.rq_quantity;
  const rq_prio_level = req.body.rq_prio_level;
  const rq_start_date = req.body.rq_start_date;
  const rq_end_date = req.body.rq_end_date;
  const rq_start_time = req.body.rq_start_time;
  const rq_end_time = req.body.rq_end_time;
  const rq_notes = req.body.rq_notes;
  const rq_create_date = req.body.rq_create_date;
  const rq_create_user_id = req.body.rq_create_user_id;
  const rq_status = req.body.rq_status;

  const sql = "INSERT INTO tbrequests (rq_type, dept_id, item_id, rq_quantity, rq_prio_level, rq_start_date, rq_end_date, rq_start_time, rq_end_time, rq_notes, rq_create_date, rq_create_user_id, rq_status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

  db.query(sql, [rq_type, dept_id, item_id, rq_quantity, rq_prio_level, rq_start_date, rq_end_date, rq_start_time, rq_end_time, rq_notes, rq_create_date, rq_create_user_id, rq_status],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send("Item Reservation Request Submitted!");
      }
    }
  );
});

//requests/reserve_room/add
app.post("/requests/reserve_room/add", (req, res) => {
  const rq_type = req.body.rq_type;
  const dept_id = req.body.dept_id;
  const room_id = req.body.room_id;
  const rq_prio_level = req.body.rq_prio_level;
  const rq_start_date = req.body.rq_start_date;
  const rq_end_date = req.body.rq_end_date;
  const rq_start_time = req.body.rq_start_time;
  const rq_end_time = req.body.rq_end_time;
  const rq_notes = req.body.rq_notes;
  const rq_create_date = req.body.rq_create_date;
  const rq_create_user_id = req.body.rq_create_user_id;
  const rq_status = req.body.rq_status;

  const sql = "INSERT INTO tbrequests (rq_type, dept_id, room_id, rq_prio_level, rq_start_date, rq_end_date, rq_start_time, rq_end_time, rq_notes, rq_create_date, rq_create_user_id, rq_status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

  db.query(sql, [rq_type, dept_id, room_id, rq_prio_level, rq_start_date, rq_end_date, rq_start_time, rq_end_time, rq_notes, rq_create_date, rq_create_user_id, rq_status],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send("Room Reservation Request Submitted!");
      }
    }
  );
});

//requests/service_item/add
app.post("/requests/service_item/add", (req, res) => {
  const rq_type = req.body.rq_type;
  const dept_id = req.body.dept_id;
  const item_id = req.body.item_id;
  const rq_quantity = req.body.rq_quantity;
  const rq_service_type = req.body.rq_service_type;
  const rq_prio_level = req.body.rq_prio_level;
  const rq_start_date = req.body.rq_start_date;
  const rq_end_date = req.body.rq_end_date;
  const rq_start_time = req.body.rq_start_time;
  const rq_end_time = req.body.rq_end_time;
  const rq_notes = req.body.rq_notes;
  const rq_create_date = req.body.rq_create_date;
  const rq_create_user_id = req.body.rq_create_user_id;
  const rq_status = req.body.rq_status;

  const sql = "INSERT INTO tbrequests (rq_type, dept_id, item_id, rq_quantity, rq_service_type, rq_prio_level, rq_start_date, rq_end_date, rq_start_time, rq_end_time, rq_notes, rq_create_date, rq_create_user_id, rq_status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

  db.query(sql, [rq_type, dept_id, item_id, rq_quantity, rq_service_type, rq_prio_level, rq_start_date, rq_end_date, rq_start_time, rq_end_time, rq_notes, rq_create_date, rq_create_user_id, rq_status],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send("Service Request Submitted!");
      }
    }
  );
});

//requests/service_room/add
app.post("/requests/service_room/add", (req, res) => {
  const rq_type = req.body.rq_type;
  const dept_id = req.body.dept_id;
  const room_id = req.body.room_id;
  const rq_service_type = req.body.rq_service_type;
  const rq_prio_level = req.body.rq_prio_level;
  const rq_start_date = req.body.rq_start_date;
  const rq_end_date = req.body.rq_end_date;
  const rq_start_time = req.body.rq_start_time;
  const rq_end_time = req.body.rq_end_time;
  const rq_notes = req.body.rq_notes;
  const rq_create_date = req.body.rq_create_date;
  const rq_create_user_id = req.body.rq_create_user_id;
  const rq_status = req.body.rq_status;

  const sql = "INSERT INTO tbrequests (rq_type, dept_id, room_id, rq_service_type, rq_prio_level, rq_start_date, rq_end_date, rq_start_time, rq_end_time, rq_notes, rq_create_date, rq_create_user_id, rq_status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

  db.query(sql, [rq_type, dept_id, room_id, rq_service_type, rq_prio_level, rq_start_date, rq_end_date, rq_start_time, rq_end_time, rq_notes, rq_create_date, rq_create_user_id, rq_status],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send("Service Request Submitted!");
      }
    }
  );
});

//requests/reserve_item/:id edit
app.put("/requests/reserve_item/:id", (req, res) => {
  const itemId = req.params.id;
  const sql = "UPDATE tbrequests SET `rq_complete_date`= ?, `rq_status`= ?, `rq_accept_notes`= ? WHERE `rq_id` = ? AND `rq_type` = 'Reserve Item'";

  var complete_date = '';
  if (req.body.rq_status == 'Completed') {
    complete_date = currentDate;
  }

  const values = [
    complete_date,
    req.body.rq_status,
    req.body.rq_accept_notes
  ];

  db.query(sql, [...values, itemId], (err, data) => {
    if (err) return res.send(err);
    return res.json(data);
  });
});

//requests/reserve_item_conflict/:id edit when conflict
app.put("/requests/reserve_item_conflict/:id", (req, res) => {
  const requestId = req.params.id;
  const sql = "UPDATE tbrequests SET `item_id`= ?, `rq_quantity`= ?, `rq_prio_level`= ?, `rq_start_date`= ?, `rq_end_date`= ?, `rq_start_time`= ?, `rq_end_time`= ?, `rq_notes`= ? WHERE `rq_id` = ? AND `rq_type` = 'Reserve Item'";

  const values = [
    req.body.item_id,
    req.body.rq_quantity,
    req.body.rq_prio_level,
    req.body.rq_start_date,
    req.body.rq_end_date,
    req.body.rq_start_time,
    req.body.rq_end_time,
    req.body.rq_notes
  ];

  db.query(sql, [...values, requestId], (err, data) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).send(err);
    }
    return res.json({
      status: "success",
      message: "Request updated successfully",
      data: data
    });
  });
});

//requests/reserve_item_admin/:id
app.put("/requests/reserve_item_admin/:id", (req, res) => {
  const requestId = req.params.id;
  const sql = "UPDATE tbrequests SET `item_id`= ?, `rq_quantity`= ?, `rq_prio_level`= ?, `rq_start_date`= ?, `rq_end_date`= ?, `rq_start_time`= ?, `rq_end_time`= ?, `rq_notes`= ?, `rq_accept_user_id`= ?, `rq_status`= ? WHERE `rq_id` = ? AND `rq_type` = 'Reserve Item'";

  const values = [
    req.body.item_id,
    req.body.rq_quantity,
    req.body.rq_prio_level,
    req.body.rq_start_date,
    req.body.rq_end_date,
    req.body.rq_start_time,
    req.body.rq_end_time,
    req.body.rq_notes,
    req.body.rq_accept_user_id,
    req.body.rq_status
  ];

  db.query(sql, [...values, requestId], (err, data) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).send(err);
    }
    return res.json({
      status: "success",
      message: "Request updated successfully",
      data: data
    });
  });
});

//requests/reserve_room/:id edit
app.put("/requests/reserve_room/:id", (req, res) => {
  const roomId = req.params.id;
  const sql = "UPDATE tbrequests SET `rq_complete_date`= ?, `rq_status`= ?, `rq_accept_notes`= ? WHERE `rq_id` = ? AND `rq_type` = 'Reserve Facility'";

  var complete_date = '';
  if (req.body.rq_status == 'Completed') {
    complete_date = currentDate;
  }

  const values = [
    complete_date,
    req.body.rq_status,
    req.body.rq_accept_notes
  ];

  db.query(sql, [...values, roomId], (err, data) => {
    if (err) return res.send(err);
    return res.json(data);
  });
});

//requests/reserve_room_conflict/:id edit when conflict
app.put("/requests/reserve_room_conflict/:id", (req, res) => {
  const requestId = req.params.id;
  const sql = "UPDATE tbrequests SET `room_id`= ?, `rq_prio_level`= ?, `rq_start_date`= ?, `rq_end_date`= ?, `rq_start_time`= ?, `rq_end_time`= ?, `rq_notes`= ? WHERE `rq_id` = ? AND `rq_type` = 'Reserve Facility'";

  const values = [
    req.body.room_id,
    req.body.rq_prio_level,
    req.body.rq_start_date,
    req.body.rq_end_date,
    req.body.rq_start_time,
    req.body.rq_end_time,
    req.body.rq_notes
  ];

  db.query(sql, [...values, requestId], (err, data) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).send(err);
    }
    return res.json({
      status: "success",
      message: "Request updated successfully",
      data: data
    });
  });
});

//requests/reserve_room_admin/:id
app.put("/requests/reserve_room_admin/:id", (req, res) => {
  const requestId = req.params.id;
  const sql = "UPDATE tbrequests SET `room_id`= ?, `rq_prio_level`= ?, `rq_start_date`= ?, `rq_end_date`= ?, `rq_start_time`= ?, `rq_end_time`= ?, `rq_notes`= ?, `rq_accept_user_id`= ?, `rq_status`= ? WHERE `rq_id` = ? AND `rq_type` = 'Reserve Facility'";

  const values = [
    req.body.room_id,
    req.body.rq_prio_level,
    req.body.rq_start_date,
    req.body.rq_end_date,
    req.body.rq_start_time,
    req.body.rq_end_time,
    req.body.rq_notes,
    req.body.rq_accept_user_id,
    req.body.rq_status
  ];

  db.query(sql, [...values, requestId], (err, data) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).send(err);
    }
    return res.json({
      status: "success",
      message: "Request updated successfully",
      data: data
    });
  });
});

//requests/service_item/:id edit
app.put("/requests/service_item/:id", (req, res) => {
  const itemId = req.params.id;
  const sql = "UPDATE tbrequests SET `rq_complete_date`= ?, `rq_status`= ?, `rq_service_user_id` = ?, `rq_accept_notes`= ? WHERE `rq_id` = ? AND `rq_type` = 'Service for Item'";

  var complete_date = '';
  if (req.body.rq_status == 'Completed') {
    complete_date = currentDate;
  }

  const values = [
    complete_date,
    req.body.rq_status,
    req.body.rq_service_user_id,
    req.body.rq_accept_notes
  ];

  db.query(sql, [...values, itemId], (err, data) => {
    if (err) return res.send(err);
    return res.json(data);
  });
});

//requests/service_item/progress/:id edit by service staff
app.put("/requests/service_item/progress/:id", (req, res) => {
  proofUpload(req, res, function(err) {
    if (err) {
      console.error('Upload error:', err);
      return res.status(400).json({ error: err.message });
    }

    const itemId = req.params.id;
    let imageData = req.body.rq_service_proof; // Keep existing proof if no new file

    // If there's a new file, convert it to base64
    if (req.file) {
      const base64Image = req.file.buffer.toString('base64');
      imageData = `data:${req.file.mimetype};base64,${base64Image}`;
    }

    const sql = "UPDATE tbrequests SET `rq_service_notes`= ?, `rq_service_proof`= ?, `rq_service_status`= ? WHERE `rq_id` = ? AND `rq_type` = 'Service for Item'";

    const values = [
      req.body.rq_service_notes,
      imageData,
      req.body.rq_service_status
    ];

    db.query(sql, [...values, itemId], (err, data) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).send(err);
      }
      return res.json(data);
    });
  });
});

//requests/service_item_conflict/:id edit when conflict
app.put("/requests/service_item_conflict/:id", (req, res) => {
  const requestId = req.params.id;
  const sql = "UPDATE tbrequests SET `item_id`= ?, `rq_quantity`= ?, `rq_service_type`= ?, `rq_prio_level`= ?, `rq_start_date`= ?, `rq_end_date`= ?, `rq_start_time`= ?, `rq_end_time`= ?, `rq_notes`= ? WHERE `rq_id` = ? AND `rq_type` = 'Service for Item'";

  const values = [
    req.body.item_id,
    req.body.rq_quantity,
    req.body.rq_service_type,
    req.body.rq_prio_level,
    req.body.rq_start_date,
    req.body.rq_end_date,
    req.body.rq_start_time,
    req.body.rq_end_time,
    req.body.rq_notes
  ];

  db.query(sql, [...values, requestId], (err, data) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).send(err);
    }
    return res.json({
      status: "success",
      message: "Request updated successfully",
      data: data
    });
  });
});

//requests/service_item_admin/:id
app.put("/requests/service_item_admin/:id", (req, res) => {
  const requestId = req.params.id;
  const sql = "UPDATE tbrequests SET `item_id`= ?, `rq_quantity`= ?, `rq_service_type`= ?, `rq_prio_level`= ?, `rq_start_date`= ?, `rq_end_date`= ?, `rq_start_time`= ?, `rq_end_time`= ?, `rq_notes`= ?, `rq_accept_user_id`= ?, `rq_accept_notes`= ?, `rq_service_user_id`= ?, `rq_service_notes`= ?, `rq_service_status`= ?, `rq_status`= ? WHERE `rq_id` = ? AND `rq_type` = 'Service for Item'";

  const values = [
    req.body.item_id,
    req.body.rq_quantity,
    req.body.rq_service_type,
    req.body.rq_prio_level,
    req.body.rq_start_date,
    req.body.rq_end_date,
    req.body.rq_start_time,
    req.body.rq_end_time,
    req.body.rq_notes,
    req.body.rq_accept_user_id,
    req.body.rq_accept_notes,
    req.body.rq_service_user_id,
    req.body.rq_service_status,
    req.body.rq_service_notes,
    req.body.rq_status
  ];

  db.query(sql, [...values, requestId], (err, data) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).send(err);
    }
    return res.json({
      status: "success",
      message: "Request updated successfully",
      data: data
    });
  });
});

//requests/service_room/:id edit
app.put("/requests/service_room/:id", (req, res) => {
  const roomId = req.params.id;
  const sql = "UPDATE tbrequests SET `rq_complete_date`= ?, `rq_status`= ?, `rq_service_user_id` = ?, `rq_accept_notes`= ? WHERE `rq_id` = ? AND `rq_type` = 'Service for Facility'";

  var complete_date = '';
  if (req.body.rq_status == 'Completed') {
    complete_date = currentDate;
  }

  const values = [
    complete_date,
    req.body.rq_status,
    req.body.rq_service_user_id,
    req.body.rq_accept_notes
  ];

  db.query(sql, [...values, roomId], (err, data) => {
    if (err) return res.send(err);
    return res.json(data);
  });
});

//requests/service_room/progress/:id edit by service staff
app.put("/requests/service_room/progress/:id", (req, res) => {
  proofUpload(req, res, function(err) {
    if (err) {
      console.error('Upload error:', err);
      return res.status(400).json({ error: err.message });
    }

    const roomId = req.params.id;
    let imageData = req.body.rq_service_proof; // Keep existing proof if no new file

    // If there's a new file, convert it to base64
    if (req.file) {
      const base64Image = req.file.buffer.toString('base64');
      imageData = `data:${req.file.mimetype};base64,${base64Image}`;
    }

    const sql = "UPDATE tbrequests SET `rq_service_notes`= ?, `rq_service_proof`= ?, `rq_service_status`= ? WHERE `rq_id` = ? AND `rq_type` = 'Service for Facility'";

    const values = [
      req.body.rq_service_notes,
      imageData,
      req.body.rq_service_status
    ];

    db.query(sql, [...values, roomId], (err, data) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).send(err);
      }
      return res.json(data);
    });
  });
});

//requests/service_room_conflict/:id edit when conflict
app.put("/requests/service_room_conflict/:id", (req, res) => {
  const requestId = req.params.id;
  const sql = "UPDATE tbrequests SET `room_id`= ?, `rq_service_type`= ?, `rq_prio_level`= ?, `rq_start_date`= ?, `rq_end_date`= ?, `rq_start_time`= ?, `rq_end_time`= ?, `rq_notes`= ? WHERE `rq_id` = ? AND `rq_type` = 'Service for Facility'";

  const values = [
    req.body.room_id,
    req.body.rq_service_type,
    req.body.rq_prio_level,
    req.body.rq_start_date,
    req.body.rq_end_date,
    req.body.rq_start_time,
    req.body.rq_end_time,
    req.body.rq_notes
  ];

  db.query(sql, [...values, requestId], (err, data) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).send(err);
    }
    return res.json({
      status: "success",
      message: "Request updated successfully",
      data: data
    });
  });
});

//requests/service_room_admin/:id
app.put("/requests/service_room_admin/:id", (req, res) => {
  const requestId = req.params.id;
  const sql = "UPDATE tbrequests SET `room_id`= ?, `rq_service_type`= ?, `rq_prio_level`= ?, `rq_start_date`= ?, `rq_end_date`= ?, `rq_start_time`= ?, `rq_end_time`= ?, `rq_notes`= ?, `rq_accept_user_id`= ?, `rq_accept_notes`= ?, `rq_service_user_id`= ?, `rq_service_notes`= ?, `rq_service_status`= ?, `rq_status`= ? WHERE `rq_id` = ? AND `rq_type` = 'Service for Facility'";

  const values = [
    req.body.room_id,
    req.body.rq_service_type,
    req.body.rq_prio_level,
    req.body.rq_start_date,
    req.body.rq_end_date,
    req.body.rq_start_time,
    req.body.rq_end_time,
    req.body.rq_notes,
    req.body.rq_accept_user_id,
    req.body.rq_accept_notes,
    req.body.rq_service_user_id,
    req.body.rq_service_status,
    req.body.rq_service_notes,
    req.body.rq_status
  ];

  db.query(sql, [...values, requestId], (err, data) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).send(err);
    }
    return res.json({
      status: "success",
      message: "Request updated successfully",
      data: data
    });
  });
});

//requests/accept/:id
app.put("/requests/accept/:id", (req, res) => {
  const requestId = req.params.id;
  const sql = "UPDATE tbrequests SET `rq_status`= ?, `rq_accept_user_id`= ? WHERE `rq_id` = ? ";

  const values = [
    req.body.rq_status,
    req.body.rq_accept_user_id
  ];

  db.query(sql, [...values, requestId], (err, data) => {
    if (err) return res.send(err);
    return res.json(data);
  });
});

//requests/delete
app.delete("/requests/:id", (req, res) => {
  const itemId = req.params.id;
  const sql = " DELETE FROM tbrequests WHERE `rq_id` = ? ";

  db.query(sql, [itemId], (err, data) => {
    if (err) return res.send(err);
    return res.json(data);
  });
});

//requests/summary/weekly
app.get("/requests/summary/weekly", (req, res) => {
  const sql = `
        SELECT 
            rq_type,
            SUM(CASE WHEN rq_status != 'Completed' AND WEEK(rq_create_date) = WEEK(CURDATE()) THEN 1 ELSE 0 END) AS ongoing_count,
            SUM(CASE WHEN rq_status = 'Completed' AND WEEK(rq_complete_date) = WEEK(CURDATE()) THEN 1 ELSE 0 END) AS completed_count
        FROM tbrequests
        WHERE YEAR(rq_create_date) = YEAR(CURDATE())  -- Ensure it's the current year
        GROUP BY rq_type
    `;
  db.query(sql, (err, result) => {
    if (err) return res.json({ Message: "Error inside server" });
    else return res.json(result);
  });
});

// requests/summary/monthly
app.get("/requests/summary/monthly", (req, res) => {
  const sql = `
      SELECT 
          rq_type,
          SUM(CASE WHEN rq_status != 'Completed' AND MONTH(rq_create_date) = MONTH(CURDATE()) AND YEAR(rq_create_date) = YEAR(CURDATE()) THEN 1 ELSE 0 END) AS ongoing_count,
          SUM(CASE WHEN rq_status = 'Completed' AND MONTH(rq_complete_date) = MONTH(CURDATE()) AND YEAR(rq_create_date) = YEAR(CURDATE()) THEN 1 ELSE 0 END) AS completed_count
      FROM tbrequests
      GROUP BY rq_type
  `;

  db.query(sql, (err, result) => {
      if (err) {
          console.error('Error fetching monthly summary:', err);
          return res.status(500).json({ error: "Database query failed" });
      }
      return res.json(result);
  });
});

//requests/summary/quarter
app.get("/requests/summary/quarter", (req, res) => {
  const sql = `
      SELECT 
          rq_type,
          SUM(CASE WHEN rq_status != 'Completed' AND QUARTER(rq_create_date) = QUARTER(CURDATE()) AND YEAR(rq_create_date) = YEAR(CURDATE()) THEN 1 ELSE 0 END) AS ongoing_count,
          SUM(CASE WHEN rq_status = 'Completed' AND QUARTER(rq_complete_date) = QUARTER(CURDATE()) AND YEAR(rq_create_date) = YEAR(CURDATE()) THEN 1 ELSE 0 END) AS completed_count
      FROM tbrequests
      GROUP BY rq_type
  `;

  db.query(sql, (err, result) => {
      if (err) {
          console.error('Error fetching quarterly summary:', err);
          return res.status(500).json({ error: "Database query failed" });
      }
      return res.json(result);
  });
});

// Endpoint to get the number of requests created in the past 4 months
app.get('/requests/monthly', (req, res) => {
  const sql = `
      WITH RECURSIVE months AS (
          SELECT 
              DATE_FORMAT(CURDATE() - INTERVAL 3 MONTH, '%Y-%m-01') as date
          UNION ALL
          SELECT 
              DATE_ADD(date, INTERVAL 1 MONTH)
          FROM months
          WHERE DATE_ADD(date, INTERVAL 1 MONTH) <= CURDATE()
      )
      SELECT 
          DATE_FORMAT(m.date, '%M') AS month,
          COUNT(r.rq_id) AS requests,
          DATE_FORMAT(m.date, '%Y-%m') AS sort_date
      FROM 
          months m
          LEFT JOIN tbrequests r ON DATE_FORMAT(STR_TO_DATE(r.rq_create_date, '%Y-%m-%d'), '%Y-%m') = DATE_FORMAT(m.date, '%Y-%m')
      GROUP BY 
          m.date
      ORDER BY 
          m.date;
  `;

  db.query(sql, (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.json({ Message: "Error inside server" });
    } else {
      return res.json(result);
    }
  });
});

// Endpoint to get the number of completed requests in the past 4 months
app.get('/requests/monthly/completed', (req, res) => {
  const sql = `
      WITH RECURSIVE months AS (
          SELECT 
              DATE_FORMAT(CURDATE() - INTERVAL 3 MONTH, '%Y-%m-01') as date
          UNION ALL
          SELECT 
              DATE_ADD(date, INTERVAL 1 MONTH)
          FROM months
          WHERE DATE_ADD(date, INTERVAL 1 MONTH) <= CURDATE()
      )
      SELECT 
          DATE_FORMAT(m.date, '%M') AS month,
          COUNT(r.rq_id) AS requests,
          DATE_FORMAT(m.date, '%Y-%m') AS sort_date
      FROM 
          months m
          LEFT JOIN tbrequests r ON DATE_FORMAT(STR_TO_DATE(r.rq_complete_date, '%Y-%m-%d'), '%Y-%m') = DATE_FORMAT(m.date, '%Y-%m')
          AND r.rq_status = 'Completed'
      GROUP BY 
          m.date
      ORDER BY 
          m.date;
  `;

  db.query(sql, (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.json({ Message: "Error inside server" });
    } else {
      return res.json(result);
    }
  });
});

//jobrequests/all
app.get("/jobrequests/all", (req, res) => {
  const sql = `
    SELECT 
      jb.*, 
      d.dept_name, 
      u_create.user_fname AS create_user_fname, 
      u_create.user_lname AS create_user_lname,
      u_bmo.user_fname AS bmo_user_fname, 
      u_bmo.user_lname AS bmo_user_lname,
      u_custodian.user_fname AS custodian_user_fname, 
      u_custodian.user_lname AS custodian_user_lname,
      u_cads.user_fname AS cads_user_fname, 
      u_cads.user_lname AS cads_user_lname,
      u_recommend.user_fname AS recommend_user_fname, 
      u_recommend.user_lname AS recommend_user_lname
    FROM 
      tbjobrequests jb
    INNER JOIN 
      tbdepartments d ON jb.job_dept_id = d.dept_id
    INNER JOIN 
      tbuseraccounts u_create ON jb.job_create_user_id = u_create.user_id
    LEFT JOIN 
      tbuseraccounts u_bmo ON jb.job_bmo_user_id = u_bmo.user_id
    LEFT JOIN 
      tbuseraccounts u_custodian ON jb.job_custodian_user_id = u_custodian.user_id
    LEFT JOIN 
      tbuseraccounts u_cads ON jb.job_cads_user_id = u_cads.user_id
    LEFT JOIN 
      tbuseraccounts u_recommend ON jb.job_recommend_user_id = u_recommend.user_id`;

  db.query(sql, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ Message: "Error inside server" });
    } else {
      return res.json(result);
    }
  });
});

//jobrequests/deptID/:id
app.get("/jobrequests/deptID/:id", (req, res) => {
  const deptId = req.params.id;
  const sql = `
    SELECT 
      jb.*, 
      d.dept_name, 
      u_create.user_fname AS create_user_fname, 
      u_create.user_lname AS create_user_lname,
      u_bmo.user_fname AS bmo_user_fname, 
      u_bmo.user_lname AS bmo_user_lname,
      u_custodian.user_fname AS custodian_user_fname, 
      u_custodian.user_lname AS custodian_user_lname,
      u_cads.user_fname AS cads_user_fname, 
      u_cads.user_lname AS cads_user_lname,
      u_recommend.user_fname AS recommend_user_fname, 
      u_recommend.user_lname AS recommend_user_lname
    FROM 
      tbjobrequests jb
    INNER JOIN 
      tbdepartments d ON jb.job_dept_id = d.dept_id
    INNER JOIN 
      tbuseraccounts u_create ON jb.job_create_user_id = u_create.user_id
    LEFT JOIN 
      tbuseraccounts u_bmo ON jb.job_bmo_user_id = u_bmo.user_id
    LEFT JOIN 
      tbuseraccounts u_custodian ON jb.job_custodian_user_id = u_custodian.user_id
    LEFT JOIN 
      tbuseraccounts u_cads ON jb.job_cads_user_id = u_cads.user_id
    LEFT JOIN 
      tbuseraccounts u_recommend ON jb.job_recommend_user_id = u_recommend.user_id
    WHERE 
      jb.job_dept_id = ?`;

  db.query(sql, [deptId], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ Message: "Error inside server" });
    } else {
      return res.json(result);
    }
  });
});

//jobrequests/:id job_id
app.get("/jobrequests/:id", (req, res) => {
  const jobId = req.params.id;
  const sql = `
    SELECT 
      jb.*, 
      d.dept_name, 
      u_create.user_fname AS create_user_fname, 
      u_create.user_lname AS create_user_lname,
      u_bmo.user_fname AS bmo_user_fname, 
      u_bmo.user_lname AS bmo_user_lname,
      u_custodian.user_fname AS custodian_user_fname, 
      u_custodian.user_lname AS custodian_user_lname,
      u_cads.user_fname AS cads_user_fname, 
      u_cads.user_lname AS cads_user_lname,
      u_recommend.user_fname AS recommend_user_fname, 
      u_recommend.user_lname AS recommend_user_lname
    FROM 
      tbjobrequests jb
    INNER JOIN 
      tbdepartments d ON jb.job_dept_id = d.dept_id
    INNER JOIN 
      tbuseraccounts u_create ON jb.job_create_user_id = u_create.user_id
    LEFT JOIN 
      tbuseraccounts u_bmo ON jb.job_bmo_user_id = u_bmo.user_id
    LEFT JOIN 
      tbuseraccounts u_custodian ON jb.job_custodian_user_id = u_custodian.user_id
    LEFT JOIN 
      tbuseraccounts u_cads ON jb.job_cads_user_id = u_cads.user_id
    LEFT JOIN 
      tbuseraccounts u_recommend ON jb.job_recommend_user_id = u_recommend.user_id
    WHERE 
      jb.job_id = ?`;

  db.query(sql, [jobId], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ Message: "Error inside server" });
    } else {
      return res.json(result);
    }
  });
});

//jobrequests/submitted/:id job_create_user_id
app.get("/jobrequests/submitted/:id", (req, res) => {
  const userId = req.params.id;
  const sql = `
    SELECT 
      jb.*, 
      d.dept_name, 
      u_create.user_fname AS create_user_fname, 
      u_create.user_lname AS create_user_lname,
      u_bmo.user_fname AS bmo_user_fname, 
      u_bmo.user_lname AS bmo_user_lname,
      u_custodian.user_fname AS custodian_user_fname, 
      u_custodian.user_lname AS custodian_user_lname,
      u_cads.user_fname AS cads_user_fname, 
      u_cads.user_lname AS cads_user_lname
    FROM 
      tbjobrequests jb
    INNER JOIN 
      tbdepartments d ON jb.job_dept_id = d.dept_id
    INNER JOIN 
      tbuseraccounts u_create ON jb.job_create_user_id = u_create.user_id
    LEFT JOIN 
      tbuseraccounts u_bmo ON jb.job_bmo_user_id = u_bmo.user_id
    LEFT JOIN 
      tbuseraccounts u_custodian ON jb.job_custodian_user_id = u_custodian.user_id
    LEFT JOIN 
      tbuseraccounts u_cads ON jb.job_cads_user_id = u_cads.user_id
    WHERE 
      jb.job_create_user_id = ?`;

  db.query(sql, [userId], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ Message: "Error inside server" });
    } else {
      return res.json(result);
    }
  });
});

//jobrequests/bmo_approval
app.get("/jobrequests/bmo_approval/:status", (req, res) => {
  const status = req.params.status;
  const sql = `
    SELECT 
      jb.*, 
      d.dept_name, 
      u_create.user_fname AS create_user_fname, 
      u_create.user_lname AS create_user_lname 
    FROM 
      tbjobrequests jb 
    INNER JOIN 
      tbdepartments d ON jb.job_dept_id = d.dept_id 
    INNER JOIN 
      tbuseraccounts u_create ON jb.job_create_user_id = u_create.user_id 
    WHERE 
      jb.job_bmo_approval = ?`;

  db.query(sql, [status], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ Message: "Error inside server" });
    } else {
      return res.json(result);
    }
  });
});

//jobrequests/cads_approval
app.get("/jobrequests/cads_approval/:status", (req, res) => {
  const status = req.params.status;
  const sql = `
    SELECT 
      jb.*, 
      d.dept_name, 
      u_create.user_fname AS create_user_fname, 
      u_create.user_lname AS create_user_lname 
    FROM 
      tbjobrequests jb 
    INNER JOIN 
      tbdepartments d ON jb.job_dept_id = d.dept_id 
    INNER JOIN 
      tbuseraccounts u_create ON jb.job_create_user_id = u_create.user_id 
    WHERE 
      jb.job_bmo_approval = 'Approved' 
    AND 
      jb.job_cads_approval = ?`;

  db.query(sql, [status], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ Message: "Error inside server" });
    } else {
      return res.json(result);
    }
  });
});

//jobrequests/custodian_approval
app.get("/jobrequests/custodian_approval/:status", (req, res) => {
  const status = req.params.status;
  const sql = `
    SELECT 
      jb.*, 
      d.dept_name, 
      u_create.user_fname AS create_user_fname, 
      u_create.user_lname AS create_user_lname 
    FROM 
      tbjobrequests jb 
    INNER JOIN 
      tbdepartments d ON jb.job_dept_id = d.dept_id 
    INNER JOIN 
      tbuseraccounts u_create ON jb.job_create_user_id = u_create.user_id 
    WHERE 
      jb.job_bmo_approval = 'Approved' 
    AND 
      jb.job_custodian_approval = ?`;

  db.query(sql, [status], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ Message: "Error inside server" });
    } else {
      return res.json(result);
    }
  });
});

//jobrequests/approved
app.get("/jobrequests/approved/:status", (req, res) => {
  const status = req.params.status;
  const sql = `
    SELECT 
      jb.*, 
      d.dept_name, 
      u_create.user_fname AS create_user_fname, 
      u_create.user_lname AS create_user_lname,
      u_bmo.user_fname AS bmo_user_fname, 
      u_bmo.user_lname AS bmo_user_lname,
      u_custodian.user_fname AS custodian_user_fname, 
      u_custodian.user_lname AS custodian_user_lname,
      u_cads.user_fname AS cads_user_fname, 
      u_cads.user_lname AS cads_user_lname
    FROM 
      tbjobrequests jb
    INNER JOIN 
      tbdepartments d ON jb.job_dept_id = d.dept_id
    INNER JOIN 
      tbuseraccounts u_create ON jb.job_create_user_id = u_create.user_id
    LEFT JOIN 
      tbuseraccounts u_bmo ON jb.job_bmo_user_id = u_bmo.user_id
    LEFT JOIN 
      tbuseraccounts u_custodian ON jb.job_custodian_user_id = u_custodian.user_id
    LEFT JOIN 
      tbuseraccounts u_cads ON jb.job_cads_user_id = u_cads.user_id
    WHERE 
      jb.job_bmo_approval = ? 
      AND jb.job_custodian_approval = ? 
      AND jb.job_cads_approval = ?`;

  db.query(sql, [status, status, status], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ Message: "Error inside server" });
    } else {
      return res.json(result);
    }
  });
});

//jobrequests/quarter/created
app.get("/jobrequests/quarter/created", (req, res) => {
  const sql = `
      WITH RECURSIVE months AS (
          SELECT 
              DATE_FORMAT(CURDATE() - INTERVAL 3 MONTH, '%Y-%m-01') as date
          UNION ALL
          SELECT 
              DATE_ADD(date, INTERVAL 1 MONTH)
          FROM months
          WHERE DATE_ADD(date, INTERVAL 1 MONTH) <= CURDATE()
      )
      SELECT 
          DATE_FORMAT(m.date, '%M') AS month,
          COUNT(j.job_id) AS requests,
          DATE_FORMAT(m.date, '%Y-%m') AS sort_date
      FROM 
          months m
          LEFT JOIN tbjobrequests j ON DATE_FORMAT(STR_TO_DATE(j.job_create_date, '%Y-%m-%d'), '%Y-%m') = DATE_FORMAT(m.date, '%Y-%m')
      GROUP BY 
          m.date
      ORDER BY 
          m.date;
  `;

  db.query(sql, (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: "Database query failed" });
    }
    return res.json(result);
  });
});

//jobrequests/quarter/completed
app.get("/jobrequests/quarter/completed", (req, res) => {
  const sql = `
      WITH RECURSIVE months AS (
          SELECT 
              DATE_FORMAT(CURDATE() - INTERVAL 3 MONTH, '%Y-%m-01') as date
          UNION ALL
          SELECT 
              DATE_ADD(date, INTERVAL 1 MONTH)
          FROM months
          WHERE DATE_ADD(date, INTERVAL 1 MONTH) <= CURDATE()
      )
      SELECT 
          DATE_FORMAT(m.date, '%M') AS month,
          COUNT(j.job_id) AS requests,
          DATE_FORMAT(m.date, '%Y-%m') AS sort_date
      FROM 
          months m
          LEFT JOIN tbjobrequests j ON DATE_FORMAT(STR_TO_DATE(j.job_complete_date, '%Y-%m-%d'), '%Y-%m') = DATE_FORMAT(m.date, '%Y-%m')
      WHERE j.job_complete_date IS NULL OR (j.job_complete_date IS NOT NULL AND j.job_complete_date >= DATE_SUB(CURDATE(), INTERVAL 4 MONTH))
      GROUP BY 
          m.date
      ORDER BY 
          m.date;
  `;

  db.query(sql, (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: "Database query failed" });
    }
    return res.json(result);
  });
});

//jobrequests/add
app.post("/jobrequests/add", (req, res) => {
  const job_dept_id = req.body.job_dept_id;
  const job_create_date = req.body.job_create_date;
  const job_items = req.body.job_items; // Assuming this is a JSON object
  const job_purpose = req.body.job_purpose;
  const job_create_user_id = req.body.job_create_user_id;
  const job_letter = req.body.job_letter;
  const job_bmo_approval = req.body.job_bmo_approval;
  const job_custodian_approval = req.body.job_custodian_approval;
  const job_cads_approval = req.body.job_cads_approval;
  const job_status = req.body.job_status;

  const sql = "INSERT INTO tbjobrequests (job_dept_id, job_create_date, job_items, job_purpose, job_create_user_id, job_letter, job_bmo_approval, job_custodian_approval, job_cads_approval, job_status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

  db.query(sql, [job_dept_id, job_create_date, job_items, job_purpose, job_create_user_id, job_letter, job_bmo_approval, job_custodian_approval, job_cads_approval, job_status],
    (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).send("Error adding job request");
      } else {
        // Return both success message and the new job_id
        return res.json({
          message: "Job request added successfully!"
          //job_id: result.insertId
        });
      }
    }
  );
});

//jobrequests/bmo_approval/:id edit
app.put("/jobrequests/bmo_approval/:id", (req, res) => {
  const jobId = req.params.id;
  const { job_bmo_approval, job_bmo_user_id, job_bmo_notes } = req.body;

  const sql = `
    UPDATE tbjobrequests 
    SET 
      job_bmo_approval = ?, 
      job_bmo_user_id = ?, 
      job_bmo_notes = ? 
    WHERE 
      job_id = ?`;

  const values = [job_bmo_approval, job_bmo_user_id, job_bmo_notes, jobId];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ Message: "Error updating job request" });
    }
    return res.json({ Message: "Job request updated successfully!" });
  });
});

//jobrequests/cads_approval/:id edit
app.put("/jobrequests/cads_approval/:id", (req, res) => {
  const jobId = req.params.id;
  const { job_cads_approval, job_cads_user_id, job_cads_notes } = req.body;

  const sql = `
    UPDATE tbjobrequests 
    SET 
      job_cads_approval = ?, 
      job_cads_user_id = ?, 
      job_cads_notes = ? 
    WHERE 
      job_id = ?`;

  const values = [job_cads_approval, job_cads_user_id, job_cads_notes, jobId];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ Message: "Error updating job request" });
    }
    return res.json({ Message: "Job request updated successfully!" });
  });
});

//jobrequests/custodian_approval/:id edit
app.put("/jobrequests/custodian_approval/:id", (req, res) => {
  const jobId = req.params.id;
  const { job_custodian_approval, job_custodian_user_id, job_custodian_notes } = req.body;

  const sql = `
    UPDATE tbjobrequests 
    SET 
      job_custodian_approval = ?, 
      job_custodian_user_id = ?, 
      job_custodian_notes = ? 
    WHERE 
      job_id = ?`;

  const values = [job_custodian_approval, job_custodian_user_id, job_custodian_notes, jobId];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ Message: "Error updating job request" });
    }
    return res.json({ Message: "Job request updated successfully!" });
  });
});

//jobrequests/edit/:id edit when declined
app.put("/jobrequests/edit/:id", (req, res) => {
    const jobId = req.params.id;
    const { job_items, job_purpose, job_letter, job_custodian_approval, job_cads_approval, job_status } = req.body;

    // SQL query to update the job request
    const sql = `
        UPDATE tbjobrequests 
        SET 
            job_items = ?, 
            job_purpose = ?, 
            job_letter = ?, 
            job_custodian_approval = ?, 
            job_cads_approval = ?, 
            job_status = ? 
        WHERE 
            job_id = ?`;

    const values = [job_items, job_purpose, job_letter, job_custodian_approval, job_cads_approval, job_status, jobId];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ Message: "Error updating job request" });
        }
        return res.json({ Message: "Job request updated successfully!" });
    });
});

//jobrequests/status/:id edit
app.put("/jobrequests/status/:id", (req, res) => {
  const jobId = req.params.id;
  const { job_recommendation, job_estimated_cost, job_recommend_user_id, job_status, job_remarks } = req.body;

  var complete_date = '';
  if (req.body.job_status == 'Completed') {
    complete_date = currentDate;
  }

  const sql = `
    UPDATE tbjobrequests 
    SET 
      job_recommendation = ?, 
      job_estimated_cost = ?, 
      job_recommend_user_id = ?, 
      job_status = ?, 
      job_remarks = ?, 
      job_complete_date = ? 
    WHERE 
      job_id = ?`;

  const values = [job_recommendation, job_estimated_cost, job_recommend_user_id, job_status, job_remarks, complete_date, jobId];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ Message: "Error updating job request" });
    }
    return res.json({ Message: "Job request updated successfully!" });
  });
});

//jobrequests/delete/:id
app.delete("/jobrequests/delete/:id", (req, res) => {
  const jobId = req.params.id;
  const sql = "DELETE FROM tbjobrequests WHERE `job_id` = ?";

  db.query(sql, [jobId], (err, data) => {
    if (err) return res.send(err);
    return res.json(data);
  });
});

//departments
app.get('/departments', (req, res) => {
  const sql = "SELECT * FROM tbdepartments";
  db.query(sql, (err, result) => {
    if (err) return res.json({ Message: "Error inside server" });
    else return res.json(result);
  });
});

//departments/maintenance
app.get('/departments/maintenance', (req, res) => {
  const sql = "SELECT * FROM tbdepartments WHERE dept_id = 1 OR dept_id = 2";
  db.query(sql, (err, result) => {
    if (err) return res.json({ Message: "Error inside server" });
    else return res.json(result);
  });
});

//departments/id: get name
app.get('/departments/:id', (req, res) => {
  const dept_id = req.params.id;
  const sql = "SELECT `dept_name` FROM tbdepartments where dept_id = ?";
  db.query(sql, dept_id, (err, result) => {
    if (err) return res.json({ Message: "Error inside server" });
    else return res.json(result);
  });
});

//schedules
app.get('/schedules', (req, res) => {
  const sql = "SELECT *, tbuseraccounts.user_fname, tbuseraccounts.user_lname, tbdepartments.dept_name FROM tbschedules INNER JOIN tbuseraccounts ON tbschedules.sched_user_id=tbuseraccounts.user_id INNER JOIN tbdepartments ON tbschedules.sched_dept_id=tbdepartments.dept_id";
  db.query(sql, (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.json({ Message: "Error inside server" });
    }
    console.log('API response:', result); // Debug log
    return res.json(result);
  });
});

//schedules order by last name
app.get('/schedules/lname', (req, res) => {
  const sql = "SELECT *, tbuseraccounts.user_fname, tbuseraccounts.user_lname, tbdepartments.dept_name FROM tbschedules INNER JOIN tbuseraccounts ON tbschedules.sched_user_id=tbuseraccounts.user_id INNER JOIN tbdepartments ON tbschedules.sched_dept_id=tbdepartments.dept_id ORDER BY tbuseraccounts.user_lname";
  db.query(sql, (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.json({ Message: "Error inside server" });
    }
    console.log('API response:', result); // Debug log
    return res.json(result);
  });
});

//schedules/:id
app.get("/schedules/:id", (req, res) => {
  const sched_id = req.params.id;
  const sql = "SELECT *, tbuseraccounts.user_fname, tbuseraccounts.user_lname, tbdepartments.dept_name FROM tbschedules INNER JOIN tbuseraccounts ON tbschedules.sched_user_id=tbuseraccounts.user_id INNER JOIN tbdepartments ON tbschedules.sched_dept_id=tbdepartments.dept_id WHERE tbschedules.sched_id = ?";
  db.query(sql, sched_id, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

//schedules/deptID/:id
app.get("/schedules/deptID/:id", (req, res) => {
  const dept_id = req.params.id;
  const sql = "SELECT *, tbuseraccounts.user_fname, tbuseraccounts.user_lname, tbdepartments.dept_name FROM tbschedules INNER JOIN tbuseraccounts ON tbschedules.sched_user_id=tbuseraccounts.user_id INNER JOIN tbdepartments ON tbschedules.sched_dept_id=tbdepartments.dept_id WHERE tbschedules.sched_create_dept_id = ?";
  
  db.query(sql, dept_id, (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: "Database query failed" });
    } else {
      res.json(result);
    }
  });
});

//schedules/deptID/lname/:id order by last name
app.get("/schedules/deptID/lname/:id", (req, res) => {
  const dept_id = req.params.id;
  const sql = "SELECT *, tbuseraccounts.user_fname, tbuseraccounts.user_lname, tbdepartments.dept_name FROM tbschedules INNER JOIN tbuseraccounts ON tbschedules.sched_user_id=tbuseraccounts.user_id INNER JOIN tbdepartments ON tbschedules.sched_dept_id=tbdepartments.dept_id WHERE tbschedules.sched_create_dept_id = ?  ORDER BY tbuseraccounts.user_lname";
  
  db.query(sql, dept_id, (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: "Database query failed" });
    } else {
      res.json(result);
    }
  });
});

//schedules/userID/:id
app.get("/schedules/userID/:id", (req, res) => {
  const user_id = req.params.id;
  const sql = "SELECT *, tbuseraccounts.user_fname, tbuseraccounts.user_lname, tbdepartments.dept_name FROM tbschedules INNER JOIN tbuseraccounts ON tbschedules.sched_user_id=tbuseraccounts.user_id INNER JOIN tbdepartments ON tbschedules.sched_dept_id=tbdepartments.dept_id WHERE tbschedules.sched_user_id = ?";
  
  db.query(sql, user_id, (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: "Database query failed" });
    } else {
      res.json(result);
    }
  });
});

//schedules/add
app.post("/schedules/add", (req, res) => {
  const sched_user_id = req.body.sched_user_id;
  const sched_dept_id = req.body.sched_dept_id;
  const sched_days_of_week = req.body.sched_days_of_week;
  const sched_time_in = req.body.sched_time_in;
  const sched_time_out = req.body.sched_time_out;
  const sched_start_date = req.body.sched_start_date;
  const sched_end_date = req.body.sched_end_date;
  const sched_notes = req.body.sched_notes;
  const sched_create_dept_id = req.body.sched_create_dept_id;

  const sql = "INSERT INTO tbschedules (sched_user_id, sched_dept_id, sched_days_of_week, sched_time_in, sched_time_out, sched_start_date, sched_end_date, sched_notes, sched_create_dept_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

  db.query(sql, [sched_user_id, sched_dept_id, sched_days_of_week, sched_time_in, sched_time_out, sched_start_date, sched_end_date, sched_notes, sched_create_dept_id],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        return res.json({ message: "Schedule Added Successfully!", sched_id: result.insertId });
      }
    }
  );
});

//schedules/edit/:id
app.put("/schedules/:id", (req, res) => {
  const schedId = req.params.id;
  const sql = "UPDATE tbschedules SET `sched_user_id`= ?, `sched_dept_id`= ?, `sched_days_of_week`= ?, `sched_time_in`= ?, `sched_time_out`= ?, `sched_start_date`= ?, `sched_end_date`= ?, `sched_notes`= ? WHERE `sched_id` = ?";

  const values = [
    req.body.sched_user_id,
    req.body.sched_dept_id,
    req.body.sched_days_of_week,
    req.body.sched_time_in,
    req.body.sched_time_out,
    req.body.sched_start_date,
    req.body.sched_end_date,
    req.body.sched_notes
  ];

  db.query(sql, [...values, schedId], (err, data) => {
    if (err) return res.send(err);
    return res.json(data);
  });
});

//schedules/delete/:id
app.delete("/schedules/:id", (req, res) => {
  const schedId = req.params.id;
  const sql = "DELETE FROM tbschedules WHERE `sched_id` = ?";

  db.query(sql, [schedId], (err, data) => {
    if (err) return res.send(err);
    return res.json(data);
  });
});


// Get notifications for a user
app.get("/notifications/:userId", (req, res) => {
  const userId = req.params.userId;
  const sql = "SELECT * FROM tbnotifs WHERE notif_user_id = ? ORDER BY notif_date DESC LIMIT 10";

  db.query(sql, [userId], (err, result) => {
    if (err) return res.json({ Message: "Error inside server" });
    return res.json(result);
  });
});

// Create new notification
app.post("/notifications/add", (req, res) => {
  const sql = "INSERT INTO tbnotifs (notif_user_id, notif_type, notif_content, notif_date, notif_read, notif_related_id) VALUES (?, ?, ?, ?, 0, ?)";

  const values = [
    req.body.notif_user_id,
    req.body.notif_type,
    req.body.notif_content,
    today.toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    }),
    req.body.notif_related_id
  ];

  db.query(sql, values, (err, result) => {
    if (err) return res.json({ Message: "Error inside server" });
    return res.json(result);
  });
});

// Create notifications to multiple users
app.post('/notifications/create-job-request', async (req, res) => {
  try {
      const { job_request_id, notification_type, content, user_roles } = req.body;

      // Get all users with the specified roles
      const users = await pool.query(
          'SELECT user_id FROM users WHERE role = ANY($1)',
          [user_roles]
      );

      // Create notifications for each user
      for (const user of users.rows) {
          await pool.query(
              'INSERT INTO tbnotifs (notif_user_id, notif_type, notif_content, notif_related_id, notif_date, notif_read) VALUES ($1, $2, $3, $4, $5, false)',
              [user.user_id, notification_type, content, job_request_id, currentDate]
          );
      }

      res.json({ message: 'Notifications created successfully' });
  } catch (error) {
      console.error('Error creating notifications:', error);
      res.status(500).json({ error: 'Failed to create notifications' });
  }
});

// Mark notifications as read
app.put("/notifications/mark-read/:userId", (req, res) => {
  const userId = req.params.userId;
  const sql = "UPDATE tbnotifs SET notif_read = 1 WHERE notif_user_id = ? AND notif_read = 0";

  db.query(sql, [userId], (err, result) => {
    if (err) return res.json({ Message: "Error inside server" });
    return res.json(result);
  });
});

//listen
app.listen(8081, () => {
  console.log("Listening to Port 8081");
});