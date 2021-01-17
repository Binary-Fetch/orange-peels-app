const fetch = require("node-fetch");
const fs = require('fs');

let rawdata = fs.readFileSync('MOCK_DATA_COCKTAIL.json');
const recipes = JSON.parse(rawdata);
//console.log(recipes);

function fetchGraphQL(operationsDoc, operationName, variables) {
  return fetch(
    "https://4bf92cef-8769-48ef-b0d3-41ee16d56931-us-east1.apps.astra.datastax.com/api/graphql/datacenter",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-cassandra-token": "7d53e022-03db-4e9b-a3f2-a7d6b340ce92"
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
  mutation addCocktailData($input:cocktailInput!) {
    insertcocktail(value: $input) {
      value {
        name
      }
    }
  }
`;

function executeAddCocktailData(inputs) {
for(input of inputs){

  fetchGraphQL(
    operationsDoc,
    "addCocktailData",
    {"input": input}
  );
  setTimeout(function() {
  }, 3000);
}
    
return true;
}


function addBasicUsers(){



  executeAddCocktailData(recipes);
  

}

addBasicUsers();