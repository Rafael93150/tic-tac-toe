import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(" ")[1];
        try {
            const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
            req.user = decodedToken;
            next();
        } catch (error) {
            res.status(401).send("Token invalide");
        }
    } else {
        res.status(401).send("Authentification requise");
    }
};

export const adminMiddleware = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "Token non fourni" });
        }

        const decodedToken = jwt.verify(token, process.env.SECRET_KEY);

        const userRole = decodedToken.role;

        if (userRole === "ADMIN_ROLE") {
            next();
        } else {
            res.status(403).send("ADMIN, Accès interdit pour cet utilisateur");
        }
    } catch (error) {
        console.error(error);
        if (error.name === "TokenExpiredError") {
            res.status(401).send("Token expiré");
        } else {
            res.status(500).send(
                "Une erreur est survenue lors de la vérification des autorisations."
            );
        }
    }
};
