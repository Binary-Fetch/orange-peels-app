export type RootStackParamList = {
  Root: undefined;
  NotFound: undefined;
  LoginSplash: undefined,
  SignIn: undefined,
  UserRegistration: undefined,
  DetailRecipe: undefined
};

export type BottomTabParamList = {
  HomeScreen: undefined;
  MyAccount: undefined;
  UploadRecipe: undefined;
};

export type HomeParamList = {
  HomeScreen: undefined;
};

export type TabTwoParamList = {
  MyAccount: undefined;
};
export type UploadRecipeParamList = {
  UploadRecipe: undefined;
};

export namespace HomeComponent {
  export interface props {
    navigation : any
    doSignout: Function
  }
  export interface state {
    isLoading: boolean, 
    coctailRecipeList: CocktailRecipe[]
  }
}

export namespace DetailRecipeComponent {
  export interface Props {
  route: any,
  navigation: any
  }
  export interface State {
    isLoading: boolean,
    user: User,
    coctailRecipe: CocktailRecipe
  }
}

export namespace CreateRecipeComponent {
  export interface Props {
    authentication: any,
    navigation: any,
    doSignout: Function
  }
  export interface State {
    newRecipe?: CocktailRecipe
    creationMessage?: string
    submissionInProg: boolean,
    imageURI?: string,
    imageFormData: any
  }
}
export type MyCocktailRecipesResponse = {
  coctailRecipeByUser: any
}

export type MyCocktailRecipeImageUploadResponse = {
  data: {
    recipeImageUpload: {
      name?: string
      /* mimetype?: string
      encoding?: string */
      url?: string
    }
  }
}

export namespace MyRecipeComponent {
  export interface props {
    navigation: any,
    doSignout: Function,
    authentication: any
  }
  export interface state {
    isLoading: boolean,
    user: User,
    coctailRecipeList: CocktailRecipe[]
  }
}


export type CocktailRecipeResponse = {
  coctailRecipe: CocktailRecipe[]
}

export type User = {
  firstName?: string,
  lastName?: string,
  email?: string,
  username: string,
  gender?: string,
  name: string,
  token: string
}

export type UserRegistrationRequest = {
  email: string,
  username: string,
  gender: string,
  name: string,
  password: string
}

export type UserLoginResponse = {
  login: User;
}

export type CocktailRecipe = {
  desc: string
  id?: string
  imageUrl?: string
  ingredients?: Ingredients[]
  name: string
  prepareSteps?: PreparationStep[]
  owner: OwnerInfo
}

export type Ingredients = {
  amount: String
  name: string
}

export type PreparationStep = {
  description: string
} 

export type OwnerInfo = {
  ownerid: string
  ownername: string
} 

export namespace AppRoot {
  export interface State {
    isLoading: boolean
    isSignout: boolean
    userToken: string
  }

  export interface AppAuthContext{
    signIn: Promise<void>,
    signOut: Function,
    signUp: Promise<void>
  }
}
