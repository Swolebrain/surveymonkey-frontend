import React, {Component} from "react";
import PropTypes from "prop-types";
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import styles from "./TextSummaryPanel.style";

export default class TextSummaryPanel extends Component{
  constructor(props){
    super(props);
  }

  computeNumbers(){
    //qid: 983923296: "How satisfied are you with your course? (Que satisfecho estas con este curso/clase)"
    if (!this.props.surveyResults) return "-";
    let answerValues = {
      10360991410: 5, //fully
      10360991411: 4, //mostly
      10360991412: 3, //mildly
      10360991413: 2, //barely
      10360991414: 1 //not at all
    };
    let satisfactionAnswers = [];
    let recommendAnswers = [];
    this.props.surveyResults.forEach(survey=>{
      if (survey.answers && survey.answers["983923296"])
        satisfactionAnswers.push(survey.answers["983923296"]);
      if (survey.answers && survey.answers["1056576059"])
        recommendAnswers.push(survey.answers["1056576059"]);
    });
    // console.log(satisfactionAnswers);
    let avg = satisfactionAnswers.reduce((acc,answer)=>acc+answerValues[answer.ansID], 0);
    let totalRecommendations = 0 + recommendAnswers.filter(ans=>ans.answer.toLowerCase()==="yes").length;
    return {
      averageSatisfaction: ""+Math.round(avg*1000/satisfactionAnswers.length)/1000,
      averageSatisfactionLength: ""+satisfactionAnswers.length,
      percentWouldRecommend: ""+Math.round(totalRecommendations*10000/recommendAnswers.length)/100 + "%",
      percentWouldRecommendLength: "" + recommendAnswers.length,
      totalResponses: "" + this.props.surveyResults.length
    }
  }
  render(){
    let stats = this.computeNumbers();
    return (
      <Card>
        <CardHeader
          title="Numbers At a Glance"
          subtitle={this.props.subtitle}
          actAsExpander={false}
          showExpandableButton={false}
        />
        <CardText>
          <div style={styles.figureContainer}>
            <span style={styles.figCaption}>Avg Satisfaction:</span>
            <span style={styles.figNumber}>{stats.averageSatisfaction}</span>
          </div>
          <div style={styles.figureContainer}>
            <span style={styles.figCaption}>Responses:</span>
            <span style={styles.figNumber}>{stats.averageSatisfactionLength}</span>
          </div>
          <div style={styles.figureContainer}>
            <span style={styles.figCaption}>% would refer:</span>
            <span style={styles.figNumber}>{stats.percentWouldRecommend}</span>
          </div>
          <div style={styles.figureContainer}>
            <span style={styles.figCaption}>Responses:</span>
            <span style={styles.figNumber}>{stats.percentWouldRecommendLength}</span>
          </div>
          <div style={styles.figureContainer}>
            <span style={styles.figCaption}>Total Surveys</span>
            <span style={styles.figNumber}>{stats.totalResponses}</span>
          </div>
        </CardText>
      </Card>
    );
  }
}
