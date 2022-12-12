import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/Loginpage';
import SigninPage from './pages/SigninPage';
import AnalyticsPage from './pages/AnalyticsPage';
import MoneyPage from './pages/MoneyPage';
import NotificationsPage from './pages/NotificationsPage';
import SettingsPage from './pages/SettingsPage';
import Backdrop from './components/Backdrop';
import MenuLaterale from './components/MenuLaterale';
import LandingPage from './pages/LandingPage';

// App
// Il componente che viene renderizzato da index
// Qua viene gestito tutto:
// - si imposta il routing
// - si definiscono le funzioni da passare alle pagine per la gestione dei vari eventi
// - si gestisce lo stato della pagina
// - si richiamano selettivamente i componenti da renderizzare

class App extends React.Component {
  constructor(){
    super();
    this.state={
      menuAperto: false,
      logged: false,
    }
    this.gestoreLogin=this.gestoreLogin.bind(this);
    this.gestoreSignin=this.gestoreSignin.bind(this);
    this.logout=this.logout.bind(this);
  }

  //metodo logout: imposta lo stato su non loggato
  logout(){
    fetch('${window.location.origin/api/logout',
    {
      method: 'POST',
      headers: {'Authorisation': "Bearer TOKEN"},
      body: null, //da sostituire
    })
    this.setState({logged:false,});
  }

  //metodo gestoreLogin: da passare alla pagina di login per gestire l'accesso
  //invia una richiesta al server
  //riceve come parametro un evento automaticamente generato dal submit
  async gestoreLogin(event) {
    event.preventDefault();
    const log= new FormData(document.getElementById('login'));
    
    const response=await fetch('${window.location.origin}/api/login', { method: 'POST', body: new FormData(document.getElementById('login')), } );
    console.log(response);
    this.setState({logged:true,});
  }

  //metodo gestoreLogin: da passare alla pagina di registrazione per gestire la medesima
  //invia una richiesta al server
  //riceve come parametro un evento automaticamente generato dal submit
  async gestoreSignin(event) {
    event.preventDefault();
    const dati=new FormData(document.getElementById('sign-in'));
    if( dati.get('password') !== dati.get('password2') ) {
      return alert("Le password non corrispondono");
    } else {
      const response= await fetch('${window.location.origin}/api/register', { method: 'POST', body: dati,})
      console.log(response);
    }
    this.setState({logged: true,});
  }

  gestoreSoldi(event){
    event.preventDefault();
  }

  render(){
    return (
      <Routes>
        <Route exact path='/' element={<LandingPage />} />
        <Route exact path='/login' element={
          this.state.logged ? <Navigate to='/app/analytics' replace /> : <LoginPage onLogin={this.gestoreLogin} onLogout={this.logout} /> 
        } />
        <Route exact path='/sign-in' element={ this.state.logged ? <Navigate to='/app/analytics' replace /> :
          <SigninPage onSignin={this.gestoreSignin}/> }/>
          <Route exact path='/app/analytics' element={
            <div>
              <AnalyticsPage apriMenu={ ()=>{this.setState({menuAperto: true});} } />
              {this.state.menuAperto?
                <Backdrop onClick={()=>{
                  this.setState({menuAperto: false})
                }} />
              : null}
              {this.state.menuAperto? <MenuLaterale onClick={ ()=>this.setState({menuAperto: false}) } />: null}
            </div>
          } />
          <Route exact path='/app/money' element={
            <div>
              <MoneyPage onTransaction={this.gestoreSoldi} apriMenu={ ()=>{this.setState({menuAperto: true})} } />
              {this.state.menuAperto?
                <Backdrop onClick={()=>{
                  this.setState({menuAperto: false})
                }} />
              : null}
              {this.state.menuAperto? <MenuLaterale onClick={ ()=>this.setState({menuAperto: false}) } />: null}
            </div>
          } />
          <Route exact path='/app/notifications' element={
            <div>
              <NotificationsPage  apriMenu={ ()=>{this.setState({menuAperto: true})} } />
              {this.state.menuAperto?
                <Backdrop onClick={()=>{
                  this.setState({menuAperto: false})
                }}/>
              : null}
              {this.state.menuAperto? <MenuLaterale onClick={ ()=>this.setState({menuAperto: false}) } />: null}
            </div>
          } />
          <Route exact path='/app/settings' element={
            <div>
              <SettingsPage  apriMenu={ ()=>{this.setState({menuAperto: true})} } />
              {this.state.menuAperto?
                <Backdrop onClick={()=>{
                  this.setState({menuAperto: false})
                }}/>
              : null}
              {this.state.menuAperto? <MenuLaterale onClick={ ()=>this.setState({menuAperto: false}) } />: null}
            </div>
          } />
      </Routes>
    );
  }
}

export default App;