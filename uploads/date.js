import express from 'express';
import bodyParser from 'body-parser';
import admin from 'firebase-admin';
import path from 'path';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
app.use(cors());

// Initialize Firebase Admin
const serviceAccount = path.resolve('path-to-your-firebase-service-account-key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Get a reference to the Firestore database
const db = admin.firestore();

// Middleware to parse JSON
app.use(bodyParser.json());

app.post('/api/date', async (req, res) => {
  const { date } = req.body;

  if (date) {
    try {
      // Add the date to the 'dataTambahan' collection in the 'date' document
      const docRef = db.collection('dataTambahan').doc('date');
      await docRef.set({ date: date });

      res.status(200).json({ message: 'Date successfully added to Firestore', date });
    } catch (error) {
      console.error('Error adding date to Firestore:', error);
      res.status(500).json({ message: 'Failed to save date', error });
    }
  } else {
    res.status(400).json({ message: 'No date provided' });
  }
});

const PORT = 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
