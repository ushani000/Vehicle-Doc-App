// App.js
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Home from './Screens/Home';
import SignUp from './Screens/SignUp';
import SignIn from './Screens/SignIn';
import Menu from './Screens/Menu';
import AddVehicle from './Screens/AddVehicle';
import AddDocument from './Screens/AddDocument';
import AddedVehicle from './Screens/AddedVehicle';
import ShareExp from './Screens/ShareExp';
import LiveChat from './Screens/LiveChat';
import OfficerChatList from './Screens/OfficerChatList';
import ChatWindow from './Screens/ChatWindow';
import RevenueScanner from './Screens/RevenueScanner';
import AddedDocument from './Screens/AddedDocument';
import TypePost from './Screens/TypePost';
import Admin from './Screens/Admin';
import Comments from './Screens/Comments'; 
import SetReminderModal from './Screens/SetReminderModal';
 // Assuming you have a Comments screen
//import LicenseScanner from './Screens/LicenseScanner';
//import InsuranceScanner from './Screens/InsuranceScanner';
//import EmissionScanner from './Screens/EmissionScanner';  

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        screenOptions={{ 
          headerShown: false,
          // Add this to log all navigation events
          onStateChange: (state) => {
            console.log('Navigation State Changed:', state);
          }
        }}
      >
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="SignIn" component={SignIn} />
        <Stack.Screen name="Menu" component={Menu} />
        <Stack.Screen name="AddVehicle" component={AddVehicle} />
        <Stack.Screen name="AddDocument" component={AddDocument} />
        <Stack.Screen name="AddedVehicle" component={AddedVehicle} />
        <Stack.Screen name="ShareExp" component={ShareExp} />
        <Stack.Screen name="LiveChat" component={LiveChat} />
        <Stack.Screen name="OfficerChatList" component={OfficerChatList} />
        <Stack.Screen name="ChatWindow" component={ChatWindow} />
        <Stack.Screen name="RevenueScanner" component={RevenueScanner} />
        <Stack.Screen name="AddedDocument" component={AddedDocument} />
        <Stack.Screen name="TypePost" component={TypePost} />
        <Stack.Screen name="Comments" component={Comments} />
        <Stack.Screen name="SetReminderModal" component={SetReminderModal} />
        
        {/* Add Admin screen with navigation logging */}
        <Stack.Screen 
          name="Admin" 
          component={Admin}
          listeners={({ navigation, route }) => ({
            focus: () => {
              console.log('Admin screen focused');
            },
            beforeRemove: () => {
              console.log('Leaving Admin screen');
            }
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}