import { defineStore } from 'pinia';
import { useUserStore } from './user';

type SidebarUser = { label: string; userid: string };
type StateUser = { id: string, username: string };

export const useFavoritesStore = defineStore('favorites', {
  state: () => ({
    users: [] as StateUser[],
  }),
  actions: {
    add(userid: string, username: string) {
      if (this.users.includes({id: userid, username})) return;  
      this.users.push({ id: userid, username });
    },
    remove(userid: string) {
      this.users = this.users.filter(u => u.id !== userid);
    },
  },
  getters: {
    sidebar(state): SidebarUser[] {
      let users: SidebarUser[] = [];

      const user = useUserStore();
      if (user.userid && user.username) {
        users.push({ label: user.username, userid: user.userid });
      }

      users.push({ label: 'Featured', userid: 'broadcaster' });
      users = users.concat(state.users.map(user => ({ label: user.username, userid: user.id })));

      return users;
    },
  },
  persist: true,
});
