Meteor.startup(function() {
    //process.env.MAIL_URL="smtp://houttyty7%40gmail.com:tytyhout7@smtp.gmail.com:465/";
    process.env.MAIL_URL = "smtp://contact%40safirperfumery.com:Senegal95@smtp.domain.com:465/";
});
Meteor.methods({
    verifyBank: function(reponse) {
        var error = 0;
        var success = 0;
        var log = '';
        log = log + 'rep: ' + JSON.stringify(reponse) + '/ ' + reponse;
        if (reponse.state == 'OK') {
            var check = receipts.find({ refnum: reponse.refnum }).fetch();
            if (check.length > 0) {
                error = 'Error this receipt exist already!';
                log = log + ' Transaction already exists!';
            } else {
                receipts.insert(reponse);
                var url = 'https://SEP.shaparak.ir/payments/referencepayment.asmx?WSDL';
                var args = {
                    String_1: reponse.refnum, //RefNum: reponse.refnum,
                    String_2: reponse.mid //MID: reponse.mid
                };
                try {
                    var client = Soap.createClient(url);
                    var result = client.verifyTransaction(args);
                    log = log + ' RETURN FROM VERIF: ' + result;
                    // console.log(result);
                    // console.log(JSON.stringify(result));
                    result = Number(result.result.$value);
                    log = log + ' RETURN FROM VERIF: ' + result;
                    if (result < 0) {
                        switch (result) {
                            case -1:
                                error = 'Internal Error';
                                break;
                            case -2:
                                error = 'Deposits are not alike';
                                break;
                            case -3:
                                error = 'Inputs include invalid characters';
                                break;
                            case -4:
                                error = 'Merchant Authentication Failed (user name or password is incorrect)';
                                break;
                            case -5:
                                error = 'Database Exception';
                                break;
                            case -6:
                                error = 'The transaction has been completely reversed already';
                                break;
                            case -7:
                                error = 'RefNum is Null';
                                break;
                            case -8:
                                error = 'Input length is more than allowed one';
                                break;
                            case -9:
                                error = 'Invalid characters in reversed value';
                                break;
                            case -10:
                                error = 'RefNum is not in form of Base64 (includes invalid characters)';
                                break;
                            case -11:
                                error = 'Input length is less than allowed one';
                                break;
                            case -12:
                                error = 'Reversed amount is negative';
                                break;
                            case -13:
                                error = 'Reversed amount of a partial reverse is more than a non-reversed value of RefNum';
                                break;
                            case -14:
                                error = 'The transaction is not recorded';
                                break;
                            case -15:
                                error = 'Data type of reversed amount is double or float';
                                break;
                            case -16:
                                error = 'Internal Error';
                                break;
                            case -17:
                                error = 'Partial reversed of a transaction has been done by a bank card except for Saman card';
                                break;
                            case -18:
                                error = 'Invalid IP address of merchant';
                                break;
                            default:
                                error = 0;
                        }
                    } else {
                        // console.log("VERIFY...");
                        // console.log(result);
                        var myInvoice = invoices.find({ resNum: reponse.resNum }).fetch();
                        if (myInvoice.length == 1) {
                            myInvoice = myInvoice[0];
                            if (myInvoice.amount == result) {
                                //success
                                log = log + ' Transaction success!';
                                success = 'Payment success! No error!';
                            } else {
                                log = log + ' The amount are different... Refund ';
                                error = 'The amount are different... Refund in progress';
                                //reverseTransaction
                                var newArg = {
                                    String_1: reponse.refnum, //RefNum: reponse.refnum,
                                    String_2: reponse.mid, //MID: reponse.mid,
                                    Username: reponse.mid,
                                    Password: '9224397'
                                }
                                var statusReverse = client.reverseTransaction(newArg);
                                // statusReverse=statusReverse.result;
                                log = log + ' Reverse transaction: ' + statusReverse;
                                statusReverse = Number(statusReverse.result.$value);
                                log = log + ' Reverse transaction: ' + statusReverse;
                                if (statusReverse == 1)
                                    error = error + ' Refund succes!';
                                else
                                    error = error + ' Refund failed!';
                            }
                        } else {
                            log = log + 'Too much invoice with the same ID';
                            error = 'Too much invoice with the same ID. Amount=' + result + ';ResNum=' + reponse.resNum;
                        }
                    }


                } catch (err) {
                    log = log + 'ERR SOAP: ' + err.error;
                    if (err.error === 'soap-creation') {
                        console.log('SOAP Client creation failed');
                    } else if (err.error === 'soap-method') {
                        console.log('SOAP Method call failed');
                    }
                }

            }
        } else {
            log = log + 'Transaction failed: ' + reponse.state;
            error = 'Transaction failed: ' + reponse.state;
        }

        //this.response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
        //this.response.setHeader( 'access-control-allow-origin', '*' );
        if (error == 0) {
            var html = '<div class="alert alert-success"><strong>Validated!</strong> Payment success! ' + log + '</div><a href="/checkout">Back to safir</a>';

        } else {
            var html = '<div class="alert alert-danger"><strong>Error!</strong> ' + log + ' The payment failed. Here is the reasons: ' + error + '</div><a href="/checkout">Back to safir</a>';

        }

        return html;
        //this.response.end(JSON.stringify(html));
    },
    sendEmailComment:function(subject,html){
        this.unblock();
        Email.send({
            to: 'contact@safirperfumery.com',
            from: 'contact@safirperfumery.com',
            subject: subject,
            html: html
        });
    },
    sendMailBack:function(){
        this.unblock();
        Email.send({
            to:'seyhainfo@gmail.com',
            from:'contact@safirperfumery.com',
            subject:'Test send mail to clients!',
            html:'<body style="margin: 0; padding: 0;"> <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="border-collapse: collapse;"> <tr> <td><img src="http://164.138.19.129/images/system/logo_old.png" width="100" height="100" ></td> <td style="borer:none;text-align:right;float:right; padding:43px 0 0 0; font-family:Arial, sans-serif;font-size:14px; border-bottom:3px solid black; width:470px"> Safirperfumery.com </td> </tr> <tr> <td><br/><br/><br/></td> <td></td> </tr> <tr> <td></td> <td style="float:right"> <h1>نهادات</h1> </td> </tr> <tr> <td></td> <td style="float:right"> <h1>نهادات سفی</h1> </td> </tr> <tr> <td colspan="2" style="width:300"> <table background=" http://54.169.251.255/images/bg-mail.png" border="0" cellpadding="0" cellspacing="0" width="600" style="box-shadow: 1px 2px 4px rgba(0, 0, 0, .5);"> <tr valign="top"> <th style="text-align:right;padding:0 30px 0 0;border-right:3px solid black; height:200px; width:50%;"> <h1>نهادات سفی</h1> </th> <th style="text-align:right;padding-right:30px;width:50%"> <h1>نهادات</h1> </th> </tr> </table> </td> </tr> <tr> <td colspan="2" style="width:300; border-bottom:3px solid black;"> <h1 style="text-align:right;padding:26px 0 0 0;color:red">پینترست</h1> </td> </tr> <tr> <td colspan="2" style="border-bottom:3px solid gray;"> <table border="0" cellpadding="0" cellspacing="0" width="600"> <tr> <td style="text-align:left;"> مختلفی از قبیل<br/> مختلفی </td> <td style="text-align:right;"> مختلفی از قبیل<br/> از قبیل </td> <td style="text-align:right;"> <img src="http://54.169.251.255/images/product1.png" width="70" height="130"> </td> </tr> </table> </td> </tr> <tr> <td colspan="2" style="border-bottom:3px solid black;"> <table border="0" cellpadding="0" cellspacing="0" width="600"> <tr style="border-bottom:3px solid black;"> <td style="text-align:left;"> مختلفی از قبیل<br/> مختلفی </td> <td style="text-align:right;"> مختلفی از قبیل<br/> مختلفی </td> <td style="text-align:right;"> <img src="http://54.169.251.255/images/product1.png" width="70" height="130"> </td> </tr> </table> </td> </tr> <tr> <td colspan="2"> <h1>مختلفی از قبیلمختلفی</h1> </td> </tr> </table> </body>'
        });
    }
})
