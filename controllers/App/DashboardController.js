const db = require("../../db");
const md5 = require("md5");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.getData = async (req, res) => {
    try {
        const [rows] = await db.execute(`SELECT
                                            COUNT(*) AS total,
                                            SUM(CASE WHEN status = 1 THEN 1 ELSE 0 END) AS active_count,
                                            SUM(CASE WHEN status = 2 THEN 1 ELSE 0 END) AS ok_count,
                                            SUM(CASE WHEN status = 3 THEN 1 ELSE 0 END) AS cancel_count,
	                                        SUM(CASE WHEN status = 0 THEN 1 ELSE 0 END) AS passive_count
                                        FROM appointments;`);

        res.json({ status: true, obj: rows[0] });
    } catch (err) {
        res.status(500).json({ status: false, error: err.message });
    }
};
