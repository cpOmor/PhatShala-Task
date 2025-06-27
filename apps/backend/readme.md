# how can clone the repository

```bash
git clone https://github.com/cpOmor/Paatshala.git
```

goto file

```bash
cd Paatshala
```

```bash
npm install
```

---

### base url

```bash
http://localhost:5000/
```

# 

### user account create url
##### POST method
```bash
{{base_url}}/user/create-user
```

#### Data 
```bash
{
    "email": "",
    "firstName": "",
    "lastName": "",
    "phone": "",
    "alterNumber": "",
    "password": ""
}
```
# Authorization
### login user url
##### POST method
```bash
{{base_url}}/auth/login
```
#### Data 
```bash
{
    "email": "",
    "password": ""
}
```


### Logout user
##### POST method
```bash
{{base_url}}/auth/logout
``` 


### User Verification
##### POST method
```bash
{{base_url}}/auth/verification
```
#### Data 
```bash
{
    "email": "",
    "code": ""
}
```


### Forget password
##### POST method
```bash
{{base_url}}/auth/forget-password
```
#### Data 
```bash
{
    "email": ""
}
```


### Forget password verification code
##### PUT method
```bash
{{base_url}}/auth/forget-password-verification
```
#### Data 
```bash
{
    "email": "",
    "code" : ""
}
```



### Set new password
##### POST method
```bash
{{base_url}}/auth/set-new-password
```
#### Data 
```bash
{
    "password": ""
}
```


### Resent verification code
##### POST method
```bash
{{base_url}}/auth/resend-verification-code
```



### Change password
##### POST method
```bash
{{base_url}}/auth/change-password
```
#### Data 
```bash
{
    "newPassword": ""
}
```


# User APIs

### Get my information
##### GET method
```bash
{{base_url}}/auth/get-me
```


### Update my information
##### POST method
```bash
{{base_url}}/auth/update-me
```


#### Data 
```bash
{
  "data" : 
    {
      "firstName": "",
      "lastName": "",
      "phone": "",
      "alterNumber": ""
    },
    "file" : ""
}

```


### Delete my information
##### DELETE method
```bash
{{base_url}}/auth/delete-me
```



# Student APIs
##### POST method
```bash
{{base_url}}/student/create-student
```

#### Data 
```bash
{
    "email": "",
    "firstName": "",
    "lastName": "",
    "phone": "",
    "alterNumber": "",
    "password": ""
}
```



### student account create
##### POST method
```bash
{{base_url}}/student/create-student
```

#### Data 
```bash
{
    "email": "",
    "firstName": "",
    "lastName": "",
    "phone": "",
    "alterNumber": "",
    "password": ""
}
```

### Find students
##### POST method
```bash
{{base_url}}/student/students
```
 



# Faculty APIs

### faculty account create
##### POST method
```bash
{{base_url}}/faculty/create-faculty
```

#### Data 
```bash
{
    "email": "",
    "firstName": "",
    "lastName": "",
    "phone": "",
    "alterNumber": "",
    "password": ""
}
```

### Find faculty
##### GET method
```bash
{{base_url}}/faculty/faculties
```
 




### find all user
```bash
{{base_url}}/user
```

### find single user

```bash
{{base_url}}/user/<email>
```

