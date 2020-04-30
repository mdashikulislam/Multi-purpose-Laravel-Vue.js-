export default class Gate {
   constructor(user) {
       this.user = user;
   }

   isAdmin(){
       return this.user.type === 'admin';
   }
   isuser(){
       return this.user.type === 'user';
   }
}
