import { ToastType } from '@/constraints/enums/core-enums';
import { toast, ToastPosition } from 'react-hot-toast';
import { dateToEpoch, formatEpochToHumanReadable } from '@/utils/date-utils';
import { PublicHoliday } from '@/constraints/types/core-types';

export const isHoliday = (date: Date, holidays: PublicHoliday[]): string | undefined => {
  const holiday = holidays.find((holiday) => {
    const holidayStart = new Date(holiday.startDate);
    const holidayEnd = new Date(holiday.endDate);
    return date >= holidayStart && date <= holidayEnd;
  });
  return holiday?.name;
};

export const showToast = (type: ToastType, message: string) => {
  const options = {
    duration: 3000,
    position: 'top-center' as ToastPosition,
  };

  switch (type) {
    case ToastType.Success:
      toast.success(message, options);
      break;
    case ToastType.Error:
      toast.error(message, options);
      break;
  }
};

export const generateAdaptiveCard = (formData: any) => {
  const startDate = formatEpochToHumanReadable(dateToEpoch(formData.leaveStartDate), true);
  const endDate = formatEpochToHumanReadable(dateToEpoch(formData.leaveEndDate), true);

  return {
    $schema: 'http://adaptivecards.io/schemas/adaptive-card.json',
    type: 'AdaptiveCard',
    version: '1.4',
    body: [
      {
        type: 'TextBlock',
        text: `${formData.name} | ${startDate}${endDate !== startDate ? ` - ${endDate}` : ''} | ${formData.leaveType}`,
        weight: 'bolder',
        size: 'large',
        spacing: 'medium',
      },
      {
        type: 'Container',
        items: [
          {
            type: 'TextBlock',
            text: formData.name,
            weight: 'bolder',
            size: 'medium',
          },
          {
            type: 'FactSet',
            facts: [
              {
                title: 'Department:',
                value: formData.department === 'Other' ? formData.customDepartment : formData.department,
              },
              {
                title: 'Role:',
                value: formData.role,
              },
              {
                title: 'Duration:',
                value:
                  formData.leaveStartDate.getTime() === formData.leaveEndDate.getTime()
                    ? startDate
                    : `${startDate} - ${endDate}`,
              },
              {
                title: 'Type:',
                value: formData.leaveType,
              },
              {
                title: 'Category:',
                value: formData.leaveCategory === 'Other' ? formData.customCategory : formData.leaveCategory,
              },
            ],
          },
          {
            type: 'TextBlock',
            text: 'Reason:',
            weight: 'bolder',
            spacing: 'medium',
          },
          {
            type: 'TextBlock',
            text: formData.reasonForLeave,
            wrap: true,
          },
        ],
        spacing: 'medium',
        style: 'emphasis',
        bleed: false,
      },
    ],
    actions: [],
  };
};
