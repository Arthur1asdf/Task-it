import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Button, Modal, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import { Checkbox } from 'react-native-paper';
import { format, parseISO } from 'date-fns';
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

const WeeklyCalendarView: React.FC<WeeklyCalendarViewProps> = ({ navigation }) => {
  const [groupedTasks, setGroupedTasks] = useState<GroupedTasks>({});
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

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
        const dateStr = formatDateOnly(day);
        const todayStr = formatDateOnly(new Date());
        const dayTasks = groupedTasks[dateStr] || [];
        const isToday = dateStr === todayStr;
        const isSelected = formatDateOnly(selectedDate) === dateStr;

        return (
          <View
            key={index}
            style={{
              marginBottom: 20,
              backgroundColor: isSelected ? '#E0F7FA' : 'transparent',
              padding: 10,
              borderRadius: 8,
            }}
          >
            <TouchableOpacity onPress={() => router.navigate(`./DailyCalendarView?date=${dateStr}`)}>
              <Text
                style={{
                  fontWeight: isToday ? 'bold' : 'normal',
                  fontSize: 16,
                  marginBottom: 6,
                  color: isToday ? '#007AFF' : '#000',
                }}
              >
                {day.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
              </Text>
            </TouchableOpacity>

            <ScrollView style={{ maxHeight: 150 }}>
              {dayTasks.length > 0 ? dayTasks.map(task => (
                <View key={task._id} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                  <Checkbox
                    status={task.isCompleted ? 'checked' : 'unchecked'}
                    onPress={() => handleToggleComplete(task._id, task.isCompleted)}
                  />
                  <Text style={task.isCompleted ? styles.uncompletedTask : styles.completedTask}>{task.name}</Text>
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

const styles = StyleSheet.create({
    uncompletedTask: {
        textDecorationLine: 'line-through',
        color: '#888',
    },
    completedTask: {
        textDecorationLine: 'none',
        color: '#000',
    },
});

export default WeeklyCalendarView;
