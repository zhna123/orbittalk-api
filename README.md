# ORBITTALK API
Backend REST API for Orbit Talk app.

* Express
* Mongo DB 
* Mongoose

## Schema design

* Store messages directly in Conversation model for simplicity

## Development

`npm run serverstart`

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



