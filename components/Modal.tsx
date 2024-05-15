type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

export const Modal = ({ isOpen, onClose, children }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 w-full h-full">
      <div className="bg-white p-2 lg:rounded-lg shadow-lg w-full max-w-7xl max-h-full overflow-y-auto m-0 lg:m-8 h-full sm:h-auto">
        <div className="flex justify-end">
          <button className="text-gray-500 hover:text-gray-700" onClick={onClose}>
            X
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};
