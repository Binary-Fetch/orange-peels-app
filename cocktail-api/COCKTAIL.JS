const fs = require('fs');

let rawdata = fs.readFileSync('COCKTAILDB.json');
const cocktails = JSON.parse(rawdata);
console.log(cocktails);
let rawuserdata = fs.readFileSync('MOCK_DATA_USER.json');
const users = JSON.parse(rawuserdata);
console.log(users);

let Crecipes = [];
let i=0;
for(var cocktail of cocktails){
i++;
if(i>=20){
i=0;
}

    let recipe={}
    recipe.id=cocktail.idDrink;
    recipe.name=cocktail.strDrink;
    recipe.tags=cocktail.strTags;
    recipe.desc=cocktail.strTags; 
    recipe.ownerid=users[i].username; 
    recipe.ownername=users[i].name; 
    recipe.imageUrl=cocktail.strDrinkThumb;
    recipe.ingredients=[];
    recipe.prepareSteps=[];
    recipe.category=cocktail.strCategory;

    for(let j=1;j<=15;j++ ){
        if(cocktail['strIngredient'+j] != null){
            
            let item = '';
            item =item + cocktail['strIngredient'+j];
            if(cocktail['strMeasure'+j] != null){
                item = item.concat("|");
                item = item.concat(cocktail['strMeasure'+j]);
            }

            recipe.ingredients.push(item);
        }    
    }

    let instruction = cocktail.strInstructions;
        
    
    recipe.prepareSteps.push(instruction);
    Crecipes.push(recipe);
}

const data = JSON.stringify(Crecipes);

// write JSON string to a file
fs.writeFile('MOCK_DATA_COCKTAIL.json', data, (err) => {
    if (err) {
        throw err;
    }
    console.log("JSON data is saved.");
});