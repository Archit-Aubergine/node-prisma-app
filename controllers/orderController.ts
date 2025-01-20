import ErrorHandler from "../utils/ErrorHandler";
import AsyncErrorHandler from "../middleware/AsyncErrorHandler";
import { NextFunction, Request, Response } from "express";
import { prismaClient } from "..";

// Create new Order
export const newOrder = async (req: any, res: Response) => {
  try {
    const {
      shippingInfo,
      orderItems,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    } = req.body;

    const userId = req.user.id;

    // Create the order with nested write for orderItems
    const order = await prismaClient.order.create({
      data: {
        userId,
        orderItems: {
          create: orderItems.map((item: any) => ({
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
            productId: item.productId,
          })),
        },
        paidAt: new Date(),
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        orderStatus: "Processing",
        paymentStatus: "PAID", // Assuming the payment status is 'PAID'
      },
      include: {
        orderItems: true,
      },
    });

    res.status(201).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

// get Single Order
export const getSingleOrder = AsyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const order = await prismaClient.order.findUnique({
      where: { id: Number(req.params.id) },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    if (!order) {
      return next(new ErrorHandler("Order not found with this Id", 404));
    }

    res.status(200).json({
      success: true,
      order,
    });
  }
);

// get logged in user  Orders
export const myOrders = AsyncErrorHandler(
  async (req: any, res: Response, next: NextFunction) => {
    // console.log('hittt')
    const orders = await prismaClient.order.findMany({
      where: { userId: req.user._id },
    });

    res.status(200).json({
      success: true,
      orders,
    });
  }
);

// get all Orders -- Admin
export const getAllOrders = AsyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const orders = await prismaClient.order.findMany();

    let totalAmount = 0;

    orders.forEach((order) => {
      totalAmount += order.totalPrice;
    });

    res.status(200).json({
      success: true,
      totalAmount,
      orders,
    });
  }
);

// update Order Status -- Admin
export const updateOrder = AsyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const order = await prismaClient.order.findUnique({
      where: { id: Number(req.params.id) },
    });

    if (!order) {
      return next(new ErrorHandler("Order not found with this Id", 404));
    }

    if (order.orderStatus === "Delivered") {
      return next(
        new ErrorHandler("You have already delivered this order", 400)
      );
    }

    if (req.body.status === "Shipped") {
      let orderItems = await prismaClient.orderItem.findMany({
        where: { orderId: order.id },
      });
    }
    order.orderStatus = req.body.status;

    if (req.body.status === "Delivered") {
      order.deliveredAt = new Date();
    }

    res.status(200).json({
      success: true,
    });
  }
);

// delete Order -- Admin
export const deleteOrder = AsyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const order = await prismaClient.order.findUnique({
      where: { id: Number(req.params.id) },
    });

    if (!order) {
      return next(new ErrorHandler("Order not found with this Id", 404));
    }

    await prismaClient.order.delete({ where: { id: Number(req.params.id) } });

    res.status(200).json({
      success: true,
    });
  }
);
