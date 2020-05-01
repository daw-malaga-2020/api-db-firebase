'use strict'

const nodemailer = require("nodemailer")

class Mailer {
  constructor(){
    nodemailer.createTestAccount().then((data) => {

      this.testAccount = data

      this.transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: this.testAccount.smtp.port,
        secure: this.testAccount.smtp.secure, // true for 465, false for other ports
        auth: {
          user: this.testAccount.user, // generated ethereal user
          pass: this.testAccount.pass // generated ethereal password
        }
      });
    })
  }

  async send(to, subject, body, asHTMLBody = true){
    let emailItem = {
      from: '"Fred Foo 👻" <foo@example.com>', // sender address
      to: to,
      subject: subject,
    }

    if(asHTMLBody){
      emailItem.html = body
    }

    if(!asHTMLBody){
      emailItem.text = body
    }

    let transporterResponse = await this.transporter.sendMail(emailItem);

    console.log("Message sent: %s", transporterResponse.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(transporterResponse));
  }

}


module.exports = new Mailer()
