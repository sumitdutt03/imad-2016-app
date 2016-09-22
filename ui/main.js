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
              
           var counter = request.responsetext;
            var span =document.getElementById('count');
            span.innerHTML=counter.toString();  
          }
      }
    };
    request.open('GET','http://sumitdutt03.imad.hasura-app.io/counter',true);
    request,send(null);
};

