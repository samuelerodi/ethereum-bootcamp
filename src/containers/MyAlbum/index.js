/*
 * AboutPage
 */

import React from 'react';
import {
  // AccountData,
  // ContractData,
  // ContractForm
} from 'drizzle-react-components';
import { drizzleConnect } from 'drizzle-react';
import PropTypes from 'prop-types';
import { Container, Row, Col, Button, Input, InputGroup, InputGroupAddon, InputGroupText } from 'reactstrap';
import {Sticker, StickerSm} from '../../components/Sticker';

import ZtickerZ from '../../instances/ZtickerZ';
import ZtickyZtorage from '../../instances/ZtickyZtorage';
import ZtickyCoinZ from '../../instances/ZtickyCoinZ';

import web3 from '../../config/web3';
import {album, getStickersOf, getStickersDetails, computeAlbumReward} from '../../utils/ZtickerZ';
import {fromZCZ, toZCZ} from '../../utils/ZtickyCoinZ';


class MyAlbumPage extends React.PureComponent {
  /**
   * when initial state username is not null, submit the form to load repos
   */
   constructor(props, context) {
    super(props);
    this.state={
      reload:false
    }
    this.missing=[];
    this.stickers={
        _stn:[],
        _sId:[],
        _onSale:[],
        _onSalePrice:[]
      };
    this.ids=[];
    this.balance=0;
    this.album={};
    this.coinToBurn=0;
    this.reward={_eth:0,_tips:0};
    this.web3=web3;

    this.instantiateContracts()
    .then(()=> this.ZtickerZ.albums(0))
    .then(r => this.album=album(r));
    //INIT
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
  reRender=()=>{
    this.setState({reload:!this.state.reload});
  }
  refresh = ()=>{
    this.instantiateContracts()
    .then(r=>this.ZtickyZtorage.getStickersOf(this.account))
    .then(r=>this.ids=getStickersOf(r))
    .then(r=>this.ZtickerZ.getStickersDetails(this.ids))
    .then(r=>this.stickers=getStickersDetails(r))
    .then(r=>{
      var missing=[];
      for (var i=0;i<this.album.nStickers; i++){
        if(!this.stickers._stn.includes(i.toString())) missing.push(i);
      }
      this.missing=missing;
    })
    .then(r=> this.ZtickyCoinZ.balanceOf(this.account))
    .then(r=> this.balance=toZCZ(r))
    .then(r=>this.reRender());
  }
  buyNewPack = ()=> {
    this.ZtickerZ.unwrapStickerPack(0, {
      from: this.account,
      value:this.album.packPrice,
      gas: 1500000,
      gasPrice: 4000000000
    })
    .then(()=>this.refresh());
  }
  computeFinalReward=(e)=>{
    this.coinToBurn=e.target.value;
    if(!this.coinToBurn)this.coinToBurn=0;
    this.reRender();
    this.ZtickerZ.computeAlbumReward(0, fromZCZ(this.coinToBurn))
    .then(r=>this.reward=computeAlbumReward(r))
    .then(r=>this.reRender());
  }
  redeemAlbumReward = ()=> {
    if(!this.coinToBurn) return;
    if(this.coinToBurn>this.balance) return;
    this.ZtickerZ.redeemReward(0, fromZCZ(this.coinToBurn), {
      from: this.account,
      gas: 1500000,
      gasPrice: 4000000000
    })
    .then(()=>this.refresh());
  }

  componentDidMount() { }

  render() {
    let missing = (
      <div>
        <li>
          <p><strong> Missing stickers:</strong> {this.missing.length}</p>
        </li>
        <Row>
        {this.missing.map(i=>{
          return (<Col xs="6" key={'missing_' + i}>
              <StickerSm stn={i}></StickerSm>
            </Col>)
        })}
        </Row>
      </div>
    )
    let warning=(<div></div>);
    let redeemable = (<div></div>);
    if (!this.missing.length && this.ids.length){
      if (this.coinToBurn>this.balance) warning=(<p className="text-danger">Your specified amount exceed your <strong>ZCZ</strong> balance</p>);
      redeemable = (
        <div className="mt-5">
          <h2 className="text-success">Great! You have completed the album!</h2>
          <h3>Claim your <strong>ETH</strong> reward now!</h3>
          <p>You will simply need to specify an amount of <strong>ZCZ</strong> you would like to burn and burn it!</p>
          <small><i>Beware... the more <strong>ZCZ</strong> you burn, exponentially greater your <strong>ETH</strong> reward will be</i></small>
          <InputGroup size="sm">
            <Input placeholder="Coin to burn..." type="number" step="0.1" onChange={this.computeFinalReward}/>
            <InputGroupAddon addonType="append">
              <InputGroupText><strong>ZCZ</strong></InputGroupText>
            </InputGroupAddon>
          </InputGroup>
          {warning}
          <p><strong>Expected reward: {this.reward._eth.toFixed(5)} ETH</strong></p>
          <small>Expected tips: {this.reward._tips.toFixed(5)} <strong>ETH</strong></small>
          <Button className="btn btn-success" onClick={this.redeemAlbumReward} disabled={this.coinToBurn>this.balance}>Redeem and Burn!</Button>
        </div>
      );
      missing = (<div></div>);
    }
    return (
      <div className="mt-5">
        <Container className="text-left">
          <Row>
            <aside className="border col-md-9 order-md-1">
              <h2>My Album</h2>
              <p>Here you can find all your stickers!</p>
              <div className="border-top">
                <Row>
                  {this.ids.map((el,idx)=>{
                    return (<Col xs="3" key={el}>
                      <Sticker
                                ac={this.ZtickyZtorage}
                                cc={this.ZtickyCoinZ}
                                zz={this.ZtickerZ}
                                account={this.account}
                                stn={this.stickers._stn[idx]}
                                stickerId={el}
                                onSale={this.stickers._onSale[idx]}
                                price={this.stickers._onSalePrice[idx]}
                                refresh={this.refresh}></Sticker>
                    </Col>)
                  })}
                </Row>
              </div>
            </aside>
            <main className="col-md-3 order-md-2">
              <h2>Buy a new Pack</h2>
              <p>Start off by buying a new sticker pack!</p>
              <Button className="btn btn-success" onClick={this.buyNewPack}>Buy a Zticker Pack</Button>
              <h2 className="mt-5">My Collection</h2>
              <p>This is a recap of your collection</p>
              <ul className="flex-column">
                <li>
                  <p><strong> Number of stickers in the album:</strong> {this.album.nStickers} </p>
                </li>
                <li>
                  <p><strong> Total collected stickers:</strong> {this.album.nStickers - this.missing.length} </p>
                </li>
                <li>
                  <p><strong> Your balance:</strong> {parseFloat(this.balance).toFixed(3)} <strong>ZCZ</strong> </p>
                </li>
                {missing}
              </ul>
              {redeemable}
            </main>
            </Row>
        </Container>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    accounts: state.accounts,
    ZtickyZtorage: state.contracts.ZtickyZtorage,
    ZtickyCoinZ: state.contracts.ZtickyCoinZ,
    ZtickerZ: state.contracts.ZtickerZ,
    drizzleStatus: state.drizzleStatus
  }
}

MyAlbumPage.contextTypes = {
  drizzle: PropTypes.object
}
const MyAlbumContainer = drizzleConnect(MyAlbumPage, mapStateToProps);
export default MyAlbumContainer;
