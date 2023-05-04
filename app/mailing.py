def sendmailbill(mailid,sms):# to send e bill to the user
        from email.mime.multipart import MIMEMultipart
        from email.mime.text import MIMEText
        from datetime import date
        import smtplib
        msg = MIMEMultipart('alternative')
        msg['Subject'] = "E-bill"
        msg['From'] = "Username@gmail.com"
        msg['To'] =mailid
        print('sending maill')

        text = "your E-bill"
        html = str(sms)


        part1 = MIMEText(text, 'plain')
        part2 = MIMEText(html, 'html')
        msg.attach(part1)
        msg.attach(part2)




        server = smtplib.SMTP('smtp.gmail.com',587)
        server.ehlo()
        server.starttls()
        server.ehlo()
        server.login("Username@gmail.com","PASSWORD")
        #print('message sent is:--> '+msg.as_string())
        server.sendmail('Username@gmail.com',mailid,msg.as_string())
