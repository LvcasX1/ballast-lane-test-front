import React from 'react';
import { Modal } from 'antd';

interface BookDeleteConfirmModalProps {
  open: boolean;
  loading?: boolean;
  title?: string;
  onCancel: () => void;
  onOk: () => void;
}

export const BookDeleteConfirmModal: React.FC<BookDeleteConfirmModalProps> = ({ open, loading, title, onCancel, onOk }) => {
  return (
    <Modal
      open={open}
      onCancel={onCancel}
      title="Delete Book"
      okText="Delete"
      okButtonProps={{ danger: true }}
      confirmLoading={loading}
      onOk={onOk}
    >
      Are you sure you want to delete “{title}”? 
    </Modal>
  );
};

export default BookDeleteConfirmModal;
