import React from "react";
import CustomButton from "./CustomButton";

const ConfirmDialog = ({
  show,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
}) => {
  if (!show) return null;

  return (
    <div className='fixed z-50 inset-0 overflow-y-auto'>
      <div className='flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0'>
        <div className='fixed inset-0 transition-opacity'>
          <div className='absolute inset-0 bg-[#000] opacity-70'></div>
        </div>
        <span className='hidden sm:inline-block sm:align-middle sm:h-screen'></span>
        &#8203;
        <div
          className='inline-block align-bottom bg-primary rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full p-6'
          role='dialog'
          aria-modal='true'
          aria-labelledby='confirm-dialog-headline'
        >
          <p
            id='confirm-dialog-headline'
            className='text-xl font-medium text-ascent-1 text-left'
          >
            {title}
          </p>
          <p className='mt-2 text-base text-ascent-2 text-left'>{message}</p>

          <div className='mt-6 flex justify-end gap-3'>
            <CustomButton
              type='button'
              onClick={onCancel}
              title={cancelLabel}
              containerStyles='border border-[#666] text-ascent-1 px-4 py-2 rounded-full text-sm'
            />
            <CustomButton
              type='button'
              onClick={onConfirm}
              title={confirmLabel}
              containerStyles='bg-[#f64949fe] text-white px-4 py-2 rounded-full text-sm font-semibold'
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
