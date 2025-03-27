import axios from 'axios';
import { env } from '../../environment';

const { endpoint } = env;

export const thirdPartyLogin = async (emailId) => {
  return await axios({
    method: 'post',
    url: endpoint + '/android_login/',
    data: { email: emailId },
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then((response) => response.data?.result)
    .catch((error) => error?.response);
};

export const useBasicLogin = async (email, password) => {
  return await axios({
    method: 'post',
    url: endpoint + '/user_basic_auth/',
    data: { email, password },
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then((response) => response.data.result)
    .catch((error) => error);
};
