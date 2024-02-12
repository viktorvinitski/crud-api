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
method: get
address: http://localhost:3000/api/users
```

#### Add one user

```
method: post
address: http://localhost:3000/api/users
body: {
    "username": "test",
    "age": 30,
    "hobbies": ["football"]
}
```

#### Get user

```
method: get
address: http://localhost:3000/api/users/${userID}
```

#### Update user

```
method: put
address: http://localhost:3000/api/users/${userID}
body: {
    "username": "test name2",
    "age": 100,
    "hobbies": ["chess"]
}
```

#### Delete user

```
method: delete
address: http://localhost:3000/api/users/${userID}
```
