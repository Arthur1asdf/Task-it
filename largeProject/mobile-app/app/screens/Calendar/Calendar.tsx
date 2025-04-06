import React from 'react';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import TaskAPI from '../../api/tasks';

interface Task {
    _id: string;
    userId: string;
    title: string;
    days?: string[];
    isCompleted?: boolean;
}

const Calendar: React.FC = () => {
    const [weeklyTasks, setWeeklyTasks] = React.useState([]);
    const [selectedDay, setSelectedDay] = useState<string[]>([]);

    const router = useRouter();

    // const fetchWeekTasks = async () => {
    //     try {
    //         //const response = await TaskAPI.getWeeklyTasks(selectedDay);
    //         setWeeklyTasks(response.data);
    //     } catch (error) {
    //         console.error('Error fetching weekly tasks:', error);
    //     }
    // };

    return (
        <View style={{ flex: 1 }}>

        </View>
    );
}

export default Calendar;