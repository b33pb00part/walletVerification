const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');
const mongoose = require('mongoose');
const app = express();

app.use(cors());

app.use(express.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

mongoose.connect('mongodb://127.0.0.1:27017/walletVerification', {useNewUrlParser: true, useUnifiedTopology: true});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("We're connected to the database!");
});

const bitcoinAddressSchema = new mongoose.Schema({
  address: String,
  imageUrls: [String]
});

const BitcoinAddress = mongoose.model('BitcoinAddress', bitcoinAddressSchema);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/test', (req, res) => {
  res.send('Test route is working!');
});

app.get('/wallet/:address', async (req, res) => {
  const { address } = req.params;
  console.log("Received request for address: ", address);

  const record = await BitcoinAddress.findOne({ address: address });

  if (!record) {
    console.log("No image URLs found for address: ", address);
    return res.status(404).json({ message: 'Unable to verify wallet.' });
  }

  let validURLs = [];
  for(let i = 0; i < record.imageUrls.length; i++) {
    try {
      const response = await axios.head(record.imageUrls[i]);
      if (response.status === 200) {
        validURLs.push(record.imageUrls[i]);
      } else {
        console.log("Failed to access image URL for address: ", address);
      }
    } catch (error) {
      console.log("Error accessing image URL for address: ", address);
    }
  }

  if (validURLs.length === 0) {
    return res.status(404).json({ message: 'Unable to verify wallet.' });
  }

  return res.json({ imageURLs: validURLs });
});

app.post('/wallet', async (req, res) => {
  const newAddress = new BitcoinAddress({ 
    address: req.body.address,
    imageUrls: req.body.imageUrls
  });

  try {
    await newAddress.save();
    res.status(201).json(newAddress);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
