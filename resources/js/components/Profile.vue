<template>
    <div class="container">
        <div class="row mt-3">
            <div class="col-md-12">
                <div class="card card-widget widget-user">
                    <!-- Add the bg color to the header using any of the bg-* classes -->
                    <div class="widget-user-header text-white" style="background: url('../img/back.jpg') center center;">
                        <h3 class="widget-user-username text-right">{{form.name}}</h3>
                        <h5 class="widget-user-desc text-right">Web Designer</h5>
                    </div>
                    <div class="widget-user-image">
                        <img class="img-circle" :src="updateProfileImage()" alt="User Avatar">
                    </div>
                    <div class="card-footer">
                        <div class="row">
                            <div class="col-sm-4 border-right">
                                <div class="description-block">
                                    <h5 class="description-header">3,200</h5>
                                    <span class="description-text">SALES</span>
                                </div>
                                <!-- /.description-block -->
                            </div>
                            <!-- /.col -->
                            <div class="col-sm-4 border-right">
                                <div class="description-block">
                                    <h5 class="description-header">13,000</h5>
                                    <span class="description-text">FOLLOWERS</span>
                                </div>
                                <!-- /.description-block -->
                            </div>
                            <!-- /.col -->
                            <div class="col-sm-4">
                                <div class="description-block">
                                    <h5 class="description-header">35</h5>
                                    <span class="description-text">PRODUCTS</span>
                                </div>
                                <!-- /.description-block -->
                            </div>
                            <!-- /.col -->
                        </div>
                        <!-- /.row -->
                    </div>
                </div>
                <div class="card">
                    <div class="card-header p-2">
                        <ul class="nav nav-pills">
                            <li class="nav-item"><a class="nav-link active" href="#activity" data-toggle="tab">Activity</a></li>
                            <li class="nav-item"><a class="nav-link" href="#settings" data-toggle="tab">Settings</a></li>
                        </ul>
                    </div><!-- /.card-header -->
                    <div class="card-body">
                        <div class="tab-content">
                            <div class="active tab-pane" id="activity">

                                <h1 style="text-align: center">Display Activity</h1>
                            </div>
                            <!-- /.tab-pane -->
                            <!-- /.tab-pane -->

                            <div class="tab-pane" id="settings">
                                <form>
                                    <div class="form-group">
                                        <label  class="col-sm-2 col-form-label">Name</label>
                                        <div class="col-sm-10">
                                            <input v-model="form.name" type="text" name="name"
                                               placeholder="Enter Name"
                                               class="form-control" :class="{ 'is-invalid': form.errors.has('name') }">
                                            <has-error :form="form" field="name"></has-error>
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <label  class="col-sm-2 col-form-label">Email</label>
                                        <div class="col-sm-10">
                                            <input v-model="form.email" type="email" name="email"
                                                   placeholder="Enter Name"
                                                   class="form-control" :class="{ 'is-invalid': form.errors.has('email') }">
                                            <has-error :form="form" field="email"></has-error>
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <label  class="col-sm-2 col-form-label">Short Bio</label>
                                        <div class="col-sm-10">
                                            <textarea v-model="form.bio" name="bio" placeholder="Short bio for user (optional)" class="form-control" :class="{ 'is-invalid': form.errors.has('bio')}"></textarea>
                                            <has-error :form="form" field="bio"></has-error>
                                        </div>
                                    </div>
                                    <div class="form-group ">
                                        <label for="profileimage" class="col-sm-2 col-form-label">Profile Picture</label>
                                        <div class="col-sm-10">
                                            <input type="file" id="profileimage" @change="updateImage">
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <label  class="col-sm-2 col-form-label">Password</label>
                                        <div class="col-sm-10">
                                            <input v-model="form.password" type="password" name="password"
                                                   placeholder="Leave if not change"
                                                   class="form-control" :class="{ 'is-invalid': form.errors.has('password') }">
                                            <has-error :form="form" field="password"></has-error>
                                        </div>
                                    </div>
                                    <div class="form-group ">
                                        <div class="col-sm-10">
                                            <button type="submit" @click.prevent="updateCurrentUserInfo" class="btn btn-success">Update</button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <!-- /.tab-pane -->
                        </div>
                        <!-- /.tab-content -->
                    </div><!-- /.card-body -->
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data(){
          return {
              form: new Form({
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
            loadCurrentUser(){
                axios.get('api/profile').then((data)=>{
                    this.form.fill(data.data);
                     //console.log(data.data);

                }).catch(()=>{});

            },
            updateImage(e){
                let file = e.target.files[0];
                //console.log(file);
                let reader = new FileReader();
                if(file['size'] < 2111775){
                    reader.onloadend = (file)=> {
                       // console.log('RESULT',reader.result);
                        this.form.photo = reader.result;
                    }
                    reader.readAsDataURL(file);
                }else{
                    Swal.fire(
                        'Ops..!',
                        'Your file larger then 2MB.',
                        'error'
                    );

                }

            },
            updateCurrentUserInfo(){
                this.$Progress.start();
                this.form.put('api/profile').then(()=>{
                    this.$Progress.finish();
                    Fire.$emit('AfterRefresh')
                    Swal.fire('Success','Profile update Successfully','success');
                }).catch(()=>{
                    this.$Progress.fail();
                });
            },
            updateProfileImage(){
                let photos = (this.form.photo.length > 200)? this.form.photo : 'img/profile/'+this.form.photo;
                return photos;
            }
        },
        created() {
            this.loadCurrentUser();
            Fire.$on('AfterRefresh',()=>{
               this.loadCurrentUser();
            });

        },
        mounted() {
            console.log('Component mounted.')
        }
    }
</script>
<style scoped>
    .widget-user .widget-user-header{
        height: 250px!important;
    }
    .widget-user .widget-user-image{
        top: 200px!important;
    }
</style>
