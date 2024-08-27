// message.js
const { MailtrapClient } = require("mailtrap");
const fs = require('fs');
const { spawn } = require('child_process'); 


class Message {
    constructor(name, email, text_message) {
        // Assign default values if the fields are empty
        this.name = name || 'No name provided';
        this.email = email ;
        this.text_message = text_message ;
      }
    

  // Private method to format the message
  #formatMessage() {
    return `Name: ${this.name}\nEmail: ${this.email}\nMessage: ${this.text_message}`;
  }

  // Public method to get the formatted message
  formattedMessage() {
    return this.#formatMessage();
  }

  // Private method to send a reply email
  #sendReplyEmail() {
    if (!this.email) {
        console.log('No email provided, skipping reply email.');
        return; // Exit the method if email is empty
      }

    const TOKEN = "da95d54c576369870c39b46f762ba713";
    const ENDPOINT = "https://send.api.mailtrap.io/";

    const client = new MailtrapClient({ endpoint: ENDPOINT, token: TOKEN });

    const sender = {
      email: "mailtrap@arnhem-front-end.site",
      name: "arnhem front end",
    };

    const recipients = [
      { email: this.email } // Use the email from the Message class
    ];

    const replyMessage = "Thank you for contacting us! We will get back to you shortly.";

    return client.send({
      from: sender,
      to: recipients,
      subject: "Thank you for your message",
      text: replyMessage,
      category: "Reply",
    });
  }

// Private method to validate email address format
#validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }


  // Public method to handle the reply email process
  async sendReply() {
    if (!this.email) {
      console.log('No email provided, skipping reply email.');
      return; // Exit the method if email is empty
    }

    // Validate the email format before sending the reply email
    if (!this.#validateEmail(this.email)) {
      console.log('Invalid email format, skipping reply email.');
      return; // Exit the method if the email format is invalid
    }

    try {
      await this.#sendReplyEmail();
      console.log("Reply email sent successfully");
    } catch (error) {
      console.error("Error sending reply email:", error);
    }
  }
  writeToFile(filename) {

    if (!this.text_message) {
        console.log('No message provided, skipping writing to file.');
        return; // Exit the method if writen message to file is empty
      }


    const messageBuffer = Buffer.from(this.formattedMessage());
    
    const child = spawn('bash', ['-c', `echo "${messageBuffer.toString()}" >> ./msg/${filename}`]);

    child.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
    });

    child.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`);
    });

    child.on('exit', (code) => {
      console.log(`Child process exited with code ${code}`);
    });

    return child;
  }

  catchErrorsMessage(child, res) {
    let errorOccurred = false;

    // Check for errors in the child process
    child.on('error', (error) => {
      console.error('Error spawning child process:', error);
      errorOccurred = true; // Set the flag to indicate an error occurred
    });

    child.on('exit', (code) => {
      if (code === 0 && !errorOccurred) {
        console.log(`Message successfully written to file`);

        // Redirect the user after the emails are sent and file is written
        res.redirect('/profile.html');
      } else {
        console.log(`Child process exited with code ${code}`);
        res.status(500).send('Error processing your request');
      }
    });
  }

}
module.exports = Message;