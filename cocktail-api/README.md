# cocktail-api

## Sample Quary

- Fetch all cocktail recipe

```
query fetchAllRecipe{
  coctailRecipe{
    id
    owner{
      username
      name
    }
    name
    desc
    imageUrl
    ingredients{
      name
      amount
    }
    prepareSteps
  }
}
```

- Fetch My Recipe

```
query {
    coctailRecipeByUser{
      id
      owner{
        username
        name
      }
      name
      desc
      imageUrl
      ingredients{
        name
        amount
      }
      prepareSteps
    }
  }
```

- Login (Sample Requests, Response)

```
query {
  login(username:String,password:String) {
    token
    username
    email
    name
    gender
  }
}
```

```
{
  "data": {
    "login": {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkdXR0IiwiZW1haWwiOiJheWFuXzk0QHJlZGlmZm1haWwuY29tIiwiaWF0IjoxNjAzOTY2ODA0LCJleHAiOjE2MDM5NzA0MDR9.DWf1VSmZI4fcSlqPXA4ZIReK11rOo09ENhSAC0JF7-0",
      "username": "adutta",
      "email": "ayan_94@rediffmail.com",
      "name": "Ayan Dutta",
      "gender": "Male"
    }
  }
}
```

- Save user (Sample Requets, Success Response & Failure Response)

```
mutation {
  saveUser(user:{username:"sroy",email:"subham.roy@xyz.com",name:"Subham Roy",gender:"Male",password:"Test123"}){
    success
    message
  }
}
```

```
{
  "data": {
    "saveUser": {
      "success": true,
      "message": "Data saved successfully."
    }
  }
}
```

```
{
  "data": {
    "saveUser": {
      "success": false,
      "message": "couldn't rewrite query for mutation addUser because id sroy already exists for type User"
    }
  }
}
```

- Save Recipe (Sample Requets & Sample Response)

```
mutation{
  recipeImageUpload(file:Upload!) {
    filename
    mimetype
    encoding
    url
  }
}
```

```
mutation {
  saveRecipe(recipe:{
      desc: "Create cocktail by following easy steps",
      imageUrl:"https://www.recipegirl.com/wp-content/uploads/2007/09/Sea-Breeze-1.jpg",
      name: "Flip flop",
      prepareSteps: [
         {
            description: "In an old-fashioned glass almost filled with ice cubes, combine all of the ingredients. 
         },
        {
            description: "Shake ingredients together in a mixer with ice. Strain into glass, garnish and serve.",
         }
      ],
      owner: {
         ownerid: "sday",
         ownername: "Sayan Day"
      },
      ingredients: [
         {
            amount: "1 parts",
            name: "Vodka"
         },
		 {
            amount: "2 parts",
            name: "Water"
         }
      ]
   }){
    success
    message
  }
}
```

```
{
  "data": {
    "saveRecipe": {
      "success": true,
      "message": "Data saved successfully."
    }
  }
}
```
