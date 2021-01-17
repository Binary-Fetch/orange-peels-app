import { Formik } from 'formik';
import * as React from 'react';
import { Image, StyleSheet, TextInput } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as Yup from 'yup';
import { authRestore, authSingIn } from '../actions/auth.action';
import { Text, View } from "../components/Themed";
import { useFocusEffect } from '@react-navigation/native';
import RecipesService from '../services/recipes';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Button, Input } from 'react-native-elements';

function UserRegistrationScreen({
  navigation, authentication, doAuthSingIn, checkLogin
}: any) {
  useFocusEffect(React.useCallback(() => {
    if (!authentication.isSignout) {
      checkLogin();
    }
  }, []));

  const LoginFormSchema = Yup.object().shape({
    username: Yup.string()
      .min(1, 'Too Short!')
      .max(10, 'Too Long!')
      .required('Required'),
    password: Yup.string()
      .required('Required'),
    name: Yup.string()
      .required('Required'),
    email: Yup.string()
      .required('Required'),
    gender: Yup.string()
      .required('Required'),
  });

  return (
    <Formik
      initialValues={{ username: '', password: '', name: '', email: '', gender: '' }}
      validationSchema={LoginFormSchema}
      onSubmit={async values => {
        console.log(values);
        const createUser = await RecipesService().createUser(values);
        navigation.navigate("SignIn");
      }}
    >
      {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
        <View style={styles.container}>
          <Image source={require('../assets/images/lemon.png')} style={styles.image} />
          <Text style={styles.formLabel}>Register Yourself</Text>
          <Input
            containerStyle={styles.inputStyle}
            placeholder="User Name"
            onChangeText={handleChange('username')}
            onBlur={handleBlur('username')}
            value={values.username}
            errorMessage={touched.username && errors.username ? errors.username : undefined}
          />
          <Input
            containerStyle={styles.inputStyle}
            placeholder="Password"
            onChangeText={handleChange('password')}
            onBlur={handleBlur('password')}
            value={values.password}
            errorMessage={touched.password && errors.password ? errors.password : undefined}
          />
          <Input
            containerStyle={styles.inputStyle}
            placeholder="Name"
            onChangeText={handleChange('name')}
            onBlur={handleBlur('name')}
            value={values.name}
            errorMessage={touched.name && errors.name ? errors.name : undefined}
          />
          <Input
            containerStyle={styles.inputStyle}
            placeholder="Email"
            onChangeText={handleChange('email')}
            onBlur={handleBlur('email')}
            value={values.email}
            errorMessage={touched.email && errors.email ? errors.email : undefined}
          />
          <Input
            containerStyle={styles.inputStyle}
            placeholder="Gender"
            onChangeText={handleChange('gender')}
            onBlur={handleBlur('gender')}
            value={values.gender}
            errorMessage={touched.gender && errors.gender ? errors.gender : undefined}
          />
          <View style={styles.fixToText}>
            <Button
              icon={
                <Icon
                  name="arrow-left"
                  size={20}
                  color="white"
                />
              }
              buttonStyle={styles.buttonStyle}
              onPress={e => navigation.navigate('SignIn')}
              type="solid"
              title=" Back" />
            <Button
              icon={
                <Icon
                  name="user-plus"
                  size={20}
                  color="white"
                />
              }
              buttonStyle={styles.buttonStyle}
              onPress={(e: any) => handleSubmit(e)}
              type="solid"
              title=" Register" />
          </View>
        </View>
      )}
    </Formik>
  );

}

const mapStateToProps = (state: any, ownProps: any) => {
  const { authentication } = state;
  return { authentication, ...ownProps };
}

export default connect(mapStateToProps)(UserRegistrationScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: "98%"
  },
  formLabel: {
    fontSize: 20
  }, image: {
    height: 150,
    width: 150,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    resizeMode: 'contain',
  },
  formErrorMessage: {
    color: '#f00'
  },
  inputStyle: {
    margin: 5,
    width: 300,
    height: 60,
    paddingHorizontal: 10,
  },
  separator: {
    marginVertical: 8,
  },
  fixToText: {
    marginVertical: 10,
    flexDirection: 'row',
    width: 300,
    justifyContent: 'space-between',
  },
  buttonStyle: {
    width: 145
  },
});