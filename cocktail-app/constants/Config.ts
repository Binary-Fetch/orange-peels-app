export default class AppConfiguration {
    static readonly GQLBackendUrl = 'https://orange-peels-api.herokuapp.com/api/graphql';
    static readonly storageKeyForAuth = 'AUTH_KEY';
    static readonly storageKeyForUserDetails = 'USER_DETAILS_KEY';
    static readonly loginFailedMessage = 'Login failed due to invalid credential';
}