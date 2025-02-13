import aj from '../config/arcjet.js';

const arcjetMiddleware = async (req, res, next) => {
  try {
    const decision = await aj.protect(req, { requested: 1 }); //Защите тези заявки и ми кажете вашите решения. Отказано или разрешено

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        return res.status(429).json({ error: "Too many requests" });
      }
      if (decision.reason.isBot()) {
        return res.status(403).json({ error: "Bots detected" });
      }

      return res.status(403).json({ error: "Access denied" });
    }

    next();
  } catch (error) {
    console.log(`Arcjet middleware error: ${error}`);
    next(error);
  }
}

export default arcjetMiddleware;