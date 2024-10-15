import express from 'express';
import jwt from 'jsonwebtoken';
import Joi from 'joi';
import bcrypt from 'bcrypt';
import { Prisma } from '../util/index.js';

const router = express.Router();

router.post('/account/signup', async (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(20).required(),
    id: Joi.string().min(4).max(20).required(),
    password: Joi.string().min(4).max(20).required(),
    passwordCheck: Joi.string().required(),
  });

  try {
    const validation = await schema.validateAsync(req.body);
    const { name, id, password, passwordCheck } = validation;

    const accountCheck = await userPrisma.users.findFirst({
      where: { id: id },
    });

    if (accountCheck) {
      return res.status(400).json('아이디가 이미 존재합니다');
    }

    if (password !== passwordCheck) {
      return res.status(400).json('비밀번호가 일치하지 않습니다');
    }

    const uuid = crypto.randomUUID();

    const hashedPassword = await bcrypt.hash(password, 10);

    const newaccount = await Prisma.account.create({
      data: {
        accountid: uuid,
        name: name,
        id: id,
        password: hashedPassword,
      },
    });

    res.status(201).json({ message: '회원가입 성공', account: newaccount });
  } catch (error) {
    return res.status(500).json({ errorname: error.name, errormessage: error.message });
  }
});

router.post('/account/signin', async (req, res, next) => {
  const schema = Joi.object({
    id: Joi.string().required(),
    password: Joi.string().required(),
  });
  try {
    const validation = await schema.validateAsync(req.body);
    const { id, password } = validation;

    const account = await Prisma.account.findFirst({
      where: { id: id },
    });

    const passwordMatch = await bcrypt.compare(password, account.password);

    if (!account || !passwordMatch) {
      return res.status(400).json('아이디 혹은 비밀번호가 틀렸습니다');
    }

    const token = jwt.sign({ name: account.id }, process.env.SECRET_KEY, {
      expiresIn: '1d',
    });
    res.cookie('authorization', `Bearer ${token}`);
    res.status(200).json({ message: '로그인 성공', token: token });
  } catch (error) {
    return res.status(500).json({ errorname: error.name, errormessage: error.message });
  }
});

router.get('/auth', async (req, res, next) => {
  try {
    const { authorization } = req.cookies;

    if (!authorization) {
      throw new Error('유효하지 않은 인증입니다.');
    }

    const [tokenType, token] = authorization.split(' ');

    if (tokenType !== 'Bearer') {
      throw new Error('토큰 타입이 일치하지 않습니다.');
    }

    const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
    const id = decodedToken.id;

    const user = await Prisma.account.findFirst({
      where: { id },
    });
    if (!user) {
      res.clearCookie('authorization');
      throw new Error('토큰 사용자가 존재하지 않습니다.');
    }

    return res.status(200).json({ message: '토큰 사용자 인증이 완료되었습니다.', data: { id } });
  } catch (err) {
    res.clearCookie('authorization');

    switch (err.name) {
      case 'JsonWebTokenError':
        return res.status(400).json({ errorMessage: '토큰이 잘못되었습니다.' });
      default:
        return res.status(500).json({ errorMessage: error.message ?? '비정상적인 요청입니다.' });
    }
  }
});

export default router;
