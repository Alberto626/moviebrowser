
import React, { useState, useEffect } from 'react';
import { Button, FlatList, SafeAreaView, StyleSheet, Text, TextInput, View,Image, Alert } from 'react-native';
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
    return (
      <SafeAreaView style = {{flexDirection: 'row'}}>
        <Image
        style = {styles.logo}
        source ={{ uri: item.item.Poster }}
        />
        <SafeAreaView style = {{flexDirection : 'column'}}>
        <Text style = {{fontWeight: `bold`}}>{item.item.Title}</Text>
        <Text>{item.item.Type}</Text>
        <Text>From: {item.item.Year}</Text>
        <Text>ID: {item.item.imdbID}</Text>
        <Button
          style = {styles.buttonStyle}
          title = "Click For More"
          onPress = {() => props.navigation.navigate("Description", {imdbID: item.item.imdbID, poster: item.item.Poster})}
        />
        </SafeAreaView>
      </SafeAreaView>
    )
  }
  return(
    <SafeAreaView>
      <TextInput
        placeholder = "Please Enter a Movie"
        onChangeText = {setUserInput}
        value = {userInput}
        style = {{height: 40, borderWidth: 1}}
      />
      <Button
        title = "Search"
        onPress = {() => apiCall(userInput, data, setRenderList)}
      />
      <FlatList
        data = {data}
        renderItem = {renderItem}
        keyExtractor = {item => item.imdbID}
        ListEmptyComponent = {empty}
        extraData = {renderList}
        contentContainerStyle = {{ paddingBottom : 100}}
      />
    </SafeAreaView>
  );
}
const empty = () => {
  return (
    <Text>There is nothing here, Search something</Text>
  )
}
const apiCall = async (userInput, data, setRenderList) =>  {
  let search;
  if(userInput !== '') { // do the api call
    search = await fetch(`http://www.omdbapi.com/?apikey=33014428&s=${userInput}`)
    .then(response => response.json()) // response is a promise and to access the text, we must convert to a json
      .then(data => { // data is the response.json, does not refer to the parameter
        console.log(data); return data.Search; // returns the results of array of objects of the movies
        }
      )
      if(search) { // if the search is valid
        while(data.length > 0) { // empty the array when creating a new search
          data.pop();
        }
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
          setRenderList(true) // These are to rerender the flatList
          setRenderList(false)
        }
      }
      else{
        Alert.alert(`Movies not found`)
      }
  }

}
const Description = props => {
  const [movie, setMovie] = useState(new Object())
  useEffect(() => {
    const searchByID = async(ID) => {
      let search = await fetch(`http://www.omdbapi.com/?apikey=33014428&i=${ID}`)
      .then(response => response.json())
      setMovie(search)
    }
    searchByID(props.route.params.imdbID)

  })
  return(
    <SafeAreaView style = {{alignItems: `center`}}>
      <Text style = {{fontWeight: `bold`}}>{movie.Title}</Text>
      <Image
        style = {{width: 300, height: 300}}
        source ={ { uri: props.route.params.poster }}
      />
      <Text>Genre: {movie.Genre}</Text>
      <Text>Actors: {movie.Actors}</Text>
      <Text>Year: {movie.Year} Rated: {movie.Rated} Released: {movie.Released}</Text>
      <Text>Director: {movie.Director} Writer: {movie.Writer}</Text>
      
      <Text style = {{fontWeight: `bold`,fontSize: 20}}>Plot: {movie.Plot}</Text>
    </SafeAreaView>
  )
}
const styles = StyleSheet.create({
  logo: {
    width: 125,
    height: 125
  },
  buttonStyle: {
    height: 20,
    marginTop: 20,
    alignItems: 'center'

  }
})
//() => props.navigation.navigate("Description")
export default App

