import store from '@/store';
import { LOGIN_GETTER_TYPES } from '@/store/LoginModule';

export const isAuthed = () => store.getters[LOGIN_GETTER_TYPES.LOGIN]
