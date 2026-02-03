import GoverningBody from "../models/governing-body.model.js";
import { AppError } from "../middlewares/error-handler.middleware.js";

export const createBody = async (req, res, next) => {
  try {
    const body = await GoverningBody.create(req.body);
    res.status(201).json({ success: true, data: body });
  } catch (error) {
    next(new AppError(error.message, 400));
  }
};

export const getAllBodies = async (req, res, next) => {
  try {
    const bodies = await GoverningBody.find()
      .populate("accreditedDepartments", "departmentName departmentCode")
      .sort({ name: 1 });
    res.status(200).json({ success: true, data: bodies });
  } catch (error) {
    next(new AppError(error.message, 400));
  }
};

export const getBodyById = async (req, res, next) => {
  try {
    const body = await GoverningBody.findById(req.params.id).populate(
      "accreditedDepartments",
    );
    if (!body) return next(new AppError("Governing body not found", 404));
    res.status(200).json({ success: true, data: body });
  } catch (error) {
    next(new AppError(error.message, 400));
  }
};

export const updateBody = async (req, res, next) => {
  try {
    const body = await GoverningBody.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      },
    );
    if (!body) return next(new AppError("Governing body not found", 404));
    res.status(200).json({ success: true, data: body });
  } catch (error) {
    next(new AppError(error.message, 400));
  }
};

export const deleteBody = async (req, res, next) => {
  try {
    const body = await GoverningBody.findById(req.params.id);
    if (!body) return next(new AppError("Governing body not found", 404));
    await body.softDelete();
    res
      .status(200)
      .json({ success: true, message: "Governing body soft-deleted" });
  } catch (error) {
    next(new AppError(error.message, 400));
  }
};

export const restoreBody = async (req, res, next) => {
  try {
    const body = await GoverningBody.findWithDeleted().findOne({
      _id: req.params.id,
    });
    if (!body) return next(new AppError("Governing body not found", 404));
    await body.restore();
    res
      .status(200)
      .json({ success: true, data: body, message: "Governing body restored" });
  } catch (error) {
    next(new AppError(error.message, 400));
  }
};

export default {
  createBody,
  getAllBodies,
  getBodyById,
  updateBody,
  deleteBody,
  restoreBody,
};
