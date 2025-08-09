export interface OverdueBookItem {
  book_id: string | number;
  title: string;
  due_date: string; // ISO
  // Optional borrowing identifier (provided by backend) used for return action
  borrowing_id?: string | number;
}

export interface OverdueMember {
  member: {
    id: string | number;
    name: string;
    email: string;
  };
  overdue: OverdueBookItem[];
}

export interface LibrarianDashboard {
  total_books: number;
  total_borrowed_books: number;
  books_due_today: number;
  overdue_members: OverdueMember[];
}

export interface MemberBorrowing {
  id: string;
  title: string;
  due_date: string; // ISO
  status: 'borrowed' | 'overdue' | 'returned';
}

export interface MemberBorrowRecord {
  id: string | number;
  book: {
    id: string | number;
    title: string;
    author: string;
  };
  borrowed_at: string; // ISO
  due_date: string; // ISO
  returned_at: string | null;
}

// Updated to match /borrowings/current API
export interface ActiveBorrowingItem {
  id: string | number;
  user_name: string;
  book_title: string;
  borrowed_at: string; // ISO
  due_date: string; // ISO
  returned_at: string | null;
}

export interface MemberDashboard {
  my_borrowed_count: number;
  my_overdue_count: number;
  my_due_today_count: number;
  my_borrowings: MemberBorrowing[];
  // New optional shape support
  active?: MemberBorrowRecord[];
  overdue?: MemberBorrowRecord[];
}
