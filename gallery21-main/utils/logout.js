const logout = () => {
    const token = localStorage.getItem('userToken');
    if (token) {
      console.log(token);
      localStorage.removeItem('userToken');
    }
  }
  
  export default logout;
  