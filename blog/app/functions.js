const path = require("path");

const generateAccessToken = (user) => {
	return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
		expiresIn: "30s",
	});
};

const authenticateToken = (req, res, next) => {
	const authHeader = req.headers["authorization"];
	const token = authHeader && authHeader.split(" ")[1];

	if (!token) return res.sendStatus(401);
	jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
		if (err) return res.sendStatus(403);
		req.user = user.name;
		next();
	});
};

const renderPage = function (res, page, data) {
	try {
		res.render(path.join(__dirname, `./views/pages/${page}.pug`), data);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const isVerifiedUser = (req, res, next) => {
	try {
		if (req.user) {
			next();
		} else {
			res.status(403).json({ message: "Unauthorized" });
		}
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

module.exports = {
	generateAccessToken,
	authenticateToken,
	isVerifiedUser,
	renderPage,
};
