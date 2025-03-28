import { defineStore } from 'pinia';
import { ref } from 'vue';
import { AccessTokenResponse, LichessUser } from '../types';
import { lichessFetch } from '../utils';

export const useUserStore = defineStore(
  'user',
  () => {
    const accessToken = ref<AccessTokenResponse | null>(null);
    const expiresAt = ref<number | null>(null);
    const userid = ref<string | null>(null);
    const username = ref<string | null>(null);

    function setAccessToken(token: AccessTokenResponse) {
      accessToken.value = token;
      expiresAt.value = new Date().getTime() + token.expires_in * 1000;

      updateUser();
    }

    function updateUser() {
      lichessFetch('/api/account')
        .then(response => response.json() as Promise<LichessUser>)
        .then(data => {
          userid.value = data.id;
          username.value = data.username;
        });
    }

    function validateToken() {
      updateUser();
    }

    function tokenHasExpired(): boolean {
      const oneMonthFromNow = new Date();
      oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 11);

      return expiresAt.value === null || expiresAt.value < oneMonthFromNow.getTime();
    }

    function isLoggedIn(): boolean {
      return !tokenHasExpired();
    }

    function logout(deleteRemoteToken = true) {
      if (deleteRemoteToken) {
        lichessFetch(
          '/api/token',
          {},
          {
            method: 'DELETE',
          },
        );
      }

      accessToken.value = null;
      expiresAt.value = null;
      userid.value = null;
      username.value = null;
    }

    function is(u: string): boolean {
      return u === userid.value;
    }

    return {
      accessToken,
      expiresAt,
      userid,
      username,
      validateToken,
      setAccessToken,
      isLoggedIn,
      logout,
      is,
    };
  },
  {
    persist: true,
  },
);
