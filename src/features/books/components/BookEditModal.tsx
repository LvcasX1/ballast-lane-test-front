import React, { useEffect } from 'react';
import { Modal, Form, Input, InputNumber } from 'antd';
import type { Book } from '../types/book';
import { isValidIsbn } from '../../../utils/isbn';

interface BookEditModalProps {
  open: boolean;
  loading?: boolean;
  book: Book | null;
  state: Omit<Book, 'id'>;
  onChange: (patch: Partial<Omit<Book, 'id'>>) => void;
  onCancel: () => void;
  onOk: () => void;
}

export const BookEditModal: React.FC<BookEditModalProps> = ({ open, loading, book, state, onChange, onCancel, onOk }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (open && book) {
      const payload = {
        title: book.title,
        author: book.author,
        genre: book.genre,
        isbn: book.isbn,
        total_copies: book.total_copies,
        borrowings_count: book.borrowings_count ?? 0,
      };
      form.setFieldsValue(payload);
      onChange(payload);
    } else if (!open) {
      form.resetFields();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, book]);

  const handleOk = async () => {
    try {
      await form.validateFields();
      onOk();
    } catch {
      // validation failed
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      title="Edit Book"
      okText="Save"
      onOk={handleOk}
      confirmLoading={loading}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={state}
        onValuesChange={(_, allValues) => onChange(allValues)}
      >
        <Form.Item label="Title" name="title" rules={[{ required: true, message: 'Title is required' }, { min: 2, message: 'Title is too short' }]} getValueFromEvent={(e) => e.target.value.trimStart()}>
          <Input placeholder="Title" maxLength={120} />
        </Form.Item>
        <Form.Item label="Author" name="author" rules={[{ required: true, message: 'Author is required' }, { min: 2, message: 'Author is too short' }]} getValueFromEvent={(e) => e.target.value.trimStart()}>
          <Input placeholder="Author" maxLength={80} />
        </Form.Item>
        <Form.Item label="Genre" name="genre" rules={[{ required: true, message: 'Genre is required' }]} getValueFromEvent={(e) => e.target.value.trimStart()}>
          <Input placeholder="Genre" maxLength={40} />
        </Form.Item>
        <Form.Item
          label="ISBN"
          name="isbn"
          rules={[
            { required: true, message: 'ISBN is required' },
            {
              validator: async (_, value) => {
                if (!value) return Promise.reject(new Error('ISBN is required'));
                if (!isValidIsbn(value)) return Promise.reject(new Error('Enter a valid ISBN-10 or ISBN-13'));
                return Promise.resolve();
              },
            },
          ]}
          getValueFromEvent={(e) => e.target.value.replace(/[-\s]/g, '').toUpperCase()}
        >
          <Input placeholder="ISBN (digits only or X for ISBN-10)" maxLength={13} />
        </Form.Item>
        <Form.Item
          label="Total Copies"
          name="total_copies"
          rules={[{ required: true, type: 'number', min: 0, message: 'Total copies must be 0 or greater' }]}
        >
          <InputNumber placeholder="Total Copies" min={0} step={1} precision={0} style={{ width: '100%' }} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default BookEditModal;
