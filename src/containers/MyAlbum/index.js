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
import { Container, Row, Col, Button } from 'reactstrap';
import {Sticker, StickerSm} from '../../components/Sticker';

import ZtickerZ from '../../instances/ZtickerZ';
import ZtickyZtorage from '../../instances/ZtickyZtorage';
import ZtickyCoinZ from '../../instances/ZtickyCoinZ';

import web3 from '../../config/web3';
import {album, getStickersOf, getStickersDetails} from '../../utils/ZtickerZ';
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

  componentDidMount() { }

  render() {
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
              </ul>
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
