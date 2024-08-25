import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Địa chỉ API gốc
const API_ROOT = 'http://187.123.45.101:1302';

// Tự động thêm token vào mỗi yêu cầu API
axios.interceptors.request.use(async config => {
  const token = await AsyncStorage.getItem('accessToken');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

// Board API
export const fetchBoardDetailsAPI = async (boardId) => {
  const response = await axios.get(`${API_ROOT}/v1/boards/${boardId}`);
  return response.data;
};

export const createNewBoardAPI = async (boardData) => {
  const response = await axios.post(`${API_ROOT}/v1/boards`, boardData);
  return response.data;
};

export const updateBoardDetailsAPI = async (boardId, updateData) => {
  const response = await axios.put(`${API_ROOT}/v1/boards/${boardId}`, updateData);
  return response.data;
};
export const getBoardDetailsAPI = async (boardId) => {
  const response = await axios.get(`${API_ROOT}/v1/boards/${boardId}`);
  return response.data;
};

export const moveCardToDifferentColumnAPI = async (updateData) => {
  const response = await axios.put(`${API_ROOT}/v1/boards/supports/movingCard`, updateData);
  return response.data;
};

export const deleteBoardAPI = async (boardId) => {
  const response = await axios.post(`${API_ROOT}/v1/boards/delete`, boardId);
  return response.data;
};

// Column API
export const createNewColumnApi = async (newColumnData) => {
  const response = await axios.post(`${API_ROOT}/v1/columns`, newColumnData);
  return response.data;
};

export const updateColumnDetailsAPI = async (columnId, updateData) => {
  const response = await axios.put(`${API_ROOT}/v1/columns/${columnId}`, updateData);
  return response.data;
};

export const deleteColumnDetailsAPI = async (columnId) => {
  const response = await axios.delete(`${API_ROOT}/v1/columns/${columnId}`);
  return response.data;
};

// Card API
export const createNewCardApi = async (newCardData) => {
  const response = await axios.post(`${API_ROOT}/v1/cards`, newCardData);
  return response.data;
};

export const addMemberCardAPI = async (data) => {
  const response = await axios.post(`${API_ROOT}/v1/cards/addMember`, data);
  return response.data;
};

export const removeMemberCardAPI = async (data) => {
  const response = await axios.post(`${API_ROOT}/v1/cards/removeMember`, data);
  return response.data;
};

export const updateCardAPI = async (data) => {
  const response = await axios.post(`${API_ROOT}/v1/cards/update`, data);
  return response.data;
};

export const deleteCardAPI = async (data) => {
  const response = await axios.post(`${API_ROOT}/v1/cards/delete`, data);
  return response.data;
};

export const updateTaskCardAPI = async (data) => {
  const response = await axios.post(`${API_ROOT}/v1/cards/updateTask`, data);
  return response.data;
};

export const addTaskCardAPI = async (data) => {
  const response = await axios.post(`${API_ROOT}/v1/cards/addTask`, data);
  return response.data;
};

export const removeTaskCardAPI = async (data) => {
  const response = await axios.post(`${API_ROOT}/v1/cards/removeTask`, data);
  return response.data;
};

// User API
export const loginApi = async (userData) => {
  const response = await axios.post(`${API_ROOT}/v1/users/login`, userData);
  return response.data;
};

export const registerApi = async (userData) => {
  const response = await axios.post(`${API_ROOT}/v1/users`, userData);
  return response.data;
};

export const getUser = async () => {
  try {
    // Lấy token từ AsyncStorage
    const accessToken = await AsyncStorage.getItem('userToken');
    if (!accessToken) {
      throw new Error('No access token found');
    }
    // Gửi yêu cầu với header Authorization
    const response = await axios.get(`${API_ROOT}/v1/users/getUser`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error in getUser:', error);
    throw error;
  }
};

export const updateUser = async (data) => {
  const response = await axios.post(`${API_ROOT}/v1/users/update`, data);
  return response.data;
};

export const updatePasswordAPI = async (data) => {
  const response = await axios.post(`${API_ROOT}/v1/users/updatePassword`, data);
  return response.data;
};

export const addStarreddAPI = async (data) => {
  const response = await axios.post(`${API_ROOT}/v1/users/addStarred`, data);
  return response.data;
};

export const removeStarreddAPI = async (data) => {
  const response = await axios.post(`${API_ROOT}/v1/users/removeStarred`, data);
  return response.data;
};

// Upload Image API
export const uploadImageAPI = async (formData) => {
  try {
    const response = await axios.post(`${API_ROOT}/v1/image/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    console.log('Upload Response:', response.data); // Xem cấu trúc phản hồi
    return response.data.data.url;
  } catch (error) {
    console.error('Error uploading image:', error.response?.data || error.message);
    throw new Error('Failed to upload image');
  }
};

// Workspace API
export const addMemberAPI = async (data) => {
  const response = await axios.post(`${API_ROOT}/v1/workspace/member/addMember`, data);
  return response.data;
};

export const removeMemberAPI = async (data) => {
  const response = await axios.post(`${API_ROOT}/v1/workspace/member/removeMember`, data);
  return response.data;
};

export const createNewWorkspaceAPI = async (workspaceData) => {
  const response = await axios.post(`${API_ROOT}/v1/workspaces/createWorkspace`, workspaceData);
  return response.data;
};

export const updateWorkspaceAPI = async (newData) => {
  const accessToken = await AsyncStorage.getItem('userToken');
  if (!accessToken) {
    throw new Error('No access token found');
  }

  const response = await axios.post(`${API_ROOT}/v1/workspaces/update`, newData, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return response.data;
};

export const deleteWorkspaceAPI = async (id) => {
  const response = await axios.post(`${API_ROOT}/v1/workspaces/delete`, id);
  return response.data;
};

// Comment API
export const addCommentAPI = async (data) => {
  const response = await axios.post(`${API_ROOT}/v1/comments/postComment`, data);
  return response.data;
};

export const deleteCommentAPI = async (data) => {
  const response = await axios.post(`${API_ROOT}/v1/comments/deleteComment`, data);
  return response.data;
};

export const updateCommentAPI = async (data) => {
  const response = await axios.post(`${API_ROOT}/v1/comments/updateContent`, data);
  return response.data;
};

// Email API
export const sendEmailAPI = async (data) => {
  const response = await axios.post(`${API_ROOT}/v1/email/sendEmail`, data);
  return response.data;
};

// Recover Password API
export const recoverPasswordAPI = async (data) => {
  const response = await axios.post(`${API_ROOT}/v1/users/recoverPassword`, data);
  return response.data;
};

// Workspace Members API
export const getMembersByWorkspaceIdAPI = async (workspaceId) => {
  const response = await axios.get(`${API_ROOT}/v1/workspace/member/getMembersByWorkspaceId/${workspaceId}`);
  return response.data;
};

// Notification API
export const getNotifiAPI = async (data) => {
  const response = await axios.post(`${API_ROOT}/v1/notifications/getNotificationsByReceiver`, data);
  return response.data;
};
