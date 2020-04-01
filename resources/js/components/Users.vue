<template>
    <div class="container">
        <div class="row mt-5">
            <div class="col-md-12">
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">Users Table</h3>

                        <div class="card-tools">
                            <button type="button" class="btn btn-success" data-toggle="modal" data-target="#addNewModal">Add New
                                <i class="fas fa-user-plus fw"></i>
                            </button>
                        </div>
                    </div>
                    <!-- /.card-header -->
                    <div class="card-body table-responsive p-0">
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
                            <tr v-for="user in users" :key="user.id">
                                <td>{{user.id}}</td>
                                <td>{{user.name}}</td>
                                <td>{{user.email}}</td>
                                <td>{{user.type | upperCase}}</td>
                                <td>{{user.created_at | humanDate}}</td>
                                <td>
                                    <a href="#" class="btn btn-primary"><i class="fas fa-edit"></i></a>
                                    <a href="#" class="btn badge-danger"><i class="fas fa-trash"></i></a>
                                </td>
                            </tr>

                            </tbody>
                        </table>
                    </div>
                    <!-- /.card-body -->
                </div>
                <!-- /.card -->
            </div>
        </div>
        <!-- Modal -->
        <div class="modal fade" id="addNewModal" tabindex="-1" role="dialog" aria-labelledby="addNewModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="addNewModalLabel">Add New User</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                 <form @submit.prevent="createUser">
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
                        <button type="submit" class="btn btn-primary">Create</button>
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
              users: {},
              form : new Form({
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
            loadUser(){
                axios.get('api/user').then(({ data }) => { this.users = data.data })
            },
            createUser(){
                this.form.post('api/user');
            }
        },
        created() {
            this.loadUser();
        }
    }
</script>
