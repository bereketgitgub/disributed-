-- Insert default roles with detailed permissions
INSERT INTO roles (role_name, description, permissions) VALUES
('admin', 'Administrator with full access', '{
  "all": true,
  "books": {"read": true, "write": true, "delete": true},
  "loans": {"read": true, "write": true, "manage": true},
  "members": {"read": true, "write": true, "delete": true},
  "reports": {"read": true, "generate": true},
  "settings": {"manage": true}
}'),
('librarian', 'Library staff member', '{
  "books": {"read": true, "write": true},
  "loans": {"read": true, "write": true},
  "members": {"read": true, "write": true},
  "reports": {"read": true}
}'),
('member', 'Regular library member', '{
  "books": {"read": true},
  "loans": {"self": true}
}');

-- Create admin user (password: admin123)
INSERT INTO users (username, email, password_hash, role_id) VALUES
('admin', 'admin@library.local', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 1);

-- Create librarian user (password: librarian123)
INSERT INTO users (username, email, password_hash, role_id) VALUES
('librarian', 'librarian@library.local', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 2);

-- Create member records for admin and librarian
INSERT INTO members (user_id, first_name, last_name, email) VALUES
(LAST_INSERT_ID()-1, 'System', 'Administrator', 'admin@library.local'),
(LAST_INSERT_ID(), 'Library', 'Staff', 'librarian@library.local'); 