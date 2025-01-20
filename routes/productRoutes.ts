import express from "express";
const router = express.Router();
import {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductDetails,
  getAdminProducts,
} from "../controllers/productsController";
import { AuthenticateUser, AuthorizeRole } from "../middleware/auth";

// get all products
router.get("/products", getAllProducts);

// get single product : product details
router.get("/product/:id", getProductDetails);

// create the product
router.post(
  "/product/new",
  AuthenticateUser,
  AuthorizeRole("ADMIN"),
  createProduct
);

// update the product - (Admin Only)
router.put(
  "/product/:id",
  AuthenticateUser,
  AuthorizeRole("ADMIN"),
  updateProduct
);

// delete the product - (Admin Only)
router.delete(
  "/product/:id",
  AuthenticateUser,
  AuthorizeRole("ADMIN"),
  deleteProduct
);

router
  .route("/admin/product/:id")
  .put(AuthenticateUser, AuthorizeRole("ADMIN"), updateProduct)
  .delete(AuthenticateUser, AuthorizeRole("ADMIN"), deleteProduct);

export default router;
