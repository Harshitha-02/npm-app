import React from 'react';
import { View, Text, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export const HomeIcon = ({ focused, size }) => {
    return (
        <Ionicons
            name={focused ? 'home' : 'home-outline'}
            size={size}
            color={focused ? '#4ADE80' : 'white'}
        />
    );
};

export const InventoryIcon = ({ focused, size }) => {
    return (
        <Ionicons
            name={focused ? 'cube' : 'cube-outline'}
            size={size}
            color={focused ? '#4ADE80' : 'white'}
        />
    );
};

export const FeedbackIcon = ({ focused, size }) => {
    return (
        <Ionicons
            name={focused ? 'chatbubbles' : 'chatbubbles-outline'}
            size={size}
            color={focused ? '#4ADE80' : 'white'}
        />
    );
};

export const ProfileIcon = ({ focused, size }) => {
    return (
        <View style={{ alignItems: 'center' }}>
            <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: focused ? '#4ADE80' : 'white', justifyContent: 'center', alignItems: 'center' }}>
                <Ionicons
                    name="person"
                    size={size * 0.6} 
                    color={focused ? 'white' : '#19263C'} 
                />
            </View>
        </View>
    );
};
