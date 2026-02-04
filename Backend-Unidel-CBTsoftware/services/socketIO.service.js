/**
 * Socket.IO Service - WebSocket management for real-time features
 * Converted from TypeScript to JavaScript
 */
import { Server as SocketIOServer } from "socket.io";

// ============================================================================
// SOCKET MANAGER CLASS
// ============================================================================

class SocketManager {
  constructor(httpServer, corsOrigin = "*") {
    /** @type {SocketIOServer} */
    this.io = new SocketIOServer(httpServer, {
      cors: {
        origin: corsOrigin,
        methods: ["GET", "POST"],
        credentials: true,
      },
      pingTimeout: 60000,
      pingInterval: 25000,
      transports: ["websocket", "polling"],
    });

    /** @type {Map<string, import('socket.io').Socket>} */
    this.connectedUsers = new Map();

    this.setupConnection();
  }

  /**
   * Setup connection handlers
   * @private
   */
  setupConnection() {
    this.io.on("connection", (socket) => {
      console.log(`✅ Socket Connected: ${socket.id}`);
      this.connectedUsers.set(socket.id, socket);

      socket.on("disconnect", (reason) => {
        console.log(`❌ Socket Disconnected: ${socket.id} - ${reason}`);
        this.connectedUsers.delete(socket.id);
      });

      socket.on("error", (error) => {
        console.error(`🔥 Socket error ${socket.id}:`, error);
      });

      this.registerEvents(socket);
    });
  }

  /**
   * Register custom socket events
   * @private
   * @param {import('socket.io').Socket} socket
   */
  registerEvents(socket) {
    // Join room
    socket.on("join_room", (room) => {
      socket.join(room);
      socket.emit("joined_room", { room, socketId: socket.id });
    });

    // Leave room
    socket.on("leave_room", (room) => {
      socket.leave(room);
      socket.emit("left_room", { room, socketId: socket.id });
    });

    // Send message to room or broadcast
    socket.on("send_message", (data) => {
      const payload = {
        ...data,
        socketId: socket.id,
        timestamp: Date.now(),
      };

      if (data.room) {
        this.io.to(data.room).emit("new_message", payload);
      } else {
        this.io.emit("new_message", payload);
      }
    });

    // Exam-specific events
    socket.on("join_exam", (examId) => {
      socket.join(`exam:${examId}`);
      socket.emit("joined_exam", { examId });
    });

    socket.on("leave_exam", (examId) => {
      socket.leave(`exam:${examId}`);
    });
  }

  // ============================================================================
  // PUBLIC API METHODS
  // ============================================================================

  /**
   * Emit to specific socket
   * @param {string} socketId
   * @param {string} event
   * @param {any} data
   * @returns {boolean}
   */
  emitToSocket(socketId, event, data) {
    const socket = this.connectedUsers.get(socketId);
    if (socket) {
      socket.emit(event, data);
      return true;
    }
    return false;
  }

  /**
   * Emit to room
   * @param {string} room
   * @param {string} event
   * @param {any} data
   */
  emitToRoom(room, event, data) {
    this.io.to(room).emit(event, data);
  }

  /**
   * Broadcast to all connected clients
   * @param {string} event
   * @param {any} data
   */
  broadcast(event, data) {
    this.io.emit(event, data);
  }

  /**
   * Get count of connected clients
   * @returns {number}
   */
  getConnectedCount() {
    return this.connectedUsers.size;
  }

  /**
   * Check if socket is connected
   * @param {string} socketId
   * @returns {boolean}
   */
  isConnected(socketId) {
    return this.connectedUsers.has(socketId);
  }

  /**
   * Disconnect a socket
   * @param {string} socketId
   */
  disconnectSocket(socketId) {
    const socket = this.connectedUsers.get(socketId);
    if (socket) {
      socket.disconnect(true);
    }
  }

  /**
   * Get the Socket.IO server instance
   * @returns {SocketIOServer}
   */
  getIO() {
    return this.io;
  }

  /**
   * Emit to user by userId (user joins a room with their userId)
   * @param {string} userId
   * @param {string} event
   * @param {any} data
   */
  emitToUser(userId, event, data) {
    this.io.to(`user:${userId}`).emit(event, data);
  }

  /**
   * Emit to exam room
   * @param {string} examId
   * @param {string} event
   * @param {any} data
   */
  emitToExam(examId, event, data) {
    this.io.to(`exam:${examId}`).emit(event, data);
  }
}

// ============================================================================
// SINGLETON INSTANCE
// ============================================================================

/** @type {SocketManager | null} */
let socketManagerInstance = null;

/**
 * Create socket manager instance
 * @param {import('http').Server} httpServer
 * @param {string | string[]} [corsOrigin]
 * @returns {SocketManager}
 */
export const createSocketManager = (httpServer, corsOrigin) => {
  socketManagerInstance = new SocketManager(httpServer, corsOrigin);
  return socketManagerInstance;
};

/**
 * Get socket manager instance
 * @returns {SocketManager | null}
 */
export const getSocketManager = () => socketManagerInstance;

/**
 * Initialize WebSocket with authentication and user room joining
 * @param {import('http').Server} httpServer
 * @param {string | string[]} [corsOrigin]
 * @returns {SocketManager}
 */
export const initializeWebSocket = (httpServer, corsOrigin) => {
  const manager = createSocketManager(httpServer, corsOrigin);
  const io = manager.getIO();

  // Add authentication middleware
  io.use((socket, next) => {
    const userId =
      socket.handshake.auth?.userId || socket.handshake.query?.userId;
    if (userId) {
      socket.userId = userId;
    }
    next();
  });

  // Handle user room joining on connection
  io.on("connection", (socket) => {
    const userId = socket.userId;
    const role = socket.handshake.query?.role || socket.handshake.auth?.role;

    if (userId) {
      // Join user's personal room
      socket.join(`user:${userId}`);
      console.log(`User ${userId} joined their room`);

      if (role && ["admin", "superadmin"].includes(role)) {
        socket.join("admin_notifications");
        console.log(`User ${userId} joined admin_notifications`);
      }

      socket.on("disconnect", () => {
        socket.leave(`user:${userId}`);
        if (role && ["admin", "superadmin"].includes(role)) {
          socket.leave("admin_notifications");
        }
      });
    }

    // Handle manual room joining (for authenticated users)
    socket.on("authenticate", (data) => {
      if (data.userId) {
        socket.userId = data.userId;
        socket.join(`user:${data.userId}`);
        socket.emit("authenticated", { success: true });
      }
    });
  });

  return manager;
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Emit to a specific user
 * @param {string} userId
 * @param {string} event
 * @param {any} data
 */
export const emitToUser = (userId, event, data) => {
  const manager = getSocketManager();
  if (manager) {
    manager.emitToUser(userId, event, data);
  }
};

/**
 * Broadcast to all connected clients
 * @param {string} event
 * @param {any} data
 */
export const broadcast = (event, data) => {
  const manager = getSocketManager();
  if (manager) {
    manager.broadcast(event, data);
  }
};

/**
 * Emit to a room
 * @param {string} room
 * @param {string} event
 * @param {any} data
 */
export const emitToRoom = (room, event, data) => {
  const manager = getSocketManager();
  if (manager) {
    manager.emitToRoom(room, event, data);
  }
};

/**
 * Emit to exam room
 * @param {string} examId
 * @param {string} event
 * @param {any} data
 */
export const emitToExam = (examId, event, data) => {
  const manager = getSocketManager();
  if (manager) {
    manager.emitToExam(examId, event, data);
  }
};

export { SocketManager };

export default {
  SocketManager,
  createSocketManager,
  getSocketManager,
  initializeWebSocket,
  emitToUser,
  broadcast,
  emitToRoom,
  emitToExam,
};
