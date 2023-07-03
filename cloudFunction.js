const axios = require('axios');
const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const { Schema } = mongoose;
<<<<<<< HEAD
const { Storage } = require('@google-cloud/storage');

// Google Cloud Storage setup
const credentials = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON);
const storage = new Storage({ credentials });
const bucketName = 'b33pb00p_assets';

async function generateSignedUrl(bucketName, fileName) {
    const options = {
        version: 'v4',
        action: 'read',
        expires: Date.now() + 10 * 60 * 1000, // 10 minutes
    };

    const [url] = await storage
        .bucket(bucketName)
        .file(fileName)
        .getSignedUrl(options);

    return url;
}
=======
>>>>>>> parent of ee07fd4 (Updated)

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
<<<<<<< HEAD
    imageUrls: [Object]
=======
    imageUrls: [String]
>>>>>>> parent of ee07fd4 (Updated)
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
<<<<<<< HEAD
        const signedUrls = [];
        for (let imageUrl of wallet.imageUrls) {
            let splitPath = imageUrl.split('/');
            let fileName = splitPath.pop();
            let bucketFolder = splitPath.pop();
            let signedUrl = await generateSignedUrl('b33pb00p_assets/' + bucketFolder, fileName);
            signedUrls.push(signedUrl);
        }
        res.json({ imageURLs: signedUrls });
=======
        res.json({ imageURLs: wallet.imageUrls });
>>>>>>> parent of ee07fd4 (Updated)
    } else {
        console.log('No wallet found for address:', address);
        res.status(404).json({ message: 'Unable to verify wallet.' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
