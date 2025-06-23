window.onload = () => {
  let userAddress = '';
  let tronWeb;
  
  // Initialize TronWeb
  async function initTronWeb() {
    if (window.tronLink && window.tronLink.ready) {
      tronWeb = window.tronLink;
      try {
        const accounts = await tronWeb.request({ method: 'tron_requestAccounts' });
        userAddress = accounts[0];
        document.getElementById('userAddress').innerText = userAddress;
        getInvestmentDetails(userAddress);
      } catch (err) {
        alert('Please connect your TronLink wallet.');
      }
    }
  }
  
  // Get user investment details
  async function getInvestmentDetails(address) {
    try {
      // Simulate fetching investment details from server (using Tron testnet)
      const response = await fetch(`/api/invest/balance?address=${address}`);
      const data = await response.json();
      
      document.getElementById('amountInvested').innerText = data.balance || '$0';
      document.getElementById('dailyEarnings').innerText = data.dailyEarnings || '$0';
      document.getElementById('timeLeft').innerText = data.daysLeft || '0';
    } catch (err) {
      console.error('Error fetching investment details', err);
    }
  }
  
  // Investment action handler
  document.getElementById('investButton').addEventListener('click', async () => {
    const amount = prompt('Enter investment amount in USDT:');
    if (amount) {
      // Simulate investment request
      await fetch('/api/invest/create', {
        method: 'POST',
        body: JSON.stringify({ amount, days: 15 }),
        headers: { 'Content-Type': 'application/json' },
      });
      alert('Investment created successfully!');
      getInvestmentDetails(userAddress);
    }
  });
  
  // Referral logic
  document.getElementById('refCode').innerText = 'REF123ABC'; // Example referral code

  // Start TronWeb
  initTronWeb();
};