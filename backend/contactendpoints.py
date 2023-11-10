from contactschema import schema
import pymongo
from flask import Flask,request
from flask_cors import CORS
import bcrypt
import jwt
from bson import ObjectId


#Initializing flask for creating routes , initializing CORS to prevent CORS Errors and connecting with Mongo Database 
#Initializing the port number for the application and the jwt secret key
app = Flask(__name__)
CORS(app)
connect = pymongo.MongoClient("mongodb://localhost:27017")
portNumber = 5002
jwtSecret = "dianadoodle"


#Creating database and checking if collection already exists. If not create one , with the defined validation schema
database = connect["contactlist"]
if "contacts" not in database.list_collection_names():
    collection = database.create_collection("contacts",validator=schema)
collection = database["contacts"]


#Creating routes for adding new contact to the database
@app.route("/addcontact",methods=["POST"])
def addcontact():
    try:
        data= request.get_json()

        #Getting the auth-token from the header and returning error if the token is absent
        authToken= request.headers.get("auth-token")
        if (authToken ==None):
            return {"success":False , "message":"Authtoken header absent!"}
        
        #Check if the contact data is not empty , if any is empty return success is false
        if (len(data["name"]) ==0 or len(data["email"]) == 0 or len(data["phone"])==0 or len(data["organization"])==0):
            return {"success":False , "message":"The name, email, phone or the organization field cannot be empty!"}
        
        #Getting the email id from the auth-token
        tokenData= jwt.decode(authToken,jwtSecret,algorithms="HS256",)

        #getting the request contact details from the user and adding the owner email to it
        userContact = {"name":data["name"],"email":data["email"],"phone":data["phone"],"organization":data["organization"],"owner":tokenData["email"]}

        #adding the userContact to the database
        addContact = collection.insert_one(userContact)

        #check if the inserting is successful
        if (addContact.acknowledged == True):
            return {"success":True, "message":"Contact added successfully!"}
        else:
            return {"success":False , "message":"Contact adding failed, please try again!"}
    except Exception as e:
        print(e)
        return {"success":False , "message":"Some error occurred :"+ str(e)}


#Creating route to delete an already present contact in the database
@app.route("/deletecontact",methods=["DELETE"])
def deletecontact():
    try:
        #Checking the request for auth-token in the headers, if not present return False
        authToken = request.headers.get("auth-token")
        if (authToken == None):
            return {"success":False , "message": "No auth-token found in the request !"}
        
        #Checking the request for contact ID in the headers, if not present then return Fasle
        contactId = request.headers.get("contact-id")
        if(contactId==None):
            return {"success":False , "message":"No contact id found in header to delete from the database!"}
        
        #Decrypting the auth-token to find the email
        tokenData = jwt.decode(authToken,jwtSecret,algorithms="HS256")

        #finding the details of the given contact id form the database
        contactDetails = collection.find_one({"_id":ObjectId(contactId)})
        if (contactDetails == None):
            return {"success":False, "message":"No such contact found in the database !"}
        
        else:
            #Check if the email of the contact in the database is same as the email in the auth-token  
            #If it matches then return True
            if (contactDetails["owner"]==tokenData["email"]):
                print("owner of contact is correct !")
                deleteContact = collection.find_one_and_delete({"_id":ObjectId(contactId)})
                if (deletecontact == None ):
                    return {"success":False , "message":"contact not deleted !"}
                else:
                    return {"success":True , "message":"contact deleted successfully!"}
            #If the email doesn't match then return False  
            else:
                return {"success":False, "message":"You are not the owner of this contact"}
    except Exception as e:
        return {"success":False, "message":"Error Occurred :" + str(e)}


#Route to fetch all the contacts for a particular user from the database
@app.route("/getall",methods=["GET"])
def getall():
    try:
        #Fetching the auth token from the request header and if no token is present then returning successs as False
        authToken = request.headers.get("auth-token")
        if (authToken == None):
            return {"success":False, "message":"Auth token not found in the request headers !"}
        
        #Decrypting the auth token to find the email in the token
        tokenData= jwt.decode(authToken,jwtSecret,algorithms = ["HS256"])

        #Finding all the contacts for the email in the database 
        userContacts = collection.find({"owner":tokenData["email"]})

        #If no contacts are found then return message and if contacts are found then sending the contacts back in form of a dictionary
        if (userContacts == None):
            return {"success":True , "message":"No Contacts found for the current user !"}
        else:
            contactsDictionary = []
            for i in userContacts:
                temp = {"name": i["name"], "email":i["email"], "phone":i["phone"],"organization":i["organization"],"id":str(i["_id"])}
                contactsDictionary.append(temp)
            return {"success":True , "message":contactsDictionary}
    except Exception as e:
        return {"success":False , "message":"error occurred :" + str(e)}
        

#Route to update an already existing contact for a registered user
@app.route("/updatecontact", methods=["POST"])
def updatecontact():
    try:
        updatedNote = request.get_json()
        #Fetching the auth token from the request header and if no token is present then returning successs as False
        authToken = request.headers.get("auth-token")
        if (authToken == None):
            return {"success":False,"message":"Auth token not found in the request headers !"}
       
        #Fetching the contact id from the header which has to be modified
        contactId = request.headers.get("contact-id")
        if (contactId == None):
            return {"success":False,"message":"Contact Id not found in the request headers !"}

        #Decrypting the auth token to find the email in the token
        tokenData=jwt.decode(authToken,jwtSecret,algorithms=["HS256"])

        #Get all the data for the given contact from the database
        contactData= collection.find_one({"_id":ObjectId(contactId)})

        #If no contact if found then return False
        if (contactData == None):
            return {"success":False, "message":"No such contact found in the database!"}
        
        else:

        #If a contact is found then compare the owner of the contact with the email found in the auth token
        #If they match then update the contact and if they don't match then return False
            if (contactData["owner"] == tokenData["email"]):

                #If they match then updat the contact in the database with the details provided in the request body
                updateStatus = collection.find_one_and_update({"_id":ObjectId(contactId)},{"$set":updatedNote})

                #If the update function returns none then return False
                if (updateStatus == None):
                    print(updateStatus)
                    return {'success':False, 'message':"Failed to update the contact!"}
                
                #Return True if the update function doesn't return None
                else:
                    print(updateStatus)
                    return {"success":True ,"message":"Contact updated successfully!"}
                
            #If contacts don't match then return false
            else:
                return {"success":False, "message":"This Contact doesn't belong to this user!"}
            
    except Exception as e:
        return {"success":False , "message":"Error occurred :"+str(e)}


#Runing the applicaton on port portNumber
app.run(debug=True, port = portNumber)


