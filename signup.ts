import { Component } from '@angular/core';
import { ViewChild } from '@angular/core';
import { ElementRef } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import {  NavController } from 'ionic-angular';
import {  AlertController } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import firebase from 'firebase/app';
import { Events } from 'ionic-angular';
import { FormControl,FormBuilder,FormGroup,Validators } from '@angular/forms';
import {AngularFirestore} from 'angularfire2/firestore';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import {AngularFireDatabase} from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { AuthProvider } from '../../providers/auth/auth';
import {Md5} from 'ts-md5/dist/md5';


//import { AuthService } from '../../services/auth.service';
//import { EmailValidator } from '../../validators/email';
@IonicPage()
@Component({
selector: 'page-signup',
templateUrl: 'signup.html',
providers: [AngularFireAuth]
})
export class SignupPage {
name:string="";
passwordHash:any = null;
userInput:string = null;
password:string = null;
firstName:string = null;
lastName:string = null;
userEmail:string = null;
userPhone:string  = null;
defaultCountryCode:string = "91";
countryCode:string = "91";
defaultPhonePrependString:string = "+";
allowedMinimalPhoneDigits:number = 10;
allowedMaximumPhoneDigits:number = 12;
//firebase address for create node for emailVerification*****
appName:any = 'RestaurantManagement';
firebaseProjectName:any  = 'asansolcollege-6bdb4_firebaseapp_com';
userNodePath:string = null;
pathSeparator:string = "/";
userPathName:string = "users";
userNode:any = null;

recaptchaVerifier:firebase.auth.RecaptchaVerifier = null;
signupForm:FormGroup= null;
//	regexEmail:any = "/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/";
regexEmail:any=/[A-Za-z0-9._%+-]{3,}@[a-zA-Z]{3,}([.]{1}[a-zA-Z]{2,}|[.]{1}[a-zA-Z]{2,}[.]{1}[a-zA-Z]{2,})/;
regexPhone:any = /^\d{10}/;
//	userInput:number;
@ViewChild('myNav') nav: NavController
@ViewChild('recaptchaDomElement') recaptchaDomElement:ElementRef;
constructor(public navCtrl:NavController,
public alertCtrl: AlertController,
public events:Events,
public formBuilder: FormBuilder,
public loadingCtrl: LoadingController,
public afAuth: AngularFireAuth,
public afDB: AngularFireDatabase,
private authProvider:AuthProvider,
) {
console.error("signing out the currentuser");
this.authProvider.signoutUser();
this.signupForm = formBuilder.group({
name: ['',Validators.compose([Validators.minLength(3), Validators.pattern('[a-zA-Z ]*'), Validators.required]) ],
lname: ['',Validators.compose([Validators.minLength(3), Validators.pattern('[a-zA-Z ]*'), Validators.required]) ],

userInput: ['', Validators.compose([Validators.required])],
password: ['', Validators.compose([Validators.minLength(6), Validators.required])]
});
}
initRecaptcha(){
this.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container');
}
ionViewDidLoad() {
//	this.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container');
}
ionViewDidLeave(){
console.log("ionViewDidLeaveFired");
//this.recaptchaDomElement.nativeElement.innerText = "";
//this.recaptchaVerifier = null
}
clearRecaptchaFromDom(){
try{
if(this.recaptchaDomElement && this.recaptchaDomElement.nativeElement && this.recaptchaDomElement.nativeElement.innerText)
this.recaptchaDomElement.nativeElement.innerText = "";
}catch(e){
console.error("caught exception during recaptcha clearance",e);
}
}
//var data = `blur blur subtests: [] blur\nblur`;
//var regex = /subtests: \[.*\]/;
//var test = regex.exec(data);
//alert("Op: " + test);

verifySignup(email:string){
let userInfoPath = "RestaurantManagement/users";
this.userNodePath = this.appName + this.pathSeparator + this.userPathName;
let userNode = this.afDB.database.ref(this.userNodePath);


return 	userNode.orderByChild("email").equalTo(email).once("value");

}
//parse the input to determine whether a phone no. or email:
parseInput(){
console.error("entered parseInput function");
let isEmail = this.regexEmail.test(this.userInput);
if(isEmail){//Signup with email
this.userEmail = this.userInput;
//	console.log("userinputis email",this.userInput);
this.verifySignup(this.userEmail).then((snapshot) =>{
console.log(snapshot.val());


/*
this.authProvider.signupUserWithEmailAndPassword(this.userEmail,this.password).then((data)=>{
//	let userEmail = firebase.auth().currentUser;//*currentUser
//	user.sendEmailVerification();//*check Email
//	this.navCtrl.setRoot('LoginPage');//*goto rootpage
if(this.userEmail.emailVerified){
console.log("email verified");
}else{
console.log("email not verified");
//	this.sendEmailVerification(this.userEmail);
let userEmail = firebase.auth().currentUser;
userEmail.sendEmailVerification();

//	}
console.log("new user data",data);
let welcomeMessage = "Welcome " + this.firstName;
let alertObject = this.alertCtrl.create({
title: welcomeMessage,
message: 'Please check you email to confirm registration',
buttons: [
{
text: 'Proceed',
role: 'cancel',
handler: () => {
//	let user=firebase.auth().currentUser;
//	user.sendEmailVerification();
console.log('Cancel clicked');
this.authProvider.updateUser(this.firstName,this.lastName,this.userPhone,this.userEmail);
}
}					]
});
alertObject.present();

this.navCtrl.setRoot("LoginPage");

}).catch((e)=>{
let oopsMessage = "Oops! ";
if(this.firstName) {
oopsMessage += this.firstName + "!";
}
let alert = this.alertCtrl.create({
title: oopsMessage,
message: e,
buttons: [
{
text: 'Try again',
role: 'cancel',
handler: () => {
console.log('Cancel clicked');
}
}					]
});
alert.present();
});
*/

}).catch(err =>{
//msg sorry problem with signup



});

}

else{//Signup with phone
console.log("not a valid email");
let isPhone	 = this.regexPhone.test(this.userInput);
this.userPhone = this.userInput;
if(isPhone){
let alertObject = this.alertCtrl.create({
title: 'Enter country code.',
inputs: [
{
name: 'countryCode',
placeholder: '91',
handler:data=>{
console.log("data:",data);
}
}    ],
buttons: [
{
text: 'OK',
role: 'cancel',
handler: (data) => {
console.error("data input:",data);
if(data && data.countryCode == "" )
this.countryCode=this.defaultCountryCode;
else this.countryCode = data.countryCode;
console.error("countrycode is:",this.countryCode);
this.userPhone = this.defaultPhonePrependString  + this.countryCode + this.userInput;
if(this.recaptchaVerifier != null || this.recaptchaVerifier  != undefined)
this.recaptchaVerifier.clear();
console.log("userPhone:",this.userPhone);

this.initRecaptcha();
firebase.auth().signInWithPhoneNumber(this.userPhone, this.recaptchaVerifier)
.then( (confirmationResult) => {
//
if(this.recaptchaVerifier)
this.recaptchaVerifier.clear();
// SMS sent. Prompt user to type the code from the message, then sign the
let prompt = this.alertCtrl.create({
title: 'Enter the Confirmation code',
inputs: [{ name: 'confirmationCode', placeholder: 'Confirmation Code' }],
buttons: [
{ text: 'Cancel',
handler: data => { console.log('Cancel clicked'); }
},
{ text: 'Send',
handler: data => {
confirmationResult.confirm(data.confirmationCode)
.then( (result) =>{


let welcomePrompt = this.alertCtrl.create({
title:this.firstName + ", You have successfully signed up", buttons:[{text:"OK",handler:(data)=>{
console.error("User ",this.firstName," successfully signed up");
this.navCtrl.popTo("LoginPage");

}}]

});
welcomePrompt.present();


this.passwordHash = Md5.hashStr(this.password);
this.authProvider.updateUser(this.firstName,this.lastName,this.userPhone,this.userEmail,this.passwordHash);




// User signed in successfully.
console.log(result.user);
this.events.publish('user:signinWithPhoneNumber', result.user, Date.now());                  // ...
}).catch( (error) =>{
//this.recaptchaVerifier.clear();
let errorConfirmationPrompt = this.alertCtrl.create({
title:"Oops!" + error,
buttons:[{
text:"OK",
handler:(data) =>{
console.error("OK pressed");
}}]
});
errorConfirmationPrompt.present();
// User couldn't sign in (bad verification code?)
// ...
});
}
}
]
});
prompt.present();
})
.catch( (error) =>{
console.error("SMS not sent", error);
//			this.recaptchaVerifier.clear();
let errorAlert = this.alertCtrl.create({
title:"Oops!" + error,
buttons:[{text:'OK',
handler:(data)=>{
//this.navCtrl.popTo("LoginPage");
}
}]
});
errorAlert.present();
});
}
}    ]
});
alertObject.present();
//this.authProvider.loginUserWithPhone(this.userPhone,this.recaptchaVerifier);
/*
if(this.userPhone.length == this.allowedMinimalPhoneDigits){
this.userPhone = this.defaultPhonePrependString + this.defaultCountryCode + this.userPhone;
//Add a validator here
this.authProvider.loginUserWithPhone(this.userPhone,this.recaptchaVerifier);
}
*/
}else{
console.error("not a valid phone no",this.userPhone);
}
}
/*
let parsedInput = "";
let userInput =  this.getAuthType(parsedInput);
if(userInput === "email"){
this.SignUpWithEmail((<string>parsedInput));
	}else if(userInput === "phone"){
	this.SignUpWithPhoneNumber(parsedInput);
	}else if(userInput =="google"){
	}else{//I don't know or error cond
	console.log("Something fishy");
	}
	*/
	}
	SignUpWithPhoneNumber(phoneNumber: string){
	const appVerifier = this.recaptchaVerifier;
	const phoneNumberString = "+" + phoneNumber;
	firebase.auth().signInWithPhoneNumber(phoneNumberString, appVerifier)
	.then( confirmationResult => {
	// SMS sent. Prompt us er to t ype the code from the message, then sign the
	// user in with confirmationResult.confirm(code).
	let prompt = this.alertCtrl.create({
	title: 'Enter the Confirmation code',
	inputs: [{ name: 'confirmationCode', placeholder: 'Confirmation Code' }],
	buttons: [
	{ text: 'Cancel',
	handler: data => { console.log('Cancel clicked'); }
	},
	{ text: 'Send',
	handler: data => {
	confirmationResult.confirm(data.confirmationCode)
	.then( (result) =>{
	// User signed in successfully.
	// ...
	console.log(result.user);
	this.events.publish('user:signInWithPhoneNumber', result.user, Date.now());                  // ...
	}).catch( (error) =>{
	console.log("sorry user could not signin",error);
	// User couldn't sign in (bad verification code?)
	// ...
	});
	}
	}
	]
	});
	prompt.present();
	})
	.catch(function (error) {
	console.error("SMS not sent", error);
	});
	}
	SignUpWithEmail(email: string){
	const password=this.password;
	firebase.auth().createUserWithEmailAndPassword(email, password)
	.then(res => {
	//var auth = firebase.auth();
	//this.auth.sendEmailVerification(email)
	console.log("successfully created user withe mail",email);
	//firebase.auth().getRedirectResult
	//         this.navCtrl.setRoot('LoginPage');
	}).catch((err)=>{
	console.log("caught exception",err);
	/*
	const appVerifier = this.recaptchaVerifier;
	firebase.auth().signInWithEmail(email,appVerifier).then( confirmationResult => {
	let prompt = this.alertCtrl.create({
	title: 'Enter the Confirmation code',
	inputs: [{ name: 'confirmationCode', placeholder: 'Confirmation Code' }],
	buttons: [
	{ text: 'Cancel',
	handler: data => { console.log('Cancel clicked'); }
	},
	{ text: 'Send',
	handler: data => {
	confirmationResult.confirm(data.confirmationCode)
	.then( (result) =>{
	// User signed in successfully.
	// ...
	console.log(result.user);
	this.events.publish('user:signInWithEmail', result.user, Date.now());                  // ...
	}).catch( (error) =>{
	console.log("sorry user could not signin",error);
	// User couldn't sign in (bad verification code?)
	// ...
	});
	}
	}
	]
	});
	prompt.present();
	})
	.catch(function (error) {
	console.error("SMS not sent", error);
	});
	*/
	});
	}
	//added validation as it contain 91+10 digit due to i give its maxlength =12
	//KeyPress(event:any){
	//	const pattern= /[0-9\+\-\ ]/;
	//	let inputChar=String.fromCharCode(event.charCode);
	//	if(event.keyCode != 10 && !pattern.test(inputChar)){
	// 			event.preventDefault();
	//			console.log("invalid phonenumber");
	//		}
	getAuthType(input):string{
	let userInput = "phone";
	//Fill this out
	//if(){
	//}
	return  userInput;
	}
	}
