import express, { Express, Router, Request, Response } from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const router = Router();
const app: Express = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ limit: '1mb', extended: false }));

app.use('/api', router);
app.listen(8081, () => {
  console.log('Sever Opened');
});

let transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  requireTLS: true,
  auth: {
    user: process.env.NODEMAILER_USER,
    pass: process.env.NODEMAILER_PASS,
  },
});

const sendMail = async (to: string, subject: string, html: string) => {
  try {
    await transporter.sendMail({
      from: process.env.NODEMAILER_USER,
      to,
      subject,
      html,
    });
  } catch (error) {
    console.error(`Fail to send email to ${to}: ${error.message}`);
    error.statusCode = 500;
    throw error;
  }
};

const contactMail = async (req: Request, res: Response) => {
  try {
    const { email, title, phone, text } = req.body;
    await sendMail(
      email,
      title,
      `<h1>이 메일을 받는 즉시 ${phone} 번호로 회신 바랍니다.</h1><br>${text}`,
    );
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: '메일 전송에 실패했습니다.', status: false });
  }
};

router.post('/mailAlert', contactMail);
