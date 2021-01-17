const fetch = require("node-fetch");
const fs = require('fs');

let rawdata = fs.readFileSync('MOCK_DATA_USER.json');
const users = JSON.parse(rawdata);
console.log(users);

function fetchGraphQL(operationsDoc, operationName, variables) {
  return fetch(
    "https://4bf92cef-8769-48ef-b0d3-41ee16d56931-us-east1.apps.astra.datastax.com/api/graphql/datacenter",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-cassandra-token": "826f3583-478b-40ea-857e-eb7954e3bef7"
      },
      body: JSON.stringify({
        query: operationsDoc,
        variables: variables,
        operationName: operationName
      })
    }
  ).then((result) => result.json());
}

const operationsDoc = `
  mutation UserAPI($email: String = "", $name: String = "", $username: String = "",$gender: String = "",$password: String = "") {
    insertuser(value: {username: $username, email: $email, name: $name, gender: $gender, password: $password}) {
      value {
        username
        name
        email
        gender
      }
    }
  }
`;

function executeUserAPI(email, name, username,gender) {
  return fetchGraphQL(
    operationsDoc,
    "UserAPI",
    {"email": email, "name": name, "username": username,"gender": gender,"password":"Test123"}
  );
}

function addBasicUsers(){


for(let user of users){
    executeUserAPI(user.email, user.name, user.username, user.gender)
    .then(({ data, errors }) => {
        if (errors) {
        // handle those errors like a pro
        console.error(errors);
        }
        // do something great with this precious data
        console.log(data);
    })
    .catch((error) => {
        // handle errors from fetch itself
        console.error(error);
    });
}
}

addBasicUsers();