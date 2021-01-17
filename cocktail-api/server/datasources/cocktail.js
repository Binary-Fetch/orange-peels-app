const { gql } = require("apollo-server-express");
const { GraphQLDataSource } = require("apollo-datasource-graphql");
const constants = require("../constants");
const { v4: uuidv4 } = require('uuid');

const COCKTAIL_DETAILS = gql`
  query getAllCocktail {
    cocktail{
      values{
        ownerid
        ownername
        id
        desc
        imageUrl
        ingredients
        name
        prepareSteps
        tags
        category
      }
    }
  }
`;

const COCKTAIL_DETAILS_BY_USER = gql`
  query getCocktailByUser($ownerid: String!) {
    cocktail(value: {ownerid:$ownerid}){
      values{
        ownerid
        ownername
        id
        desc
        imageUrl
        ingredients
        name
        prepareSteps
        tags
        category
      }
    }
  }
`;

const SAVE_RECIPE_DETAILS = gql`
  mutation saveRecipeDetails($input: cocktailInput!) {
    insertcocktail(value: $input) {
      value{
        id
      }
    }
  }
`;

class CocktailAPI extends GraphQLDataSource {
  baseURL = constants.datastaxGraphQLUrl;

  constructor() {
    super();
  }

  willSendRequest(request) {
    request.headers = {
      "x-cassandra-token": process.env.TOKEN
    };
  }

  async getCocktailDetails(first, offset) {
    try {
      const response = await this.query(COCKTAIL_DETAILS);
      return this.convertRecipeDetails(response.data.cocktail.values);
    } catch (error) {
      console.error(error);
    }
  }

  async getCocktailDetailsByUser(userid) {
    try {
      const response = await this.query(COCKTAIL_DETAILS_BY_USER, {
        variables: {
          ownerid: userid,
        },
      });
      return this.convertRecipeDetails(response.data.cocktail.values);
    } catch (error) {
      console.error(error);
    }
  }

  async convertRecipeDetails(cocktailListFromDB) {
    let cocktailList = [];
    for (let recipeFromDB of cocktailListFromDB) {
      let recipe = {};
      recipe.owner = {};
      recipe.owner.username = recipeFromDB.ownerid;
      recipe.owner.name = recipeFromDB.ownername;
      recipe.id = recipeFromDB.id;
      recipe.desc = recipeFromDB.desc;
      recipe.imageUrl = [];
      recipe.imageUrl.push(recipeFromDB.imageUrl);
      recipe.name = recipeFromDB.name;
      recipe.prepareSteps = recipeFromDB.prepareSteps;
      recipe.ingredients = [];
      for (let ingredientFromDB of recipeFromDB.ingredients) {
        let ingredient = {};
        let ingredientDetails = ingredientFromDB.split('|');
        if (ingredientDetails.length > 1) {
          ingredient.name = ingredientDetails[0];
          ingredient.amount = ingredientDetails[1];
        } else {
          ingredient.name = ingredientDetails[0];
        }
        recipe.ingredients.push(ingredient);
      }
      cocktailList.push(recipe);
    }
    return cocktailList;
  }

  async saveRecipe(recipeDetails) {
    let success = false;
    let message = "Error occured!";
    let cocktailDetailsDB = await this.convertRecipeDetailsForSave(recipeDetails.recipe);
    try {
      const response = await this.mutation(SAVE_RECIPE_DETAILS, {
        variables: {
          input: cocktailDetailsDB,
        },
      });
      success = response.data.insertcocktail.value.id ? true : false;
      message = "Data saved successfully.";
      if (!success) {
        message = response.errors
          ? response.errors[0].message
          : "Error occured!";
      }
      return {
        success: success,
        message: message
      };
    } catch (error) {
      console.error(error);
      return {
        success: success,
        message: message
      };
    }
  }

  async convertRecipeDetailsForSave(cocktailDetails) {
    let cocktailDetailsDB = {};
    cocktailDetailsDB.ownerid = cocktailDetails.owner.ownerid;
    cocktailDetailsDB.ownername = cocktailDetails.owner.ownername;
    cocktailDetailsDB.id = uuidv4();
    cocktailDetailsDB.desc = cocktailDetails.desc;
    cocktailDetailsDB.imageUrl = cocktailDetails.imageUrl;
    cocktailDetailsDB.name = cocktailDetails.name;
    cocktailDetailsDB.tags = cocktailDetails.tags;
    cocktailDetailsDB.category = cocktailDetails.category ? cocktailDetails.category : 'Cocktail';
    cocktailDetailsDB.prepareSteps = [];
    for (let prepareStepDetails of cocktailDetails.prepareSteps) {
      cocktailDetailsDB.prepareSteps.push(prepareStepDetails.description);
    }
    cocktailDetailsDB.ingredients = [];
    for (let ingredientDetails of cocktailDetails.ingredients) {
      let ingredientDetailsDB = '';
      ingredientDetailsDB = ingredientDetailsDB.concat(ingredientDetails.name);
      if (ingredientDetails.amount) {
        ingredientDetailsDB = ingredientDetailsDB.concat("|");
        ingredientDetailsDB = ingredientDetailsDB.concat(ingredientDetails.amount);
      }
      cocktailDetailsDB.ingredients.push(ingredientDetailsDB);
    }
    return cocktailDetailsDB;
  }

}

module.exports = CocktailAPI;
