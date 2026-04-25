const router = require("express").Router();
const { getCurrentUser, updateUser } = require("../controllers/users");
const { celebrate, Joi } = require("celebrate");

router.get("/me", getCurrentUser);

router.patch(
  "/me",
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      email: Joi.string().required().email(),
    }),
  }),
  updateUser,
);

module.exports = router;
