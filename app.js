import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { fileURLToPath } from 'url';
import path from "path";
import nodemailer from "nodemailer";
import bodyParser from 'body-parser';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { MongoClient } from "mongodb";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3570;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


const mongoURI = process.env.MONGODB_URI || "mongodb://localhost:27017";
const client = new MongoClient(mongoURI);
let db;

(async () => {
    try {
        await client.connect();
        db = client.db("chatApp"); 
        console.log('Connected to MongoDB successfully');

        
        await db.collection("users").createIndex({ email: 1 }, { unique: true });
    } catch (err) {
        console.error('Error connecting to MongoDB:', err);
    }
})();

// Routes

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/join', (req, res) => {
    res.render('joinRoom');
});

app.get('/join-room/:roomId', (req, res) => {
    const { roomId } = req.params;
    res.render('joinRoom', { roomId });
});

app.post('/join-room', (req, res) => {
    const { roomId, username } = req.body;
    res.redirect(`/chat/${roomId}?username=${username}`);
});

app.post('/chat', (req, res) => {
    const { roomId, username } = req.body;

    if (!roomId || !username) {
        return res.status(400).send('Room ID and username are required to join a chat.');
    }

    res.redirect(`/chat/${roomId}?username=${username}`);
});

app.get('/chat/:roomId', (req, res) => {
    const { roomId } = req.params;
    const { username } = req.query;

    if (!username) {
        return res.redirect(`/join-room/${roomId}`);
    }

    res.render('chatroom', { roomTitle: "Chat Room", roomId, username });
});

// Register route
app.post('/register', async (req, res) => {
    const { email, password, roomId } = req.body; 

    try {
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const existingUser = await db.collection('users').findOne({ email });
        if (existingUser) {
            return res.status(409).json({ error: 'Email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await db.collection('users').insertOne({
            email,
            password: hashedPassword,
        });

        if (result.insertedId) {
            if (roomId) {
                return res.redirect(`/join-room/${roomId}`);
            }
            return res.redirect('/search');
        } else {
            return res.status(400).json({ error: 'Failed to register user' });
        }
    } catch (error) {
        console.error('Error registering user:', error);
        return res.status(500).json({ error: 'Error registering user' });
    }
});

// Login route
app.post('/login', async (req, res) => {
    const { email, password, roomId } = req.body;

    try {
        const user = await db.collection('users').findOne({ email });
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        if (roomId) {
            return res.redirect(`/join-room/${roomId}`);
        }
        return res.redirect('/search');
    } catch (error) {
        console.error('Error logging in user:', error);
        return res.status(500).json({ error: 'Error logging in user' });
    }
});

// Search route
app.post('/search', async (req, res) => {
    try {
      const userEmail = req.body.email;
      const user = await db.collection('users').findOne({ email: userEmail });
      if (user) {
        res.render('userDetails', { user });
      } else {
        res.status(404).send('User not found');
      }
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
});

app.get('/search', (req, res) => {
    res.render('search');
});

const generateRoomId = () => {
    return `room-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
};


app.post('/search-user', async (req, res) => {
    const { email } = req.body;
    const roomId = generateRoomId();

    res.redirect(`/join-room/${roomId}`);

    try {
        await sendRoomLink(email, roomId);
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
    }
});


const sendRoomLink = async (userEmail, roomId) => {
    const roomLink = `http://localhost:${PORT}/chat/${roomId}`;
    const roomIdMessage = `Room ID: ${roomId}`;

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: userEmail,
        subject: 'Join Your Chat Room',
        text: `Click the following link to join the chat room: ${roomLink}\n\n${roomIdMessage}`
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log("Email sent successfully");
    } catch (error) {
        console.error("Error sending email:", error);
        throw new Error("Failed to send email: " + error.message);
    }
};


io.on('connection', (socket) => {
    console.log('User Connected:', socket.id);

    socket.on('joinRoom', ({ roomId, username }) => {
       
        console.log(`Received roomId: ${roomId}, username: ${username}`);

        if (!username) {
            console.error(`Username is undefined for socket ID: ${socket.id}`);
            return;
        }

        socket.join(roomId);
        const timestamp = new Date().toISOString();
        io.to(roomId).emit('message', { isSystem: true, message: `${username} has joined the room.`, timestamp });
    });

    socket.on('chatMessage', ({ roomId, username, message }) => {
        console.log(`Message received in room ${roomId} from ${username}: ${message}`);
        const timestamp = new Date().toISOString();
        io.to(roomId).emit('message', { username, message, timestamp });
    });

    socket.on('leaveRoom', ({ roomId, username }) => {
        if (!username) {
            console.error(`Username is undefined for socket ID: ${socket.id}`);
            return;
        }

        socket.leave(roomId);
        const timestamp = new Date().toISOString();
        io.to(roomId).emit('message', { isSystem: true, message: `${username} has left the room.`, timestamp });
        console.log(`User ${username} (${socket.id}) left room: ${roomId}`);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

server.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});
