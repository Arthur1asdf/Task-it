import React, { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { TouchableOpacity, Text, View, TextInput, Image, ImageBackground, StyleSheet, Alert } from "react-native";
import { format } from "date-fns";
import AsyncStorage from "@react-native-async-storage/async-storage";
import TaskAPI from "../api/tasks";
import { Button } from "react-native-paper";

interface Task {
  _id: string;
  userId: string;
  title: string;
  days?: string[];
  isCompleted?: boolean;
}
interface Streak {
  streak: number;
  lastActivity: Date;
}

const Home: React.FC = () => {
    // Logout function
    const handleLogout = async () => {
        try {
            await AsyncStorage.removeItem('token'); // Remove token from AsyncStorage
            router.replace("./Login"); // Navigate to Login screen after logout
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    const router = useRouter();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [showPopup, setShowPopup] = useState(false);
    const [newTask, setNewTask] = useState("");
    const [selectedDays, setSelectedDays] = useState<string[]>([]);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [streak, setStreak] = useState<number>(0);
    const [streaksLoading, setStreaksLoading] = useState(true);
    const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const daysOfWeek = ["S", "M", "T", "W", "T", "F", "S"];

    const handleDateChange = (daysOffset: number) => {
        const newDate = new Date(selectedDate);
        newDate.setDate(newDate.getDate() + daysOffset);
        setSelectedDate(newDate);
    };

    const handleDayToggle = (index: number) => {
        const day = weekdays[index];
        setSelectedDays(prevDays => 
            prevDays.includes(day)
                ? prevDays.filter(d => d !== day)  // Remove the day if it's already selected
                : [...prevDays, day]  // Add the day if it's not selected
        );
    };

    const getNextWeekdayDates = (selectedWeekdays: string[], baseDate: Date): string[] => {
        const dates = [];
        const currentDayIndex = baseDate.getDay();  // Get the current day index (0=Sunday, 1=Monday, etc.)
        
        // Loop over the next 7 days
        for (let i = 0; i < 7; i++) {
            const currentDate = new Date(baseDate);
            currentDate.setDate(baseDate.getDate() + i); // Move to the next day
            
            const currentDayName = weekdays[currentDate.getDay()]; // Get the day name (e.g., "Monday")
    
            if (selectedWeekdays.includes(currentDayName)) {
                dates.push(currentDate.toISOString().split("T")[0]);  // Add the date in YYYY-MM-DD format
            }
        }
    
        return dates;
    };

    useEffect(() => {
        const loadCachedStreak = async () => {
            const cachedStreak = await AsyncStorage.getItem("currentStreak");
            if (cachedStreak) {
                setStreak(parseInt(cachedStreak, 10));
            }
        };
        
        loadCachedStreak();

        fetchTasks();
        fetchStreaks();
    }, [selectedDate]);

    const fetchTasks = async () => {
        try {
          const userId = await AsyncStorage.getItem("userId");
          const taskDate = selectedDate.toISOString().split("T")[0]; // YYYY-MM-DD
      
          if (!userId) return;
      
          const response = await TaskAPI.getTasks(userId, taskDate);
      
          if (Array.isArray(response)) {
            // Only keep tasks whose taskDates array includes the selected date
            const filteredTasks = response.filter(task =>
              task.taskDates?.includes(taskDate)
            );
      
            setTasks(
              filteredTasks.map(task => ({
                ...task,
                title: task.name || "Untitled task",
              }))
            );
          } else {
            setTasks([]);
          }
        } catch (error) {
          console.error("Error fetching tasks", error);
          setTasks([]);
        }
    };    
    
    const fetchStreaks = async () => {
        try {
            setStreaksLoading(true);
            const userId = await AsyncStorage.getItem("userId");
    
            if (!userId) {
                setStreaksLoading(false);
                return;
            }
    
            const response = await TaskAPI.getStreaks(userId);
            if (response) {
                setStreak(response);
            }
        } catch (error) {
            console.error("Error fetching streaks", error);
        } finally {
            setStreaksLoading(false);
        }
    }

    const handleSave = async () => {
        if (newTask.trim()) {
            try {
                const userId = await AsyncStorage.getItem('userId');
                if (!userId) return;
    
                // Ensure at least today's date is included if no days are selected
                let formattedDays = selectedDays.length > 0 
                    ? getNextWeekdayDates(selectedDays, selectedDate) // for recurring tasks 
                    : [selectedDate.toISOString().split("T")[0]]; // for one-time tasks
    
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
    
                fetchTasks();
                setShowPopup(false);
                setNewTask("");
                setSelectedDays([]);
                setEditingTask(null);
            } catch (error) {
                console.error("Error saving task", error);
            }
        }
    };    

    const handleDelete = async (taskId: string) => {
        // Show confirmation alert
        Alert.alert(
            "Delete Task",
            "Are you sure you want to delete this task?",
            [
                {
                    text: "Cancel",
                    style: "cancel",
                    onPress: () => {
                        // User canceled, do nothing
                    }
                },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        // User confirmed, proceed with deletion
                        try {
                            const userId = await AsyncStorage.getItem('userId');
                            if (userId) {
                                await TaskAPI.deleteTask(userId, taskId);
                            }
                            fetchTasks();
                        } catch (error) {
                            console.error("Error deleting task", error);
                        }
                        fetchTasks();
                        setShowPopup(false);
                        setNewTask("");
                        setSelectedDays([]);
                        setEditingTask(null);
                    }
                }
            ],
            { cancelable: true }
        );
    };

    const handleEdit = (task: Task) => {
        setEditingTask(task);
        setNewTask(task.title);
        setSelectedDays(task.days || []);
        setShowPopup(true);
    };

    const handleToggleComplete = async (task: Task) => {
        try {
          await TaskAPI.completeTask(task.userId, task._id, !task.isCompleted);
          
          setTasks(prev =>
            prev.map(t => t._id === task._id ? { ...t, isCompleted: !task.isCompleted } : t)
          );

          // refresh streaks after completing a task
          fetchStreaks();
        } catch (err) {
          console.error('Failed to toggle task completion', err);
        }
    };
      
    return (
        <ImageBackground 
            source={require("../../assets/images/MobileHomeBackground.png")}
            style={styles.background}
            resizeMode='cover'
        >
            <View style={styles.container}>
                <View style={styles.taskList}>
                   
                    <View style={styles.header}> 
                        <Text style={styles.title}>Tasks</Text>
                        <View style={styles.navButtons}>
                            <Button onPress={() => handleDateChange(-1)}>{"<"}</Button>
                            <Button onPress={() => handleDateChange(1)}>{">"}</Button>
                        </View>
                    </View>
                    <Text style={styles.date}>{format(selectedDate, "EEEE, MMM d")}</Text>

                    <View style={{ marginTop: 10 }}>
                            {tasks.map((task) => (
                                <View key={task._id} style={styles.taskItem}>
                                    <TouchableOpacity onPress={() => handleToggleComplete(task)} style={{ flex: 1 }}>
                                        <Text style={ task.isCompleted ? styles.completedTask : styles.uncompletedTask }>
                                            {task.title}
                                        </Text>
                                    </TouchableOpacity>
                                    <View style={styles.taskActions}>
                                        <TouchableOpacity onPress={() => handleEdit(task)} style={styles.taskActionsButtons}>
                                            <Image source={require("../../assets/images/pencilIcon.png")} style={{ width: 20, height: 20, marginRight: 8 }} />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            ))}
                            <TouchableOpacity onPress={() => setShowPopup(true)} style={styles.addButton}>
                                <Text style={{ color: "#6a5428" }}>+</Text>
                            </TouchableOpacity>
                        </View>
                    
                </View>
            </View>

            {showPopup &&(
                <View style={styles.popup}>
                    <TextInput
                        value={newTask}
                        onChangeText={setNewTask}
                        placeholder="Enter task..."
                        style={styles.input}
                    />
                    
                    {!editingTask && (
                        <>
                            {/* Weekday Selection */}
                            <Text style={{ fontSize: 16, fontWeight: "bold", marginBottom: 5 }}>Occurs every:</Text>
                            <View style={{ display: "flex", justifyContent: "center", gap: 5, marginBottom: 10, flexDirection: "row" }}>
                                {daysOfWeek.map((day, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        onPress={() => handleDayToggle(index)}
                                        style={{
                                            width: 30,
                                            height: 30,
                                            borderRadius: 50,
                                            borderColor: "#6F5A30",
                                            backgroundColor: selectedDays.includes(weekdays[index]) ? "#FDEEC0" : "white",
                                            borderWidth: 1,
                                            alignItems: "center",
                                            justifyContent: "center",
                                        }}
                                    >
                                        <Text style={{ fontWeight: "bold", color: selectedDays.includes(weekdays[index]) ? "#6F5A30" : "#000" }}>
                                            {day}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </>
                    )}
                    <View style={styles.buttonContainer}>
                        {/* Save Button */}
                        <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
                            <Text style={styles.buttonText}>{editingTask ? "Update" : "Save"}</Text>
                        </TouchableOpacity>

                        {/* Cancel Button */}
                        <TouchableOpacity onPress={() => { setShowPopup(false); setEditingTask(null); }} style={styles.cancelButton}>
                            <Text style={styles.buttonText}>Cancel</Text>
                        </TouchableOpacity>

                        {/* Delete Button - Only Show If Editing a Task */}
                        {editingTask && (
                            <TouchableOpacity onPress={() => handleDelete(editingTask._id)} style={styles.deleteButton}>
                                <Text style={styles.buttonText}>Delete</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            )}

            {/* Profile */}
            {/* <TouchableOpacity onPress={() => router.navigate("./Profile")}>
                <Image source={require("../../assets/images/Profile-black.png")} style={styles.profileIcon} />
            </TouchableOpacity> */}

            {/* Streaks */}
                <View style={styles.streaksView}>
                    <Image source={require("../../assets/images/StreakNote.png")} style={styles.stickyNote} />
                    <Text style={{ fontSize: 18, fontFamily: "PermanentMarker", fontWeight: "bold", color: "rgb(124, 104, 93)", left: 22, top: 16, textAlign: "center" }}>Streak:</Text>
                    <Text style={{ fontSize: 18, fontFamily: "PermanentMarker", fontWeight: "bold", color: "rgb(124, 104, 93)", left: 22, top: 20, textAlign: "center" }}>{streaksLoading ? "..." : streak} {!streaksLoading && (streak === 1 ? " day" : " days")}</Text>
                </View>
            {/* Logout */}
            <TouchableOpacity onPress={handleLogout}>
                <Image source={require("../../assets/images/Logout.png")} style={styles.logoutIcon} />
            </TouchableOpacity>

            {/* Calendar */}
            <TouchableOpacity onPress={() => router.navigate("./Calendar/WeeklyCalendarView")}>
                <Image source={require("../../assets/images/Calender.png")} style={styles.calendarIcon} />
            </TouchableOpacity>

        </ImageBackground>
    );
};

// Define styles
const styles = StyleSheet.create({
    background: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "110%",
        marginTop: "-20%",
    },
    container: {
        marginLeft: "-30%",
        width: "100%",
        height: "100%",
        alignItems: "center",
        padding: 60,
    },
    taskList: {
        width: "82%", 
        maxWidth: 300,
        // uncomment the next line to set a fixed height
        // height: "70%",
        backgroundColor: "#FDEEC0",
        borderColor: "#6a5428",
        borderWidth: 0.5, 
        padding: 10, 
        borderRadius: 8,
        marginTop: 80,
        marginLeft: 20,
        shadowColor: "#000",
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.25,
    },
    header:{
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        width: "30%",
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        textAlign: "left",
        fontFamily: "Jua",
    },
    navButtons:{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginLeft: 45,
    },
    date: {
        fontSize: 14,
        fontWeight: "light",
        color: "rgb(109, 92, 83)",
        textAlign: "left",
        fontFamily: "Quicksand",
    },
    taskSummary: {
        marginTop: 10,
        padding: 5,
        alignItems: "center",
    },
    taskSummaryText: {
        fontSize: 14,
        textAlign: "center",
        fontFamily: "HappyMonkey",
    },
    taskItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 8,
    },
    completedTask: {
        textDecorationLine: "line-through",
        color: "gray",
        fontFamily: "HappyMonkey",
    },
    uncompletedTask: {
        textDecorationLine: "none",
        color: "black",
        fontFamily: "HappyMonkey",
    },
    taskActions: {
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
    },
    taskActionsButtons: {
        marginLeft: 8,
    },
    addButton: {
        marginTop: 20,
        borderRadius: 5,
        padding: 5,
    },
    popup: {
        position: "absolute",
        left: "46.5%",
        top: "65%",
        height: "25%",
        width: "80%",
        transform: [{ translateX: -150 }, { translateY: -150 }],
        backgroundColor: "#FDEEC0",
        borderColor: "rgb(85, 70, 60)",
        borderWidth: 0.5,
        padding: 20,
        borderRadius: 18,
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    input: {
        height: 40,
        width: "100%",
        borderRadius: 10,
        borderColor: "gray",
        borderWidth: 1,
        marginBottom: 10,
        paddingLeft: 10,
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 5,
        marginTop: 20,
    },
    saveButton: {
        marginBottom: 10,
        backgroundColor: "rgb(85, 70, 60)",
        padding: 10,
        borderRadius: 10,
        alignItems: "center",
        width: "30%",
    },
    cancelButton: {
        marginBottom: 10,
        backgroundColor: "rgba(85, 70, 60, 0.7)",
        padding: 10,
        borderRadius: 10,
        alignItems: "center",
        width: "30%",
    },
    deleteButton: {
        marginBottom: 10,
        backgroundColor: "rgba(255, 0, 0, 0.7)",
        padding: 10,
        borderRadius: 10,
        alignItems: "center",
        width: "30%",
    },
    buttonText: {
        color: "#FFF",
    },
    profileIcon: {
        position: "absolute",
        width: 100,
        height: 100,
        top: -670,
        left: 65,
        shadowColor: "#000",
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 2,
    },
    stickyNote: {
        position: "absolute",
        width: "200%",
        height: "200%",
        top: 0,
        left: 0,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.4,
    },
    streaksView: {
        position: "absolute",
        width: 84,
        height: 80,
        top: 630,
        left: 20,
        backgroundImage: "../../assets/images/smallSticky.png",
        // backgroundColor: "#FDEEC0",
        // borderColor: "#6a5428",
        // borderWidth: 0.5,
        padding: 2,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        transform: [{scale: 0.7}],
    },
    calendarIcon: {
        position: "absolute",
        width: 650,
        height: 420,
        top: -310,
        left: -250,
        transform: [{ scale: 0.4 }],
    },
    logoutIcon: {
        position: "absolute",
        width: 250, 
        height: 200, 
        top: -800,
        left: 20, 
        transform: [{ scale: 0.4 }]
    },
});

export default Home;
