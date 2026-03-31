const pool = require('../config/db');

const InviteModel = {
    checkInviteCode: async (email, inviteCode) => {
        const [rows] = await pool.query(
            'SELECT * FROM Instructor_Invites WHERE email = ? AND invite_code = ? AND is_used = FALSE', 
            [email, inviteCode]
        );
        return rows[0];
    },

    burnInviteCode: async (email, inviteCode) => {
        await pool.query(
            'UPDATE Instructor_Invites SET is_used = TRUE WHERE email = ? AND invite_code = ?', 
            [email, inviteCode]
        );
    },

    createInviteCode: async (email, inviteCode) => {
        const [result] = await pool.query(
            'INSERT INTO Instructor_Invites (email, invite_code, is_used) VALUES (?, ?, FALSE)',
            [email, inviteCode]
        );
        return result;
    }
};

module.exports = InviteModel;