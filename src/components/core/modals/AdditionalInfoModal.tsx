import { Button } from '@/components/ui/button';
import GenericModal from './GenericModal';
import { dateToEpoch, formatEpochToHumanReadable } from '@/utils/date-utils';
import { stringToColour } from '@/utils/miscellaneous-utils';
import { Leave } from '@/constraints/types/core-types';

export default function AdditionalInfoModal(props: AdditionalInfoModalProps) {
  const { leaves, leavesDate, isOpen, onClose } = props;

  if (!leavesDate) return null;

  return (
    <GenericModal className="outline-none bg-white-creamy" isOpen={isOpen} onClose={onClose}>
      <div className="px-10 py-6 max-h-[80vh] overflow-y-auto overflow-x-hidden">
        <div className="py-4">
          <h1 className="flex flex-row flex-wrap items-center gap-x-2 text-2xl font-semibold mb-2">
            Leaves on {formatEpochToHumanReadable(dateToEpoch(leavesDate))}
            <span className="text-sm font-normal text-zinc-500 dark:text-zinc-400">
              ({leaves && leaves.length} members)
            </span>
          </h1>
        </div>
        <div className="flex flex-col gap-4">
          {leaves.length === 0 ? (
            <div>
              <h1 className="text-base font-medium">No leaves found</h1>
            </div>
          ) : (
            leaves.map((leave: Leave) => (
              <div key={leave.id} className="flex flex-col gap-1 shadow-card px-6 py-4 rounded-md">
                <div className="flex flex-row items-center gap-x-4">
                  <h1 className="text-base font-medium">{leave.name}</h1>
                  <div className="flex flex-row items-center gap-x-2 text-sm font-normal">
                    ({formatEpochToHumanReadable(dateToEpoch(leave.startAt))} -{' '}
                    {formatEpochToHumanReadable(dateToEpoch(leave.endAt))})
                  </div>
                  <div
                    className="text-xs text-white rounded-md px-2 py-0.5"
                    style={{ backgroundColor: stringToColour(leave.department) }}
                  >
                    {leave.department}
                  </div>
                </div>
                <div className="text-sm font-normal">{leave.role}</div>
                <div className="text-sm font-normal whitespace-nowrap">Leave Type: {leave.leaveType}</div>
                <div className="text-sm font-normal whitespace-nowrap">Leave Category: {leave.leaveCategory}</div>
                <div className="text-sm">{leave.leaveReason}</div>
              </div>
            ))
          )}
        </div>
        <div className="flex justify-end mt-4">
          <Button onClick={onClose}>Close</Button>
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
