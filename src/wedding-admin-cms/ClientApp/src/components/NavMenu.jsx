import React, { useState } from 'react';
import { 
  Collapse, Container, Navbar, NavbarText,
  NavbarBrand, NavbarToggler, NavItem, NavLink 
} from 'reactstrap';
import { Link } from 'react-router-dom';
import { useMsal } from "@azure/msal-react";

import './NavMenu.css';

export const NavMenu = () => {
  const [collapsed, setCollapsed] = useState(true);

  const msal = useMsal();
  const { name, username} = msal.accounts[0];

  const toggleNavbar = () => {
    setCollapsed(!collapsed);
  }

  return (
    <header>
      <Navbar className="navbar-expand-sm navbar-toggleable-sm ng-white border-bottom box-shadow mb-3" light>
        <Container>
          <NavbarBrand tag={Link} to="/">Wedding Portal</NavbarBrand>
          <NavbarToggler onClick={toggleNavbar} className="mr-2" />
          <Collapse className="d-sm-inline-flex flex-sm-row-reverse" isOpen={!collapsed} navbar>
            <ul className="navbar-nav flex-grow">
              <NavItem>
                <NavLink tag={Link} className="text-dark" to="/">Home</NavLink>
              </NavItem>
              <NavItem>
                <NavLink tag={Link} className="text-dark" to="/edit-wedding">Edit Wedding(s)</NavLink>
              </NavItem>
              <NavItem>
                <NavbarText>Hello, {name} ({username})!</NavbarText>
              </NavItem>
            </ul>
          </Collapse>
        </Container>
      </Navbar>
    </header>
  );
}
