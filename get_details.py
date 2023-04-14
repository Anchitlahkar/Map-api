import time
import requests
import pyttsx3
import RPi.GPIO as GPIO

GPIO.setmode(GPIO.BCM)
GPIO.setup(4,GPIO.OUT)
GPIO.output(4,True)
time.sleep(2)
GPIO.output(4,False)


distance = []
instructions = []
longitude = []
latitude = []


user_latitude = []
user_longitude = []

location_details_spoke = False

engine = pyttsx3.init()
voices = engine.getProperty('voices')
engine.setProperty('voice', voices[12].id)


def speak(audio):
    engine.say(audio)
    engine.runAndWait()
    
    
speak("Started...Trying to Gather location details")


while len(distance) <= 1:
    try:
        link_data = requests.get('https://map-api-project.herokuapp.com/api')
        data = link_data.json()
        distance = data["route"]["distance"]
        instructions = data["route"]["instruction"]
        location = data["route"]["location"]
        for i in location:
            longitude.append(i[0])
            latitude.append(i[1])

    except:
        print("Error Occured")


def getlocation():
    link_data = requests.get(
        'https://map-api-project.herokuapp.com/take-location')
    data = link_data.json()
    return data


def make_latitude_same():
    di_lat = str(latitude[0]).split(".")[0]
    user_lat = str(user_latitude).split(".")[0]

    small_no = 0

    final_lat = ""
    user_final_lat = ""

    lat_list = list(di_lat)
    user_lat_list = list(user_lat)

    len_lat = len(lat_list)
    len_user_lat = len(user_lat_list)

    if len_lat <= len_user_lat:
        small_no = len_lat

    else:
        small_no = len_user_lat

    for i in range(small_no):
        final_lat += lat_list[i]
        user_final_lat += user_lat_list[i]

    return final_lat, user_final_lat


def make_longitude_same():
    di_long = str(longitude[0]).split(".")[0]
    user_long = str(user_longitude).split(".")[0]

    small_no = 0

    final_long = ""
    user_final_long = ""

    long_list = list(di_long)
    user_long_list = list(user_long)

    len_long = len(long_list)
    len_user_long = len(user_long_list)

    if len_long <= len_user_long:
        small_no = len_long

    else:
        small_no = len_user_long

    for i in range(small_no):
        final_long += long_list[i]
        user_final_long += user_long_list[i]

    return final_long, user_final_long


num = 0

while True:
    if num <= 5:
        GPIO.output(4,True)
    else:
        GPIO.output(4,False)
    try:
        data = getlocation()
        user_latitude = data["position"]["latitude"]
        user_longitude = data["position"]["longitude"]

        lat, user_lat = make_latitude_same()
        long, user_long = make_longitude_same()


        location_lat = int(user_lat) - int(lat) 
        location_long = int(user_long) - int(long)

        if location_details_spoke == False:
            speak("Got Location Details.")
            location_details_spoke = True

        if location_lat < 0:
            location_lat = location_lat*-1

        if location_lat <= 5800000.00 and location_long >= -51000000.00:
            print(instructions[0])
            print(distance[0])
            
            dis = round(distance[0])

            for i in range(2):
                speak(f"{instructions[0]} for about {dis} meters")
                time.sleep(1)

            latitude.pop(0)
            longitude.pop(0)
            distance.pop(0)
            instructions.pop(0)

        print(location_lat, location_long, "\n\n")

    except:
        print("Error Occured")
        
    num += 1
    print(num)
    
    if num == 20:
        num = 0
