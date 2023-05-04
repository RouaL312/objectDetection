def printbill(): #give print command to the printer
    import os
    cmd = "lpr /home/rubiks/Desktop/gitlabrepo/kirana/templates/bill.html"
    returned_value = os.system(cmd)  # returns the exit code in unix
    print('returned value:', returned_value)