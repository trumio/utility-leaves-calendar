import { LEAVES_API_URL } from '@/static/api';
import axios from 'axios';
import { Leave, PublicHoliday } from '@/constraints/types/core-types';
import { DateTime } from 'luxon';
import { generateAdaptiveCard } from '@/utils/core-utils';
import { parseHolidays, parseLeaves } from '@/utils/parsing-utils';

type LeaveFormData = {
  name: string;
  email: string;
  department: string;
  customDepartment?: string;
  role: string;
  leaveStartDate: Date;
  leaveEndDate: Date;
  reasonForLeave: string;
  leaveType: string;
  leaveCategory: string;
  customCategory?: string;
};

/**
 * Fetches leave data from the API endpoint
 * @returns Promise containing the leave data response
 * @throws Error if the API request fails
 */
export const getLeaves = async (username: string, password: string): Promise<Leave[]> => {
  try {
    const data = new URLSearchParams({
      sheetName: 'DB',
      requestType: 'GET',
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
      data,
    });

    if (!response?.data?.success) throw new Error(response?.data?.error);

    const formattedLeaves = parseLeaves(response.data.data);

    return formattedLeaves;
  } catch (error) {
    console.error('Error fetching leaves:', error);
    throw error;
  }
};

/**
 * Fetches public holidays data from the API endpoint
 * @returns Promise containing the holidays data response
 * @throws Error if the API request fails
 */
export const getHolidays = async (username: string, password: string): Promise<PublicHoliday[]> => {
  try {
    const data = new URLSearchParams({
      sheetName: 'Holidays',
      requestType: 'GET',
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
      data,
    });

    const holidays = parseHolidays(response.data.data);

    return holidays;
  } catch (error) {
    console.error('Error fetching holidays:', error);
    throw error;
  }
};

/**
 * Applies for leave by submitting form data to the API endpoint
 * @returns Promise containing the API response
 * @throws Error if the API request fails
 */
export const applyLeave = async (username: string, password: string, formData: LeaveFormData) => {
  try {
    const submissionTime = DateTime.now().toFormat('yyyy-MM-dd HH:mm:ss');

    const data = new URLSearchParams({
      sheetName: 'DB',
      requestType: 'POST',
      username: username,
      password: password,
      formData: JSON.stringify({
        'submission time': submissionTime,
        email: formData.email,
        name: formData.name,
        'leave start date': DateTime.fromJSDate(formData.leaveStartDate).toFormat('yyyy-MM-dd'),
        'leave end date': DateTime.fromJSDate(formData.leaveEndDate).toFormat('yyyy-MM-dd'),
        department: formData.department === 'Other' ? formData.customDepartment : formData.department,
        role: formData.role,
        'reason for leave': formData.reasonForLeave,
        'leave type': formData.leaveType,
        'leave category': formData.leaveCategory === 'Other' ? formData.customCategory : formData.leaveCategory,
      }),
      adaptiveCard: JSON.stringify(generateAdaptiveCard(formData)),
    });

    const response = await axios({
      method: 'post',
      url: LEAVES_API_URL,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
      },
      data,
    });

    return response.data;
  } catch (error) {
    console.error('Error applying leave:', error);
    throw error;
  }
};
