import GenericModal from './GenericModal'

export default function AdditionalInfoModal(props: AdditionalInfoModalProps) {
    const { isOpen, onClose } = props;

    return (
        <GenericModal isOpen={isOpen} onClose={onClose}>
            Hello
        </GenericModal>
    )
}

type AdditionalInfoModalProps = {
    isOpen: boolean;
    onClose: () => void;
}