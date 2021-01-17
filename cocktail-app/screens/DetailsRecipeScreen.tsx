import * as React from 'react';
import { StyleSheet, Image, SectionList, SafeAreaView, useColorScheme, ScrollView } from 'react-native';
import { AnySchemaConstructor } from 'yup';
import RecipeItem from '../components/RecipeItem';
import { View , Text} from '../components/Themed';

import Colors from '../constants/Colors';
import { Card, ListItem, Button, Rating , Header,Icon } from 'react-native-elements'
import { DetailRecipeComponent, Ingredients, PreparationStep } from '../types';

export default class DetailRecipeScreen extends React.Component<DetailRecipeComponent.Props, DetailRecipeComponent.State> {
    constructor(props: DetailRecipeComponent.Props) {
        super(props);
        
        
        
    }

    render() {
       
        const { recipeDetails }= this.props.route.params;
        
        return (<>
            <Header 
  
  centerComponent={{ text: recipeDetails.name, style: { color: '#fff', fontSize:26, fontWeight:'600' } }}
  
/>
<ScrollView>
            <Card>
                {/* <Card.Image style={} source={{ uri:recipeDetails.imageUrl[0]}}  ></Card.Image> */}
                {/* <Card.Title style={{fontSize:28, alignContent:'space-between'}}>{recipeDetails.name} </Card.Title>
                <Card.Divider/> */}
                <Item imageUri={recipeDetails.imageUrl}  />
                <Card.Divider/>
                <Text style={{backgroundColor:'#6495ed', color:'#fff' ,fontSize:20 , borderRadius:5, textAlignVertical:'top', textAlign:'center',padding:5}}>What you Need</Text>
                {
                    recipeDetails.ingredients.map((item: any, i: string | number ) => (
                    <ListItem key={i} bottomDivider>
                        {/* <Icon name={item.icon} /> */}
                        <ListItem.Content>
                        <ListItem.Title><Text>{item.name}</Text>    <Text>{item.amount}</Text></ListItem.Title>
                        
                        </ListItem.Content>
                        
                    </ListItem>
                    ))
                }
                <Card.Divider/>
                <Text style={{backgroundColor:'#6495ed', color:'#fff', fontSize:20 ,padding:5, borderRadius:5, textAlignVertical:'top', textAlign:'center'}}>Steps</Text>
                {
                    recipeDetails.prepareSteps.map((item: any, i: string | number ) => (
                    <ListItem key={i} bottomDivider>
                        {/* <Icon name={item.icon} /> */}
                        <ListItem.Content>
                        <ListItem.Title><Text>{item}</Text></ListItem.Title>
                        
                        </ListItem.Content>
                        
                    </ListItem>
                    ))
                }
                
            </Card>
            </ScrollView>
            </>
        );
    }
}
const Item = ({ imageUri }: { imageUri: string[] | undefined }) => {
    return (
        <View style={styles.imageItem}>
            {imageUri && imageUri[0] && <Image  source={{ uri: imageUri[0] }} style={styles.image} />}
            {!imageUri || (imageUri && !imageUri[0]) && <Text style={styles.title}>No Image Exists</Text>}
        </View>
    );

}
const styles = StyleSheet.create({
    containerroot: {
        flex: 1,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 4,
        padding: 5,
        marginTop: 50,
        marginBottom: 5,
        marginLeft: 2,
        marginRight: 2,
       
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        justifyContent: 'flex-start',
        overflow: "scroll"
    },line:{
        borderBottomColor: 'black',
        borderBottomWidth: 1,
      },
    container: {
        
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 2,
        padding: 20,
        marginBottom: 5,
        marginLeft: 2,
        marginRight: 2,
        borderWidth: 0.5,
        justifyContent: 'flex-start',
    },title: {
        flex: 0.3,
        
        //backgroundColor: "grey",
        //borderWidth: 0.5,
        //borderTopLeftRadius: 20,
        //borderTopRightRadius: 20,
        fontSize: 24,
        textAlign: "center"
    },titleEnd: {
        flex: 0.3,
        fontStyle:"italic",
        padding:5,
        backgroundColor: "grey",
        borderWidth: 0.5,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        fontSize: 12,
        textAlign: "center"
    },title2: {
        flex: 0.3,
        marginTop: 5,
        marginLeft: 2,
        marginRight: 2,
        padding:5,
        backgroundColor: "grey",
        borderWidth: 0.5,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        fontSize: 20,
        textAlign: "center"
    },image: {
        width: "100%",
        height: 250,
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
        overflow: "hidden",
        resizeMode: 'stretch'
    },
    formLabel: {
        fontSize: 20
    },
    imageItem: {
        flex:1,
        padding: 0,
        height:300
    },
    inputStyle: {
        marginTop: 20,
        width: 300,
        height: 40,
        paddingHorizontal: 10,
        borderRadius: 50,
        backgroundColor: '#DCDCDC',
    },
    ingredient: {
        flex: 0.6,
        //backgroundColor: "#c2d9ff",
        borderColor:"#c2d9ff",
        borderWidth:0.5,
        //color: "red",
        fontWeight:"500",
        fontSize: 10,
        textAlign: "center"
    },amount: {
        flex: 0.4,
        borderColor: "#fcffde",
        borderWidth:0.5,
        fontSize: 10,
        fontWeight:"500",
        //color:"red",
        textAlign: "center"
    },ingredientrow:{
        flexDirection: "row",
        height: 'auto'
    }
});
