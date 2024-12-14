import { cn } from '@/lib/utils';
import { X } from 'react-feather';
import { Dialog, DialogContent, DialogTitle } from '../../ui/dialog';

export default function GenericModal(props: GenericModalProps) {
  const { children, onClose, isOpen = false, className } = props;

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} modal onOpenChange={(newState: boolean) => !newState && onClose()}>
      <DialogContent hideClose className={cn('p-0 m-0 border-0 max-w-2xl', className)}>
        {/* Required for screen readers */}
        <DialogTitle hidden>Modal Title</DialogTitle>
        <div className={cn('bg-white rounded-lg relative')}>
          <div
            className="absolute -top-2 -right-2 bg-white rounded-md p-2 shadow-table cursor-pointer z-10 hover:bg-grey-50 transition-colors duration-200"
            onClick={onClose}
          >
            <X size={16} />
          </div>
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
}

type GenericModalProps = {
  children: React.ReactNode;
  className?: string;
  onClose: () => void;
  isOpen?: boolean;
};
