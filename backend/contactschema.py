schema = {"$jsonSchema":
      {
             "bsonType": "object",
             "required": [ "name", "email", "phone", "organization","owner" ],
             "properties": {
                "name": {
                   "bsonType": "string",
                   "description": "must be a string and is required"
                },
                "email": {
                   "bsonType": "string",
                   "description": "must be a string and is not required",
                   "uniqueItems": True
                },
                "phone": {
                   "bsonType": "string",
                   "description": "must be an integer in [ 2017, 3017 ] and is required",
                   "uniqueItems": True
                },
                "organization": {
                   "bsonType": "string",
                   "description": "must be a string and is not required"
                },
                "owner": {
                   "bsonType": "string",
                   "description": "must be a string and is not required"
                }
             }
      }
    }