import React, { useState } from 'react';
import {
  Collapse, Container, Dropdown, DropdownItem,
  DropdownMenu, DropdownToggle, Navbar, NavbarText,
  NavbarBrand, NavbarToggler, NavItem, NavLink 
} from 'reactstrap';
import { Link } from 'react-router-dom';
import { useMsal } from "@azure/msal-react";

import './NavMenu.css';

export const NavMenu = () => {
  const [collapsed, setCollapsed] = useState(true);
  const [openDropdown, setOpenDropdown] = useState(false);

  const { accounts, instance } = useMsal();
  const { name, username } = accounts[0];

  const toggleNavbar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <header>
      <Navbar className="navbar-expand-sm navbar-toggleable-sm ng-white border-bottom box-shadow mb-3" light>
        <Container fluid>
          <NavbarBrand tag={Link} to="/">Wedding Portal</NavbarBrand>
          <NavbarToggler onClick={toggleNavbar} className="mr-2" />
          <Collapse className="d-sm-inline-flex" isOpen={!collapsed} navbar>
            <ul className="navbar-nav flex-grow">
              <NavItem>
                <NavLink tag={Link} className="text-dark" to="/">Home</NavLink>
              </NavItem>
              <NavItem>
                <NavLink tag={Link} className="text-dark" to="/edit-wedding">Edit Wedding(s)</NavLink>
              </NavItem>
            </ul>
            <ul className="navbar-nav ml-auto">
              <NavItem>
                <Dropdown toggle={() => setOpenDropdown(!openDropdown)} isOpen={openDropdown}>
                  <DropdownToggle caret outline>
                    Hello, {name}!
                  </DropdownToggle>
                  <DropdownMenu>
                    <DropdownItem header>{username}</DropdownItem>
                    <DropdownItem onClick={() => instance.logoutRedirect()}>Logout</DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </NavItem>
            </ul>
          </Collapse>
        </Container>
      </Navbar>
    </header>
  );
}
