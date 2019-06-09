import { mount } from 'enzyme';
import React, { Component } from 'react';
import {
  BrowserRouter,
  Link,
  Route,
  Switch,
} from 'react-router-dom';
import PrivateRoute from 'view/shared/routes/PrivateRoute';
import Roles from 'security/roles';
const roles = Roles.values;

function mountPage(currentUser, permissionRequired) {
  const PrivatePage = class PrivatePage extends Component {
    render() {
      return (
        <div data-test="PrivatePage">Private Page</div>
      );
    }
  };

  const SignInPage = class SignInPage extends Component {
    render() {
      const { from } = this.props.location.state || {
        from: { pathname: '/' },
      };

      return (
        <div data-test="SignInPage">
          Singin Page
          <div data-test-from={from.pathname} />
        </div>
      );
    }
  };

  return mount(
    <BrowserRouter>
      <div>
        <Link to="/private">Go to private</Link>

        <Switch>
          <Route
            exact
            path="/auth/signin"
            component={SignInPage}
          />

          <Route
            exact
            path="/auth/email-unverified"
            render={() => (
              <div data-test="EmailUnverifiedPage">
                Email Unverified
              </div>
            )}
          />

          <Route
            exact
            path="/auth/empty-permissions"
            render={() => (
              <div data-test="EmptyPermissionsPage">
                Empty Permissions
              </div>
            )}
          />

          <Route
            exact
            path="/403"
            render={() => <div data-test="403">403</div>}
          />

          <PrivateRoute
            path="/private"
            currentUser={currentUser}
            permissionRequired={permissionRequired}
            component={PrivatePage}
          />
        </Switch>
      </div>
    </BrowserRouter>,
  );
}

describe('view/shared/routes/PrivateRoute', () => {
  describe('Not Authenticated', () => {
    let component;
    beforeAll(() => {
      component = mountPage(null, []);

      component
        .find('Link[to="/private"]')
        .simulate('click', { button: 0 });
    });

    test('redirect to login', () => {
      expect(component.html()).toMatchSnapshot();

      expect(
        component
          .find(`[data-test="PrivatePage"]`)
          .exists(),
      ).toBeFalsy();

      expect(
        component.find(`[data-test="SignInPage"]`).exists(),
      ).toBeTruthy();
    });

    test('send from to signin', () => {
      expect(
        component
          .find(`[data-test-from="/private"]`)
          .exists(),
      ).toBeTruthy();
    });
  });

  describe('Email Unverified', () => {
    let component;

    beforeAll(() => {
      component = mountPage(
        {
          id: 1,
          roles: [roles.owner],
          emailVerified: false,
        },
        { allowedRoles: [roles.owner] },
      );

      component
        .find('Link[to="/private"]')
        .simulate('click', { button: 0 });
    });

    test('redirects to email unverified', () => {
      expect(component.html()).toMatchSnapshot();

      expect(
        component
          .find(`[data-test="EmailUnverifiedPage"]`)
          .exists(),
      ).toBeTruthy();
    });
  });

  describe('Empty Permissions', () => {
    let component;

    beforeAll(() => {
      component = mountPage(
        {
          id: 1,
          roles: [],
          emailVerified: true,
        },
        { allowedRoles: [roles.owner] },
      );

      component
        .find('Link[to="/private"]')
        .simulate('click', { button: 0 });
    });

    test('redirects to empty permissions', () => {
      expect(component.html()).toMatchSnapshot();

      expect(
        component
          .find(`[data-test="EmptyPermissionsPage"]`)
          .exists(),
      ).toBeTruthy();
    });
  });

  describe('Not enough permissions', () => {
    let component;

    beforeAll(() => {
      component = mountPage(
        {
          id: 1,
          roles: [roles.viewer],
          emailVerified: true,
        },
        { allowedRoles: [roles.owner] },
      );

      component
        .find('Link[to="/private"]')
        .simulate('click', { button: 0 });
    });

    test('redirects to 403', () => {
      expect(component.html()).toMatchSnapshot();

      expect(
        component.find(`[data-test="403"]`).exists(),
      ).toBeTruthy();
    });
  });

  describe('Authenticated with emailVerified and roles', () => {
    let component;

    beforeAll(() => {
      component = mountPage(
        {
          id: 1,
          roles: [roles.owner],
          emailVerified: true,
        },
        { allowedRoles: [roles.owner] },
      );

      component
        .find('Link[to="/private"]')
        .simulate('click', { button: 0 });
    });

    test('opens the page', () => {
      expect(component.html()).toMatchSnapshot();

      expect(
        component
          .find(`[data-test="PrivatePage"]`)
          .exists(),
      ).toBeTruthy();
    });
  });
});
