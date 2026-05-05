"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mongoose_1 = __importDefault(require("mongoose"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const PORT = process.env.PORT || 3001;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/edubrain';
const JWT_SECRET = process.env.JWT_SECRET || 'dummy_secret';
// Connect to MongoDB
mongoose_1.default.connect(MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));
// Simple User model
const userSchema = new mongoose_1.default.Schema({
    email: String,
    password: String,
    role: String
});
const User = mongoose_1.default.model('User', userSchema);
// Auth routes
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || !user.password)
            return res.status(400).json({ message: 'User not found' });
        const isValid = await bcryptjs_1.default.compare(password, user.password);
        if (!isValid)
            return res.status(400).json({ message: 'Invalid password' });
        const token = jsonwebtoken_1.default.sign({ id: user._id, role: user.role }, JWT_SECRET);
        res.json({ token, user: { email: user.email, role: user.role } });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
app.post('/api/auth/register', async (req, res) => {
    try {
        const { email, password, role } = req.body;
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const user = new User({ email, password: hashedPassword, role });
        await user.save();
        res.status(201).json({ message: 'User created' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'OK' });
});
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
//# sourceMappingURL=index.js.map