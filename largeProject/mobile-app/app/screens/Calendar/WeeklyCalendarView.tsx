import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Button, Modal } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import CheckBox from '@react-native-community/checkbox';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TaskAPI from '../../api/tasks';

type Task = {
  _id: string;
  taskName: string;
  isComplete: boolean;
  taskDates: string[];
};

type WeeklyCalendarViewProps = {
  navigation: {
    navigate: (screen: string, params?: { date: string }) => void;
  };
};

const getStartOfWeek = (date: Date): Date => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
};

// Helper to normalize dates to YYYY-MM-DD
const formatDateOnly = (d: string) => new Date(d).toISOString().split("T")[0];

const WeeklyCalendarView: React.FC<WeeklyCalendarViewProps> = ({ navigation }) => {
    const [weekTasks, setWeekTasks] = useState<Task[]>([]);
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [year, setYear] = useState<number>(new Date().getFullYear());
    const [month, setMonth] = useState<number>(new Date().getMonth());
    const [showAddModal, setShowAddModal] = useState<boolean>(false);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
            const userId = await AsyncStorage.getItem("userId");
            if (!userId) return;

            const response = await TaskAPI.getWeekTasks(selectedDate.toISOString());
            console.log("Weekly tasks response:", response);

            setWeekTasks(response.tasks || []);
            } catch (err) {
            console.error("Failed to load weekly tasks:", err);
            }
        };
        fetchTasks();
    }, [selectedDate]);

    const loadWeekTasks = async (): Promise<void> => {
        try {
            const formattedDate: string = selectedDate.toISOString().split('T')[0];
            const tasks: Task[] = await TaskAPI.getWeekTasks(formattedDate);
            setWeekTasks(tasks);
        } catch (error) {
            console.error(error);
        }
    };

    const handleToggleComplete = async (taskId: string, isCompleted: boolean): Promise<void> => {
        try {
            const userId = await AsyncStorage.getItem("userId");
            if (!userId) return;
            await TaskAPI.completeTask(userId, taskId, !isCompleted);
            loadWeekTasks();
        } catch (error) {
            console.error(error);
        }
    };

    const handleDateChange = (newYear: number, newMonth: number): void => {
        const updated = new Date(newYear, newMonth, 1);
        setSelectedDate(updated);
    };

    const handleWeekNav = (direction: number): void => {
        const newDate = new Date(selectedDate);
        newDate.setDate(newDate.getDate() + direction * 7);
        setSelectedDate(newDate);
    };

    const startOfWeek: Date = getStartOfWeek(selectedDate);
    const daysOfWeek: Date[] = Array.from({ length: 7 }, (_, i) => {
        const day = new Date(startOfWeek);
        day.setDate(startOfWeek.getDate() + i);
        return day;
    });

    return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
        {/* Pickers */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        {/* year picker */}
        <Picker
            selectedValue={selectedDate.getFullYear().toString()}
            onValueChange={(val: string) => handleDateChange(parseInt(val), selectedDate.getMonth())}
            style={{ width: 150 }}
        >
            {Array.from({ length: 5 }, (_, i) => {
                const y = 2023 + i;
                return <Picker.Item key={y} label={y.toString()} value={y.toString()} />;
            })}
        </Picker>

        {/* month picker */}
        <Picker
            selectedValue={selectedDate.getMonth().toString()}
            onValueChange={(val: string) => handleDateChange(selectedDate.getFullYear(), parseInt(val))}
            style={{ width: 150 }}
        >
            {Array.from({ length: 12 }, (_, i) => (
                <Picker.Item
                key={i}
                label={new Date(0, i).toLocaleString('default', { month: 'long' })}
                value={i.toString()}
                />
            ))}
        </Picker>


        </View>

        {/* Navigation */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10 }}>
        <Button title="← Previous" onPress={() => handleWeekNav(-1)} />
        <Button title="Next →" onPress={() => handleWeekNav(1)} />
        </View>

        {/* Daily Task Stacks */}
        {daysOfWeek.map((day: Date, index: number) => {
            const dateStr = day.toISOString().split('T')[0];

            const dayTasks: Task[] = weekTasks.filter(t =>
                t.taskDates.some(taskDate => taskDate.startsWith(dateStr))
            );


            return (
                <View key={index} style={{ marginBottom: 20 }}>
                <TouchableOpacity onPress={() => navigation.navigate("DailyCalendarView", { date: dateStr })}>
                    <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 6 }}>
                    {day.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
                    </Text>
                </TouchableOpacity>
                <ScrollView style={{ maxHeight: 150 }}>
                    {dayTasks.length > 0 ? dayTasks.map(task => (
                    <View key={task._id} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                        <CheckBox
                        value={task.isComplete}
                        onValueChange={() => handleToggleComplete(task._id, task.isComplete)}
                        />
                        <Text>{task.taskName}</Text>
                    </View>
                    )) : <Text>No tasks</Text>}
                </ScrollView>
                </View>
            );
        })}

        {/* Add Task Modal */}
        <Button title="Add Task" onPress={() => setShowAddModal(true)} />
        <Modal visible={showAddModal} animationType="slide" onRequestClose={() => setShowAddModal(false)}>
        <View style={{ padding: 20 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Add Task (Coming Soon)</Text>
            <Button title="Close" onPress={() => setShowAddModal(false)} />
        </View>
        </Modal>
    </ScrollView>
    );
};

export default WeeklyCalendarView;
