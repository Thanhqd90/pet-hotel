import { mount } from 'enzyme';
import React, { Component } from 'react';
import {
  BrowserRouter,
  Link,
  Route,
  Switch,
} from 'react-router-dom';
import EmptyPermissionsRoute from 'view/shared/routes/EmptyPermissionsRoute';

function mountPage(currentUser) {
  const EmptyPermissionsPage = class EmptyPermissionsPage extends Component {
    render() {
      return (
        <div data-test="EmptyPermissionsPage">
          Empty Permissions Page
        </div>
      );
    }
  };

  return mount(
    <BrowserRouter>
      <div>
        <Link to="/auth/empty-permissions">
          Go to Empty Permissions
        </Link>

        <Switch>
          <Route
            exact
            path="/auth/signin"
            render={() => (
              <div data-test="SignInPage">Sign in</div>
            )}
          />

          <Route
            exact
            path="/"
            render={() => (
              <div data-test="PrivatePage">Private</div>
            )}
          />

          <EmptyPermissionsRoute
            path="/auth/empty-permissions"
            currentUser={currentUser}
            component={EmptyPermissionsPage}
          />
        </Switch>
      </div>
    </BrowserRouter>,
  );
}

describe('view/shared/routes/EmptyPermissionsRoute', () => {
  describe('Authenticated with permissions', () => {
    let component;
    beforeAll(() => {
      component = mountPage({
        id: 1,
        roles: ['viewer'],
        emailVerified: true,
      });

      component
        .find('Link[to="/auth/empty-permissions"]')
        .simulate('click', { button: 0 });
    });

    test('redirect to private', () => {
      expect(component.html()).toMatchSnapshot();

      expect(
        component
          .find(`[data-test="PrivatePage"]`)
          .exists(),
      ).toBeTruthy();
    });
  });

  describe('Authenticated with NO permissions', () => {
    let component;
    beforeAll(() => {
      component = mountPage({
        id: 1,
        roles: [],
        emailVerified: false,
      });

      component
        .find('Link[to="/auth/empty-permissions"]')
        .simulate('click', { button: 0 });
    });

    test('opens the page', () => {
      expect(component.html()).toMatchSnapshot();

      expect(
        component
          .find(`[data-test="EmptyPermissionsPage"]`)
          .exists(),
      ).toBeTruthy();
    });
  });

  describe('Not authenticated', () => {
    let component;

    beforeAll(() => {
      component = mountPage(null);

      component
        .find('Link[to="/auth/empty-permissions"]')
        .simulate('click', { button: 0 });
    });

    test('redirect to signin', () => {
      expect(component.html()).toMatchSnapshot();

      expect(
        component.find(`[data-test="SignInPage"]`).exists(),
      ).toBeTruthy();
    });
  });
});
