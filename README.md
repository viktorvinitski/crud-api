Application CRUD API on noodejs

## Preparing for cross-check

#### Clone repo

```
git clone https://github.com/viktorvinitski/crud-api.git
```

#### Install dependencies

```
npm install
```

#### Run in development mode

```
npm run start:dev
```

#### Run in production mode

```
npm run start:prod
```

---

## Opportunities

#### Get all users

```
method: GET
address: http://localhost:3000/api/users
```

#### Add one user

```
method: POST
address: http://localhost:3000/api/users
body: {
    "username": "test",
    "age": 30,
    "hobbies": ["football"]
}
```

#### Get user by id

```
method: GET
address: http://localhost:3000/api/users/${userID}
```

#### Update user

```
method: PUT
address: http://localhost:3000/api/users/${userID}
body: {
    "username": "test2",
    "age": 100,
    "hobbies": ["football", "ski"]
}
```

#### Delete user

```
method: DELETE
address: http://localhost:3000/api/users/${userID}
```
