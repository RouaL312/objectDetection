def cartdb(classids,boxes): #conn to cart tabel for removing item
    import yolo
    import mysql.connector
    mydb = mysql.connector.connect(
    host="localhost",
    user="root",
    passwd="",
    database="supermarket"
)
    for i in range(len(classids)):
        area=boxes[i][2]*boxes[i][3]
        itemid=0
        itemid=classids[i]
        #print("class:"+str(classids[i]))
        #print("area:"+str(area))
        if(area<25000 and classids[i]==3):
            itemid=itemid+1000
        if(area<4000 and classids[i]==4):
            itemid=itemid+1000
        mycursor = mydb.cursor()
        sql = "DELETE FROM cartdb WHERE itemid ="+str(classids[i]) #remove item from tabel
        mycursor.execute(sql)
        mydb.commit()
    #print(mycursor.rowcount, "record inserted.")
