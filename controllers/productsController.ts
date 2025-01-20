import ErrorHandler from "../utils/ErrorHandler";
import AsyncErrorHandler from "../middleware/AsyncErrorHandler";
import { prismaClient } from "..";
import { NextFunction, Request, Response } from "express";

////////////////////////////////////////////////////////////////

// get all the products
export const getAllProducts = AsyncErrorHandler(
  async (req: Request, res: Response) => {
    let products = await prismaClient.product.findMany();
    const productCount = await prismaClient.product.count();
    res.status(200).json({
      success: true,
      products,
      productCount,
    });
  }
);

// get single product - product details
export const getProductDetails = AsyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const product = await prismaClient.product.findUnique({
      where: { id: Number(req.params.id) },
    });

    if (!product) {
      return next(new ErrorHandler("Product Not Found", 404));
    }
    res.status(201).json({
      success: true,
      product,
    });
  }
);

// Get All Product (Admin)
export const getAdminProducts = AsyncErrorHandler(
  async (req: Request, res: Response) => {
    const products = await prismaClient.product.findMany();

    res.status(200).json({
      success: true,
      products,
    });
  }
);

// create the product
export const createProduct = AsyncErrorHandler(
  async (req: any, res: Response, next: NextFunction) => {
    req.body.createdBy = req.user.id;

    const productData = {
      ...req.body,
      createdBy: {
        connect: { id: req.body.createdById }, // Transform createdById to proper format
      },
    };

    // Remove the createdById from the data since we've handled it above
    delete productData.createdById;

    const product = await prismaClient.product.create({
      data: productData,
    });
    if (!product) {
      return next(new ErrorHandler("Product Not Created", 404));
    } else {
      res.status(201).json({
        success: true,
        message: "Product created",
        product,
      });
    }
  }
);

// update the product
export const updateProduct = AsyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    let product = await prismaClient.product.findUnique({
      where: { id: Number(req.params.id) },
    });

    if (!product) {
      return next(new ErrorHandler("Product Not Found", 404));
    }

    product = await prismaClient.product.update({
      where: { id: Number(req.params.id) },
      data: req.body,
    });

    res.status(200).json({
      success: true,
      product,
    });
  }
);

// delete the product
export const deleteProduct = AsyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // First check if product exists
    const exists = await prismaClient.product.findUnique({
      where: { id: Number(req.params.id) },
    });

    if (!exists) {
      return next(new ErrorHandler("Product Not Found", 404));
    }

    // If we get here, we know the product exists, so we can safely delete it
    const product = await prismaClient.product.delete({
      where: { id: Number(req.params.id) },
    });

    res.status(200).json({
      success: true,
      product,
    });
  }
);
