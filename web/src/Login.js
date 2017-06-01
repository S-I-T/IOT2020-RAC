import React, { Component } from 'react';
import { withRouter } from 'react-router'
import {Card,CardHeader,CardText,CardActions} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

import logo from './images/logo.png'
import Auth from './utils/Auth'

const style = {
  container:{
    position:"absolute",
    top:"50%",
    width:"100%",
    marginTop:"-115px"
  },
  login:{
    width: "90%",
    maxWidth: "400px",
    marginLeft:"auto",
    marginRight:"auto"
  },
  title:{
    fontSize:"22px",
    paddingTop:"0px"
  }
};

class Login extends Component {
    constructor(props) {
      super(props);
      this.state = {email: "",pass:"",error:""};

      this.handleEmailChange = this.handleEmailChange.bind(this);
      this.handlePassChange  = this.handlePassChange.bind(this);
      this.handleSubmit      = this.handleSubmit.bind(this);
    }

    handleEmailChange(event) {
      this.setState({email: event.target.value});
    }

    handlePassChange(event) {
      this.setState({pass: event.target.value});
    }

    handleSubmit(event) {
      event.preventDefault()

      const email = this.state.email
      const pass = this.state.pass

      Auth.login(email, pass, (loggedIn,error) => {
        if (!loggedIn){
            console.log(error)
            return this.setState({ error: error.message})
        }

        const { location } = this.props

        if (location.state && location.state.nextPathname) {
          this.props.router.replace(location.state.nextPathname)
        } else {
          this.props.router.replace('/')
        }
      })
    }

    render() {
      return (
        <div style={style.container}>

          <Card style={style.login}>
            <CardHeader
              title="IOT2020"
              subtitle="Realtime Access Control"
              avatar={logo}
              titleStyle={style.title}
            />
            <CardText>
                <form onSubmit={this.handleSubmit}>
                  <TextField type="text" value={this.state.email} hintText="Email" onChange={this.handleEmailChange} fullWidth={true}/>
                  <TextField type="password" value={this.state.pass} hintText="Clave" onChange={this.handlePassChange} fullWidth={true} errorText={this.state.error}/>
                </form>
            </CardText>

            <CardActions style={{textAlign:'center'}}>
                <RaisedButton type="submit" primary={true} onClick={this.handleSubmit} label="Enter"/>
           </CardActions>
         </Card>

        </div>
      )
    }
}

export default withRouter(Login);
