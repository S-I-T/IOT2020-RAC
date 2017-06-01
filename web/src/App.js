import React, { Component } from 'react';
import { withRouter } from 'react-router'
import AppBar from 'material-ui/AppBar';
import Paper from 'material-ui/Paper';
import {Table,TableBody,TableHeader,TableHeaderColumn,TableRow,TableRowColumn} from 'material-ui/Table';
import Avatar from 'material-ui/Avatar';
import IconButton from 'material-ui/IconButton';
import SvgIconAccount from 'material-ui/svg-icons/action/account-circle';
import SvgIconLogout from 'material-ui/svg-icons/action/power-settings-new';
import RefreshIndicator from 'material-ui/RefreshIndicator';
import Snackbar from 'material-ui/Snackbar';
import * as firebase from 'firebase';

import Auth from './utils/Auth'
import logo from './images/logo.png'
import {fullWhite} from 'material-ui/styles/colors';

const MAX_ACCESS = 100
const style = {
  container:{
    position: 'relative'
  },
  title:{
    height:"20px"
  },
  subtitle:{
    fontSize:"12px"
  },
  searchHint:{
    color:"#eeeeee"
  },
  refresh: {
    marginLeft: '50%',
    marginTop: '30%'
  },
  content:{
    margin:"30px"
  },
  photoRow:{
    width:"30px"
  },
  snackbar:{
    width:"95%",
    maxWidth:"500px"
  }
};


class App extends Component {
  constructor(props){
    super(props);
    this.usersRef = null
    this.accessRef = null
    this.users  = {}
    this.access = []
    this.state = {refreshStatus:"loading",
                  notificationsActive:true,
                  showSnackbar:false,
                  snackbarMessage:"",
                  accessList:[]}

    Auth.onChange = (logged)=>{
        if(!logged){
          this.props.router.replace('/login')
        }
    };
  }
  //Events
  componentDidMount(){
    this.startGettingUsers()
    this.startGettingAccess()
    this.setState({refreshStatus:"hide"})
  }
  componentWillUnmount(){
    this.stopGettingUsers()
    this.stopGettingAccess()
  }

  startGettingUsers(){
    this.usersRef = firebase.database().ref().child('users')
    this.usersRef.on('child_added', this.updateUser.bind(this))
    this.usersRef.on('child_changed',this.updateUser.bind(this))
    this.usersRef.on('child_removed', this.deleteUser.bind(this))
  }
  stopGettingUsers(){
    this.usersRef.off()
  }

  startGettingAccess(){
    this.accessRef = firebase.database().ref().child('access').limitToLast(MAX_ACCESS)
    this.accessRef.on('child_added', this.addAccess.bind(this));
  }
  stopGettingAccess(){
    this.accessRef.off()
  }

  updateUser(data){
    this.users[data.key] = data.val()
  }
  deleteUser(data){
    this.users[data.key] = null
  }
  addAccess(data){
    let access = data.val()
    access.key = data.key
    if(this.users[access.U_id]){
      access.name = this.users[access.U_id].name
      access.photo = this.users[access.U_id].photo
    }
    else{
      access.name = "NN"
      access.photo = null
    }
    access.date= this.formatDate(new Date(access.date))
    this.access.push(access)
    console.log(this.access)
    this.setState({accessList:this.access})
  }

  formatDate(d){
    return ("0" + d.getDate()).slice(-2) + "-" +
           ("0"+(d.getMonth()+1)).slice(-2) + "-" +
           d.getFullYear() + " " +
           ("0" + d.getHours()).slice(-2) + ":" +
           ("0" + d.getMinutes()).slice(-2) + ":" +
           ("0" + d.getSeconds()).slice(-2)

  }

  showMessage(message){
    console.log("showMessage",message)
    this.setState({showSnackbar:true,snackbarMessage:message})
  }

  //_____________________________________
  //User handler
  logout(event){
      event.preventDefault()
      Auth.logout();
  }

  render() {
    const appBarElementsRight = <div>
                                  <IconButton onClick={this.logout.bind(this)}><SvgIconLogout color={fullWhite}/></IconButton>
                                </div>
    return (
      <div style={style.container}>
        <AppBar
          title={<div><div style={style.title}>IOT2020</div><div  style={style.subtitle}>Realtime Access Control</div></div>}
          iconElementLeft={<img src={logo} alt={"logo"}/>}
          iconElementRight={appBarElementsRight}
          zDepth={2}
        />

        <RefreshIndicator
          size={50}
          left={-25}
          top={-25}
          status={this.state.refreshStatus}
          style={style.refresh}
        />
        <Paper style={style.content} zDepth={1}>
        <Table>
          <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
            <TableRow>
              <TableHeaderColumn style={style.photoRow}></TableHeaderColumn>
              <TableHeaderColumn>Name</TableHeaderColumn>
              <TableHeaderColumn>Date</TableHeaderColumn>
              <TableHeaderColumn>Device</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody displayRowCheckbox={false}>
            {this.state.accessList.map((item, i)=>{
              return <TableRow key={item.key}>
                <TableRowColumn style={style.photoRow}>{item.photo?<Avatar src={item.photo}/>:<Avatar icon={<SvgIconAccount />}/>}</TableRowColumn>
                <TableRowColumn>{item.name}</TableRowColumn>
                <TableRowColumn>{item.date}</TableRowColumn>
                <TableRowColumn>{item.dev_id}</TableRowColumn>
              </TableRow>
            })}
            </TableBody>
          </Table>
        </Paper>

        <Snackbar
          open={this.state.showSnackbar}
          message={this.state.snackbarMessage}
          autoHideDuration={3000}
          onRequestClose={ (reason)=>{this.setState({showSnackbar:false})} }
          bodyStyle={style.snackbar}
        />

      </div>
    );
  }
}

export default withRouter(App);
