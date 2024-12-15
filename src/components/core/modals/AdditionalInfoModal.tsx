import { Button } from '@/components/ui/button';
import GenericModal from './GenericModal';
import { dateToEpoch, formatEpochToHumanReadable } from '@/utils/date-utils';
import { stringToColour } from '@/utils/miscellaneous-utils';
import { Leave } from '@/constraints/types/core-types';

export default function AdditionalInfoModal(props: AdditionalInfoModalProps) {
  const { leaves, leavesDate, isOpen, onClose } = props;

  if (!leavesDate) return null;

  return (
    <GenericModal
      className="w-full max-w-[90vw] sm:max-w-[600px] outline-none bg-white dark:bg-zinc-900"
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="p-4 sm:p-6 max-h-[80vh] overflow-y-auto overflow-x-hidden">
        <div className="mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
            <h1 className="text-xl sm:text-2xl font-semibold">
              Leaves on {formatEpochToHumanReadable(dateToEpoch(leavesDate))}
            </h1>
            {new Date().getDate() === leavesDate.getDate() &&
              new Date().getMonth() === leavesDate.getMonth() &&
              new Date().getFullYear() === leavesDate.getFullYear() && (
                <span className="text-xs font-medium text-white bg-blue-500 px-2.5 py-1 rounded-full w-fit">Today</span>
              )}
          </div>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            {leaves.length} {leaves.length === 1 ? 'member' : 'members'} on leave
          </p>
        </div>

        <div className="space-y-3 sm:space-y-4">
          {leaves.length === 0 ? (
            <div className="text-center py-6 sm:py-8 text-zinc-500 dark:text-zinc-400">
              <p className="text-base">No leaves scheduled for this date</p>
            </div>
          ) : (
            leaves.map((leave: Leave) => (
              <div
                key={leave.id}
                className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-3 sm:p-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0 mb-3">
                  <h2 className="text-base sm:text-lg font-medium">{leave.name}</h2>
                  <div
                    className="text-xs font-medium text-white px-3 py-1 rounded-full w-fit"
                    style={{ backgroundColor: stringToColour(leave.department) }}
                  >
                    {leave.department}
                  </div>
                </div>

                <div className="space-y-2 text-sm text-zinc-600 dark:text-zinc-300">
                  <p className="font-medium text-zinc-900 dark:text-zinc-100">{leave.role}</p>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                    <span className="text-zinc-500">Duration:</span>
                    <span className="break-all sm:break-normal">
                      {leave.startAt.getTime() === leave.endAt.getTime()
                        ? formatEpochToHumanReadable(dateToEpoch(leave.startAt))
                        : `${formatEpochToHumanReadable(dateToEpoch(leave.startAt))} - ${formatEpochToHumanReadable(dateToEpoch(leave.endAt))}`}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <span className="text-zinc-500">Type:</span> {leave.leaveType}
                    </div>
                    <div>
                      <span className="text-zinc-500">Category:</span> {leave.leaveCategory}
                    </div>
                  </div>

                  {leave.leaveReason && (
                    <div className="pt-2 border-t border-zinc-100 dark:border-zinc-700">
                      <p className="text-zinc-500 mb-1">Reason:</p>
                      <p className="break-words">{leave.leaveReason}</p>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="flex justify-end mt-4 sm:mt-6">
          <Button onClick={onClose} className="w-full sm:w-auto px-6">
            Close
          </Button>
        </div>
      </div>
    </GenericModal>
  );
}

type AdditionalInfoModalProps = {
  leaves: Leave[];
  leavesDate: Date | null;
  isOpen: boolean;
  onClose: () => void;
};
