import { call, put, select } from 'redux-saga/effects';
import api from '../../services/api';

import { Creators as UserActions } from '../ducks/users';
import { Creators as ModalActions } from '../ducks/modal';

export default function* addUser(action) {
  try {
    const { data } = yield call(api.get, `users/${action.payload.name}`);
    const isDuplicated = yield select(state => state.users.data.some(user => user.id === data.id));

    if (isDuplicated) {
      yield put(UserActions.addUserFailure('Usuário duplicado'));
    } else {
      const userData = {
        id: data.id,
        name: data.name,
        login: data.login,
        avatar: data.avatar_url,
        lngLat: action.payload.lngLat,
      };

      yield put(UserActions.addUserSuccess(userData));
    }
  } catch (err) {
    yield put(UserActions.addUserFailure('Erro ao adicionar usuário'));
  } finally {
    yield put(ModalActions.closeModal());
  }
}
