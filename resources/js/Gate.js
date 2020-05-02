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
   isAuthor(){
       return this.user.type === 'author';
   }
   isAdminOrOthore(){
       if(this.user.type==='admin' || this.user.type === 'author'){
           return true;
       }
   }
}
