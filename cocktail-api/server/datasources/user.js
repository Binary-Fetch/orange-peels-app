const { gql } = require("apollo-server-express");
const { GraphQLDataSource } = require("apollo-datasource-graphql");
const constants = require("../constants");

// const VERIFY_USER_DETAILS = gql`
// query MyQuery($username: String, $password: String) {
//   queryUser(filter: {username: {eq: $username}, password: {eq: $password}}) {
//     active
//     email
//     gender
//     name
//     username
//   }
// }
// `;

const VERIFY_USER_DETAILS = gql`
query login($username: String,$password: String) {
  user(value:{username:$username, password:$password}) {
    values{
      username
      email
      gender
      name
    }
  }
}
`;

const SAVE_USER_DETAILS = gql`
mutation saveUserDetails($input: userInput!) {
  insertuser(value:$input) {
    value{
      username
    }
  }
}
`;

class UserAPI extends GraphQLDataSource {
  baseURL = constants.datastaxGraphQLUrl;

  constructor() {
    super();
  }

  initialize(config) {
    this.context = config.context
  }

  willSendRequest(request) {
    request.headers = {
      "x-cassandra-token": process.env.TOKEN
    };
  }

  async verifyUserDetails(username, password) {
    try {
      const response = await this.query(VERIFY_USER_DETAILS, {
        variables: {
          username: username,
          password: password
        },
      });
      let user = '';
      if (response.data.user.values.length != 0) {
        user = response.data.user.values[0];
      }
      return user;
    } catch (error) {
      console.error(error);
    }
  }

  async saveUsers(userDetails) {
    let success = false;
    let message = "Error occured!";
    try {
      const response = await this.mutation(SAVE_USER_DETAILS, {
        variables: {
          input: userDetails.user,
        },
      });
      success = response.data.insertuser.value.username ? true : false;
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
}

module.exports = UserAPI;