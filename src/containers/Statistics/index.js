/*
 * AboutPage
 */

import React from 'react';
import { AccountData, ContractData, ContractForm } from 'drizzle-react-components';
import { drizzleConnect } from 'drizzle-react';
import PropTypes from 'prop-types';
import { Container, Row, Col, Button, Table, Input, InputGroup, InputGroupAddon, InputGroupText } from 'reactstrap';
import stns from '../../components/Sticker/constants';

import ZtickerZ from '../../instances/ZtickerZ';
import ZtickyZtorage from '../../instances/ZtickyZtorage';
import ZtickyCoinZ from '../../instances/ZtickyCoinZ';

import web3 from '../../config/web3';
import {album, getStickersOf, getStickersDetails, getAlbumStats, computeAlbumReward} from '../../utils/ZtickerZ';
import {fromZCZ, toZCZ} from '../../utils/ZtickyCoinZ';


class StatsPage extends React.PureComponent {
  /**
   * when initial state username is not null, submit the form to load repos
   */
   constructor(props, context) {
    super(props);
    this.state={reload:false};
    this.stats={
      _nStickers:0,
      _nStickersPerPack: 0,
      _packPrice: 0,
      _ethReceived: 0,
      _mintedCoins: 0,
      _burntCoins: 0,
      _nStickersInCirculation: 0,
      _stnDistribution: [],
      _nextStnGenReward: [],
      _rewardedUsers: [],
      _rewardedEth: [],
      _rewardedCoinBurnt: []
    };
    this.contractBalance=0;
    this.balance=0;
    this.reward={_eth:0,_tips:0};
    this.coinToBurn=0;
    this.web3=web3;
    this.refresh();
  }

  instantiateContracts = () =>{
    if (this.loaded) return Promise.resolve();
    return ZtickerZ.deployed()
    .then((r)=>this.ZtickerZ=r)
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
  reRender=()=>{
    this.setState({reload:!this.state.reload});
  }
  refresh = ()=>{
    this.instantiateContracts()
    .then(r=>this.ZtickerZ.getAlbumStats(0))
    .then(r=>getAlbumStats(r))
    .then(r=>this.stats=r)
    .then(r=> this.ZtickyCoinZ.balanceOf(this.account))
    .then(r=> this.balance=toZCZ(r))
    .then(r=> this.coinToBurn=this.balance)
    .then(r=>this.web3.eth.getBalance(this.ZtickerZ.address,(e,r)=>{
      return new Promise(function(resolve,reject){
        if(e)return reject(e);
        this.contractBalance=toZCZ(r)
        resolve(this.contractBalance);
      }.bind(this))
    }))
    .then(r=>this.reRender());
  }
  computeFinalReward=(e)=>{
    this.coinToBurn=e.target.value;
    if(!this.coinToBurn)this.coinToBurn=0;
    this.ZtickerZ.computeAlbumReward(0, fromZCZ(this.coinToBurn))
    .then(r=>this.reward=computeAlbumReward(r))
    .then(r=>this.reRender());
  }
  componentDidMount() { }
  render() {
    return (
      <div>
        <Container className="text-left">
          <Row>
            <Col xs="8">
            <h2>Stickers Statistics</h2>
            <p>This is just a bit of stats about the stickers supply to make everything more transparent and clear to anyone</p>
            <Table size="sm">
              <thead>
                <tr>
                  <th style={{width:'10%'}}>Sticker</th>
                  <th>#</th>
                  <th>Supply</th>
                  <th>Supply(%)</th>
                  <th>Next coin reward</th>
                </tr>
              </thead>
              <tbody>
                {this.stats._stnDistribution.map((e,idx)=>
                  <tr key={idx}>
                    <td><img width="40%" src={stns[idx]}/></td>
                    <th scope="row">{idx}</th>
                    <td>{e}</td>
                    <td>{(e*100/this.stats._nStickersInCirculation).toFixed(2)} %</td>
                    <td>{toZCZ(this.stats._nextStnGenReward[idx]).toFixed(2)} <strong>ZCZ</strong></td>
                  </tr>
                )}

              </tbody>
            </Table>
            </Col>
            <Col xs="4">
              <h2>Album Statistics</h2>
              <p>A bit of detail for the coin generation</p>
              <ul className="flex-column" size="sm">
                <li><p> Number of stickers in the album: {this.stats._nStickers} </p></li>
                <li><p> Stickers per pack: {this.stats._nStickersPerPack} </p></li>
                <li><p> Pack price:  {toZCZ(this.stats._packPrice).toFixed(5)} <strong>ETH</strong></p></li>
                <li><p> Total stickers supply: {this.stats._nStickersInCirculation} </p></li>
                <li><p> Total ETH received: {toZCZ(this.stats._ethReceived).toFixed(5)} <strong>ETH</strong></p></li>
                <li><p> Current ETH contract balance: {this.contractBalance.toFixed(5)} <strong>ETH</strong></p></li>
                <li><p> Total minted coins: {toZCZ(this.stats._mintedCoins).toFixed(3)} <strong>ZCZ</strong></p></li>
                <li><p> Coin successfully burnt: {toZCZ(this.stats._burntCoins).toFixed(3)} <strong>ZCZ</strong></p></li>
              </ul>
              <h2>Album completed?</h2>
              <p>Calculate your expected ETH reward by specifying the amount of <strong>ZCZ</strong> you would like to burn.</p>
              <p>Your current balance: {this.balance.toFixed(3)} <strong>ZCZ</strong></p>
              <InputGroup size="sm">
                <Input placeholder="Coin to burn..." type="number" step="0.1" onChange={this.computeFinalReward}/>
                <InputGroupAddon addonType="append">
                  <InputGroupText><strong>ZCZ</strong></InputGroupText>
                </InputGroupAddon>
              </InputGroup>
              <p><strong>Your expected reward: {this.reward._eth.toFixed(5)} ETH</strong></p>
              <small>Expected tips: {this.reward._tips.toFixed(5)} <strong>ETH</strong></small>
              <h2 className="mt-5">Users Leaderboard</h2>
              <p>Total completed albums:{this.stats._rewardedUsers.length}</p>
              <Table size="sm">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>User</th>
                  </tr>
                </thead>
                <tbody>
                  {this.stats._rewardedUsers.map((e,idx)=>{
                    return (
                      <tr key={idx}>
                        <th scope="row">{idx + 1}</th>
                        <td >{e}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </Table>
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

StatsPage.contextTypes = {
  drizzle: PropTypes.object
}
const StatsContainer = drizzleConnect(StatsPage, mapStateToProps);
export default StatsContainer;
