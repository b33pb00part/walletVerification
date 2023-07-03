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
    imageUrls: [String]
}, { collection: 'wallets' }); // specifying the collection name

const Wallet = mongoose.model('Wallet', walletSchema);

// Express.js server
const app = express();
app.use(cors());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.static(path.join(__dirname, 'dist')));


// Add this line
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/wallet/:address', async (req, res) => {
    const { address } = req.params;
    const wallet = await Wallet.findOne({ address: address });
    if (wallet) {
        console.log('Found wallet:', wallet);
        res.json({ imageURLs: wallet.imageUrls });
    } else {
        console.log('No wallet found for address:', address);
        res.status(404).json({ message: 'Unable to verify wallet.' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
