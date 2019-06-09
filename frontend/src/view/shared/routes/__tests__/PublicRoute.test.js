import { mount } from 'enzyme';
import React, { Component } from 'react';
import {
  BrowserRouter,
  Link,
  Route,
  Switch,
} from 'react-router-dom';
import PublicRoute from 'view/shared/routes/PublicRoute';

function mountPage(currentUser) {
  const PublicPage = class PublicPage extends Component {
    render() {
      return <div data-test="PublicPage">Public Page</div>;
    }
  };

  return mount(
    <BrowserRouter>
      <div>
        <Link to="/public">Go to public</Link>

        <Switch>
          <Route
            exact
            path="/"
            render={() => (
              <div data-test="PrivatePage">Private</div>
            )}
          />

          <PublicRoute
            path="/public"
            currentUser={currentUser}
            component={PublicPage}
          />
        </Switch>
      </div>
    </BrowserRouter>,
  );
}

describe('view/shared/routes/PublicRoute', () => {
  describe('Authenticated', () => {
    let component;
    beforeAll(() => {
      component = mountPage({ id: 1 });

      component
        .find('Link[to="/public"]')
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

  describe('Not authenticated', () => {
    let component;

    beforeAll(() => {
      component = mountPage(null);

      component
        .find('Link[to="/public"]')
        .simulate('click', { button: 0 });
    });

    test('opens the page', () => {
      expect(component.html()).toMatchSnapshot();

      expect(
        component.find(`[data-test="PublicPage"]`).exists(),
      ).toBeTruthy();
    });
  });
});
