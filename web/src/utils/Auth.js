import * as firebase from 'firebase';

module.exports = {
  login(email, pass, cb) {
    cb = arguments[arguments.length - 1]
    if (firebase.auth().currentUser!=null) {
      if (cb){
        cb(true)
      }
      this.onChange(true)
      return
    }
    firebase.auth().signInWithEmailAndPassword(email, pass)
      .then(()=>{
          if (cb){
            cb(true)
          }
          this.onChange(true)
      })
      .catch((error) => {
          if (cb){
            cb(false,error);
          }
          this.onChange(false)
      });
  },

  getToken() {
    return firebase.auth().currentUser.uid
  },

  logout(cb) {
    firebase.auth().signOut().then(()=>{
      if(cb){
        cb()
      }
      this.onChange(false)
    })
  },

  loggedIn() {
    return firebase.auth().currentUser!=null;
  },

  onChange() {}
}
