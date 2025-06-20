require('dotenv').config();
const twilio = require('twilio');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const verifySid = process.env.TWILIO_VERIFY_SERVICE_SID;

console.log('Twilio Account SID:', accountSid);
console.log('Twilio Auth Token:', authToken ? '***' + authToken.slice(-4) : 'Not found');
console.log('Twilio Verify Service SID:', verifySid);

const client = twilio(accountSid, authToken);

// Test account status
client.api.accounts(accountSid)
  .fetch()
  .then(account => {
    console.log('Account Status:', account.status);
    console.log('Account is valid and accessible');
    
    // Test verify service
    if (verifySid) {
      return client.verify.v2.services(verifySid)
        .fetch()
        .then(service => {
          console.log('Verify Service Name:', service.friendlyName);
          console.log('Verify Service is valid and accessible');
        });
    }
  })
  .catch(err => {
    console.error('Error:', err.message);
    console.error('Full error:', err);
  }); 