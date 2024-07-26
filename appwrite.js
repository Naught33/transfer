//Globals
const successMessage = document.getElementById('info');

const DATABASE_ID = '66938c41002bd122abbf';
const TEACHERS_COLLECTION_ID = '66938f3b002e52ef4083';
const STUDENTS_COLLECTION_ID = '66938c8e0003d017e599';
const ASSIGNMENTS_COLLECTION_ID = '66a24776000ea022e06f';

const client = new Appwrite.Client();
client
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('66938a9700068710d0c8');

const Database = new Appwrite.Databases(client);
    
async function signUp(username, email, accountType,password){
    try{
    if(accountType==="teacher"){
        const result = await Database.createDocument(
            DATABASE_ID,
            TEACHERS_COLLECTION_ID,
            Appwrite.ID.unique(),
            {   "username": username,
                "email": email,
                "password": password
            }
        );
        successMessage.innerText = "Sign up successful, please log in";
        successMessage.style.color = 'rgb(21, 203, 21)';
        successMessage.classList.add('alertShow');
        setTimeout(()=>{
            successMessage.classList.remove('alertShow')
        },2000);
        return await result;
    }else{
        const result = await Database.createDocument(
            DATABASE_ID,
            STUDENTS_COLLECTION_ID,
            Appwrite.ID.unique(),
            {
                "username": username,
                "email": email,
                "password": password
            }
        );
        successMessage.innerText = "Sign up successful, please log in";
        successMessage.style.color = 'rgb(21, 203, 21)';
        successMessage.classList.add('alertShow');
        setTimeout(()=>{
            successMessage.classList.remove('alertShow')
        },4000);
        return await result;
        }
    }catch(error){
        successMessage.innerText = "Sign up failed, please try again";
        successMessage.style.color = "red";
        successMessage.classList.add('alertShow');
        setTimeout(()=>{
            successMessage.classList.remove('alertShow')
        },4000);
    }
}



async function login(username, accountType, password){
    try{
        if(accountType==="teacher"){
            const result = await Database.listDocuments(
                DATABASE_ID,
                TEACHERS_COLLECTION_ID,
                [
                    Appwrite.Query.equal('username',username)
                ]
            );
            return await result;
        }else{
            const result = await Database.listDocuments(
                DATABASE_ID,
                STUDENTS_COLLECTION_ID,
                [
                    Appwrite.Query.equal('username',username)
                ]
            );
            return await result;
        }
    }catch(error){
        successMessage.innerText = "Login failed, please try again";
        successMessage.style.color = "red";
        successMessage.classList.add('alertShow');
        setTimeout(()=>{
            successMessage.classList.remove('alertShow')
        },4000);
        return
    }
}

async function deleteUser(){
    //implement
}

async function updateUser(){
    //implement
}

async function fetchAssignments(account,ID){
    try{
        if(account === "student"){
        const result = await Database.listDocuments(
            DATABASE_ID,
            ASSIGNMENTS_COLLECTION_ID,
            );
            console.log(await result);
            return await result;
        }else if(account === "teacher"){
                const result = await Database.listDocuments(
                    DATABASE_ID,
                    ASSIGNMENTS_COLLECTION_ID,
                    [
                        Appwrite.Query.equal('teacher',ID)
                    ]
                );
                console.log(await result);
                return await result;

            }
    }catch(err){
        console.log(err);
        return "please reload";
    }
}

async function deleteassignment(assignmentID){
    try{
        const result = await Database.deleteDocument(
            DATABASE_ID,
            ASSIGNMENTS_COLLECTION_ID,
            assignmentID
            );
            console.log(result);
        successMessage.innerText = "Assignment Deleted";
        successMessage.style.color = "green";
        successMessage.classList.add('alertShow');
        setTimeout(()=>{
            successMessage.classList.remove('alertShow')
        },4000);
            return result;
    }catch(err){
        successMessage.innerText = "Delete Failed, please try again";
        successMessage.style.color = "red";
        successMessage.classList.add('alertShow');
        setTimeout(()=>{
            successMessage.classList.remove('alertShow')
        },4000);
        console.log(err);
    }
}

async function writeAssignment(name, date, content,teacher){
    try{
        const result = await Database.createDocument(
            DATABASE_ID,
            ASSIGNMENTS_COLLECTION_ID,
            Appwrite.ID.unique(),
            {   "name": name,
                "content": content,
                "teacher": teacher,
                "DueDate": date
            });
        successMessage.innerText = "Assignment added successfully";
        successMessage.style.color = "green";
        successMessage.classList.add('alertShow');
        setTimeout(()=>{
            successMessage.classList.remove('alertShow')
        },4000);

            return await result;
    }catch(err){

        successMessage.innerText = "Failed, Please check your internet connection";
        successMessage.style.color = "red";
        successMessage.classList.add('alertShow');
        setTimeout(()=>{
            successMessage.classList.remove('alertShow')
        },4000);
        console.log(err)
    }
}

export { signUp,
        login,
        deleteUser,
        updateUser,
        fetchAssignments,
        deleteassignment,
        writeAssignment }

