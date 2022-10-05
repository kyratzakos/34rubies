#This module gets an input until the user types the valid keyword
def getvalidinput(validwords,exitword):
    while True:
        inp = str(input().upper())
        if inp in validwords:
            return inp
        if inp == exitword:
            print("Exiting Now...")
            exit()
        print("Wrong input, try again. Press E to exit")

