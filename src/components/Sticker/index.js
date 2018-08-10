import React from 'react';
import logo from '../../assets/logo.svg';
import './component.css';
/* eslint-disable react/prefer-stateless-function */

import { Card, CardImg, CardBody, CardTitle, CardSubtitle, Button } from 'reactstrap';

export default class Sticker extends React.Component {
  constructor(){
    super()
  }
  render() {
    return (
      <div>
      <Card>
        <CardImg top width="100%" src="https://placeholdit.imgix.net/~text?txtsize=33&txt=318%C3%97180&w=318&h=180" alt="Card image cap" />
        <CardBody>
          <CardTitle>Card title</CardTitle>
          <CardSubtitle>Card subtitle</CardSubtitle>
        </CardBody>
      </Card>
    </div>
    );
  }
}
