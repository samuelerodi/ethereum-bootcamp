/*
 * AboutPage
 */

import React from 'react';
import { AccountData, ContractData, ContractForm } from 'drizzle-react-components';
import { drizzleConnect } from 'drizzle-react';
import { Container, Row, Col, Button } from 'reactstrap';
import {MarketSticker} from '../../components/Sticker';
import PropTypes from 'prop-types';

import ZtickerZ from '../../instances/ZtickerZ';
import ZtickyZtorage from '../../instances/ZtickyZtorage';
import ZtickyCoinZ from '../../instances/ZtickyCoinZ';

import web3 from '../../config/web3';
import {album, getStickersOf, getStickersDetails, getOrderBook} from '../../utils/ZtickerZ';
import {fromZCZ, toZCZ} from '../../utils/ZtickyCoinZ';



class AdminPage extends React.PureComponent {
  /**
   * when initial state username is not null, submit the form to load repos
   */
   constructor(props, context) {
    super(props);
    this.state={
      reload:false,
      isPaused:false
    };
    this.web3=web3;
    this.refresh();
  }
  instantiateContracts = () =>{
    if (this.loaded) return Promise.resolve();
    return ZtickerZ.deployed()
    .then((r)=>this.ZtickerZ=r)
    .then(()=>ZtickyZtorage.deployed())
    .then((r)=>this.ZtickyZtorage=r)
    .then(()=>ZtickyCoinZ.deployed())
    .then((r)=>this.ZtickyCoinZ=r)
    .then(r=>{
      return new Promise(function(resolve,reject){
        this.web3.eth.getAccounts((e,r)=>{
          if(e)return reject(e);
          this.account=r[0];
          resolve(this.account);
        })
      }.bind(this))
     })
    .then(()=>this.loaded=true);
  }
  refresh = ()=>{
    this.instantiateContracts()
    .then(r=>this.ZtickerZ.paused())
    .then(r=>this.setState({isPaused:r}));
  }
  toggle = () => {
    if (this.state.isPaused)
      return this.ZtickerZ.unpause({
        from: this.account,
        gas: 1500000,
        gasPrice: 4000000000
      }).then(r=>this.refresh());
    return this.ZtickerZ.pause({
      from: this.account,
      gas: 1500000,
      gasPrice: 4000000000
    }).then(r=>this.refresh());
  }
  componentDidMount() { }
  render() {
    return (
      <div className="mt-5">
        <Container className="text-left">
          <Row>
          <Col>
            <h2>Hi Admin!</h2>
            <div>
            {this.state.isPaused ?
              <p>Restart the game!</p> :
              <p>You can pause the game if you want...</p>
            }
            <Button className="btn btn-danger mt-1" onClick={this.toggle}>Toggle</Button>
            </div>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    accounts: state.accounts,
    drizzleStatus: state.drizzleStatus
  }
}

AdminPage.contextTypes = {
  drizzle: PropTypes.object
}
const AdminContainer = drizzleConnect(AdminPage, mapStateToProps);
export default AdminContainer;
