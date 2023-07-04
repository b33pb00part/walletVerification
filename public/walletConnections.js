async function connectSatsConnect() {
  const getAddressOptions = {
    payload: {
      purposes: ['payment'],
      message: 'Address for receiving payments',
      network: {
        type: 'Mainnet'
      },
    },
    onFinish: async (response) => {
      const paymentAddresses = response.addresses.filter(a => a.purpose === 'payment');
      if (paymentAddresses.length > 0) {
        const btcAddress = paymentAddresses[0].address;
        
        // Fetch image URLs
        const response = await fetch(`https://b33pb00p-4d7029c0887f.herokuapp.com/wallet/${btcAddress}`);
if (!response.ok) {
  throw new Error(`HTTP error! status: ${response.status}`);
} else {
  const data = await response.json();
  // ... rest of your code
}

        console.log(data);

        if (data.imageURLs && data.imageURLs.length > 0) {
          const linkContainer = document.getElementById('asset-link');
          linkContainer.innerHTML = '';

          const assetNames = ["Full color", "Monochromatic"];

          for(let i = 0; i < data.imageURLs.length; i++) {
            const link = document.createElement('a');
            link.href = data.imageURLs[i];
            link.textContent = assetNames[i] ? assetNames[i] : `Click here to download asset ${i + 1}`;
            link.target = '_blank';
            linkContainer.appendChild(link);
          }
        } else {
          alert('Unable to verify wallet.');
        }
      } else {
        console.log('No payment address found');
      }
    },
    onCancel: () => console.log('Request canceled'),
  }

  await getAddress(getAddressOptions);
}
