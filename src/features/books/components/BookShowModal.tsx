import React from 'react';
import { Modal, Descriptions, Button, Tag, Typography } from 'antd';
import { Link } from 'react-router-dom';
import type { Book } from '../types/book';

interface BookShowModalProps {
  open: boolean;
  book: Book | null;
  loading?: boolean;
  canBorrow: boolean;
  alreadyBorrowed?: boolean;
  onCancel: () => void;
  onBorrow: () => void;
}

export const BookShowModal: React.FC<BookShowModalProps> = ({ open, book, loading, canBorrow, alreadyBorrowed = false, onCancel, onBorrow }) => {
  const remaining = book ? Math.max(0, (book.total_copies ?? 0) - (book.borrowings_count ?? 0)) : 0;
  const color = remaining === 0 ? 'error' : remaining <= 2 ? 'warning' : 'success';
  const text = remaining === 0 ? 'Unavailable' : remaining <= 2 ? 'Low stock' : 'Available';

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      title={book ? book.title : 'Book'}
      footer={[
        <Button key="cancel" onClick={onCancel}>Close</Button>,
        ...(canBorrow ? [
          <Button key="borrow" type="primary" onClick={onBorrow} loading={loading} disabled={remaining <= 0 || alreadyBorrowed}>
            {alreadyBorrowed ? 'Already Borrowed' : 'Borrow'}
          </Button>
        ] : []),
      ]}
    >
      {book && (
        <>
          <Descriptions column={1} bordered size="small">
            <Descriptions.Item label="Title">{book.title}</Descriptions.Item>
            <Descriptions.Item label="Author">{book.author}</Descriptions.Item>
            <Descriptions.Item label="Genre">{book.genre}</Descriptions.Item>
            <Descriptions.Item label="ISBN">{book.isbn}</Descriptions.Item>
            <Descriptions.Item label="Remaining Copies">{remaining}</Descriptions.Item>
            <Descriptions.Item label="Availability"><Tag color={color}>{text}</Tag></Descriptions.Item>
          </Descriptions>
          {!canBorrow && (
            <div style={{ marginTop: 12 }}>
              <Typography.Text type="secondary">
                Sign in to borrow this book. <Link to="/login">Sign in</Link>
              </Typography.Text>
            </div>
          )}
        </>
      )}
    </Modal>
  );
};

export default BookShowModal;
