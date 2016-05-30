Meteor.startup(function () {
   //  process.env.MAIL_URL="smtp://tinhamly%40gmail.com:0977484889@smtp.gmail.com:465/";
     //process.env.MAIL_URL="smtp://houttyty7%40gmail.com:tytyhout7@smtp.gmail.com:465/";
     process.env.MAIL_URL="smtp://contact%40safirperfumery.com:Senegal95@smtp.domain.com:465/";
});
Meteor.methods({
  sendEmail: function (subject, html) {
    this.unblock();
    Email.send({
      to: 'contact@safirperfumery.com',
      from: 'contact@safirperfumery.com',
      subject: subject,
      html: html
    });
  }
});
