import express from 'express';
import cors from 'cors';
import eventRoutes from './routes/eventRoutes.js';
import connectDB from './config/db.js';
import dotenv from 'dotenv';


dotenv.config();


connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/events', eventRoutes);

// mongoose.connect((process.env.MONGO_URL), {
// //   useNewUrlParser: true,
// //   useUnifiedTopology: true,
// }).then(() => console.log('MongoDB connected'))
//   .catch(err => console.error('MongoDB connection error:', err));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
