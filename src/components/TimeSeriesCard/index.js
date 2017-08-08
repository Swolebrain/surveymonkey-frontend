import React, {Component} from "react";
import PropTypes from "prop-types";
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import styles from "./TimeSeriesCard.style";

export default class TimeSeriesCard extends Component{
  constructor(props){
    super(props);
  }
  shouldComponentUpdate(nextProps){
    return nextProps.surveyResults !== null && this.props.surveyResults === null;
  }
  mountGraph(){
    let vis = window.vis;
    var container = document.getElementById("canvas-"+this.props.surveyQuestionID);
    if (container) container.innerHTML = "";
    var items = this.buildDataSet();
    if (items){
      var dataset = new vis.DataSet(items);
      var options = {
        graphHeight: 200,
        dataAxis: {
          left: {
            range: {
              min: this.props.rangeMin,
              max: this.props.rangeMax
            }
          }
        }
      };
      var graph2d = new vis.Graph2d(container, dataset, options);
    }
  }
  buildDataSet(){
    if (!this.props.surveyResults || !this.props.surveyQuestionID || !this.props.answerIDValueMap){
      return null;
    }
    let itemHash = {};
    // console.log(this.props.answerIDValueMap);
    this.props.surveyResults.forEach((survey,idx)=>{
      let surveyDate = new Date(survey.date_created);
      let hashDate = surveyDate.getFullYear()+ "-" + ("0"+(surveyDate.getMonth()+1)).slice(-2);
      let surveyAnswer = survey.answers[this.props.surveyQuestionID];
      // console.log(surveyAnswer);
      if (typeof surveyAnswer == "undefined") return;
      let answerValue = this.props.answerIDValueMap[surveyAnswer.ansID];
      if (typeof answerValue === "undefined") return;
      if (!itemHash[hashDate])
        itemHash[hashDate] = [];
      itemHash[hashDate].push(answerValue);
    });
    // console.log(itemHash);
    let items = [];
    Object.keys(itemHash).sort().forEach(date=>{
      var yVal = itemHash[date].reduce((p,c)=>p+Number(c), 0)/itemHash[date].length;
      // console.log({x: date, y: yVal});
      items.push({x: date, y: yVal, label:{content: Math.round(yVal*100)/100}});
    });
    return items;
  }

  render(){
    this.mountGraph();
    return (
      <Card>
        <CardHeader
          title={this.props.title}
          actAsExpander={false}
          showExpandableButton={false}
        />
        <CardText>
          <div id={"canvas-"+this.props.surveyQuestionID}>

          </div>
        </CardText>
      </Card>
    );
  }
}
