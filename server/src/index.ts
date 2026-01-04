import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.routes';
import petRoutes from './routes/pet.routes';
import walkerRoutes from './routes/walker.routes';
import bookingRoutes from './routes/booking.routes';
import storeRoutes from './routes/store.routes';
import reviewRoutes from './routes/review.routes';
import adminRoutes from './routes/admin.routes';
import paymentRoutes from './routes/payment.routes';
import messageRoutes from './routes/message.routes';

dotenv.config();

import { createServer } from 'http';
import { Server } from 'socket.io';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "*", // Adjust for production
        methods: ["GET", "POST"]
    }
});

const PORT = process.env.PORT || 9000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

import fs from 'fs';
import path from 'path';
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
    console.log('Created uploads directory at:', uploadsDir);
}
app.use('/uploads', express.static(uploadsDir));

// Socket.io Middleware for Authentication (Optional, simplified for now)
io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);

    socket.on("join_room", (room) => {
        socket.join(room); // Room can be userId or bookingId
        console.log(`User ${socket.id} joined room ${room}`);
    });

    socket.on("send_message", (data) => {
        // data: { room, content, senderId, ... }
        // Broadcast to room
        socket.to(data.room).emit("receive_message", data);
    });

    socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
    });
});

// Pass io to routes via middleware if needed, or export it
export { io };

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/pets', petRoutes);
app.use('/api/walkers', walkerRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/store', storeRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => {
    res.json({ message: 'CaminaCan API v1.1.0 is running 🐶 (Payment Update)' });
});

// Basic error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).send({ error: 'Something broke!' });
});

httpServer.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
