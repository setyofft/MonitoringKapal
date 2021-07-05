<template>
  <div class="iq-top-navbar header-top-sticky" style="width: calc(100% - 60px);">
    <div class="iq-navbar-custom">
      <div class="iq-sidebar-logo">
        <div class="top-logo">
          <a href="index.html" class="logo">
            <img src="images/logo.png" class="img-fluid" alt="" />
            <span>XRay</span>
          </a>
        </div>
      </div>
      <nav class="navbar navbar-expand-lg navbar-light p-0">
        <div class="iq-search-bar">
          <h3>{{nmPerusahaan}}</h3>
        </div>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav ml-auto navbar-list">
            <li class="nav-item iq-full-screen">
              <a href="#" class="iq-waves-effect" id="btnFullscreen"
                ><i class="ri-fullscreen-line"></i
              ></a>
            </li>
          </ul>
        </div>
        <ul class="navbar-list">
          <li>
            <a
              href="#"
              class="search-toggle iq-waves-effect d-flex align-items-center"
            >
              <img
                src="images/user/1.jpg"
                class="img-fluid rounded mr-3"
                alt="user"
              />
              <div class="caption">
                <h6 class="mb-0 line-height">Akun</h6>
                <span class="font-size-12">Available</span>
              </div>
            </a>
            <div class="iq-sub-dropdown iq-user-dropdown">
              <div class="iq-card shadow-none m-0">
                <div class="iq-card-body p-0 ">
                  <div class="bg-primary p-3">
                    <h5 class="mb-0 text-white line-height">{{this.$session.get('email')}}</h5>
                    <span class="text-white font-size-12">Available</span>
                  </div>
                  <div class="d-inline-block w-100 text-center p-3">
                    <a
                      class="bg-primary iq-sign-btn"
                      href="javascript:void(0)"
                      role="button"
                      @click="signout"
                      >Sign out<i class="ri-login-box-line ml-2"></i
                    ></a>
                  </div>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: "TopBar",
  components: {},
  data() {
    return {
      nmPerusahaan: null,
    };
  },
  created() {
    this.getPrusahaan()
  },
  methods: {
    async getPrusahaan(){
        try {
            if(this.$session.get('level')==='root'){
                this.nmPerusahaan = this.$session.get('nmperusahaan')
            }else{
                const response = await axios.get(`https://track.kapalpintar.co.id/api/perusahaan/${this.$session.get('id')}`);
                this.nmPerusahaan = response.data['results'][0]['customer_name'];
            }
        } catch (error) {
            // console.log(error);
        }
        
    },
    async signout(){
      this.$swal.fire({
          text: 'Apakah yakin ingin keluar?',
          showDenyButton: true,
          confirmButtonText: `Ya`,
          denyButtonText: `Tidak`,
        }).then((result) => {
          if (result.isConfirmed) {
              this.$session.clear()
              this.$session.destroy()
              this.$router.go()
          } 
      });
      
    }
  },
};
</script>

<style>
@media (max-width: 1299px){
  .iq-top-navbar, body.sidebar-main .iq-top-navbar {
      width: calc(100% - 30px) !important;
      margin: 20px 15px;
  }
}

</style>
