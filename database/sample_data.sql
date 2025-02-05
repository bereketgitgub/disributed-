-- Insert sample categories
INSERT INTO categories (name, description) VALUES
('Fiction', 'Fictional literature and novels'),
('Non-Fiction', 'Educational and factual books'),
('Science Fiction', 'Science fiction and fantasy'),
('Technology', 'Computer science and technology books'),
('History', 'Historical books and biographies'),
('Children', 'Books for young readers'),
('Reference', 'Reference materials and textbooks');

-- Insert sample books
INSERT INTO books (isbn, title, author, publisher, publication_year, description, available_copies, total_copies, category_id) VALUES
('9780743273565', 'The Great Gatsby', 'F. Scott Fitzgerald', 'Scribner', 1925, 'A story of decadence and excess.', 3, 3, 1),
('9780451524935', '1984', 'George Orwell', 'Signet Classic', 1949, 'A dystopian social science fiction novel.', 2, 2, 3),
('9780446310789', 'To Kill a Mockingbird', 'Harper Lee', 'Grand Central', 1960, 'A story of racial injustice.', 2, 2, 1),
('9780307474278', 'The Da Vinci Code', 'Dan Brown', 'Anchor', 2003, 'A mysterious detective fiction.', 1, 1, 1),
('9780132350884', 'Clean Code', 'Robert C. Martin', 'Prentice Hall', 2008, 'A handbook of agile software craftsmanship.', 2, 2, 4);

-- Insert sample users
INSERT INTO users (username, email, password_hash, role_id) VALUES
('librarian1', 'librarian1@library.local', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 2),
('john.doe', 'john.doe@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 3),
('jane.smith', 'jane.smith@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 3);

-- Insert sample members
INSERT INTO members (user_id, first_name, last_name, email, phone) VALUES
(2, 'John', 'Doe', 'john.doe@example.com', '123-456-7890'),
(3, 'Jane', 'Smith', 'jane.smith@example.com', '123-456-7891');

-- Insert sample book reviews
INSERT INTO book_reviews (book_id, user_id, rating, review_text) VALUES
(1, 2, 5, 'A masterpiece of American literature.'),
(1, 3, 4, 'Beautifully written, captures the essence of the era.'),
(2, 2, 5, 'A prophetic and powerful novel.');