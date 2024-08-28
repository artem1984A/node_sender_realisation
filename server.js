const express = require('express');
const Message = require('./message');


const { MailtrapClient } = require("mailtrap");






const PORT =  3000;
const app = express();





app.use(express.static(path.resolve(__dirname, 'static')));

app.get('/index.html', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'static/message.html'));
});


app.post('/submitmesx', async (req, res) => {
    try {
      // Extract name, email, and message from the form data
      const { name, email, message } = req.body;
  
      // Check if any of the fields are empty
      if (!name && !email && !message) {
        console.log("No valid data provided, skipping processing.");
        return res.status(400).send('No valid data provided.');
      }
  
      // Instantiate the Message class with the form data
      const userMessage = new Message(name, email, message);
  
      // Use the formattedMessage method to convert the properties into a string
      const formattedMessage = userMessage.formattedMessage();
  
      const TOKEN = "***";
      const ENDPOINT = "https://send.api.mailtrap.io/";
  
      const client = new MailtrapClient({ endpoint: ENDPOINT, token: TOKEN });
  
      const sender = {
        email: "***",
        name: "***",
      };
  
      const recipients = [
        { email: "***" }
      ];
  
      // Send the primary email if there is a valid message
      if (message) {
        await client.send({
          from: sender,
          to: recipients,
          subject: "Hy from ***!",
          text: formattedMessage,
          category: "Integration Test",
        });
  
        console.log("Email sent successfully");
      }
  
      // Send the reply email only if the email is present and valid
      if (email) {
        await userMessage.sendReply();
        console.log("Reply email sent successfully");
      }
  
      // Write the message to a file only if the message text is present
      if (message) {
        const child = userMessage.writeToFile('user_message.txt');
        userMessage.catchErrorsMessage(child, res); // Handle child process errors
      } else {
        // If no file writing is necessary, still send the success response
        res.redirect('/profile.html');
      }
  
    } catch (error) {
      console.error("Error processing request:", error);
      res.status(500).send('Error processing your request');
    }
  });
  app.listen(PORT, '127.0.0.1', () => console.log("Server running on port " + PORT));
