import React from 'react';

const ConfirmationDialog = ({ isOpen, onClose, onConfirm, title, message,option1 = "No",option2 = "yes" }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
            <div className="bg-white p-6 rounded-md shadow-md max-w-sm w-full">
                <h2 className="text-lg font-semibold mb-4">{title}</h2>
                <p>{message}</p>
                <div className="flex justify-end mt-4">
                    <button
                        className="mr-2 px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
                        onClick={onClose}
                    >
                        {option1}
                    </button>
                    <button
                        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                        onClick={onConfirm}
                    >
                        {option2}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationDialog;
