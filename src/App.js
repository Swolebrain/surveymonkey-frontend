import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import NavBar from './components/NavBar';
import TextSummaryPanel from './components/TextSummaryPanel';
import TimeSeriesCard from './components/TimeSeriesCard';
import {API_URI} from './config';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      surveyResults: null,
      dateInterval: 0,
      instructor: 0,
      drawerVisible: false,
      instructorList: {}
    }
    fetch(API_URI+"/surveyresults")
    .then(serverRes=>{
      if (serverRes.status != 200) throw {err: "Error getting surveyresults", serverRes};
      return serverRes.json()
    })
    .then(surveyResults=>{
      console.log("Received survey results from server");
      // console.log(surveyResults);
      this.setState({surveyResults});
    })
  }
  handleTimeChange = (event, index, value) => this.setState({dateInterval: value});
  handleInstructorChange = (event, index, value) => this.setState({instructor: value});
  toggleDrawer = (event, obj) => {
    this.setState({drawerVisible: !this.state.drawerVisible});
  }
  loadInstructors = instructorObj=>{
    this.setState({instructorList: instructorObj})
  }
  getStartDate(){
    if (this.state.dateInterval === 1) return new Date("01-01-"+new Date().getFullYear());
    if (this.state.dateInterval === 2) return computerQuarterByMonth(new Date().getMonth());
    if (this.state.dateInterval === 3) return new Date((new Date().getMonth()+1)+"-01-"+new Date().getFullYear());
    return new Date(0);
    function computerQuarterByMonth(m){
      var qtrNumber = Math.floor(m/3);
      var qtrMonthStart = qtrNumber*3+1;
      var date = new Date(qtrMonthStart+"-01-"+new Date().getFullYear());
      return date;
    }
  }
  applyFilters(){
    let resultsToDisplay = this.state.surveyResults;
    if (this.state.instructor != 0){
      resultsToDisplay = resultsToDisplay.filter((survey, idx)=>{
        if (idx===1) window.survey=survey;
        window.stateInstructor = this.state.instructor;
        return survey.answers &&
              survey.answers["983930695"] &&
              survey.answers["983930695"].ansID===this.state.instructor}
      );
      console.log(resultsToDisplay);
    }
    if (this.state.dateInterval != 0){
      let startDate = this.getStartDate();
      resultsToDisplay = resultsToDisplay.filter((survey, idx)=>new Date(survey.date_created) > startDate);
    }
    return resultsToDisplay;
  }
  getSubtitle(){
    if (!this.state.instructor && !this.state.dateInterval)
      return "Use menu to change time intervals or instructor.";
    let ret = "";
    let dateIntervals = ["All", "YTD", "QTD", "MTD"];
    if (this.state.instructor) ret += "Instructor: "+this.state.instructorList[this.state.instructor]+".";
    if (this.state.dateInterval) ret += "Dates: "+dateIntervals[this.state.dateInterval];
    return ret;
  }
  render() {
    let resultsToDisplay = this.applyFilters();
    return (
      <MuiThemeProvider>
        <div className="App">
          <NavBar dateInterval={this.state.dateInterval} instructor={this.state.instructor}
            instructorList={this.state.instructorList} drawerVisible={this.state.drawerVisible}
            toggleDrawer={this.toggleDrawer} loadInstructors={this.loadInstructors}
            handleTimeChange={this.handleTimeChange} handleInstructorChange={this.handleInstructorChange}/>
          <div className="grid-container">
            <TextSummaryPanel
              subtitle={this.getSubtitle()}
              surveyResults={resultsToDisplay} />
            <TimeSeriesCard surveyResults={resultsToDisplay}
                title="Course Satisfaction Over Time"
              rangeMin={4} rangeMax={5.25}
              surveyQuestionID="983923296" answerIDValueMap={{
                "10360991410": 5, //fully
                "10360991411": 4, //mostly
                "10360991412": 3, //mildly
                "10360991413": 2, //barely
                "10360991414": 1 //not at all
              }}/>
            <TimeSeriesCard surveyResults={resultsToDisplay}
                title="Overall Instructor Effectiveness Over Time"
              rangeMin={1} rangeMax={4.25}
              surveyQuestionID="1056572702" answerIDValueMap={{
                "10872719992": 4, //excellent
                "10872719993": 3, //good
                "10872719994": 2, //average
                "10872719995": 1 //poor
              }}/>
            <TimeSeriesCard surveyResults={resultsToDisplay}
                title="% who would recommend, over time"
              rangeMin={0.7} rangeMax={1.05}
              surveyQuestionID="1056576059" answerIDValueMap={{
                "10872741216": 1, //yes
                "10872741217": 0  //no
              }}/>
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
