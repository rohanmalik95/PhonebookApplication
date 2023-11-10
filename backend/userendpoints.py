from userschema import schema
import pymongo
from flask import Flask,request
from flask_cors import CORS
import bcrypt
import json
import jwt

#Initializing the app, allowing cors requests , declaring the port number and declaring the jwt secret key
app = Flask(__name__)
CORS(app)
portNumber = 5004
jwtSecret = "dianadoodle"


#Connecting the database , creating the database named Userdatabase and then 
#checking if a collection named "users" exists and if it doesn't exist then creating one 
#by validating the schema defined in the userschema file
connect = pymongo.MongoClient("mongodb://localhost:27017")
database = connect["userdatabase"]
if "users" not in database.list_collection_names():
    createCollection = database.create_collection("users",validator=schema)
    createCollection.create_index("email",unique=True)
collection= database["users"]



#Defining routes

#Route to create a new user in the database
@app.route("/register",methods=["POST"])
def register():
    try:
        data = request.get_json()

        #Making sure the username or email or the password are not empty
        if (len(data["username"]) == 0 or len(data["email"]) == 0 or len(data["password"]) == 0):
            print("username or password is not added")
            return {"success":False , "message":"Username or password cannot be empty"}
        
        #encrypting password and replacing the request data with encryped passwrod
        salt = bcrypt.gensalt(10)
        encryptedPassword = bcrypt.hashpw(data["password"].encode('utf-8'),salt)
        data["password"]= encryptedPassword
        
        #defining payload and encrypting the payload for jwt token
        payload = {"email":data["email"],"username":data["username"]}
        jwtToken = jwt.encode(payload,jwtSecret,algorithm="HS256")
        
        #adding the user details to the database
        userDetails = {"username":data["username"],"email":data["email"],"password":data["password"]}
        addUser = collection.insert_one(userDetails)

        #Checking the status of adding the user to the database and returning appropriate response
        if (addUser.acknowledged == True):
            return {"success":True, "token":jwtToken}
        else:
            return {"success":False, "message":"Failed to add the user deatils to the database"}
        
    except:
        return {"success":False , "message":"Some error occurred , please try again!"}



#Login a user already present in the database:
@app.route("/login",methods=["POST"])
def login():
    try:
        data = request.get_json()
        
        #Make sure the "email" and "password" field is not empty in the request
        if (len(data["email"])==0 or len(data["password"])==0):
            return {"success":False , "message":"Email or password field caannot be empty!"}
        print("check1")
        #Checking the database for email and returning false if no user is found 
        userDetails = collection.find_one({"email":data["email"]})
        if (userDetails == None):
            return {"success":False , "message":"No such user found in the database!"}
        print("check2")
        #Matching the password received from the user
        passwordMatch = bcrypt.checkpw(data["password"].encode("utf-8"),userDetails["password"])
        print("check3")
        if (passwordMatch == False):
            return {"success":False , "message":"The password is incorrect"}
        else:
            print("check4")
            #If password match is true then generating jwt token with a payload and returning it
            payload = {"email":data["email"], "username":userDetails["username"]}        
            jwtToken=jwt.encode(payload,jwtSecret,algorithm="HS256")
            return json.dumps({"success":True, "token":jwtToken})
        
    except:
        return {"success":False , "message":"Some error occurred, please try again!"}

#Starting the applicatoin on the defined portNumber
app.run(debug=True, port=portNumber)