import React, {Component} from "react";
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import IconButton from 'material-ui/IconButton';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import FlatButton from 'material-ui/FlatButton';

import styles from './NavBar.style.js';

import {API_URI} from '../../config';

export default class NavBar extends React.Component {
  //dateInterval filter
  //instructor filter
  constructor(props) {
    super(props);

    fetch(API_URI+"/instructors")
    .then(serverRes=>{
      if (serverRes.status != 200) throw {err: "Something went wrong", serverRes};
      return serverRes.json();
    })
    .then(instructorObj=>{
      console.log(instructorObj);
      window.instructors = instructorObj;
      this.props.loadInstructors(instructorObj)
    })
  }


  renderInstructorDropDown = ()=>{
    let inst = this.props.instructorList;
    let menuItems = Object.keys(inst).sort((a,b)=>inst[a].toLowerCase().localeCompare(inst[b].toLowerCase()))
                    .map((k,i)=> (<MenuItem key={k} value={k} primaryText={inst[k]} />))
    return (
      <DropDownMenu value={this.props.instructor} onChange={this.props.handleInstructorChange} >
        <MenuItem value={0} primaryText="All" />
        {menuItems}
      </DropDownMenu>
    )
  }

  render() {
    return (
      <div style={styles.navBarContainer}>
        <AppBar title={<span style={styles.title}>FVI Survey Visualizer</span>}
          onLeftIconButtonTouchTap={this.props.toggleDrawer}
          />
        <Drawer open={this.props.drawerVisible} openSecondary={true} zdepth={4}>
          <div style={styles.drawerPadding} >
            <div style={styles.dropDownLabel}>
              Time Interval:
            </div>
            <DropDownMenu value={this.props.dateInterval} onChange={this.props.handleTimeChange} >
              <MenuItem value={0} primaryText="All Time" />
              <MenuItem value={1} primaryText="YTD" />
              <MenuItem value={2} primaryText="QTD" />
              <MenuItem value={3} primaryText="MTD" />
              <MenuItem value={4} primaryText="Last Month" />
            </DropDownMenu>
          </div>
          <div style={styles.optionsContainer} >
            <div style={styles.dropDownLabel}>
              Instructor:
            </div>
            {this.renderInstructorDropDown()}
          </div>
        </Drawer>
      </div>
    );
  }
}
