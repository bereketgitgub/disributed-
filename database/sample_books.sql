-- First clear existing data
DELETE FROM books;
DELETE FROM categories;

-- Add categories
INSERT INTO categories (name, description) VALUES
('Programming', 'Computer programming and software development'),
('Literature', 'Classic and contemporary literature'),
('Science', 'Scientific books and research'),
('Business', 'Business and management books'),
('Philosophy', 'Philosophy and critical thinking');

-- Add Programming Books
INSERT INTO books (isbn, title, author, publisher, publication_year, description, available_copies, total_copies, category_id, status) 
SELECT '9780132350884', 'Clean Code', 'Robert C. Martin', 'Prentice Hall', 2008, 'A handbook of agile software craftsmanship', 3, 3, category_id, 'AVAILABLE'
FROM categories WHERE name = 'Programming';

INSERT INTO books (isbn, title, author, publisher, publication_year, description, available_copies, total_copies, category_id, status)
SELECT '9780201633610', 'Design Patterns', 'Erich Gamma et al.', 'Addison-Wesley', 1994, 'Elements of Reusable Object-Oriented Software', 2, 2, category_id, 'AVAILABLE'
FROM categories WHERE name = 'Programming';

INSERT INTO books (isbn, title, author, publisher, publication_year, description, available_copies, total_copies, category_id, status)
SELECT '9780262033848', 'Introduction to Algorithms', 'Thomas H. Cormen', 'MIT Press', 2009, 'A comprehensive guide to algorithms', 2, 2, category_id, 'AVAILABLE'
FROM categories WHERE name = 'Programming';

-- Add Literature Books
INSERT INTO books (isbn, title, author, publisher, publication_year, description, available_copies, total_copies, category_id, status)
SELECT '9780743273565', 'The Great Gatsby', 'F. Scott Fitzgerald', 'Scribner', 1925, 'A story of decadence and excess', 4, 4, category_id, 'AVAILABLE'
FROM categories WHERE name = 'Literature';

INSERT INTO books (isbn, title, author, publisher, publication_year, description, available_copies, total_copies, category_id, status)
SELECT '9780140283334', '1984', 'George Orwell', 'Penguin Books', 1949, 'A dystopian social science fiction novel', 3, 3, category_id, 'AVAILABLE'
FROM categories WHERE name = 'Literature';

INSERT INTO books (isbn, title, author, publisher, publication_year, description, available_copies, total_copies, category_id, status)
SELECT '9780061120084', 'To Kill a Mockingbird', 'Harper Lee', 'Harper Perennial', 1960, 'A story of racial injustice', 3, 3, category_id, 'AVAILABLE'
FROM categories WHERE name = 'Literature';

-- Add Science Books
INSERT INTO books (isbn, title, author, publisher, publication_year, description, available_copies, total_copies, category_id, status)
SELECT '9780393609394', 'Astrophysics for People in a Hurry', 'Neil deGrasse Tyson', 'W. W. Norton & Company', 2017, 'A straightforward introduction to the universe', 2, 2, category_id, 'AVAILABLE'
FROM categories WHERE name = 'Science';

INSERT INTO books (isbn, title, author, publisher, publication_year, description, available_copies, total_copies, category_id, status)
SELECT '9780143111801', 'Sapiens', 'Yuval Noah Harari', 'Harper', 2015, 'A brief history of humankind', 3, 3, category_id, 'AVAILABLE'
FROM categories WHERE name = 'Science';

INSERT INTO books (isbn, title, author, publisher, publication_year, description, available_copies, total_copies, category_id, status)
SELECT '9780544272996', 'A Brief History of Time', 'Stephen Hawking', 'Bantam', 1988, 'From the Big Bang to Black Holes', 2, 2, category_id, 'AVAILABLE'
FROM categories WHERE name = 'Science';

-- Add Business Books
INSERT INTO books (isbn, title, author, publisher, publication_year, description, available_copies, total_copies, category_id, status)
SELECT '9781591846352', 'Zero to One', 'Peter Thiel', 'Crown Business', 2014, 'Notes on startups, or how to build the future', 2, 2, category_id, 'AVAILABLE'
FROM categories WHERE name = 'Business';

INSERT INTO books (isbn, title, author, publisher, publication_year, description, available_copies, total_copies, category_id, status)
SELECT '9780062301239', 'The Lean Startup', 'Eric Ries', 'Crown Business', 2011, 'How Constant Innovation Creates Radically Successful Businesses', 3, 3, category_id, 'AVAILABLE'
FROM categories WHERE name = 'Business';

INSERT INTO books (isbn, title, author, publisher, publication_year, description, available_copies, total_copies, category_id, status)
SELECT '9781847941831', 'Good to Great', 'Jim Collins', 'Random House Business', 2001, 'Why Some Companies Make the Leap...And Others Do Not', 2, 2, category_id, 'AVAILABLE'
FROM categories WHERE name = 'Business';

-- Add Philosophy Books
INSERT INTO books (isbn, title, author, publisher, publication_year, description, available_copies, total_copies, category_id, status)
SELECT '9780679724650', 'The Republic', 'Plato', 'Vintage', 1991, 'Plato''s masterwork of philosophy', 2, 2, category_id, 'AVAILABLE'
FROM categories WHERE name = 'Philosophy';

INSERT INTO books (isbn, title, author, publisher, publication_year, description, available_copies, total_copies, category_id, status)
SELECT '9780872201668', 'Meditations', 'Marcus Aurelius', 'Hackett Publishing', 1992, 'Personal writings of the Roman Emperor', 2, 2, category_id, 'AVAILABLE'
FROM categories WHERE name = 'Philosophy';

INSERT INTO books (isbn, title, author, publisher, publication_year, description, available_copies, total_copies, category_id, status)
SELECT '9780679783268', 'Beyond Good and Evil', 'Friedrich Nietzsche', 'Vintage', 1989, 'Prelude to a Philosophy of the Future', 2, 2, category_id, 'AVAILABLE'
FROM categories WHERE name = 'Philosophy'; 