const pool = require('../config/db');
const getAllCategories = async () => {
    const [rows] = await pool.query('SELECT * FROM Categories ORDER BY category_name ASC');
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