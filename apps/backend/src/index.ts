import fastify from 'fastify';
import { adminSdk, QELOS_APP_URL } from './sdk';
import QelosSDK from '@qelos/sdk';

const app = fastify({ logger: true });

app.get('/api', async (request, reply) => {
  return { hello: 'world' }
});


app.post('/api/login', async (request, reply) => {
  const { username, password } = request.body;
  const email = username + '@mydomain.com';

  const newSdk = new QelosSDK({ fetch: fetch, appUrl: QELOS_APP_URL });

  let authData;
  try {
    authData = await newSdk.authentication.oAuthSignin({
      username: email,
      password
    });
  } catch {
    //
  }
  if (!authData) {
    console.log('creating user:', email);
    await adminSdk.users.create({
      email: email,
      roles: ['user'],
      username: email,
      metadata: undefined,
      password,
      firstName: 'test',
      lastName: 'test',
    });
    authData = await newSdk.authentication.oAuthSignin({
      username: email,
      password
    });
  }

  return {
    redirectUrl: QELOS_APP_URL + '/auth/callback?rt=' + authData.payload.refreshToken
  };
});


app.listen({ port: Number(process.env.PORT || 5500), host: 'localhost' }, (err, address) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
  app.log.info(`server listening on ${address}`);
})