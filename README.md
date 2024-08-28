# node_sender_realisation
message.js is a Node.js module designed to handle message processing, sending emails, and writing messages to a file. The module uses the Mailtrap API for sending emails and the child_process module to handle file writing through a spawned child process. The primary goal of this module is to provide an organized way to manage user-submitted messages by sending a confirmation email and storing the message content in a file, which implemented be creation class Message and keeping all functionality in this class, through different methods.
This class Message represents «factory» and «builder» creational design patterns for Node.js developing.

Features

	1.	Message Formatting:
	•	The Message class formats user input (name, email, and message) into a readable string format.
	2.	Email Validation:
	•	A private method #validateEmail() is included to check if the provided email address has a valid format before attempting to send any emails.
	3.	Send Reply Email:
	•	The sendReply() method checks if an email is provided and in a valid format. If valid, it sends a reply email using the Mailtrap API. If the email is missing or invalid, the method will not attempt to send the email.
	4.	Write Message to File:
	•	The writeToFile() method writes the formatted message to a specified file. If the file already exists, the new content is appended rather than overwritten.
	5.	Child Process Handling:
	•	The catchErrorsMessage() method is used to handle errors and process the completion of the child process spawned to write the message to a file. It ensures that the process exits cleanly or returns an appropriate error if something goes wrong.

 
