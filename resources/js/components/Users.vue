import swal from "sweetalert2";
<template>
    <div class="container">
        <div class="row mt-5">
            <div class="col-md-12">
                <div class="card" v-if="this.$gate.isAdminOrOthore()">
                    <div class="card-header">
                        <h3 class="card-title">Users Table</h3>

                        <div class="card-tools">
                            <button type="button" class="btn btn-success" @click="newModal">Add New
                                <i class="fas fa-user-plus fw"></i>
                            </button>
                        </div>
                    </div>
                    <!-- /.card-header -->
                    <div class="card-body table-rescponsive p-0">
                        <table class="table table-hover usertable">
                            <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Type</th>
                                <th>Registered At</th>
                                <th>Action</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr v-for="user in users.data" :key="user.id">
                                <td>{{user.id}}</td>
                                <td>{{user.name}}</td>
                                <td>{{user.email}}</td>
                                <td>{{user.type | upperCase}}</td>
                                <td>{{user.created_at | humanDate}}</td>
                                <td>
                                    <a href="#" class="btn btn-primary" @click="editModal(user)"><i class="fas fa-edit"></i></a>
                                    <a href="" class="btn badge-danger" @click.prevent="deleteUser(user.id,user.name)"><i class="fas fa-trash"></i></a>
                                </td>
                            </tr>

                            </tbody>
                        </table>
                    </div>
                    <div class="card-footer">
                        <pagination :data="users" @pagination-change-page="getResults"></pagination>
                    </div>
                    <!-- /.card-body -->
                </div>
                <!-- /.card -->
            </div>
        </div>
        <!-- Modal -->
        <div v-if="!this.$gate.isAdminOrOthore()">
            <not-found></not-found>
        </div>
        <div class="modal fade" id="addNewModal" tabindex="-1" role="dialog" aria-labelledby="addNewModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 v-show="editMode" class="modal-title" >Update User Info</h5>
                        <h5 v-show="!editMode" class="modal-title" >Add New User</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                 <form @submit.prevent="editMode ? editUser() : createUser()">
                    <div class="modal-body">

                        <div class="form-group">
                            <input v-model="form.name" type="text" name="name"
                                   placeholder="Enter Name"
                                   class="form-control" :class="{ 'is-invalid': form.errors.has('name') }">
                            <has-error :form="form" field="name"></has-error>
                        </div>
                        <div class="form-group">
                            <input v-model="form.email" type="email" name="email"
                                   placeholder="Enter Email Address"
                                   class="form-control" :class="{ 'is-invalid': form.errors.has('email') }">
                            <has-error :form="form" field="email"></has-error>
                        </div>
                        <div class="form-group">
                            <textarea v-model="form.bio" name="bio" placeholder="Short bio for user (optional)" class="form-control" :class="{ 'is-invalid': form.errors.has('bio')}"></textarea>
                            <has-error :form="form" field="bio"></has-error>
                        </div>
                        <div class="form-group">
                            <select name="type" v-model="form.type" class="form-control" :class="{ 'is-invalid': form.errors.has('type')}">
                                <option value="">Select user type</option>
                                <option value="admin">Admin</option>
                                <option value="user">Standerd User</option>
                                <option value="author">Author</option>
                                <has-error :form="form" field="type"></has-error>
                            </select>
                        </div>
                        <div class="form-group">
                            <input v-model="form.password" type="password" name="password"
                                   placeholder="Enter Password"
                                   class="form-control" :class="{ 'is-invalid': form.errors.has('password') }">
                            <has-error :form="form" field="password"></has-error>
                        </div>

                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-danger" data-dismiss="modal">Close</button>
                        <button v-show="editMode" type="submit" class="btn btn-success">Update</button>
                        <button v-show="!editMode" type="submit" class="btn btn-primary">Create</button>
                    </div>
                 </form>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
    export default {
        data(){
          return {
              editMode: false,
              users: {},
              form : new Form({
                  id:'',
                  name:'',
                  email:'',
                  password:'',
                  type:'',
                  bio:'',
                  photo:''
              })
          }
        },
        methods:{
            getResults(page = 1) {
                axios.get('api/user?page=' + page)
                    .then(response => {
                        this.users = response.data;
                    });
            },
            loadUser(){
                if(this.$gate.isAdminOrOthore()){
                    axios.get('api/user').then(({ data }) => { this.users = data });
                }

            },
            createUser(){
                this.$Progress.start();
                this.form.post('api/user').then(()=>{
                    $('#addNewModal').modal('hide');
                    //Fire.$emit('AfterCreate');
                    const Toast = Swal.mixin({
                        toast: true,
                        position: 'top-end',
                        showConfirmButton: false,
                        timer: 3000,
                        timerProgressBar: true,
                        onOpen: (toast) => {
                            toast.addEventListener('mouseenter', Swal.stopTimer)
                            toast.addEventListener('mouseleave', Swal.resumeTimer)
                        }
                    });
                    Toast.fire({
                        icon: 'success',
                        title: 'User Create successfully'
                    });

                    this.$Progress.finish();
                }).catch(()=>{
                    //console.log(error);
                    this.$Progress.finish();
                });
            },
            deleteUser(id,name){
                Swal.fire({
                    title: 'Are you sure?',
                    text: "You want to delete '"+name+"'",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Yes, delete it!'
                }).then((result) => {
                    //Send request to server
                    if(result.value){
                        this.form.delete('api/user/'+id).then(()=>{
                            Fire.$emit('AfterCreate');
                            Swal.fire(
                                'Deleted!',
                                'Your file has been deleted.',
                                'success'
                            );
                        }).catch(()=>{
                            Swal("Failed!","There was something wrong","warning");
                        });
                    }
                });
            },
            newModal(){
                this.form.reset();
                this.form.clear();
                $('#addNewModal').modal('show');
                this.editMode = false;
            },
            editModal(user){
                this.form.reset();
                this.form.clear();
                $('#addNewModal').modal('show');
                this.editMode = true;
                this.form.fill(user);
            },
            editUser(){
                this.$Progress.start();
                this.form.put('api/user/'+this.form.id).then(()=>{
                    this.$Progress.finish();
                    Fire.$emit('AfterCreate');
                    $('#addNewModal').modal('hide');
                    Swal.fire(
                        'Updated!',
                        'Information Updated Successfully',
                        'success'
                    );
                    this.form.reset();
                    this.form.clear();

                }).catch(()=>{
                this.$Progress.fail();
                });
            }
        },
        created() {
            this.loadUser();
            //Auto Refresh request every set second
            //setInterval(() => this.loadUser(), 3000);

            Fire.$on('AfterCreate',() => {
                this.loadUser();
            });


            Fire.$on('SearchItem',()=>{
                let query = this.$parent.search;
                axios.get('api/search?q='+query).then((data)=>{
                    this.users = data.data
                }).catch(()=>{
                    Swal.fire(
                        'Opps!',
                        'No User Found',
                        'error'
                    );
                });

            });
        }
    }
</script>
