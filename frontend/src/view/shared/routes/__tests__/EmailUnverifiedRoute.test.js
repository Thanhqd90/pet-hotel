import { mount } from 'enzyme';
import React, { Component } from 'react';
import {
  BrowserRouter,
  Link,
  Route,
  Switch,
} from 'react-router-dom';
import EmailUnverifiedRoute from 'view/shared/routes/EmailUnverifiedRoute';

function mountPage(currentUser) {
  const EmailUnverifiedPage = class EmailUnverifiedPage extends Component {
    render() {
      return (
        <div data-test="EmailUnverifiedPage">
          Email Unverified Page
        </div>
      );
    }
  };

  return mount(
    <BrowserRouter>
      <div>
        <Link to="/auth/email-unverified">
          Go to Email Unverified
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

          <EmailUnverifiedRoute
            path="/auth/email-unverified"
            currentUser={currentUser}
            component={EmailUnverifiedPage}
          />
        </Switch>
      </div>
    </BrowserRouter>,
  );
}

describe('view/shared/routes/EmailUnverifiedRoute', () => {
  describe('Authenticated with email verified', () => {
    let component;
    beforeAll(() => {
      component = mountPage({ id: 1, emailVerified: true });

      component
        .find('Link[to="/auth/email-unverified"]')
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

  describe('Authenticated WITHOUT email verified', () => {
    let component;
    beforeAll(() => {
      component = mountPage({
        id: 1,
        emailVerified: false,
      });

      component
        .find('Link[to="/auth/email-unverified"]')
        .simulate('click', { button: 0 });
    });

    test('opens the page', () => {
      expect(component.html()).toMatchSnapshot();

      expect(
        component
          .find(`[data-test="EmailUnverifiedPage"]`)
          .exists(),
      ).toBeTruthy();
    });
  });

  describe('Not authenticated', () => {
    let component;

    beforeAll(() => {
      component = mountPage(null);

      component
        .find('Link[to="/auth/email-unverified"]')
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
