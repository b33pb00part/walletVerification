const axios = require('axios');
const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const { Schema } = mongoose;

// MongoDB model
const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("Connected to MongoDB successfully...");
});

const walletSchema = new Schema({
    address: String,
    assets: [String]
}, { collection: 'wallets' }); // specifying the collection name

const Wallet = mongoose.model('Wallet', walletSchema);

// Express.js server
const app = express();
app.use(cors());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'public')));

app.get('/wallet/:address', async (req, res) => {
    try {
        const wallet = await Wallet.findOne({ address: req.params.address });
        if (wallet) {
            res.json({ imageURLs: wallet.imageUrls });

        } else {
            res.status(404).json({ message: 'Unable to verify wallet.' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
