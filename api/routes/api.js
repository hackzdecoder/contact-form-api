const express = require("express");
const router = express.Router();
const protected = express.Router();
const middleware = require("../middleware/middleware");

const UserController = require("../controllers/UserController");
const DashboardController = require("../controllers/DashboardController");

// Public routes
router.post("/create", UserController.create);
router.post("/login", UserController.login);

// Protected routes
protected.use(middleware);

protected.post("/logout", UserController.logout);

protected.post("/dashboard", DashboardController.index);

// CRUD for contact_persons
protected.get("/contacts", DashboardController.getAllContacts);
protected.post("/contacts/create", DashboardController.createContact);
protected.post("/contacts/edit/:id", DashboardController.getContactById);
protected.post("/contacts/update/:id", DashboardController.updateContact);
protected.post("/contacts/delete/:id", DashboardController.deleteContact);


// router.get("/guard", middleware, (request, response) => {
//   if (!request.user) {
//     return response.status(401).json({ message: "Unauthenticated" });
//   }

//   response.status(200).json({
//     message: "Authenticated",
//     user: request.user,
//   });
// })


// Mount protected routes
router.use(protected);

module.exports = router;
