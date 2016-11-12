///////////////////11-11-2016
var submit = document.getElementById('submit_btn');
    submit.onclick = function () {
        // Create a request object
        var request = new XMLHttpRequest();
        
        // Capture the response and store it in a variable
        request.onreadystatechange = function () {
          if (request.readyState === XMLHttpRequest.DONE) {
              // Take some action
              if (request.status === 200) {
                  submit.value = 'Sucess!';
              } else if (request.status === 403) {
                  submit.value = 'Invalid credentials. Try again?';
              } else if (request.status === 500) {
                  alert('Something went wrong on the server');
                  submit.value = 'Login';
              } else {
                  alert('Something went wrong on the server');
                  submit.value = 'Login';
              }
              loadLogin();
          }  
          // Not done yet
        };

        
         var username = document.getElementById('username').value;
        var password = document.getElementById('password').value;
        console.log(username);
        console.log(password);
        request.open('POST', 'http://sumitdutt03.imad.hasura-app.io/login', true);
        request.setRequestHeader('Content-Type', 'application/json');
        request.send(JSON.stringify({username: username, password: password}));
        
    };



















/////////////////
console.log('Loaded!');
var button = document.getElementById('counter');

button.onclick = function(){
    request = new XMLHttpRequest();
    request.onreadystatechange = function()
    {
      if(request.readyState===XMLHttpRequest.DONE)
      {
          if(request.status===200)
          {
              
           var counter = request.responseText;
            var span =document.getElementById('count');
            span.innerHTML=counter.toString();  
          }
      }
    };
    request.open('GET','http://sumitdutt03.imad.hasura-app.io/counter',true);
    request.send(null);
};

