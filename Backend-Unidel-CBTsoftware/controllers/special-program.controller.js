import SpecialProgram from "../models/special-program.model.js";
import { AppError } from "../middlewares/error-handler.middleware.js";

export const createProgram = async (req, res, next) => {
  try {
    const program = await SpecialProgram.create({
      ...req.body,
      createdBy: req.user.userId,
    });
    res.status(201).json({ success: true, data: program });
  } catch (error) {
    next(new AppError(error.message, 400));
  }
};

export const getAllPrograms = async (req, res, next) => {
  try {
    const programs = await SpecialProgram.find()
      .populate("department", "departmentName departmentCode")
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: programs });
  } catch (error) {
    next(new AppError(error.message, 400));
  }
};

export const getProgramById = async (req, res, next) => {
  try {
    const program = await SpecialProgram.findById(req.params.id).populate(
      "department",
    );
    if (!program) return next(new AppError("Program not found", 404));
    res.status(200).json({ success: true, data: program });
  } catch (error) {
    next(new AppError(error.message, 400));
  }
};

export const updateProgram = async (req, res, next) => {
  try {
    const program = await SpecialProgram.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      },
    );
    if (!program) return next(new AppError("Program not found", 404));
    res.status(200).json({ success: true, data: program });
  } catch (error) {
    next(new AppError(error.message, 400));
  }
};

export const deleteProgram = async (req, res, next) => {
  try {
    const program = await SpecialProgram.findById(req.params.id);
    if (!program) return next(new AppError("Program not found", 404));
    await program.softDelete();
    res.status(200).json({ success: true, message: "Program soft-deleted" });
  } catch (error) {
    next(new AppError(error.message, 400));
  }
};

export const restoreProgram = async (req, res, next) => {
  try {
    const program = await SpecialProgram.findWithDeleted().findOne({
      _id: req.params.id,
    });
    if (!program) return next(new AppError("Program not found", 404));
    await program.restore();
    res
      .status(200)
      .json({ success: true, data: program, message: "Program restored" });
  } catch (error) {
    next(new AppError(error.message, 400));
  }
};

export default {
  createProgram,
  getAllPrograms,
  getProgramById,
  updateProgram,
  deleteProgram,
  restoreProgram,
};
