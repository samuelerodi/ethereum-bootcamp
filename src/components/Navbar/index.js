import React from 'react';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  // UncontrolledDropdown,
  // DropdownToggle,
  // DropdownMenu,
  // DropdownItem
} from 'reactstrap';
import {Link} from 'react-router';

import ZtickerZ from '../../instances/ZtickerZ';

import web3 from '../../config/web3';

export default class Example extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false,
      isAdmin: false
    };
    this.web3 = web3;
    ZtickerZ.deployed()
    .then((r)=>this.ZtickerZ=r)
    .then((r)=>this.ZtickerZ.owner())
    .then(owner=>{
      return new Promise(function(resolve,reject){
        this.web3.eth.getAccounts((e,r)=>{
          if(e)return reject(e);
          this.account=r[0];
          if(this.account==owner)this.setState({isAdmin:true})
          resolve(this.account);
        })
      }.bind(this))
     })
  }
  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }
  render() {
    let admin;
    if(this.state.isAdmin) admin=(
        <NavItem>
          <NavLink tag={Link} to="/admin">Admin</NavLink>
        </NavItem>
      );
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
              {admin}
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
