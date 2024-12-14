import { LEAVES_API_URL } from '@/static/api';
import axios from 'axios';

/**
 * Fetches leave data from the API endpoint
 * @returns Promise containing the leave data response
 * @throws Error if the API request fails
 */
export const getLeaves = async (username: string, password: string) => {
  try {
    const params = new URLSearchParams({
      sheetName: 'DB',
      username: username,
      password: password,
    });

    const response = await axios({
      method: 'post',
      url: LEAVES_API_URL,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
      },
      data: params,
    });

    const formattedLeaves = response.data.data.map((rawLeave: any, index: number) => ({
      id: index,
      name: rawLeave.name,
      department: rawLeave.department,
      role: rawLeave.role,
      leaveReason: rawLeave['reason for leave'],
      leaveType: rawLeave['leave type'],
      leaveCategory: rawLeave['leave category'],
      startAt: new Date(rawLeave['leave start date']),
      endAt: new Date(rawLeave['leave end date']),
    }));

    return formattedLeaves;
  } catch (error) {
    console.error('Error fetching leaves:', error);
    throw error;
  }
};
