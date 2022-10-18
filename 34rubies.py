def getvalidinput(possiblescenarios):
    #This faction checks if the input is valid.
    while True:
        i = input().upper()
        if i == "A" or i == "B":
            return i
        elif possiblescenarios == 3 and i == "C":
            return i
        elif i == "E":
            print("Exiting now...")
            exit()
        else:
            print("Wrong input, try again. Press E to exit")

def page1():
    print("A young knight named Rudolf Ruleman with his sleepy horse, Snoozy, encountered a castle.\nIn one of the balconys, there was a princess. What does Rudolf do?")
    print("A. Get inside and ask her to marry him \nB. Continue the trip")
    inp = getvalidinput(2)
    if inp == "A":
        return 95
    else:
        return 10

def page95():
    print("He knocked on the door and an old man dressed as the buttler opened.\n-What do you want?\n-I am Knight Rudolf Ruleman from the Ruleman City and I want to marry the princess.\n-Sure, take this paper and when your number comes you can speak with the king.\nThe number is 73. What does Rudolf do?")
    print("A. Follow butler inside and wait\nB. Leave and continue the trip")
    inp = getvalidinput(2)
    if inp == "A":
        return 36
    else:
        return 45

def page36():
    print("Inside the lobby, they were 72 other knights. Some were sharpening their swords, others were combing their hair and some others were doing push-ups.\nWhat does Rudolf do?")
    print("A. Call everybody into duel\nB. Wait patiently for his turn\nC. Paint his face with small purple dots")
    inp = getvalidinput(3)
    if inp == "A":
        return 111
    elif inp == "B":
        return 183
    else:
        return 202

def page111():
    print("-Cowards, I\'m challenging you all to fight me!\nNoone answered\n-What are you waiting for! Come and prove what are you worth!\nSuddenly one big and bulky knight stood up and got closer to Rudolf. Without saying a word, he grabbed him from the neck and threw him outside the window.\nWhere does Rudold land?")
    print("A. Into the river\nB. At a big gold-feather dragon that happend to fly below the window")
    inp = getvalidinput(2)
    if inp == "A":
        return 65
    else:
        return 183

def page202():
    print("Knight Rudolf then painted small purple dots on his face, started caughing and shivering. An other knight next to him, worried, asked him:\n-What\'s up friend?\n-Nothing. Just that I suffer from an extremely rare and contagious disease\n-What disease\n-Its called Eggplantitisis, where your face turns purple, your nose transforms into an eggplant and your mouth becomes an eggplant salad\nAs soon as he said that, all the other 72 knights rushed to the exit freightened")
    print("The buttler called the next person\nA.Clean his face and proceed")
    inp = getvalidinput(1)
    return 159

def main():
    var = 0
    laststep = 0
    while var >= 0:
        if var == 0:
            var = page1()
        elif var == 95:
            laststep = 95
            var = page95()
        elif var == 36:
            laststep = 36
            var = page36()
        elif var == 111:
            laststep = 111
            var = page111()
        elif var == 202:
            laststep = 202
            var = page202()
        else:
            print("This story is still under construction, and this part has not implemented yet. You will return on the last step")
            var = laststep



if __name__=='__main__':
    main()