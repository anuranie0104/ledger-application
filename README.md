# Ledger Application

Ledger application offers a quick way to see the ledger details of a given lease via a REST API endpoint that generates the relevant ledger with all its individual records.

## 💻 Development setup

1. Clone the repository
2. Move into the application folder with `cd ledger-application`
3. Run `npm i` to install all the dependencies
4. Next run `npm start` to get the application running
5. Testing could be done through [postman](https://www.postman.com/) with the link structure, `http://localhost:3000/ledger` (POST HTTP call)

**Note:** Incase the application does not run even after the dependency installation in *Step 3*, ensure [nodemon](https://www.npmjs.com/package/nodemon/v/2.0.7) is installed by running `npm i -g nodemon`

*Further documentation is available in the [docs](docs/index.html) folder*

## ✒️ Run unit and integration tests

Run both the unit and integration tests using the following command,

```
npm test
```

## 📜 License

MIT