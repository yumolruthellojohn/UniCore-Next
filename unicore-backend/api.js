const express = require("express");
const cors = require("cors");
const mysql = require("mysql");

const app = express();

app.use(cors());
app.use(express.json());

const today = new Date();
const month = today.getMonth()+1;
const year = today.getFullYear();
const date = today.getDate();
const currentDate = year + "-" + month + "-" + date;

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "unicoredb"
});

//login
app.post("/login", (req, res) => {
    const sql = "SELECT * FROM tbuseraccounts WHERE `user_idnum` = ?  AND `user_password` = ?";
    db.query(sql, [req.body.user_idnum,req.body.user_password], (err, result) => {
        if(err) return res.json({Message: "Error inside server"});
        else return res.json(result);
    });
});

//get user type
app.get("/users/user_type", (req, res) => {
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

//items
app.get("/items", (req, res) => {
    const sql = "SELECT *, tbdepartments.dept_name FROM tbitems INNER JOIN tbdepartments ON tbitems.dept_id=tbdepartments.dept_id";
    db.query(sql, (err, result) => {
        if(err) return res.json({Message: "Error inside server"});
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

//items/add
app.post("/items/add", (req, res) => {
    const item_category = req.body.item_category;
    const item_control = req.body.item_control;
    const item_quantity = req.body.item_quantity;
    const item_measure = req.body.item_measure;
    const item_name = req.body.item_name;
    const item_desc = req.body.item_name_desc;
    const item_buy_date = req.body.item_buy_date;
    const item_buy_cost = req.body.item_buy_cost;
    const item_total = item_quantity * item_buy_cost;
    const item_remarks = req.body.item_remarks;
    const dept_id = req.body.dept_id;
    
    const sql = "INSERT INTO tbitems (item_category, item_control, item_quantity, item_measure, item_name, item_desc, item_buy_date, item_buy_cost, item_total, item_remarks, dept_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

    db.query(sql, [item_category, item_control, item_quantity, item_measure, item_name, item_desc, item_buy_date, item_buy_cost, item_total, item_remarks, dept_id],
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
    const sql = "UPDATE tbitems SET `item_category`= ?, `item_control`= ?, `item_quantity`= ?, `item_measure`= ?, `item_name`= ?, `item_desc`= ?, `item_buy_date`= ?, `item_buy_cost`= ?, `item_total`= ?, `item_remarks`= ?, `dept_id`= ? WHERE `item_id` = ?";
   
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
        req.body.dept_id
    ];
   
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

//items_summary
app.get("/items_summary", (req, res) => {
    const sql = "SELECT `item_category`, SUM(item_quantity) AS `total_quantity`, SUM(item_total) AS `total_cost` FROM tbitems GROUP BY `item_category`";
    db.query(sql, (err, result) => {
      if(err) return res.json({Message: "Error inside server"});
      else return res.json(result);
    });
});

//rooms
app.get('/rooms', (req, res) => {
    const sql = "SELECT *, tbdepartments.dept_name FROM tbrooms INNER JOIN tbdepartments ON tbrooms.dept_id=tbdepartments.dept_id";
    db.query(sql, (err, result) => {
      if(err) return res.json({Message: "Error inside server"});
      else return res.json(result);
    });
});

//rooms/:id
app.get("/rooms/:id", (req, res) => {
    const item_id = req.params.id;
    const sql = "SELECT *, tbdepartments.dept_name FROM tbrooms INNER JOIN tbdepartments ON tbrooms.dept_id=tbdepartments.dept_id WHERE tbrooms.room_id = ?";
    db.query(sql, item_id, (err, result) => {
      if (err) {
      console.log(err);
      } else {
      res.send(result);
      }
    });
});

//rooms/add
app.post("/rooms/add", (req, res) => {
    const room_name = req.body.room_name;
    const room_desc = req.body.room_desc;
    const room_status = req.body.room_status;
    const dept_id = req.body.dept_id;
  
    const sql = "INSERT INTO tbrooms (room_name, room_desc, room_status, dept_id) VALUES (?, ?, ?, ?)";

    db.query(sql, [room_name, room_desc, room_status, dept_id],
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
    const itemId = req.params.id;
    const sql = "UPDATE tbrooms SET `room_name`= ?, `room_desc`= ?, `room_status`= ?, `dept_id`= ? WHERE `room_id` = ?";
 
    const values = [
      req.body.room_name,
      req.body.room_desc,
      req.body.room_status,
      req.body.dept_id
    ];
 
    db.query(sql, [...values, itemId], (err, data) => {
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
        if(err) return res.json({Message: "Error inside server"});
        else return res.json(result);
    });
});

//requests/reserve_item
app.get('/requests/reserve_item', (req, res) => {
    const sql = "SELECT *, tbdepartments.dept_name, tbitems.item_name, user1.user_id AS rq_create_user_id, user1.user_fname AS rq_create_user_fname, user1.user_lname AS rq_create_user_lname, user2.user_id AS rq_accept_user_id, user2.user_fname AS rq_accept_user_fname, user2.user_lname AS rq_accept_user_lname FROM tbrequests INNER JOIN tbdepartments ON tbrequests.dept_id=tbdepartments.dept_id INNER JOIN tbitems ON tbrequests.item_id=tbitems.item_id INNER JOIN tbuseraccounts user1 ON tbrequests.rq_create_user_id=user1.user_id LEFT JOIN tbuseraccounts user2 ON tbrequests.rq_accept_user_id=user2.user_id WHERE `rq_type` = 'Reserve Item'";
    db.query(sql, (err, result) => {
        if(err) return res.json({Message: "Error inside server"});
        else return res.json(result);
    });
});

//requests/reserve_room
app.get('/requests/reserve_room', (req, res) => {
    const sql = "SELECT *, tbdepartments.dept_name, tbrooms.room_name, user1.user_id AS rq_create_user_id, user1.user_fname AS rq_create_user_fname, user1.user_lname AS rq_create_user_lname, user2.user_id AS rq_accept_user_id, user2.user_fname AS rq_accept_user_fname, user2.user_lname AS rq_accept_user_lname FROM tbrequests INNER JOIN tbdepartments ON tbrequests.dept_id=tbdepartments.dept_id INNER JOIN tbrooms ON tbrequests.room_id=tbrooms.room_id INNER JOIN tbuseraccounts user1 ON tbrequests.rq_create_user_id=user1.user_id LEFT JOIN tbuseraccounts user2 ON tbrequests.rq_accept_user_id=user2.user_id WHERE `rq_type` = 'Reserve Room'";
    db.query(sql, (err, result) => {
        if(err) return res.json({Message: "Error inside server"});
        else return res.json(result);
    });
});

//requests/service
app.get('/requests/service', (req, res) => {
    const sql = "SELECT *, tbdepartments.dept_name, user1.user_id AS rq_create_user_id, user1.user_fname AS rq_create_user_fname, user1.user_lname AS rq_create_user_lname, user2.user_id AS rq_accept_user_id, user2.user_fname AS rq_accept_user_fname, user2.user_lname AS rq_accept_user_lname FROM tbrequests INNER JOIN tbdepartments ON tbrequests.dept_id=tbdepartments.dept_id INNER JOIN tbuseraccounts user1 ON tbrequests.rq_create_user_id=user1.user_id LEFT JOIN tbuseraccounts user2 ON tbrequests.rq_accept_user_id=user2.user_id WHERE `rq_type` = 'Service'";
    db.query(sql, (err, result) => {
        if(err) return res.json({Message: "Error inside server"});
        else return res.json(result);
    });
});

//requests/:id
app.get("/requests/:id", (req, res) => {
    const item_id = req.params.id;
    const sql = "SELECT * FROM tbrequests WHERE `rq_id` = ?";
    db.query(sql, item_id, (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    });
});

//requests/reserve_item/:id
app.get("/requests/reserve_item/:id", (req, res) => {
    const item_id = req.params.id;
    const sql = "SELECT *, tbdepartments.dept_name, tbitems.item_name, user1.user_id AS rq_create_user_id, user1.user_fname AS rq_create_user_fname, user1.user_lname AS rq_create_user_lname, user2.user_id AS rq_accept_user_id, user2.user_fname AS rq_accept_user_fname, user2.user_lname AS rq_accept_user_lname FROM tbrequests INNER JOIN tbdepartments ON tbrequests.dept_id=tbdepartments.dept_id INNER JOIN tbitems ON tbrequests.item_id=tbitems.item_id INNER JOIN tbuseraccounts user1 ON tbrequests.rq_create_user_id=user1.user_id LEFT JOIN tbuseraccounts user2 ON tbrequests.rq_accept_user_id=user2.user_id WHERE `rq_id` = ? AND `rq_type` = 'Reserve Item'";
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
    const sql = "SELECT *, tbdepartments.dept_name, tbrooms.room_name, user1.user_id AS rq_create_user_id, user1.user_fname AS rq_create_user_fname, user1.user_lname AS rq_create_user_lname, user2.user_id AS rq_accept_user_id, user2.user_fname AS rq_accept_user_fname, user2.user_lname AS rq_accept_user_lname FROM tbrequests INNER JOIN tbdepartments ON tbrequests.dept_id=tbdepartments.dept_id INNER JOIN tbrooms ON tbrequests.room_id=tbrooms.room_id INNER JOIN tbuseraccounts user1 ON tbrequests.rq_create_user_id=user1.user_id LEFT JOIN tbuseraccounts user2 ON tbrequests.rq_accept_user_id=user2.user_id WHERE `rq_id` = ? AND `rq_type` = 'Reserve Room'";
    db.query(sql, item_id, (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    });
});

//requests/service/:id
app.get("/requests/service/:id", (req, res) => {
    const item_id = req.params.id;
    const sql = "SELECT *, tbdepartments.dept_name, user1.user_id AS rq_create_user_id, user1.user_fname AS rq_create_user_fname, user1.user_lname AS rq_create_user_lname, user2.user_id AS rq_accept_user_id, user2.user_fname AS rq_accept_user_fname, user2.user_lname AS rq_accept_user_lname FROM tbrequests INNER JOIN tbdepartments ON tbrequests.dept_id=tbdepartments.dept_id INNER JOIN tbuseraccounts user1 ON tbrequests.rq_create_user_id=user1.user_id LEFT JOIN tbuseraccounts user2 ON tbrequests.rq_accept_user_id=user2.user_id WHERE `rq_id` = ? AND `rq_type` = 'Service'";
    db.query(sql, item_id, (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    });
});

//requests/reserve_item/add
app.post("/requests/reserve_item/add", (req, res) => {
    const rq_type = req.body.rq_type;
    const dept_id = req.body.dept_id;
    const item_id = req.body.item_id;
    const rq_notes = req.body.rq_notes;
    const rq_create_date = req.body.rq_create_date;
    const rq_create_user_id = req.body.rq_create_user_id;
    const rq_status = req.body.rq_status;
    
    const sql = "INSERT INTO tbrequests (rq_type, dept_id, item_id, rq_notes, rq_create_date, rq_create_user_id, rq_status) VALUES (?, ?, ?, ?, ?, ?, ?)";

    db.query(sql, [rq_type, dept_id, item_id, rq_notes, rq_create_date, rq_create_user_id, rq_status],
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
    const rq_notes = req.body.rq_notes;
    const rq_create_date = req.body.rq_create_date;
    const rq_create_user_id = req.body.rq_create_user_id;
    const rq_status = req.body.rq_status;
    
    const sql = "INSERT INTO tbrequests (rq_type, dept_id, room_id, rq_notes, rq_create_date, rq_create_user_id, rq_status) VALUES (?, ?, ?, ?, ?, ?, ?)";

    db.query(sql, [rq_type, dept_id, room_id, rq_notes, rq_create_date, rq_create_user_id, rq_status],
      (err, result) => {
        if (err) {
          console.log(err);
        } else {
          res.send("Room Reservation Request Submitted!");
        }
      }
    );
});

//requests/service/add
app.post("/requests/service/add", (req, res) => {
    const rq_type = req.body.rq_type;
    const dept_id = req.body.dept_id;
    const rq_service_type = req.body.rq_service_type;
    const rq_notes = req.body.rq_notes;
    const rq_create_date = req.body.rq_create_date;
    const rq_create_user_id = req.body.rq_create_user_id;
    const rq_status = req.body.rq_status;
    
    const sql = "INSERT INTO tbrequests (rq_type, dept_id, rq_service_type, rq_notes, rq_create_date, rq_create_user_id, rq_status) VALUES (?, ?, ?, ?, ?, ?, ?)";

    db.query(sql, [rq_type, dept_id, rq_service_type, rq_notes, rq_create_date, rq_create_user_id, rq_status],
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
    const sql = "UPDATE tbrequests SET `rq_complete_date`= ?, `rq_status`= ?, `rq_notes`= ? WHERE `rq_id` = ? AND `rq_type` = 'Reserve Item'";
  
    var complete_date = '';
    if(req.body.rq_status == 'Completed')
    {
      complete_date = currentDate;
    }

    const values = [
        complete_date,
        req.body.rq_status_id,
        req.body.rq_notes
    ];
  
    db.query(sql, [...values, itemId], (err, data) => {
      if (err) return res.send(err);
      return res.json(data);
    });
});

//requests/reserve_room/:id edit
app.put("/requests/reserve_room/:id", (req, res) => {
    const itemId = req.params.id;
    const sql = "UPDATE tbrequests SET `rq_complete_date`= ?, `rq_status`= ?, `rq_notes`= ? WHERE `rq_id` = ? AND `rq_type` = 'Reserve Room'";

    var complete_date = '';
    if(req.body.rq_status == 'Completed')
    {
      complete_date = currentDate;
    }

    const values = [
        complete_date,
        req.body.rq_status_id,
        req.body.rq_notes
    ];

    db.query(sql, [...values, itemId], (err, data) => {
      if (err) return res.send(err);
      return res.json(data);
    });
});

//requests/service/:id edit
app.put("/requests/service/:id", (req, res) => {
    const itemId = req.params.id;
    const sql = "UPDATE tbrequests SET `rq_complete_date`= ?, `rq_status`= ?, `rq_notes`= ? WHERE `rq_id` = ? AND `rq_type` = 'Service'";

    var complete_date = '';
    if(req.body.rq_status == 'Completed')
    {
      complete_date = currentDate;
    }

    const values = [
        complete_date,
        req.body.rq_status_id,
        req.body.rq_notes
    ];

    db.query(sql, [...values, itemId], (err, data) => {
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

//requests_summary
app.get("/requests_summary", (req, res) => {
    const sql = `
        SELECT 
            rq_type,
            SUM(CASE WHEN rq_status != 'Completed' THEN 1 ELSE 0 END) AS ongoing_count,
            SUM(CASE WHEN rq_status = 'Completed' THEN 1 ELSE 0 END) AS completed_count
        FROM tbrequests
        GROUP BY rq_type
    `;
    db.query(sql, (err, result) => {
        if(err) return res.json({Message: "Error inside server"});
        else return res.json(result);
    });
});

//departments
app.get('/departments', (req, res) => {
    const sql = "SELECT * FROM tbdepartments";
    db.query(sql, (err, result) => {
        if(err) return res.json({Message: "Error inside server"});
        else return res.json(result);
    });
});

//listen
app.listen(8081, () => {
    console.log("Listening to Port 8081");
});