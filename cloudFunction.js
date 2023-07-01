const axios = require('axios');
const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const { Schema } = mongoose;

// MongoDB model
mongoose.connect('mongodb://localhost:27017/walletVerification', { useNewUrlParser: true, useUnifiedTopology: true });

const walletSchema = new Schema({
    address: String,
    imageURL: String
});

const Wallet = mongoose.model('Wallet', walletSchema);

// Express.js server
const app = express();
app.use(cors());

app.get('/wallet/:address', async (req, res) => {
    const wallet = await Wallet.findOne({ address: req.params.address });
    if (wallet) {
        res.json(wallet);
    } else {
        const response = await axios.get(`https://api.blockcypher.com/v1/btc/main/addrs/${req.params.address}`);
        const newWallet = new Wallet({ address: req.params.address, imageURL: response.data.image_url });
        newWallet.save();
        res.json(newWallet);
    }
});

// Cloud function
exports.walletVerification = app;
