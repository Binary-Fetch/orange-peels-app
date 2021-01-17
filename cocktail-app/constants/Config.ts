export default class AppConfiguration {
    static readonly GQLBackendUrl = 'https://cocktail-api-astra.herokuapp.com/api/graphql';
    static readonly storageKeyForAuth = 'AUTH_KEY';
    static readonly storageKeyForUserDetails = 'USER_DETAILS_KEY';
    static readonly loginFailedMessage = 'Login failed due to invalid credential';
}