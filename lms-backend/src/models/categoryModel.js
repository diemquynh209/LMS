const pool = require('../config/db');
const getAllCategories = async () => {
    const query = `
        SELECT c.*, GROUP_CONCAT(cl.class_name SEPARATOR ', ') AS classes
        FROM Categories c
        LEFT JOIN Classes cl ON c.category_id = cl.category_id
        GROUP BY c.category_id
        ORDER BY c.category_name ASC
    `;
    const [rows] = await pool.query(query);
    return rows;
};

const addCategory = async (categoryName, description) => {
    const [result] = await pool.query(
        'INSERT INTO Categories (category_name, description) VALUES (?, ?)',
        [categoryName, description]
    );
    return result;
};

const updateCategory = async (categoryId, categoryName, description) => {
    const [result] = await pool.query(
        'UPDATE Categories SET category_name = ?, description = ? WHERE category_id = ?',
        [categoryName, description, categoryId]
    );
    return result;
};

const deleteCategory = async (categoryId) => {
    const [result] = await pool.query('DELETE FROM Categories WHERE category_id = ?', [categoryId]);
    return result;
};

module.exports = {
    getAllCategories,
    addCategory,
    updateCategory,
    deleteCategory
};