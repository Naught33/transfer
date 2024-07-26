import { signUp, login, fetchAssignments, writeAssignment, deleteassignment } from "./appwrite.js";


const switchSignUp = document.getElementById('clickable_1');
const switchLogin = document.getElementById('clickable_2');
const loginForm = document.getElementById('Login');
const signupForm = document.getElementById('Signup');
const entryScreen = document.getElementById('forms');
const mainScreen = document.getElementById('container');
const loginButton = document.getElementById('loginButton');
const signupButton = document.getElementById('signupButton');
const logoutButton = document.getElementById('logout');
const loginMessage = document.getElementById('messageLogin');
const signupMessage = document.getElementById('messageSignup');
const welcomeMessage = document.getElementById('welcomeText');
const accountInfo = document.getElementById('accountType');
const itemContainer = document.getElementById('itemContainer');
const popUp = document.getElementById('finfo');
const closepopUp = document.getElementById('closepopup');
const imessage = document.getElementById('imessage');
let LoginIsVisible = true;

async function addAssignments(){
    const name = document.getElementById("aname").value;
    const date = document.getElementById("date").value;
    const content = document.getElementById("acontent").value;  
    const account = localStorage.getItem("account");  
    let ID;
    async function returnID(){
        const teacher = await login(localStorage.getItem("username"),localStorage.getItem("account"));
        ID = await teacher.documents[0].$id;
    } 
    console.log(await returnID());

    await writeAssignment(name, date, content, ID);
}



async function setAssignments(account){
    if(account ==="student"){
        console.log(localStorage.getItem("account"));
    const assignments = await fetchAssignments(localStorage.getItem("account"),"Not Required");
    if(assignments.documents.length === 0){
        let info = document.createElement('p');
        info.innerText = "No assignments yet";
        itemContainer.appendChild(info);
        return;
    }
    for(let i=0;i<assignments.documents.length;i++){
        let item = document.createElement('div');
        item.setAttribute('class','item');
        item.innerHTML = `
                <h4>${assignments.documents[i].name}</h4>
                <p>Teacher: ${assignments.documents[i].teacher.username}</p>
                <p>Due: ${assignments.documents[i].DueDate}</p>
        `;
        itemContainer.appendChild(item);
        item.addEventListener('click',()=>{
            popUp.classList.add('finfopopped');
            imessage.innerHTML = `
                <h4>${assignments.documents[i].name}</h4>
                <p>Teacher: ${assignments.documents[i].teacher.username}</p>
                <p>Due: ${assignments.documents[i].DueDate}</p>
                <p>${assignments.documents[i].content}</p>
            `
        });
    }
 }else if(account==="teacher"){
    let addAssignment = document.createElement('div');
    addAssignment.setAttribute('class','addform');
    addAssignment.innerHTML = `
    
        <form id="assignmentform">
                <h4>Add Assignment</h4>
                <div class="aname input">
                    <label for="aname">Assignment Name: </label>
                    <input type="text" id="aname" name="aname">
                </div>

                <div class="due input">
                    <label for="date">Due Date: </label>
                    <input type="datetime-local" id="date" name="date">
                </div>

                <div class="content input">
                    <label for="content">Content: </label>
                    <textarea name="content" id="acontent"></textarea>
                </div>
                <button id="addAssignment" class="button">Submit</button>
            </form>
    
    `;
    itemContainer.appendChild(addAssignment);
    document.getElementById('addAssignment').addEventListener('click',(e)=>{
        e.preventDefault();
        addAssignments();
    });


    console.log(localStorage.getItem("account"));
    let ID;
    async function returnID(){
        const teacher = await login(localStorage.getItem("username"),localStorage.getItem("account"));
        ID = await teacher.documents[0].$id;
    } 
    console.log(await returnID());
    const assignments = await fetchAssignments(localStorage.getItem("account"),ID);
    if(assignments.documents.length === 0){
        let info = document.createElement('p');
        info.innerText = "You have not given any assignments yet";
        itemContainer.appendChild(info);
        return;
    }
    for(let i=0;i<assignments.documents.length;i++){
        let item = document.createElement('div');
        item.setAttribute('class','item item2');
        item.innerHTML = `
                <h4>${assignments.documents[i].name}</h4>
                <p>Due: ${assignments.documents[i].DueDate}</p>
                <button class="deleteassignment">Delete</button>
        `;
        itemContainer.appendChild(item);
        item.querySelector('.deleteassignment').addEventListener('click', (e) => {
            e.preventDefault();
            deleteassignment(assignments.documents[i].$id);
        });

    }
}
}

function keepLoggedIn(){
    if(localStorage.length === 0){
        return;
    }
    if(localStorage.getItem("logInStatus") === "true"){
        welcomeMessage.innerText = `Welcome ${localStorage.getItem("username")}`;
        accountInfo.innerText = `${localStorage.getItem("account")} account`;   
        entryScreen.style.display = 'none';
        mainScreen.style.display = 'block';
        setAssignments(localStorage.getItem("account"));
        return;
    }else if(localStorage.getItem("logInStatus") === "false"){
        mainScreen.style.display = 'none';
        entryScreen.style.display = 'flex';
        return
    }
}

document.addEventListener('DOMContentLoaded',()=>keepLoggedIn());


async function validateLogin(){
    let username = document.getElementById('username').value;
    let password = document.getElementById('password').value;
    let account = document.getElementById('account_type').value;
    if(username == "" || password == ""){
        loginMessage.innerText = "please fill in all fields";
        loginMessage.style.opacity = '1';
        loginMessage.style.color = 'red';
        loginForm.style.borderColor = 'red';
        loginForm.classList.add('shakeForm');

        setTimeout(()=>{
            loginForm.classList.remove('shakeForm');
        },4000);
        return
    }
    let returnedCredentials = await login(username, account,password);

    if(await returnedCredentials.documents.length === 0){
        loginMessage.innerText = "Invalid username or password";
        loginMessage.style.opacity = '1';
        loginMessage.style.color = 'red';
        loginForm.style.borderColor = 'red';
        loginForm.classList.add('shakeForm');
        setTimeout(()=>{
            loginForm.classList.remove('shakeForm');
            },4000);
            return
    }


    if(await returnedCredentials.documents[0].password===password){
        welcomeMessage.innerHTML = `Welcome ${username}`;
        accountInfo.innerHTML = `${account} account`;
        localStorage.setItem("logInStatus", true);
        localStorage.setItem("username", `${username}`);
        localStorage.setItem("account", `${account}`);
        setAssignments(localStorage.getItem("account"));
        loginForm.reset();
        exitEntryScreen();
        return
    }else{
        loginMessage.innerText = "wrong username or password";
        loginMessage.style.opacity = '1';
        loginMessage.style.color = 'red';
        loginForm.style.borderColor = 'red';
        loginForm.classList.add('shakeForm');
        setTimeout(()=>{
            loginForm.classList.remove('shakeForm');
            },4000);

        return
    }   
    
}

async function checkValidUser(){
    let username = document.getElementById('cusername').value;
    let password = document.getElementById('cpassword').value;
    let account = document.getElementById('caccount_type').value;

    let returnedCredentials = await login(username, account,password);
    console.log(await returnedCredentials);
    if(await returnedCredentials.documents.length == 0){
        return true;
    }

    return false;
}

async function validateSignUp(){
    let username = document.getElementById('cusername').value;
    let password = document.getElementById('cpassword').value;
    let email = document.getElementById('email').value;
    let account = document.getElementById('caccount_type').value

    if(username=="" || password=="" || email==""){
        signupMessage.innerText = "please fill in all fields";
        signupMessage.style.opacity = '1';
        signupMessage.style.color = 'red';
        signupForm.style.borderColor = 'red';
        signupForm.classList.add('shakeSignup');
        setTimeout(()=>{
            signupForm.classList.remove('shakeSignup');
            },4000);
            return
            }

            let validUserState = await checkValidUser();
            if(!validUserState){
                signupMessage.innerText = "username already exists";
                signupMessage.style.opacity = '1';
                signupMessage.style.color = 'red';
                signupForm.style.borderColor = 'red';
                signupForm.classList.add('shakeSignup');
                setTimeout(()=>{
                    signupForm.classList.remove('shakeSignup');
                    },4000);
                    return

            }
            await signUp(username,email,account,password);
            signupForm.reset();
            switchEntryState();
    }



function switchEntryState(){
    if(LoginIsVisible == true){
        loginForm.classList.add('loginhidden');
        signupForm.classList.add('signupopen');
        LoginIsVisible = false;
    }else{
        loginForm.classList.remove('loginhidden');
        signupForm.classList.remove('signupopen');
        LoginIsVisible = true;
    }
}

function exitEntryScreen(){
    entryScreen.style.display = 'none';
    mainScreen.style.display = 'block';
}

function logOut(){
    localStorage.setItem("logInStatus", false);
    itemContainer.innerHTML = '';
    entryScreen.style.display = 'flex';
    mainScreen.style.display = 'none';
}


switchSignUp.addEventListener('click',()=>{
    switchEntryState();
});

switchLogin.addEventListener('click',()=>{
    switchEntryState();
    console.log('clicked')
});

loginButton.addEventListener('click',(e)=>{
    e.preventDefault()
    validateLogin();
});

signupButton.addEventListener('click',(e)=>{
    e.preventDefault();
    validateSignUp();
});

logoutButton.addEventListener('click',()=>{
    logOut();
});

closepopUp.addEventListener('click',()=>{
    imessage.innerHTML = '';
    popUp.classList.remove('finfopopped');
});