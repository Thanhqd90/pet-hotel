import actions from 'modules/auth/authActions';
import selectors from 'modules/auth/authSelectors';
import service from 'modules/auth/authService';
import getStore, { configureStore } from 'modules/store';
import Roles from 'security/roles';
jest.mock('modules/auth/authService');
jest.mock('view/shared/message');

const roles = Roles.values;

beforeEach(() => {
  configureStore();
});

describe('auth/store', () => {
  describe('success path', () => {
    beforeEach(() => {
      service.__setError(false);
    });

    test('signin with social stores user', async () => {
      const store = getStore();

      expect(
        selectors.selectAuthenticationUser(
          store.getState(),
        ),
      ).toBeFalsy();

      expect(
        selectors.selectCurrentUser(store.getState()),
      ).toBeFalsy();

      await actions.doSigninSocial('google')(
        store.dispatch,
      );

      expect(
        selectors.selectAuthenticationUser(store.getState())
          .uid,
      ).toEqual(1);
      expect(
        selectors.selectCurrentUser(store.getState()).id,
      ).toEqual(1);
    });

    test('signin with email and password stores user', async () => {
      const store = getStore();

      expect(
        selectors.selectAuthenticationUser(
          store.getState(),
        ),
      ).toBeFalsy();

      expect(
        selectors.selectCurrentUser(store.getState()),
      ).toBeFalsy();

      await actions.doSigninWithEmailAndPassword(
        'john',
        '1',
      )(store.dispatch);

      expect(
        selectors.selectAuthenticationUser(store.getState())
          .uid,
      ).toEqual(1);
      expect(
        selectors.selectCurrentUser(store.getState()).id,
      ).toEqual(1);
    });

    test('signout cleans user', async () => {
      const store = getStore();
      await actions.doSigninWithEmailAndPassword(
        'john',
        '1',
      )(store.dispatch);
      await actions.doSignout()(store.dispatch);
      expect(
        selectors.selectAuthenticationUser(
          store.getState(),
        ),
      ).toBeFalsy();
      expect(
        selectors.selectCurrentUser(store.getState()),
      ).toBeFalsy();
    });

    test('select user roles', async () => {
      const store = getStore();
      await actions.doSigninWithEmailAndPassword(
        'john',
        '1',
      )(store.dispatch);

      expect(
        selectors.selectRoles(store.getState()),
      ).toContain(roles.owner);
    });

    describe('emailVerified', () => {
      test('fills at init signup', async () => {
        const store = getStore();
        await actions.doSigninFromAuthChange({
          uid: '1',
          emailVerified: true,
        })(store.dispatch);

        expect(
          selectors.selectCurrentUser(store.getState())
            .emailVerified,
        ).toBeTruthy();
      });

      test('fills at login', async () => {
        const store = getStore();
        await actions.doSigninWithEmailAndPassword(
          'john',
          '1',
        )(store.dispatch);
        expect(
          selectors.selectCurrentUser(store.getState())
            .emailVerified,
        ).toBeTruthy();
      });

      test('fills at singup with email', async () => {
        const store = getStore();
        await actions.doRegisterEmailAndPassword(
          'john',
          '1',
        )(store.dispatch);
        expect(
          selectors.selectCurrentUser(store.getState())
            .emailVerified,
        ).toBeTruthy();
      });

      test('fills at signin with social', async () => {
        const store = getStore();
        await actions.doSigninSocial('google')(
          store.dispatch,
        );
        expect(
          selectors.selectCurrentUser(store.getState())
            .emailVerified,
        ).toBeTruthy();
      });
    });
  });

  describe('error path', () => {
    test('signin', async () => {
      service.__setError(true);

      const store = getStore();
      expect(
        selectors.selectAuthenticationUser(
          store.getState(),
        ),
      ).toBeFalsy();
      expect(
        selectors.selectCurrentUser(store.getState()),
      ).toBeFalsy();

      await actions.doSigninWithEmailAndPassword(
        'john',
        '1',
        false,
      )(store.dispatch);

      expect(
        selectors.selectAuthenticationUser(
          store.getState(),
        ),
      ).toBeFalsy();
      expect(
        selectors.selectCurrentUser(store.getState()),
      ).toBeFalsy();
    });
  });
});
