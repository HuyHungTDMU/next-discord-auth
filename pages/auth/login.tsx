import { GetServerSideProps, NextPage } from 'next';
import crypto from 'crypto';
import cookie from 'cookie';

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const state = crypto.randomUUID();

  const authCookie = cookie.serialize('authState', state, {
    maxAge: 60 * 15,
    httpOnly: true,
    path: '/auth/',
    secure: process.env.NODE_ENV === 'production',
  });

  ctx.res.setHeader('Set-Cookie', authCookie);

  const redirectURI = 'http://localhost:3000/auth/callback';
  return {
    redirect: {
      destination: `https://discord.com/api/oauth2/authorize?response_type=code&client_id=${process.env.CLIENT_ID}&scope=identify%20guilds.members.read%20guilds.join&redirect_uri=${redirectURI}&prompt=consent`,
      permanent: false,
    },
  };
};

const Login: NextPage = () => null;

export default Login;
