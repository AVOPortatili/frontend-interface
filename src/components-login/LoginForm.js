import React, { useEffect, useState } from 'react';
import InputField from './InputField';
import SubmitButton from './SubmitButton';
import { Alert } from 'react-bootstrap';

export default function LoginForm(props)  { 
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [buttonDisabled, setButtonDisabled] = useState(true)
  const [loginError, setLoginError] = useState("")


  useEffect(() => {
    if (username==="" || password==="") {
      setButtonDisabled(true)
    } else {
      setButtonDisabled(false)
    }
  }, [username, password])

  const resetForm = () => {
    setUsername("")
    setPassword("")
    setButtonDisabled(false)
  }

  const doLogin = async () => {
    if (username==="" || password==="") {
      return;
    }
    console.log("entrato")
    setButtonDisabled(true)

    try {
      let res = await fetch('http://192.168.1.204:8080/api/login', {
        method: 'post',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: username,
          password: password
        })
      });

      let result = await res.json();
      console.log(result)
      if (result && result.message==="success") {
        console.log("user logged in successfully");
        props.setLogin(username, result.role, result.token)
        setLoginError("")
      } else {
        setLoginError("Utente non trovato o credenziali sbagliate")
        console.log("user login failed");
        resetForm();
      }

    } catch (e) {
      setLoginError("Non è stato possibile contattare il server per il login")
      console.log(e);
      resetForm();
    }
  }

    return (
        <div className='loginForm'>
        <h2 className='loginText'> LOGIN </h2>
            {loginError!=="" && (
            <Alert key="error" variant="danger">
              <div style={{fontSize: 12}}>
                {loginError}
              </div>
            </Alert>) }
            <InputField 
              type = 'text'
              placeholder = 'Username'
              value = {username ? username : ''}
              onChange={ (val) => setUsername(val) }
              
            />

            <InputField 
              type = 'password'
              placeholder = 'Password'
              value = {password ? password : ''}
              onChange={ (val) => setPassword(val) }
            />

            <SubmitButton
              text='ACCEDI'
              disabled={buttonDisabled}
              onClick={() => {doLogin()}}
            />
        </div>
       );
}
