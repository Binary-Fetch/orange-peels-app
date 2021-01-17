import * as ImagePicker from 'expo-image-picker';
import { FieldArray, Formik } from 'formik';
import * as React from 'react';
import { Platform, StyleSheet, TextInput } from 'react-native';
import { Button, Card, Input, ThemeProvider } from 'react-native-elements';
import { ScrollView } from 'react-native-gesture-handler';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as Yup from 'yup';
import { authSingOut } from '../actions/auth.action';
import { Text, View } from '../components/Themed';
import RecipesService from '../services/recipes';
import { CreateRecipeComponent, MyCocktailRecipeImageUploadResponse } from '../types';
import { ReactNativeFile } from 'apollo-upload-client';
import Icon from 'react-native-vector-icons/FontAwesome';

class CreateRecipeScreen extends React.Component<CreateRecipeComponent.Props, CreateRecipeComponent.State> {
    constructor(props: CreateRecipeComponent.Props) {
        super(props);
        this.state = {
            submissionInProg: false,
            creationMessage: ' ',
            imageURI: ' ',
            imageFormData: null
        }

        this.selectPhotos = this.selectPhotos.bind(this);
        this.takePhotos = this.takePhotos.bind(this);
    }

    componentDidMount() {
        this._initCameraPermission();
    }

    private async _initCameraPermission() {
        if (Platform.OS != 'web') {
            const { status: cameraPermissionStatus } = await ImagePicker.requestCameraRollPermissionsAsync();
            if (cameraPermissionStatus != "granted") {
                alert('Camera Permission denied');
            }
        }
    }

    private async _processImageFileForUpload(result: ImagePicker.ImagePickerResult) {
        // ImagePicker saves the taken photo to disk and returns a local URI to it
        console.log(result);
        if (result.cancelled)
            return;
        let localUri = result.uri;
        let filename = localUri.split('/').pop();
        filename = filename ? filename : ' ';

        // Infer the type of the image
        let match = /\.(\w+)$/.exec(filename);
        let type = match ? `image/${match[1]}` : `image`;

        // Upload the image using the fetch and FormData APIs
        /* let formData: any = new FormData();
        // Assume "photo" is the name of the form field the server expects
        console.log("upload data", { uri: localUri, name: filename, type });
        formData.append('file', { uri: localUri, name: filename, type }); */
        try {
            const file = new ReactNativeFile({
                uri: localUri,
                name: filename,
                type
            });

            const uploadResponse: any = await RecipesService().uploadFile(file);
            this.setState({ /* imageFormData: formData, */ imageURI: uploadResponse.data.recipeImageUpload.url });
        } catch (ex) {
            console.log(ex);
        }
    }

    async selectPhotos(event: any) {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1
        });

        console.log(result);

        if (!result.cancelled) {
            this._processImageFileForUpload(result);
        }
    }

    async takePhotos(event: any) {
        let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1
        });

        console.log(result);

        if (!result.cancelled) {
            this._processImageFileForUpload(result);
        }
    }

    render() {
        const { submissionInProg, creationMessage } = this.state;
        const { authentication, navigation } = this.props;
        const CreateRecipeValidationSchema = Yup.object().shape({
            name: Yup.string()
                .required('Required'),
            desc: Yup.string()
                .required('Required')
            // imageUrl: Yup.string()
            //     .required('Required')
        });
        let initialValues = {
            name: '',
            desc: '',
            imageUrl: '',
            prepareSteps: [
                {
                    description: '',
                },
            ],
            ingredients: [
                {
                    amount: '',
                    name: '',
                },
            ],
        };
        const { imageURI } = this.state;
        return (
            <ThemeProvider>
                <Formik
                    initialValues={initialValues}
                    validationSchema={CreateRecipeValidationSchema}
                    onSubmit={async values => {
                        try {
                            //console.log(values);
                            let finalValue: any = { ...values };
                            finalValue.imageUrl = imageURI;
                            finalValue.owner = {
                                ownerid: authentication.userDetails.username,
                                ownername: authentication.userDetails.name
                            };
                            console.log(this.state.imageFormData);
                            this.setState({ submissionInProg: true });
                            const createCocktail = await RecipesService().createRecipe(finalValue);
                            this.setState({ imageURI: '', submissionInProg: false });
                            navigation.navigate("MyAccount");
                        } catch (ex) {
                            this.setState({ creationMessage: ex.message });
                            this.setState({ submissionInProg: false });
                            console.log(ex.message);
                            this.props.doSignout();
                        }

                    }}
                >
                    {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                        <ScrollView>
                            <View style={styles.container}>
                                <View>
                                    <Text style={styles.formLabel}>Add Recipe</Text>
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
                                        placeholder="Description"
                                        onChangeText={handleChange('desc')}
                                        onBlur={handleBlur('desc')}
                                        value={values.desc}
                                        multiline={true}
                                        errorMessage={touched.desc && errors.desc ? errors.desc : undefined}
                                    />
                                </View>
                                <Card>
                                    <Card.Title>Upload Image</Card.Title>
                                    <Card.Divider />
                                    <Input
                                        containerStyle={styles.inputStyle}
                                        placeholder="Image Url"
                                        onChangeText={handleChange('imageUrl')}
                                        onBlur={handleBlur('imageUrl')}
                                        value={imageURI}
                                        multiline={true}
                                        disabled={true}
                                    />
                                    <View style={styles.fixToText}>
                                        <Button
                                            icon={
                                                <Icon
                                                    name="picture-o"
                                                    size={20}
                                                    color="white"
                                                />
                                            }
                                            buttonStyle={styles.buttonStyle}
                                            onPress={this.selectPhotos}
                                            type="solid"
                                            title=" Gallery" />
                                        <Button
                                            icon={
                                                <Icon
                                                    name="camera"
                                                    size={20}
                                                    color="white"
                                                />
                                            }
                                            buttonStyle={styles.buttonStyle}
                                            onPress={this.takePhotos}
                                            type="solid"
                                            title=" Camera" />
                                    </View>
                                </Card>
                                <FieldArray name="ingredients">
                                    {({ insert, remove, push }) => (
                                        <Card>
                                            <Card.Title>Ingredients</Card.Title>
                                            <Card.Divider />
                                            {values.ingredients.length > 0 &&
                                                values.ingredients.map((ingredient, index) => (
                                                    <View key={index}>
                                                        <Input
                                                            containerStyle={styles.inputStyle}
                                                            placeholder="Name"
                                                            onChangeText={handleChange(`ingredients[${index}].name`)}
                                                            onBlur={handleBlur(`ingredients[${index}].name`)}
                                                            value={ingredient.name}
                                                        />
                                                        <Input
                                                            containerStyle={styles.inputStyle}
                                                            placeholder="Amount"
                                                            onChangeText={handleChange(`ingredients[${index}].amount`)}
                                                            onBlur={handleBlur(`ingredients[${index}].amount`)}
                                                            value={ingredient.amount}
                                                        />
                                                        <View style={styles.separator}>
                                                            <Button
                                                                icon={
                                                                    <Icon
                                                                        name="trash-o"
                                                                        size={20}
                                                                        color="cornflowerblue"
                                                                    />
                                                                }
                                                                raised={true}
                                                                onPress={() => remove(index)}
                                                                type="outline"
                                                                title=" Remove" />
                                                        </View>
                                                    </View>
                                                ))}
                                            <View style={styles.separator}>
                                                <Button
                                                    icon={
                                                        <Icon
                                                            name="cart-plus"
                                                            size={20}
                                                            color="cornflowerblue"
                                                        />
                                                    }
                                                    raised={true}
                                                    onPress={() => push({ amount: '', name: '' })}
                                                    type="outline"
                                                    title=" Add" />
                                            </View>
                                        </Card>
                                    )}
                                </FieldArray>
                                <FieldArray name="prepareSteps">
                                    {({ insert, remove, push }) => (
                                        <Card>
                                            <Card.Title>Preparation Steps</Card.Title>
                                            <Card.Divider />
                                            {values.prepareSteps.length > 0 &&
                                                values.prepareSteps.map((prepareStep, index) => (
                                                    <View key={index}>
                                                        <Input
                                                            containerStyle={styles.inputStyle}
                                                            placeholder="Description"
                                                            onChangeText={handleChange(`prepareSteps[${index}].description`)}
                                                            onBlur={handleBlur(`prepareSteps[${index}].description`)}
                                                            value={prepareStep.description}
                                                            multiline={true}
                                                        />
                                                        <View style={styles.separator}>
                                                            <Button
                                                                icon={
                                                                    <Icon
                                                                        name="trash-o"
                                                                        size={20}
                                                                        color="cornflowerblue"
                                                                    />
                                                                }
                                                                raised={true}
                                                                onPress={() => remove(index)}
                                                                type="outline"
                                                                title=" Remove" />
                                                        </View>
                                                    </View>
                                                ))}
                                            <View style={styles.separator}>
                                                <Button
                                                    icon={
                                                        <Icon
                                                            name="cart-plus"
                                                            size={20}
                                                            color="cornflowerblue"
                                                        />
                                                    }
                                                    raised={true}
                                                    onPress={() => push({ description: '' })}
                                                    type="outline"
                                                    title=" Add" />
                                            </View>
                                        </Card>
                                    )}
                                </FieldArray>
                                <View style={styles.separator}>
                                    <Button style={{ margin: 5 }} title={submissionInProg ? 'Adding...' : 'Submit'} disabled={submissionInProg} onPress={(e: any) => handleSubmit(e)} />
                                    {/* <Button onPress={handleSubmit} title="Submit" /> */}
                                    {creationMessage &&
                                        <Text style={{ color: '#f00' }}>{creationMessage}</Text>
                                    }
                                </View>
                            </View>
                        </ScrollView>
                    )}
                </Formik>
            </ThemeProvider>
        );
    }
}

const mapStateToProps = (state: any, ownProps: any) => {
    const { authentication } = state;
    return { authentication, ...ownProps };
}

const mapDispatchToProps = (dispatch: any) => (
    bindActionCreators({
        doSignout: authSingOut
    }, dispatch)
)

export default connect(mapStateToProps, mapDispatchToProps)(CreateRecipeScreen);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        width: "98%",
        justifyContent: 'flex-start',
    },
    formLabel: {
        fontSize: 20
    },
    inputStyle: {
        margin: 5,
        width: 300,
        height: 60,
        paddingHorizontal: 10,
    },
    separator: {
        marginTop: 8,
    },
    fixToText: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    buttonStyle: {
        width: 150,
    },
    headerContent: {
        fontWeight: "600",
        fontSize: 20,
        textAlign: "center"
    }
});
