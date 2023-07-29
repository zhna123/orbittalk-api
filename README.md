# ORBITTALK API
Backend REST API for Orbit Talk app.

* Express
* Mongo DB 
* Mongoose

## Schema design

* Store messages directly in Conversation model for simplicity

## Development

`npm run serverstart`

### Encryption
* `npm install bcryptjs`

### Authentication & Authorization

* Used passportJS LocalStrategy for user authorization
* JWT Token and Refresh Token Authentication
* Implemented token blacklist (saved in DB)

Library used:
* `npm install passport`
* `npm install passport-local`
* `npm install jsonwebtoken`

Tip:

Generate secret keys:

```
node
require('crypto').randomBytes(64).toString('hex')
```

### Using Typescript

1. Install type definitions

`npm i -D typescript @types/express @types/node`

2. Generate `tsconfig.json`

`npx tsc --init`

3. Specify `outDir` - eg: `"outDir": "dist",`

4. Rename files with `.ts` extension, and modify files(change imports, add types, .etc) accordingly

5. Install `ts-node`

`npm install -D ts-node`

6. Modify start script in `package.json` to use `ts-node`

7. Run app and fix remaining errors



