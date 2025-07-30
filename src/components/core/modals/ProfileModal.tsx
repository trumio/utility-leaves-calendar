import * as yup from 'yup';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { DateTime } from 'luxon';
import { CalendarIcon, UserCircle, Mail, Building2, UserRound, CalendarDays, FileText, Clock, Tag } from 'lucide-react';
import GenericModal from './GenericModal';
import { applyLeave } from '@/services/leaves-service';
import { showToast } from '@/utils/core-utils';
import { ToastType } from '@/constraints/enums/core-enums';
import { useCoreStore } from '@/stores/core-store';

enum Department {
  Engineering = 'Engineering',
  Marketing = 'Marketing',
  Design = 'Design',
  QA = 'QA',
  Operations = 'Operations',
  Product = 'Product',
  Project = 'Project',
  Other = 'Other',
}

enum LeaveType {
  FullDay = 'Full Day',
  HalfDayMorning = 'Half Day - Morning',
  HalfDayAfternoon = 'Half Day - Afternoon',
  MultipleDays = 'Multiple Days',
}

enum LeaveCategory {
  PersonalLeave = 'Personal Leave',
  SickLeave = 'Sick Leave',
  MaternityLeave = 'Maternity Leave',
  PaternityLeave = 'Paternity Leave',
  BereavementLeave = 'Bereavement Leave',
  FestivalDay = 'Festival Day',
  ExamAssessment = 'Exam/Assessment Leave',
}

const departments = Object.values(Department);
const leaveTypes = [LeaveType.FullDay, LeaveType.HalfDayMorning, LeaveType.HalfDayAfternoon];
const leaveCategories = Object.values(LeaveCategory);

const formSchema = yup.object({
  name: yup.string().required('Name is required'),
  email: yup
    .string()
    .email('Invalid email')
    .required('Email is required')
    .matches(/@trumio\.ai$/, 'Only @trumio.ai email addresses are allowed'),
  department: yup.string().required('Department is required'),
  customDepartment: yup.string().when('department', {
    is: Department.Other,
    then: (schema) => schema.required('Custom department is required'),
    otherwise: (schema) => schema.notRequired(),
  }),
  role: yup.string().required('Role is required'),
  leaveStartDate: yup.date().required('Leave start date is required'),
  leaveEndDate: yup
    .date()
    .required('Leave end date is required')
    .min(yup.ref('leaveStartDate'), 'End date must be after start date'),
  reasonForLeave: yup.string().required('Reason for leave is required'),
  leaveType: yup.string().when(['leaveStartDate', 'leaveEndDate'], {
    is: (startDate: Date, endDate: Date) =>
      startDate && endDate && DateTime.fromJSDate(startDate).hasSame(DateTime.fromJSDate(endDate), 'day'),
    then: (schema) => schema.required('Leave type is required'),
    otherwise: (schema) => schema.notRequired(),
  }),
  leaveCategory: yup.string().required('Leave category is required'),
  // customCategory: yup.string().when('leaveCategory', {
  //   is: LeaveCategory.Other,
  //   then: (schema) => schema.required('Custom category is required'),
  //   otherwise: (schema) => schema.notRequired(),
  // }),
});

type FormData = yup.InferType<typeof formSchema>;

export default function ProfileModal(props: ProfileModalProps) {
  const { isOpen, onClose, onLogout } = props;
  const [showCustomDepartment, setShowCustomDepartment] = useState(false);
  // const [showCustomCategory, setShowCustomCategory] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { populateLeaves } = useCoreStore();

  // Load initial values from localStorage
  const savedProfile = localStorage.getItem('userProfile');
  const initialValues = savedProfile
    ? JSON.parse(savedProfile)
    : {
        name: '',
        email: '',
        department: '',
        customDepartment: '',
        role: '',
        leaveStartDate: undefined,
        leaveEndDate: undefined,
        reasonForLeave: '',
        leaveType: '',
        leaveCategory: '',
        customCategory: '',
      };

  const form = useForm<FormData>({
    resolver: yupResolver(formSchema),
    defaultValues: initialValues,
    mode: 'onChange',
  });

  const { isValid } = form.formState;

  useEffect(() => {
    const subscription = form.watch((data) => {
      // Only save personal information
      const personalInfo = {
        name: data.name,
        email: data.email,
        department: data.department,
        customDepartment: data.customDepartment,
        role: data.role,
      };
      localStorage.setItem('userProfile', JSON.stringify(personalInfo));
    });
    return () => subscription.unsubscribe();
  }, [form.watch]);

  useEffect(() => {
    if (isOpen) {
      const profileData = localStorage.getItem('userProfile');
      if (profileData) {
        const parsedData = JSON.parse(profileData);
        form.reset({
          ...form.getValues(), // Keep existing form values
          ...parsedData, // Override with stored personal info
        });
        setShowCustomDepartment(parsedData.department === Department.Other);
      }
    }
  }, [isOpen]);

  useEffect(() => {
    const startDate = form.getValues('leaveStartDate');
    const endDate = form.getValues('leaveEndDate');

    if (startDate && endDate) {
      const start = DateTime.fromJSDate(startDate);
      const end = DateTime.fromJSDate(endDate);

      if (!start.hasSame(end, 'day')) {
        form.setValue('leaveType', LeaveType.MultipleDays);
      } else if (form.getValues('leaveType') === LeaveType.MultipleDays) {
        // Reset leave type when dates become same day
        form.setValue('leaveType', '');
      }
    } else {
      form.setValue('leaveType', '');
    }
  }, [form.watch('leaveStartDate'), form.watch('leaveEndDate')]);

  async function onSubmit(data: FormData) {
    const username = localStorage.getItem('username');
    const password = localStorage.getItem('password');

    if (!username || !password) {
      throw new Error('No username or password found');
    }

    try {
      setIsSubmitting(true);

      await applyLeave(username, password, {
        name: data.name,
        email: data.email,
        department: data.department,
        customDepartment: data.customDepartment,
        role: data.role,
        leaveStartDate: data.leaveStartDate,
        leaveEndDate: data.leaveEndDate,
        reasonForLeave: data.reasonForLeave,
        leaveType: data.leaveType || '',
        leaveCategory: data.leaveCategory,
        // customCategory: data.customCategory,
      });

      populateLeaves(username, password, true);

      showToast(ToastType.Success, 'Leave application submitted successfully');

      resetForm();
      onClose();
    } catch (error) {
      showToast(ToastType.Error, 'Error submitting leave');
    } finally {
      setIsSubmitting(false);
    }
  }

  function resetForm() {
    const profileData = localStorage.getItem('userProfile');
    if (profileData) {
      const parsedData = JSON.parse(profileData);
      form.reset({
        ...form.getValues(), // Keep existing form values
        ...parsedData, // Restore personal info
        leaveStartDate: undefined,
        leaveEndDate: undefined,
        reasonForLeave: '',
        leaveType: '',
        leaveCategory: '',
        customCategory: '',
      });
    } else {
      form.reset();
    }
    // setShowCustomCategory(false);
  }

  const startDate = form.getValues('leaveStartDate');
  const endDate = form.getValues('leaveEndDate');
  const isSameDay = startDate && endDate && DateTime.fromJSDate(startDate).hasSame(DateTime.fromJSDate(endDate), 'day');

  return (
    <GenericModal
      className="w-full max-w-[90vw] sm:max-w-[500px] outline-none bg-white dark:bg-zinc-900"
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="p-4 sm:p-6 overflow-y-auto overflow-x-hidden max-h-[90vh]">
        <div className="mb-8 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Profile Settings</h1>
          <p className="mt-2 text-sm text-muted-foreground">Update your profile information for leave applications</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-6 bg-muted/50 p-4 rounded-lg">
              <h2 className="font-semibold text-foreground">Personal Information</h2>

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <UserCircle className="w-4 h-4" />
                      Full Name
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your @trumio.ai email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Building2 className="w-4 h-4" />
                      Department
                    </FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        setShowCustomDepartment(value === Department.Other);
                      }}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {departments.map((dept) => (
                          <SelectItem key={dept} value={dept}>
                            {dept}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {showCustomDepartment && (
                <FormField
                  control={form.control}
                  name="customDepartment"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Enter custom department" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <UserRound className="w-4 h-4" />
                      Role
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your role" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-6 bg-muted/50 p-4 rounded-lg">
              <h2 className="font-semibold text-foreground">Leave Details</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="leaveStartDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="flex items-center gap-2">
                        <CalendarDays className="w-4 h-4" />
                        Start Date
                      </FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                'w-full pl-3 text-left font-normal',
                                !field.value && 'text-muted-foreground',
                              )}
                            >
                              {field.value ? (
                                DateTime.fromJSDate(field.value).toFormat('DDD')
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            // disabled={(date) => {
                            //   const today = new Date();
                            //   today.setHours(0, 0, 0, 0);
                            //   date.setHours(0, 0, 0, 0);
                            //   return date < today;
                            // }}
                            initialFocus
                            className="rounded-md border"
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="leaveEndDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="flex items-center gap-2">
                        <CalendarDays className="w-4 h-4" />
                        End Date
                      </FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                'w-full pl-3 text-left font-normal',
                                !field.value && 'text-muted-foreground',
                              )}
                            >
                              {field.value ? (
                                DateTime.fromJSDate(field.value).toFormat('DDD')
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => {
                              const startDate = form.getValues('leaveStartDate');
                              const today = new Date();
                              today.setHours(0, 0, 0, 0);
                              date.setHours(0, 0, 0, 0);
                              return startDate && date < startDate;
                            }}
                            initialFocus
                            className="rounded-md border"
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="reasonForLeave"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Reason for Leave
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Enter reason for leave" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="leaveType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Leave Type
                      </FormLabel>
                      {!startDate || !endDate ? (
                        <FormControl>
                          <Input value="Select dates first" disabled className="text-muted-foreground" />
                        </FormControl>
                      ) : isSameDay ? (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select leave type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {leaveTypes.map((type) => (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <FormControl>
                          <Input value={LeaveType.MultipleDays} disabled />
                        </FormControl>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="leaveCategory"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Tag className="w-4 h-4" />
                        Category
                      </FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          // setShowCustomCategory(value === LeaveCategory.Other);
                        }}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {leaveCategories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/*showCustomCategory && (
                <FormField
                  control={form.control}
                  name="customCategory"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Enter custom category" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )*/}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button type="button" variant="destructive" onClick={onLogout} className="flex-1">
                Logout
              </Button>
              <Button type="button" variant="outline" onClick={resetForm} className="flex-1">
                Reset Form
              </Button>
              <Button type="submit" className="flex-1" disabled={!isValid || isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Apply Leaves'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </GenericModal>
  );
}

type ProfileModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
};
