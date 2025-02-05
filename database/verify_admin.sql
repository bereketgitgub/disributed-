SELECT u.user_id, u.username, u.email, u.password_hash, r.role_name 
FROM users u 
JOIN roles r ON u.role_id = r.role_id 
 