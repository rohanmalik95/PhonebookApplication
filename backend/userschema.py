schema = {"$jsonSchema":
      {
             "bsonType": "object",
             "required": [ "username", "email", "password" ],
             "properties": {
                "username": {
                   "bsonType": "string",
                   "description": "must be a string and is required"
                },
                "email": {
                   "bsonType": "string",
                   "description": "must be a string and is not required",
                   "uniqueItems": True
                },
                "password": {
                   "description": "must be a string and is required",
                }
             }
      }
    }