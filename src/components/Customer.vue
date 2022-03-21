<template>
    <div id="content-page" class="content-page ml-0">
        <TopBar />
        <div class="container-fluid">
            <div class="row">
                <div class="col-lg-3">
                    <div class="iq-card iq-card-stretch">
                        <div class="iq-card-header d-flex justify-content-between">
                            <div class="iq-header-title">
                                <h4 class="card-title">Customers</h4>
                            </div>
                            <button class="btn btn-outline-primary btn-sm" data-toggle="modal" data-target="#tambah">
                                Tambah
                            </button>
                        </div>
                        <div class="iq-card-body pl-2 pr-0">
                            <div class="form-group ml-1 mr-2">
                                <input type="text" class="form-control" 
                                    style="padding-right:30px"
                                    placeholder="Cari Nama Customer" 
                                    v-model="CnmCustomer"
                                    @keyup="searchCustomer"
                                >
                                <a class="search-link mod" href="#">
                                    <i class="ri-search-line"></i>
                                </a>
                            </div>
                            <div class="row" v-if="perusahaan">
                                <div class="col-lg-4 pt-1">
                                    <button type="button" 
                                        class="btn btn-sm btn-outline-dark mr-2"
                                        @click="perusahaan = kapal = akun = selectedCustomer = null"
                                    >
                                        Cancel
                                    </button>
                                </div>
                                <div class="col-lg-8 pt-1 text-right mb-1">
                                    <button type="button" class="btn btn-sm btn-outline-success mr-2">Edit Data</button>
                                    <button type="button" class="btn btn-sm btn-outline-danger mr-2">Hapus</button>
                                </div>
                            </div>
                            <hr class="mb-2"/>
                            <ul class="doctors-lists m-0 p-0 iq-email-sender-list" style="height: 56vh;">
                                <li class="d-flex mb-4 align-items-center pr-1"
                                    v-for="item in customer" 
                                    :key="item.id" 
                                    :class="{'active-li': item.id === selectedCustomer}"
                                    @click="getSingleCustomer(item.id)"
                                >
                                    <div class="user-img img-fluid">
                                        <img src="images/customer.png" alt="customer icon" class="rounded-circle avatar-40" />
                                    </div>
                                    <a href="javascript:void(0)" class="iq-email-title">
                                        <div class="media-support-info ml-3">
                                            <h6>{{item.customer_name ? item.customer_name : '-'}}</h6>
                                            <p class="mb-0 font-size-12">{{item.npwp ? item.npwp : '-'}}</p>
                                        </div>
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div class="iq-card-footer p-3" style="border-top:1px solid #eee">
                            <div class="row">
                                <div class="col-lg-6 text-left">
                                    Total Data
                                </div>
                                <div class="col-lg-6 text-right">
                                    <b>{{customer.length}}</b>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- bila informasi customer tidak ada yang di-select -->
                <div v-if="!perusahaan && !akun && !kapal" class="col-lg-9">
                    <div class="mt-5 text-center" width="100%">
                        <h5 class="mb-5" style="margin-top: 10%; color: #ffc727">
                            Data customer belum dipilih !
                        </h5>
                        <img src="images/5667051.png" class="mt-2">
                    </div>
                </div>
                <!-- bila ada customer yang di-select -->
                <div class="col-lg-6" v-if="perusahaan">
                    <div class="row">
                        <div class="iq-card iq-user-profile-block" style="height: 83%;">
                            <div class="iq-card-body" style="padding: 10px;">
                                <div class="user-details-block">
                                    <div class="user-profile text-center">
                                        <img src="images/user/111.png" alt="profile-img" class="avatar-130 img-fluid">
                                    </div>
                                    <div class="text-center mt-3">
                                        <h5>{{ perusahaan.name }}</h5>
                                        <p :class="{
                                            'text-danger': !akun || akun.status != 'aktif',
                                            'text-primary': akun && akun.status == 'aktif'
                                        }">
                                            {{ !akun ? '-' : akun.status }}
                                        </p>
                                        <p v-if="!akun" class="text-danger">Customer belum mempunyai akun! 
                                            <button data-toggle="modal" data-target="#akun-customer"
                                                data-backdrop="static" data-keyboard="false" id="createakun"
                                                class="btn btn-sm btn-outline-danger"
                                            >
                                                Create !
                                            </button>
                                        </p>
                                        <p v-if="akun" class="text-primary">Customer sudah mempunyai akun! 
                                            <button data-toggle="modal" data-target="#akun-customer"
                                                data-backdrop="static" data-keyboard="false" id="editakun"
                                                class="btn btn-sm btn-outline-primary"
                                            >
                                                Edit !
                                            </button>
                                        </p>
                                    </div>
                                    <hr style="margin-bottom: 0rem;">
                                    <div class="iq-card-body pb-0" style="padding: 15px;">
                                        <h6 class="card-title text-primary">Data Perusahaan</h6>
                                        <div class="row">
                                            <div class="col-lg-4">
                                                <div class="media-support-info ml-3">
                                                    <h6>NPWP</h6>
                                                    <p class="mb-0">{{ perusahaan.npwp ? perusahaan.npwp : '-' }}</p>
                                                    <h6>Contact</h6>
                                                    <p class="mb-0">{{ perusahaan.contact ? perusahaan.contact : '-' }}</p>
                                                    <h6>Agent</h6>
                                                    <p class="mb-0">{{ perusahaan.agent ? perusahaan.agent : '-' }}</p>
                                                </div>
                                            </div>
                                            <div class="col-lg-4">
                                                <div class="media-support-info ml-3">
                                                    <h6>Email</h6>
                                                    <p class="mb-0">{{ perusahaan.email ? perusahaan.email : '-' }}</p>
                                                    <h6>Phone (Office/Handphone)</h6>
                                                    <p class="mb-0">
                                                        {{ perusahaan.phone ? perusahaan.phone : '-' }} / 
                                                        {{ perusahaan.contact_hp ? perusahaan.contact_hp : '-' }}
                                                    </p>
                                                    <h6>Fax</h6>
                                                    <p class="mb-0">{{ perusahaan.fax ? perusahaan.fax : '-' }}</p>
                                                </div>
                                            </div>
                                            <div class="col-lg-4">
                                                <div class="media-support-info ml-3">
                                                    <h6>Addres</h6>
                                                    <p class="mb-0">
                                                        {{ perusahaan.address ? perusahaan.address : '-' }}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="iq-card-body pt-0 mt-4" style="padding: 15px;">
                                        <h6 class="card-title text-primary">Data Kapal</h6>
                                        <div class="row">
                                            <div class="col-md-4">
                                                <div class="training-block d-flex align-items-center">
                                                    <div class="rounded-circle iq-card-icon iq-bg-primary">
                                                        <i class="ri-ship-fill"></i>
                                                    </div>
                                                    <div class="ml-3">
                                                        <h5>Jumlah Kapal</h5>
                                                        <p class="mb-0">{{ kapalTotal.total }} armada</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-md-4">
                                                <div class="training-block d-flex align-items-center">
                                                    <div class="rounded-circle iq-card-icon iq-bg-warning">
                                                        <i class="ri-ship-2-fill"></i>
                                                    </div>
                                                    <div class="ml-3">
                                                        <h5>Kapal On</h5>
                                                        <p class="mb-0">{{ kapalTotal.on }} armada</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-md-4">
                                                <div class="training-block d-flex align-items-center">
                                                    <div class="rounded-circle iq-card-icon iq-bg-danger">
                                                        <i class="ri-ship-2-line"></i>
                                                    </div>
                                                    <div class="ml-3">
                                                        <h5>Kapal Off</h5>
                                                        <p class="mb-0">{{ kapalTotal.off }} armada</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-lg-3" v-if="kapal">
                    <div class="iq-card iq-card-block iq-card-stretch iq-card-height">
                        <div class="iq-card-header d-flex justify-content-between">
                            <div class="iq-header-title">
                                <h4 class="card-title">Kapal</h4>
                            </div>
                            <button class="btn btn-outline-primary btn-sm" data-toggle="modal" data-target="#tambah-kapal">
                                Tambah
                            </button>
                        </div>
                        <div class="iq-card-body pl-2 pr-0 pt-2 pb-0">
                            <div class="form-group ml-1 mr-2">
                                <input type="text" autocomplete="off" placeholder="Cari Nama Kapal" class="form-control" style="padding-right: 30px;">
                                <a href="javascript:void(0)" class="search-link mod">
                                    <i class="ri-search-line"></i>
                                </a>
                            </div>
                            <ul id="listkapal" class="doctors-lists m-0 p-0 iq-email-sender-list" style="height: 64vh;">
                                <li class="d-flex mb-2 align-items-center pr-1"
                                    v-for="item in kapal"
                                    :key="item.id"
                                >
                                    <div class="media-support-info ml-3">
                                        <h6 :class="{'text-danger': !item.speed || parseFloat(item.speed) <= 0.0}">{{ item.name }}</h6>
                                        <p class="mb-0 font-size-12">{{ item.sn }}</p>
                                    </div>
                                    <ul class="iq-social-media" style="display: contents; line-height: 0px;">
                                        <li>
                                            <a href="javascript:void(0)">
                                                <i class="ri-edit-box-line"></i>
                                            </a>
                                        </li>
                                        <li>
                                            <a href="javascript:void(0)">
                                                <i class="ri-delete-bin-2-line"></i>
                                            </a>
                                        </li>
                                        <li>
                                            <a href="javascript:void(0)" data-toggle="modal" data-target="#detail-kapal">
                                                <i class="ri-file-list-2-line"></i>
                                            </a>
                                        </li>
                                    </ul>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import TopBar from './include/TopBar.vue';
import axios from 'axios';

export default {
    name: "Customer",
    components: {
        TopBar
    },
    directives: {},
    data() {
        return {
            customer: [],
            CnmCustomer: null,
            selectedCustomer: null,

            // individual data
            perusahaan: null,
            akun: null,
            kapal: null,
            kapalTotal: [],
        };
    },
    beforeCreate: function () {
        if(this.$session.exists()) {
            this.$router.push("/customers");
        } else {
            this.$router.push("/");
        }
    },
    created() {
        this.getCustomer();
    },
    mounted() {
        this.idakun = this.$session.get("level");
    },
    methods: {
        async getCustomer() {
            try {
                this.showloadingBar();
                const response = await axios.get(`https://track.kapalpintar.co.id/api/data_perusahaan`);
                this.customer = response.data.results;
                this.closeloadingBar();
            } catch (error) {
                console.log(error);
            }
        },
        async searchCustomer() {
            try {
                const response = await axios.post('https://track.kapalpintar.co.id/api/data_perusahaan/search', {
                    search: this.CnmCustomer
                });
                this.customer = response.data;
            } catch (error) {
                console.log(error);
            }
        },
        async getSingleCustomer(id) {
            try {
                this.showloadingBar();
                this.activeListCustomer(id);
                const perusahaan = await axios.get(`https://track.kapalpintar.co.id/api/perusahaan/${id}`);
                const akun = await axios.get(`https://track.kapalpintar.co.id/api/akuncustomer/${id}`);
                const kapal = await axios.get(`https://track.kapalpintar.co.id/api/kapal/${id}`);

                this.perusahaan = perusahaan.data.results[0];
                this.akun = akun.data.results[0];
                this.kapal = kapal.data;
                this.kapalTotal = this.countKapal(kapal);

                this.closeloadingBar();
            }catch (err) {
                console.log(err);
            }
        },
        activeListCustomer(id) {
            this.selectedCustomer = id ? id : null;
        },
        showloadingBar() {
            this.$swal.fire({
                html: "<img src='images/loading-bar.gif' style='width: 50px;'/><p>Loading...</p>",
                showConfirmButton: false,
            });
        },
        closeloadingBar() {
            this.$swal.fire({
                showConfirmButton: false,
            }).close();
        },
        countKapal(kapal) {
            let result = {total: 0, on: 0, off: 0};

            for (const key in kapal) {
                if (Object.hasOwnProperty.call(kapal, key)) {
                    const e = kapal[key];

                    if(e.timestamp >= e.tglNow) {
                        result.on++
                    } else {
                        result.off++
                    }

                    result.total++;
                }
            }

            return result;
        }
    }
}
</script>

<style scoped>
.doctors-lists li{
    padding-bottom: 5px;
    padding-top: 5px;
}
.doctors-lists li:hover{
    background: #ebf4f5;
    border-radius: 50px;
}
.active-li {
    background: #ceebee;
    border-radius: 50px;
}
.mod{
    position: absolute;
    right: 30px;
    top: 12.5%;
    font-size: 15pt;
}
</style>