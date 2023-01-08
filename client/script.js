import bot from './assets/bot.svg';
import user from './assets/user.svg';

const form = document.querySelector('form');
const chatContainer = document.querySelector('#chat_container');
const openbtn = document.querySelector('.openbtn');
const clsbtn = document.querySelector('.closebtn');

let loadInterval;

function loader(element){
  element.textContent = '';

  loadInterval = setInterval(() => {
    element.textContent += '.';

  
    if (element.textContent === '....') {
      element.textContent = '';
    }
  },300);
}

function typeText(element, text){
  let index = 0;

  let interval = setInterval(() => {
    if(index < text.length) {
      element.innerHTML += text.charAt(index);
      index++;    
    } else {
      clearInterval(interval);
    }
  }, 20);
}

function generateUniqueId(){
  const timestamp = Date.now();
  const randomNumber = Math.random();
  const hexaDecimalString = randomNumber.toString(16);

  return `id-${timestamp}-${hexaDecimalString}`;
}


function chatStripe(isAI, value, uniqueId){
  return (
    `
      <div class="wrapper" id="${isAI ? 'ai':'user'}">
        <div class="chat">
          <div class="profile">
            <img 
              src="${isAI ? bot : user}"
              alt="${isAI ? 'bot' : 'user'}" 
            />
          </div>
          <div class="message" id=${uniqueId}>${value}</div>
        </div>
      </div>
    `
  )
}

const handleSubmit = async (e) => {
  e.preventDefault();

  const data = new FormData(form);

  //user's chatstripe

  chatContainer.innerHTML += chatStripe(false, data.get('prompt'));

  form.reset();

  //bot's chatstripe

  const uniqueId = generateUniqueId();
  chatContainer.innerHTML += chatStripe(true, " ", uniqueId);

  chatContainer.scrollTop = chatContainer.scrollHeight;

  const messageDiv = document.getElementById(uniqueId);

  loader(messageDiv);

  const response = await fetch('https://chatterai.onrender.com', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      prompt: data.get('prompt')
    })
  })

  clearInterval(loadInterval);
  messageDiv.innerHTML = '';
  
  if(response.ok){
    const data = await response.json();
    const parsedData = data.bot.trim();
    typeText(messageDiv, parsedData);
  } else{
    const err = await response.text();
    messageDiv.innerHTML = 'Something went Worng';

    alert(err);

  }
}


openbtn.addEventListener('click', () => {
  document.getElementById("app").style.width = "calc(100%-250px)";
  document.getElementById("mySidebar").style.width = "250px";
  document.getElementById("app").style.marginLeft = "250px";
  document.getElementById("app").style.maxWidth = "1200px";
  document.getElementById("app").style.minWidth = "700px";
});

clsbtn.addEventListener('click', () => {
  document.getElementById("mySidebar").style.width = "0";
  document.getElementById("app").style.marginLeft = "0";
  document.getElementById("app").style.width = "100%";
  document.getElementById("app").style.maxWidth = "100vw";
});

form.addEventListener('submit', handleSubmit);
form.addEventListener('keyup', (g) => {
  if(g.keyCode === 13) {
    handleSubmit(g);
  }
});