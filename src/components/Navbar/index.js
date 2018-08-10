import React from 'react';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem } from 'reactstrap';
  import {Link} from 'react-router';

export default class Example extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false
    };
  }
  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }
  render() {
    return (
      <div>
        <Navbar color="light" light expand="md">
          <NavbarBrand tag={Link} to="/">ZtickerZ</NavbarBrand>
          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="ml-auto" navbar>
              <NavItem>
                <NavLink tag={Link} to="/album"> My Album </NavLink>
              </NavItem>
              <NavItem>
                <NavLink tag={Link} to="/market"> MarketPlace </NavLink>
              </NavItem>
              <NavItem>
                <NavLink tag={Link} to="/stats">Statistics</NavLink>
              </NavItem>
              <NavItem>
                <NavLink tag={Link} to="/about">?</NavLink>
              </NavItem>
            </Nav>
          </Collapse>
        </Navbar>
      </div>
    );
  }
}

// <UncontrolledDropdown nav inNavbar>
//   <DropdownToggle nav caret>
//     Options
//   </DropdownToggle>
//   <DropdownMenu right>
//     <DropdownItem>
//       Option 1
//     </DropdownItem>
//     <DropdownItem>
//       Option 2
//     </DropdownItem>
//     <DropdownItem divider />
//     <DropdownItem>
//       Reset
//     </DropdownItem>
//   </DropdownMenu>
// </UncontrolledDropdown>
