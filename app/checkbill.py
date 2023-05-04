def createbilldb():#creat bill to show
    import mysql.connector
    import pandas as pd
    import random

    mydb = mysql.connector.connect(
    host="localhost",
    user="root",
    passwd="",
    database="supermarket"
    )
    clouddb = mysql.connector.connect(
    host="localhost",
    user="root",
    passwd="",
    database="supermarket"
    )

    billid=random.randint(9999,99999)
    billid="bill"+str(billid)
    cloudcursor = clouddb.cursor()
    print(billid)
    cmdd="CREATE TABLE "+billid+"(itemid INT, name VARCHAR(50) ,price INT,quantity INT,total INT)"
    cloudcursor.execute(cmdd)
    clouddb.commit()


    dfcart=pd.read_sql("SELECT * FROM cartdb ORDER BY cartdb.itemid ",mydb)
    #print(dfcart)

    dfprice=pd.read_sql("SELECT * FROM pricedb ORDER BY pricedb.itemid ",mydb)
    #print(dfprice)

    from collections import Counter
    z = dfcart.itemid
    zz=Counter(z)
    #print(zz)
#####################compare with price of item to generate bill and ##################################3
    output = []
    for x in dfcart.itemid:
        if x not in output:
            output.append(x)
    #print(output)
    for j in output:
        itemsid=j
        count=zz[j]
        mycursor = mydb.cursor()
        mycursor.execute("SELECT * FROM pricedb WHERE itemid="+str(j))
        data=mycursor.fetchall()
        #print("itemid"+str(itemsid))
        #print('count'+str(count))
        #print('name'+str(data[0][1]))
        #print('price'+str(data[0][2]))
        itemid=j
        name=data[0][1]
        price=data[0][2]
        quantity=count
        total=price*quantity
        mycursor = mydb.cursor()
        sql = "INSERT INTO billdb (itemid,name,price,quantity,total) VALUES (%s, %s, %s, %s, %s)"
        val = (itemid,name,price,quantity,total)
        mycursor.execute(sql, val)
        mydb.commit()
        
        #to clouddb
        cloudcursor = clouddb.cursor()
        sql = "INSERT INTO "+billid+" (itemid,name,price,quantity,total) VALUES (%s, %s, %s, %s, %s)"
        val = (itemid,name,price,quantity,total)
        cloudcursor.execute(sql, val)
        clouddb.commit()
        #print(mycursor.rowcount, "record inserted.")
    mydbq = mysql.connector.connect(
    host="localhost",
    user="root",
    passwd="",
    database="supermarket"
    )
    dfbill=pd.read_sql("SELECT * FROM billdb ",mydbq)
    mydbq.commit()

    mycursor = mydb.cursor()
    mycursor.execute("SELECT SUM(total) AS TotalIbill FROM billdb")
    datat=mycursor.fetchall()
    print(datat[0][0])
    totalbill=str(datat[0][0])
    mydb.commit()

    ff=open("templates/checkbill.html","w+")
    ff.write("<html><head><title>"+str(billid)+"</title><link rel='stylesheet' type='text/css' href='static/checkbill.css'></head><body background='static/checkbill.jpg'><div class='tbr'>Total Bill is Rs."+totalbill+"/-</div>")
    ff.close()
    ff=open("templates/checkbill.html","a")
    ff.write(dfbill.to_html()+"<form><button class='additem' formaction='/webdetection'>Back To Cart</button><button class='printt' formaction='/checkout'>checkout</button></form></body></html>")
    ff.close()

def ebilldff():#read bill to  send  mail
    f=open('/home/rubiks/Desktop/gitlabrepo/kirana/templates/checkbill.html','r')#path to the checkbillhtml file
    ebill=f.read()
    #print(ebill)
    f.close()
    return ebill
