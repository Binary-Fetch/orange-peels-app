
import { gql } from '@apollo/client';
import { CocktailRecipe, CocktailRecipeResponse, MyCocktailRecipeImageUploadResponse, MyCocktailRecipesResponse, UserRegistrationRequest } from '../types';
import getApolloGQLClient from './apollo-gql-client-config';

export default function RecipesService() {
    const GET_MY_RECIPES = gql`
    query fetchMyRecipe{
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
    }`;

    const getRecipes = async () => {
        const client = await getApolloGQLClient();
        return await client.query<CocktailRecipeResponse>({
            query: gql`
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
            `
        });
    }
    const createRecipe = async (recipe: CocktailRecipe) => {
        const client = await getApolloGQLClient();
        return await client.mutate<any>({
            mutation: gql`
            mutation saveRecipe($recipe: RecipeInput){
                saveRecipe(recipe: $recipe){
                  success
                  message
                }
              }
            `,
            variables: { recipe: recipe }
        });
    }
    const createUser = async (user: UserRegistrationRequest) => {
        const client = await getApolloGQLClient(false);
        return await client.mutate<any>({
            mutation: gql`
            mutation saveUser($user: UserInput){
                saveUser(user: $user){
                  success
                  message
                }
              }
            `,
            variables: { user: user }
        });
    }
    const getMyRecipes = async () => {
        const client = await getApolloGQLClient();
        return await client.query<MyCocktailRecipesResponse>({
            query: GET_MY_RECIPES
        });
    }

    const uploadFile = async (fileFormData: any) => {
        const client = await getApolloGQLClient();
        return await client.mutate<MyCocktailRecipeImageUploadResponse>({
            mutation: gql`
                mutation uploadFile($file: Upload!){
                    recipeImageUpload(file: $file) {
                        name
                        url
                    }
                }
            `,
            variables: { file: fileFormData }
        });
    }

    return {
        getRecipes,
        createRecipe,
        getMyRecipes,
        uploadFile,
        createUser
    }
}