/*
 * AboutPage
 */

import React from 'react';
import { AccountData, ContractData, ContractForm } from 'drizzle-react-components';
import { drizzleConnect } from 'drizzle-react';
import PropTypes from 'prop-types';
import { ListGroup, ListGroupItem, Container, Row, Col } from 'reactstrap';




class AboutPage extends React.PureComponent {
  /**
   * when initial state username is not null, submit the form to load repos
   */
   constructor(props, context) {
    super(props);
    this.contracts = context.drizzle.contracts
  }
  componentDidMount() { }
  render() {
    return (
      <Container>
        <h2>Need help to play?</h2>
        <p>Don''t worry this game is actually pretty simple.</p>
        <p>Here are the rules:</p>
        <h3>1. Buy a sticker pack</h3>
        <p>Go to your album section and click on the button <strong>Buy a Pack</strong>.
          <br/>
          This will trigger a transaction that needs to be approved from Metamask.
          <br/> Once the transaction gets executed you will receive a set of stickers depending on the pack size
          and a handful of awesome <strong> ZtickyCoinZ </strong> or also <strong> ZCZ</strong>.
          <br/>
          <br/>
          Yeah!! You heard correctly! It is real coins, an ERC20 type of token and its minting is based on
          the Proof-Of-Unwrap paradigm which generates coins based on the successful unwrap of a sticker pack!
          <br/>
          Be careful that the token generation is directly dependent on the rarity of the stickers you have just unwrapped.
          The more a sticker is rare, the more coins it will generate!
          <br/>
          The rarity is dinamically adjusted as stickers are generated.
          So you can check the expected coin reward in the <strong> <a href="/stats">Statistics</a></strong> section.
          <br/>
          Beware the sticker pack has a fixed price! So <strong> do not try to change the value
          or your transaction will fail </strong>.
        </p>
        <br/>
        <h3>2. Collect your stickers </h3>
        <p> Once you have bought a pack you will see your first stickers in
          <strong> <a href="/album">My Album</a></strong> section.
          <br/>
          The goal is to complete the album. There are N different stickers in the album.
          <br/>
          <br/>
          <strong>You gotta catch''em all!!</strong>
          <br/>
          At the end you will get a nice ETH reward! Stay tuned and...
          <br/>
          <br/>
          <strong>Enjoy your collection!</strong>
        </p>
        <br/>
        <h3>3. Trade your stickers </h3>
        <p> Yes! In  <strong><a href="/album">My Album</a></strong> in you can directly sell your stickers
          by specifying your price in <strong>ZCZ</strong>!
          <br/>So you might be wondering now:
          <br/><strong>Does it mean I can really buy my missing stickers from others??</strong>

          <br/>Pretty cool eh...!! Isn''t? Yeah! If you head over to the
          <strong> <a href="/market">MarketPlace</a></strong> section you will find all the stickers in sale from other users.
          <br/>There you simply need to have enough balance in <strong>ZCZ</strong> to buy a sticker and click on the BUY button
          under your favourite sticker. This will trigger yet another Metamask tranasaction that needs your approval.
          <br/>
          Once the transaction succeed you will see your new sticker back in  <strong><a href="/album">My Album</a></strong> section.
          <br/>
          <br/>
          <strong>Have a good trading!</strong>
        </p>
        <h3>4. Get your final reward </h3>
        <p><strong> Pay attention!</strong>
          This is where the game gets interesting!
          <br/>
          Once you have completed your album the button <button className="btn btn-sm btn-success">Redeem your reward!</button> will appear
          in the <strong><a href="/album">My Album</a></strong> section.
          That means you can now finally get your ETH reward.
          <br/>
          What you have to do is simply specifying the amount of <strong>ZCZ</strong> you want to burn click on the button and approve the Metamask transaction.
          <br/> <strong><i>"Wait!! What??!! Do I have to burn my ZCZ coins?"</i></strong>
          <br/>
          <br/>
          <i>...take a deep breath...</i>
          <br/>
          <br/>
          <strong><i>Yes!</i> And that''s the most interesting part of the game!</strong>
          <br/>
          Actually your ETH reward is directly dependent on the amount of <strong>ZCZ</strong> you will be burning with a non-linear relationship.
          <br/>
          <br/> <strong><i>"What does a non-linear relationship even means??!!?"</i></strong>
          <br/>And that has a  simple answer...
          <br/>The more ZCZ coins you burn <strong>way much much greater</strong> will be your ETH reward!
          <br/>To be more precise your reward will depend on these two parameters that are calculated based on your amount of coins to burn:
          <br/>
          <br/><span>1. A <i>velocity ratio</i>: This tell us the speed you took to complete the album compared to other players.</span>
          <br/><span>2. A <i>total supply ratio</i>: This tell us the amount of coins you will burn compared to the total market cap of ZCZ.</span>
          <br/>
          The greater is the value of this parameters the higher will be your reward.
          <br/>
          <br/><strong>Translated:</strong>
          <br/>That means hurry up!!!
          <br/>Complete the album soon enough and do not forget not to waste all your ZCZ in buying stickers because you will need those.
          <br/>The more <strong>ZCZ</strong> coins you collect much higher will be your final ETH reward!
          <br/>
          <br/>
          <strong>Enjoy the extreme collection!</strong>
        </p>
      </Container>
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

AboutPage.contextTypes = {
  drizzle: PropTypes.object
}
const AboutContainer = drizzleConnect(AboutPage, mapStateToProps);
export default AboutContainer;
