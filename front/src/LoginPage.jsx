import React, { useCallback } from 'react';
// import ReactDOM from 'react-dom';
import Particles from "react-particles";
import { loadFull } from "tsparticles";
import logo from './assets/images/logo.svg';
import './styles/LoginPage.css';
import particlesOptions from "./assets/particles/particles.json";

// const { Component } = React

function LoginPage() {
    const particlesInit = useCallback(main => {
        loadFull(main);
    }, [])

    return (
        <div className="LoginPage">
            <Particles options={particlesOptions} init={particlesInit}/>
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo"/>
            </header>
        </div>
    );
}

// LOGIN COMPONENT PROGRESS...

// class EntryPage extends Component {
//   constructor(props){
//     super(props)
//     this.state = {
//       currentView: "signUp"
//     }
//   }

//   changeView = (view) => {
//     this.setState({
//       currentView: view
//     })
//   }

//   currentView = () => {
//     switch(this.state.currentView) {
//       case "signUp":
//         return (
//           <form>
//             <h2>Sign Up!</h2>
//             <fieldset>
//               <legend>Create Account</legend>
//               <ul>
//                 <li>
//                   <label for="username">Username:</label>
//                   <input type="text" id="username" required/>
//                 </li>
//                 <li>
//                   <label for="email">Email:</label>
//                   <input type="email" id="email" required/>
//                 </li>
//                 <li>
//                   <label for="password">Password:</label>
//                   <input type="password" id="password" required/>
//                 </li>
//               </ul>
//             </fieldset>
//             <button>Submit</button>
//             <button type="button" onClick={ () => this.changeView("logIn")}>Have an Account?</button>
//           </form>
//         )
//         break
//       case "logIn":
//         return (
//           <form>
//             <h2>Welcome Back!</h2>
//             <fieldset>
//               <legend>Log In</legend>
//               <ul>
//                 <li>
//                   <label for="username">Username:</label>
//                   <input type="text" id="username" required/>
//                 </li>
//                 <li>
//                   <label for="password">Password:</label>
//                   <input type="password" id="password" required/>
//                 </li>
//                 <li>
//                   <i/>
//                   <a onClick={ () => this.changeView("PWReset")} href="#">Forgot Password?</a>
//                 </li>
//               </ul>
//             </fieldset>
//             <button>Login</button>
//             <button type="button" onClick={ () => this.changeView("signUp")}>Create an Account</button>
//           </form>
//         )
//         break
//       case "PWReset":
//         return (
//           <form>
//           <h2>Reset Password</h2>
//           <fieldset>
//             <legend>Password Reset</legend>
//             <ul>
//               <li>
//                 <em>A reset link will be sent to your inbox!</em>
//               </li>
//               <li>
//                 <label for="email">Email:</label>
//                 <input type="email" id="email" required/>
//               </li>
//             </ul>
//           </fieldset>
//           <button>Send Reset Link</button>
//           <button type="button" onClick={ () => this.changeView("logIn")}>Go Back</button>
//         </form>
//         )
//       default:
//         break
//     }
//   }


//   render() {
//     return (
//       <section id="entry-page">
//         {this.currentView()}
//       </section>
//     )
//   }
// }


export default LoginPage;

// ReactDOM.render(<EntryPage/>, document.getElementById("app"))
