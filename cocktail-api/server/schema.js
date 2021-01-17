const { gql } = require("apollo-server");

const typeDefs = gql`
  # Queries
  type Query {
    coctailRecipeByUser(first: Int, offset: Int): [CoctailRecipe]
    coctailRecipe(first: Int, offset: Int): [CoctailRecipe]
    login(username: String!, password: String!): LoginResponse
  }

  # Mutation
  type Mutation {
    saveUser(user: UserInput): UserUpdateResponse!
    saveRecipe(recipe: RecipeInput): RecipeUpdateResponse!
    recipeImageUpload(file: Upload!): ImageUploadResponse!
  }

  type ImageUploadResponse {
    name: String
    url: String
  }

  # User Model
  type User {
    username: String!
    email: String!
    name: String!
    gender: String!
    recipes: [CoctailRecipe]
  }

  input UserInput {
    username: String!
    password: String!
    email: String!
    name: String!
    gender: String!
  }

  type UserUpdateResponse {
    success: Boolean!
    message: String
  }

  #Recipe Model
  type Ingredient {
    name: String
    amount: String
  }

  type Owner {
    username: String
    name: String
  }

  type CoctailRecipe {
    id: ID
    owner: Owner
    name: String
    desc: String
    imageUrl: [String]
    ingredients: [Ingredient]
    prepareSteps: [String]
  }

  type RecipeUpdateResponse {
    success: Boolean!
    message: String
  }

  type LoginResponse {
    token: String
    username: String
    email: String
    name: String
    gender: String
  }

  input RecipeInput {
    desc: String!
    imageUrl: String!
    name: String!
    tags: String
    category: String
    prepareSteps: [PrepareStepsInput]
    owner: OwnerInput
    ingredients: [IngredientsInput]
  }

  input OwnerInput {
    ownerid: String!
    ownername: String!
  }

  input IngredientsInput {
    amount: String
    name: String!
  }

  input PrepareStepsInput {
    description: String!
  }
`;

module.exports = typeDefs;
