
import React, { useState } from 'react';
import { Button, FlatList, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator(); // helps with screens

const App = props => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name = "Home" component={Home}/>
        <Stack.Screen name = "Description" component={Description}/>
     </Stack.Navigator>
    </NavigationContainer>
  );
}
const Home = props => {
  const [userInput, setUserInput] = useState('')
  const [data, setData] = useState([])
  const [renderList, setRenderList] = useState(false)
  const renderItem = item => {
    console.log(item)
    return (
      <Text>{item.item.Title}</Text>
    )
  }
  return(
    <SafeAreaView>
      <TextInput
        placeholder = "Please Enter a Movie"
        onChangeText = {setUserInput}
        value = {userInput}
      />
      <Button
        title = "Search"
        onPress = {() => {apiCall(userInput, data); setRenderList(!renderList)}}
      />
      <Button
        title = "press to print"
        onPress = {() => console.log(data)}
      />
      <FlatList
        data = {data}
        renderItem = {renderItem}
        keyExtractor = {item => item.imdbID}
        ListEmptyComponent = {empty}
        extraData = {renderList}
      />
    </SafeAreaView>
  );
}
const empty = () => {
  return (
    <Text>There is nothing here, Search something</Text>
  )
}
const apiCall = async (userInput, data) =>  {
  let search;
  if(userInput !== '') { // do the api call
    while(data.length > 0) { // empty the array when creating a new search
      data.pop();
    }
    search = await fetch(`http://www.omdbapi.com/?apikey=33014428&s=${userInput}`)
    .then(response => response.json()) // response is a promise and to access the text, we must convert to a json
      .then(data => { // data is the response.json, does not refer to the parameter
        return data.Search; // returns the results of array of objects of the movies
        }
      )
    let i = 0
    for(i; i < search.length; i++ ) { // this is to create the iterate through search and create an object for data
      const movie = { // this to recreate the data but change the poster if N/A appears
        Poster: search[i].Poster.localeCompare(`N/A`) === 0 ? `https://images.uncyclomedia.co/uncyclopedia/en/thumb/0/01/DramaticQuestionMark.png/300px-DramaticQuestionMark.png`: search[i].Poster,
        Title: search[i].Title,
        Type: search[i].Type,
        Year: search[i].Year,
        imdbID: search[i].imdbID
      }
      data.push(movie)
    }
  }

}
const Description = props => {
  return(
    <SafeAreaView>
      <Text>Hello Description</Text>
    </SafeAreaView>
  )
}
//() => props.navigation.navigate("Description")
export default App

