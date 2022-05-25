import { GetServerSideProps, NextPage } from 'next';
import cookie from 'cookie';
import { useEffect } from 'react';

function validateState(state?: string | string[], cookies?: string): boolean {

  if (cookies) {
    const parsed = cookie.parse(cookies);
    const authCookie = parsed.authState;
    if (authCookie) {
      return state === authCookie;
    }
  }
  return false;
}

async function getTokenFromCode(
  code: string | string[]
): Promise<string | null> {

  if (code) {
    
    const params = new URLSearchParams();
    params.append('grant_type', 'authorization_code');
    params.append('client_id', process.env.CLIENT_ID as any);
    params.append('client_secret', process.env.CLIENT_SECRET as any);
    params.append('code', code as any);
    params.append('redirect_uri', 'http://localhost:3000/auth/callback');

    let access_token;
    try {
      const tokenRequest = await fetch(`https://discord.com/api/v8/oauth2/token`, {
        method: 'POST',
        body: params,
        headers: {
          'Content-type': 'application/x-www-form-urlencoded'
        }
      }).then(r => r.json());
  
      access_token = tokenRequest.access_token;

      } catch {
        throw new Error('Failed to get access token.');
      }
      return access_token;
  }

  return null;
}

async function getUserFromToken(token: string): Promise<User | null> {

  if (token) {
    const GUILD_ID = '<removed>';
    let discord_user = await fetch(`https://discordapp.com/api/users/@me`, {
        method: 'GET',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }).then(r => r.json());
    
    return discord_user;
  }

  return null;
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const code = ctx.query.code;
  if (code) {
      const token = await getTokenFromCode(code);
      if (token) {
        const user = await getUserFromToken(token);

        if (user) {
          const authCookie = cookie.serialize('auth', JSON.stringify(user), {
            maxAge: 60 * 60 * 24 * 7,
            httpOnly: true,
            path: '/',
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production',
          });

          ctx.res.setHeader('Set-Cookie', authCookie);
        }
      }
  }

  return {
    props: {},
  };
};

const Callback: NextPage = (props) => {
  useEffect(() => {
    location.href = '/';
  }, []);
  return null;
};

export default Callback;
