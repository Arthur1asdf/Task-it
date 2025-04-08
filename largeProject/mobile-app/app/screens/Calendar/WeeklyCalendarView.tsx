import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Button, Modal, StyleSheet, TextInput, Image } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import { Checkbox } from 'react-native-paper';
import { format, parseISO, set } from 'date-fns';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TaskAPI from '../../api/tasks';

type Task = {
  _id: string;
  name: string;
  isCompleted: boolean;
  taskDates: string[];
};

type GroupedTasks = {
  [date: string]: Task[];
};

type WeeklyCalendarViewProps = {
  navigation: {
    navigate: (screen: string, params?: { date: string }) => void;
  };
};

const getStartOfWeek = (date: Date): Date => {
  const d = new Date(date);
  const day = d.getDay(); // 0 (Sun) to 6 (Sat)
  return new Date(d.setDate(d.getDate() - day));
};

const formatDateOnly = (date: Date): string => date.toISOString().split('T')[0];

const getNextWeekdayDates = (weekdayDates: string[], startDate: Date): string[] => {
    const result: string[] = [];
    const current = new Date(startDate);
  
    for (let i = 0; i < 7; i++) {
      const checkDate = new Date(current);
      checkDate.setDate(current.getDate() + i);
      const formatted = formatDateOnly(checkDate);
  
      if (weekdayDates.includes(formatted)) {
        result.push(formatted);
      }
    }
  
    return result;
};
  

const WeeklyCalendarView: React.FC<WeeklyCalendarViewProps> = () => {
    const [groupedTasks, setGroupedTasks] = useState<GroupedTasks>({});
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [showAddModal, setShowAddModal] = useState<boolean>(false);
    const [addTaskDate, setAddTaskDate] = useState<string | null>(null);
    const [selectedDays, setSelectedDays] = useState<string[]>([]);
    const [newTask, setNewTask] = useState<string>('');
    const [editingTask, setEditingTask] = useState<Task | null>(null);

    const router = useRouter();

    useEffect(() => {
        loadWeekTasks();
    }, [selectedDate]);

    const loadWeekTasks = async () => {
        try {
            const userId = await AsyncStorage.getItem("userId");
            if (!userId) return;

            const startOfWeekDate = getStartOfWeek(selectedDate);
            const tasks = await TaskAPI.getWeekTasks(userId, formatDateOnly(startOfWeekDate));

            const grouped: GroupedTasks = {};

            tasks.forEach((task: Task) => {
            task.taskDates.forEach(dateStr => {
                if (!grouped[dateStr]) {
                grouped[dateStr] = [];
                }
                grouped[dateStr].push(task);
            });
            });

            setGroupedTasks(grouped);
        } catch (err) {
            console.error("Failed to load weekly tasks:", err);
            setGroupedTasks({});
        }
    };

    const handleToggleComplete = async (taskId: string, isCompleted: boolean): Promise<void> => {
        try {
            const userId = await AsyncStorage.getItem("userId");
            if (!userId) return;
            await TaskAPI.completeTask(userId, taskId, !isCompleted);
            await loadWeekTasks();
        } catch (error) {
            console.error("Toggle failed:", error);
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

    const handleSave = async () => {
        if (newTask.trim()) {
            try {
                const userId = await AsyncStorage.getItem('userId');
                if (!userId) return;
    
                // Ensure at least today's date is included if no days are selected
                let formattedDays = selectedDays.length > 0 
                    ? getNextWeekdayDates(selectedDays, getStartOfWeek(selectedDate)) // for recurring tasks 
                    : [addTaskDate || selectedDate.toISOString().split("T")[0]]; // for one-time tasks
    
                console.log("Task being sent:", {
                    userId,
                    newTask,
                    formattedDays,
                    editingTask
                });
    
                if (editingTask) {
                    await TaskAPI.editTask(userId, editingTask._id, newTask);
                } else {
                    await TaskAPI.addTask(userId, newTask, formattedDays);
                }
    
                loadWeekTasks();
                setShowAddModal(false);
                setNewTask("");
                setSelectedDays([]);
                setEditingTask(null);
            } catch (error) {
                console.error("Error saving task", error);
            }
        }
    };    

    const handleDelete = async (taskId: string) => {
        try {
            const userId = await AsyncStorage.getItem('userId');
            if (userId) {
                await TaskAPI.deleteTask(userId, taskId);
            }
            loadWeekTasks();
        } catch (error) {
            console.error("Error deleting task", error);
        }
        setShowAddModal(false);
    };

    const handleEdit = (task: Task) => {
        setEditingTask(task);
        setNewTask(task.name);
        setSelectedDays(task.taskDates || []);
        setShowAddModal(true);
    };

    const startOfWeek: Date = getStartOfWeek(selectedDate);
    const daysOfWeek: Date[] = Array.from({ length: 7 }, (_, i) => {
        const day = new Date(startOfWeek);
        day.setDate(startOfWeek.getDate() + i);
        return day;
    });

    return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Button title="← Back to Home" onPress={() => router.replace("../Home")} />
        {/* Pickers */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            {/* Year picker */}
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
            
            {/* Month picker */}
            <Picker
                selectedValue={selectedDate.getMonth().toString()}
                onValueChange={(val: string) => handleDateChange(selectedDate.getFullYear(), parseInt(val))}
                style={{ width: 150 }}
            >
                {Array.from({ length: 12 }, (_, i) => (
                    <Picker.Item
                    key={i}
                    label={new Date(2023, i).toLocaleString('default', { month: 'long' })}
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
            const dateStr = formatDateOnly(day);
            const todayStr = formatDateOnly(new Date());
            const dayTasks = groupedTasks[dateStr] || [];
            const isToday = dateStr === todayStr;
            //const isSelected = formatDateOnly(selectedDate) === dateStr;

        return (
            <View
                key={index}
                style={{
                marginBottom: 20,
                backgroundColor: isToday ? '#E0F7FA' : 'transparent',
                padding: 10,
                borderRadius: 8,
                }}
            >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <TouchableOpacity onPress={() => router.navigate(`./DailyCalendarView?date=${dateStr}`)}>
                    <Text style={{
                        fontWeight: isToday ? 'bold' : 'normal',
                        fontSize: 16,
                        marginBottom: 6,
                        color: isToday ? '#007AFF' : '#000',
                    }}>
                        {day.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => {
                    setAddTaskDate(dateStr);
                    setShowAddModal(true);
                    setNewTask("");
                    setSelectedDays([]);
                    setEditingTask(null);
                }}>
                    <Text>+</Text>
                </TouchableOpacity>
                </View>

            {/* Tasks for the day */}
            <ScrollView style={{ maxHeight: 150 }}>
              {dayTasks.length > 0 ? dayTasks.map(task => (
                <View key={task._id} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 2 }}>
                    
                    {/* Checkbox for task */}
                    <View style={{
                        backgroundColor: '#rgba(234, 200, 255, 0.33)',
                        borderRadius: 20,
                        padding: 0.1,
                        marginRight: 10,
                        marginTop: 3,
                    }}>
                        <Checkbox
                            status={task.isCompleted ? 'checked' : 'unchecked'}
                            onPress={() => handleToggleComplete(task._id, task.isCompleted)}
                        />
                    </View>
                    {/* Task name */}
                    <Text style={task.isCompleted ? styles.completedTask : styles.uncompletedTask}>{task.name}</Text>
                    
                    {/* Edit task button */}
                    <TouchableOpacity onPress={() => handleEdit(task)} style={styles.editButton}>
                        <Image source={require("../../../assets/images/pencilIcon.png")} style={{ width: 20, height: 20, marginRight: 8 }} />
                    </TouchableOpacity>
                </View>
              )) : <Text>No tasks</Text>}
            </ScrollView>
          </View>
        );
      })}

        {/* Add Task Modal */}
        <Button title="Add Task" onPress={() => setShowAddModal(true)} />
        <Modal visible={showAddModal} animationType="slide" onRequestClose={() => setShowAddModal(false)}>
            <View style={{ padding: 20, marginTop: 100, alignItems: 'center' }}>
                <Text style={{ fontSize: 24, fontWeight: 'bold' }}>
                    Add Task{addTaskDate ? ` for ${addTaskDate}` : ''}
                </Text>

                {/* Input for task name */}
                <Text style={{ marginTop: 16 }}>Task Name:</Text>
                <TextInput
                    value={newTask}
                    onChangeText={setNewTask}
                    placeholder="Enter task name"
                    style={{ borderWidth: 1, borderColor: '#ccc', padding: 8, marginBottom: 12 }}
                />

                {/* Only show weekday selection if NOT editing */}
                {!editingTask && (
                <>
                    <Text>Select Days This Week:</Text>
                    {daysOfWeek.map((date, i) => {
                        const dateStr = formatDateOnly(date);
                        const label = date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
                        return (
                            <View key={dateStr} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 2 }}>
                                <View style={{
                                    borderWidth: 1,
                                    borderColor: '#888',
                                    borderRadius: 20,
                                    padding: 2,
                                    marginRight: 10,
                                    marginTop: 3,
                                }}>
                                <Checkbox
                                    status={selectedDays.includes(dateStr) ? 'checked' : 'unchecked'}
                                    onPress={() => {
                                        if (selectedDays.includes(dateStr)) {
                                            setSelectedDays(selectedDays.filter(d => d !== dateStr));
                                        } else {
                                            setSelectedDays([...selectedDays, dateStr]);
                                        }
                                    }}
                                    uncheckedColor="#888"
                                />
                                </View>
                                <Text style={{ flexShrink: 1, marginTop: 4}}>{label}</Text>
                            </View>
                        );
                    })}
                    </>
                )}

                <View style={styles.buttonContainer}>
                    {/* Delete Button - Only Show If Editing a Task */}
                    {editingTask && (
                        <TouchableOpacity onPress={() => handleDelete(editingTask._id)} style={styles.deleteButton}>
                            <Text style={styles.deleteText}>Delete</Text>
                        </TouchableOpacity>
                    )}

                    {/* Cancel Button */}
                    <TouchableOpacity onPress={() => { setShowAddModal(false); setEditingTask(null); }} style={styles.cancelButton}>
                        <Text style={styles.cancelText}>Cancel</Text>
                    </TouchableOpacity>
                    
                    {/* Save button */}
                    <TouchableOpacity onPress={handleSave}  style={styles.saveButton}>
                        <Text style={styles.saveText}>Save</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
    completedTask: {
        textDecorationLine: 'line-through',
        color: '#888',
    },
    uncompletedTask: {
        textDecorationLine: 'none',
        color: '#000',
    },
    buttonContainer: {
        marginTop: 20,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
    },
    editButton: {
        padding: 4,
        borderRadius: 4,
        marginLeft: 'auto',
    },
    saveButton: {
        width: '30%',
        alignItems: 'center',
        padding: 8,
        marginTop: 10,
    },
    saveText: {
        color: 'blue',
        fontSize: 18,
    },
    cancelButton:{
        width: '30%',
        alignItems: 'center',
        padding: 8,
        marginTop: 10,
    },
    cancelText: {
        color: 'black',
        fontSize: 18,
    },
    deleteButton:{
        width: '30%',
        alignItems: 'center',
        padding: 8,
        marginTop: 10,
    },
    deleteText: {
        color: 'red',
        fontSize: 18,
    },
});

export default WeeklyCalendarView;
