import Support from "../models/support.model.js";
import { AppError } from "../middlewares/error-handler.middleware.js";
import { sendTemplatedMail } from "../services/mailer.service.js";
import EmailContentGenerator from "../core/mail/mail-content.js";

export const createTicket = async (req, res, next) => {
  try {
    const { title, message, type, category, email, name, priority } = req.body;

    const sender = {
      email: email || req.user?.email,
      name: name || req.user?.fullname,
      role: req.user ? req.user.role : "Public",
      user: req.user ? req.user.userId : null,
    };

    if (!sender.email) return next(new AppError("Email is required", 400));

    const support = await Support.create({
      title,
      message,
      type,
      category,
      priority,
      sender,
    });

    // Send confirmation email
    try {
      const mailGen = new EmailContentGenerator();
      const emailContent = mailGen.supportTicketCreated({
        name: sender.name,
        ticketId: support.ticketId,
        title: support.title,
        type: support.type,
        priority: support.priority,
        userId: sender.user,
      });
      await sendTemplatedMail(sender.email, emailContent);
    } catch (e) {
      console.error("Email failed but ticket created:", e.message);
    }

    res.status(201).json({ success: true, data: support });
  } catch (error) {
    next(new AppError(error.message, 400));
  }
};

export const getAllTickets = async (req, res, next) => {
  try {
    const { status, type, priority, category } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (type) filter.type = type;
    if (priority) filter.priority = priority;
    if (category) filter.category = category;

    const tickets = await Support.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: tickets });
  } catch (error) {
    next(new AppError(error.message, 400));
  }
};

export const getMyTickets = async (req, res, next) => {
  try {
    // For logged-in users
    const tickets = await Support.find({ "sender.user": req.user.userId }).sort(
      { createdAt: -1 },
    );
    res.status(200).json({ success: true, data: tickets });
  } catch (error) {
    next(new AppError(error.message, 400));
  }
};

export const getTicketById = async (req, res, next) => {
  try {
    const ticket = await Support.findById(req.params.id);
    if (!ticket) return next(new AppError("Ticket not found", 404));
    res.status(200).json({ success: true, data: ticket });
  } catch (error) {
    next(new AppError(error.message, 400));
  }
};

export const updateTicketStatus = async (req, res, next) => {
  try {
    const { status, priority, assignedTo } = req.body;
    const ticket = await Support.findByIdAndUpdate(
      req.params.id,
      { status, priority, assignedTo },
      { new: true, runValidators: true },
    );

    if (!ticket) return next(new AppError("Ticket not found", 404));

    // Send status update email
    try {
      const mailGen = new EmailContentGenerator();
      const emailContent = mailGen.supportTicketUpdated({
        name: ticket.sender.name,
        ticketId: ticket.ticketId,
        title: ticket.title,
        status: ticket.status,
        message: `Your ticket status has been updated to: ${status}.`,
        userId: ticket.sender.user,
      });
      await sendTemplatedMail(ticket.sender.email, emailContent);
    } catch (e) {
      console.error("Status email failed:", e.message);
    }

    res.status(200).json({ success: true, data: ticket });
  } catch (error) {
    next(new AppError(error.message, 400));
  }
};

export const respondToTicket = async (req, res, next) => {
  try {
    const { message } = req.body;
    const ticket = await Support.findById(req.params.id);
    if (!ticket) return next(new AppError("Ticket not found", 404));

    ticket.responses.push({
      responder: req.user.userId,
      message,
    });

    ticket.status = "in-progress";
    await ticket.save();

    // Send response notification email
    try {
      const mailGen = new EmailContentGenerator();
      const emailContent = mailGen.supportTicketUpdated({
        name: ticket.sender.name,
        ticketId: ticket.ticketId,
        title: ticket.title,
        status: ticket.status,
        message,
        userId: ticket.sender.user,
      });
      await sendTemplatedMail(ticket.sender.email, emailContent);
    } catch (e) {
      console.error("Response email failed:", e.message);
    }

    res.status(200).json({ success: true, data: ticket });
  } catch (error) {
    next(new AppError(error.message, 400));
  }
};

export default {
  createTicket,
  getAllTickets,
  getMyTickets,
  getTicketById,
  updateTicketStatus,
  respondToTicket,
};
