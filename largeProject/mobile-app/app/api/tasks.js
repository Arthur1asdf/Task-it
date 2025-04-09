import axios from 'axios';
import { API_BASE_URL } from '../../config';
//import AsyncStorage from '@react-native-async-storage/async-storage';  // Import AsyncStorage

const API_URL = `${API_BASE_URL}/taskRoute`;

const TaskAPI = {
  // Fetch tasks for the week based on a reference date
  getWeekTasks: async (userId, taskDate) => {
    try {
      const response = await axios.get(`${API_URL}/get-week-tasks`, { params: { userId, date: taskDate } });
      return response.data.tasks || [];
    } catch (error) {
      console.error('Error fetching tasks:', error.response?.data || error);
      throw new Error('Failed to fetch tasks');
    }
  },
  
  // Add a new task
  addTask: async (userId, title, days) => {
    try {
      // Ensure days is an array and properly formatted
      if (!Array.isArray(days) || !days.every(d => /^\d{4}-\d{2}-\d{2}$/.test(d))) {
        throw new Error("Invalid date format. Expected YYYY-MM-DD.");
      }

      const taskData = {
        userId,
        taskName: title,
        taskDates: days, 
      };

      console.log("Sending task to API:", taskData);

      const response = await axios.post(`${API_URL}/add-task`, taskData);
      console.log("Task added:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error adding task:", error.response?.data || error);
      throw new Error("Failed to add task");
    }
  },

  // Fetch tasks by userId and taskDate
  getTasks: async (userId, taskDate) => {
    try {
      const response = await axios.get(`${API_URL}/get-tasks`, { params: { userId, taskDate } });
      return response.data.tasks || [];
    } catch (error) {
      console.error('Error fetching tasks:', error.response?.data || error);
      throw new Error('Failed to fetch tasks');
    }
  },
  
  // Edit an existing task
  editTask: async (userId, taskId, taskName) => {
    try {
      const response = await axios.put(`${API_URL}/edit-task`, { userId, taskId, taskName });
      return response.data;
    } catch (error) {
      console.error('Error editing task:', error);
      throw new Error('Failed to edit task');
    }
  },

  // Mark a task as completed
  completeTask: async (userId, taskId, isCompleted) => {
    try {
      const response = await axios.put(`${API_URL}/complete-task`, { userId, taskId, isCompleted });
      return response.data;
    } catch (error) {
      console.error('Error completing task:', error);
      throw new Error('Failed to complete task');
    }
  },

  // Delete a task
  deleteTask: async (userId, taskId) => {
    try {
      const response = await axios.delete(`${API_URL}/delete-task`, { data: { userId, taskId } });
      return response.data;
    } catch (error) {
      console.error('Error deleting task:', error);
      throw new Error('Failed to delete task');
    }
  },

  // Get streak data for a user
  getStreaks: async (userId) => {
    try {
      const response = await axios.get(`${API_URL}/streaks`, { params: { userId } });
      
      console.log("Streaks fetched successfully!", response.data.streak, response.data.lastActivity);
      
      // if (response.data.lastActivity) {
      //   await AsyncStorage.setItem("lastActivity", response.data.lastActivity);
      // }

      return response.data.streak;
    } catch (error) {
      console.error('Error fetching streaks:', error);
      throw new Error('Failed to fetch streaks');
    }
  },

  // Search for tasks based on a query
  searchTasks: async (query, userId) => {
    try {
      const response = await axios.get(`${API_URL}/search-tasks`, { params: { query, userId } });
      return response.data;
    } catch (error) {
      console.error('Error searching tasks:', error);
      throw new Error('Failed to search tasks');
    }
  }
};

export default TaskAPI;
