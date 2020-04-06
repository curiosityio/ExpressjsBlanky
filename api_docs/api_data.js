define({ "api": [  {    "type": "post",    "url": "/admin/user",    "title": "Request Add user",    "group": "Admin",    "version": "0.1.0",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "string",            "optional": false,            "field": "email",            "description": "<p>Email address to send login email to.</p>"          }        ]      }    },    "error": {      "fields": {        "Error 4xx": [          {            "group": "Error 4xx",            "optional": false,            "field": "UserEnteredBadDataError",            "description": "<p>Someone created an account with that email address already.</p>"          }        ]      }    },    "filename": "app/controller/0.1.0/admin.ts",    "groupTitle": "Admin",    "name": "PostAdminUser",    "description": "<p>Admin can add new users to the application by email.</p>",    "success": {      "examples": [        {          "title": "Success-Response:",          "content": "{\n  \"message\": \"Human readable successful message\",\n  \"user\": {\n    (see UserPublic type)\n  }\n}",          "type": "json"        }      ]    }  },  {    "type": "post",    "url": "/user/login",    "title": "Add user",    "version": "0.1.0",    "group": "User",    "filename": "app/controller/0.1.0/user.ts",    "groupTitle": "User",    "name": "PostUserLogin",    "description": "<p>First time signup for users. Receive email where they can login to your application with button press.</p>",    "success": {      "examples": [        {          "title": "Success-Response:",          "content": "{\n   message: \"Human readable successful message\",\n   user: {\n     ...\n   }\n}",          "type": "json"        }      ]    }  }] });
