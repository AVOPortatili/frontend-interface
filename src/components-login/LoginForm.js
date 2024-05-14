import React, { useState } from 'react';
import InputField from './InputField';
import SubmitButton from './SubmitButton';

export default function LoginForm(props)  { 
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [buttonDisabled, setButtonDisabled] = useState(false)


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
      let res = await fetch('http://localhost:8080/api/login', {
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
      if (result && result.message==="success") {
        console.log("user logged in successfully");
        props.setLogin(username, result.role, result.token)
      } else {
        console.log("user login failed");
        resetForm();
      }

    } catch (e) {
      console.log(e);
      resetForm();
    }
  }

    return (
        <div className='loginForm'>
        <h2 className='loginText'> LOGIN </h2>
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
